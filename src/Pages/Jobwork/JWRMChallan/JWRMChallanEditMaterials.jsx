import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Row,
  Skeleton,
  Space,
} from "antd";
import MySelect from "../../../Components/MySelect";
import { imsAxios } from "../../../axiosInterceptor";
import { v4 } from "uuid";
import FormTable from "../../../Components/FormTable";
import ToolTipEllipses from "../../../Components/ToolTipEllipses";
import errorToast from "../../../Components/errorToast";
import { toast } from "react-toastify";
import Loading from "../../../Components/Loading";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import NavFooter from "../../../Components/NavFooter";

function JWRMChallanEditMaterials({
  editingJWMaterials,
  setEditingJWMaterials,
  getRows,
}) {
  const [rows, setRows] = useState([]);
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [vendorBranchOptions, setVendorBranchOptions] = useState([]);
  const [bilingAddressOptions, setBillingAddressOptions] = useState([]);
  const [dispatchAddressOptions, setDispatchAddressOptions] = useState([]);

  const [createJobWorkChallanForm] = Form.useForm();
  const getDetails = async () => {
    setLoading("fetchingDetails");
    const response = await imsAxios.post("/jobwork/editJobworkChallan", {
      challan_no: editingJWMaterials,
    });
    setLoading(false);
    if (response.data.code === 200) {
      let arr = response.data.data2.map((row, index) => ({
        id: v4(),
        index: index + 1,
        ...row,
      }));
      let obj = response.data.data1;
      let vendor = { label: obj.vendor_name, value: obj.vendor_id };
      getVendorBranches(obj.vendor_id);
      console.log(obj);
      // console.log(vendor);
      createJobWorkChallanForm.setFieldsValue({ ...obj, vendor: vendor });
      setVendorData({ vendor: vendor, ...obj });
      setRows(arr);
    }
  };
  const inputHandler = (name, value, id) => {
    let arr = rows;
    arr = arr.map((row) => {
      if (row.id === id) {
        row = {
          ...row,
          [name]: value,
        };
        return row;
      } else {
        return row;
      }
    });
    setRows(arr);
  };
  const submitHandler = async () => {
    let vendor = createJobWorkChallanForm.getFieldsValue();
    const finalObj = {
      component: rows.map((row) => row.component_key),
      hsncode: rows.map((row) => row.hsn_code),
      qty: rows.map((row) => row.issue_qty),
      rate: rows.map((row) => row.part_rate),
      remark: rows.map((row) => row.remarks),
      transaction_id: editingJWMaterials,
      ...vendor,
    };

    setLoading("submit");
    const response = await imsAxios.post(
      "/jobwork/updateJobworkChallan",
      finalObj
    );
    setLoading(false);
    console.log(response);
    if (response.data.code === 200) {
      toast.success(response.data.message);
      setEditingJWMaterials(false);
      getRows();
    } else {
      if (response.data.message.msg) {
        toast.error(response.data.message.msg);
      } else {
        toast.error(errorToast(response.data.message));
      }
    }
  };
  const getAsyncOptions = async (search, type) => {
    let link =
      type === "dispatch"
        ? "/backend/dispatchAddressList"
        : type === "billing"
        ? "/backend/billingAddressList"
        : type === "vendor" && "/backend/vendorList";
    setLoading("select");
    const response = await imsAxios.post(link, {
      search: search,
    });
    setLoading(false);
    if (response.data[0]) {
      let arr = response.data;
      arr = arr.map((row) => ({
        text: row.text,
        value: row.id,
      }));

      setAsyncOptions(arr);
    } else {
      setAsyncOptions([]);
    }
  };
  const getVendorBranches = async (vendor_id) => {
    const response = await imsAxios.post("/backend/vendorBranchList", {
      vendorcode: vendor_id,
    });
    const { data } = response;
    if (data) {
      if (data.code === 200) {
        let arr = data.data.map((row) => ({
          text: row.text,
          value: row.id,
        }));
        setVendorBranchOptions(arr);
      } else {
        toast.error(data.message.msg);
      }
    }
  };
  const getVendorBranchDetails = async (branchCode) => {
    const vendorCode = createJobWorkChallanForm.getFieldsValue().vendor.value;
    let obj1 = createJobWorkChallanForm.getFieldsValue();
    console.log(vendorCode);
    const response = await imsAxios.post("backend/vendorAddress", {
      branchcode: branchCode,
      vendorcode: vendorCode,
    });
    const { data } = response;
    if (data) {
      if (data.code === 200) {
        let obj = {
          vendor_address: data.data.address,
          vendor_gst: data.data.gstid,
        };
        obj1 = { ...obj1, ...obj };
        createJobWorkChallanForm.setFieldsValue(obj);
      } else {
        toast.error(data.message.msg);
      }
    }
    console.log(response);
  };
  const getBillingDispatchAddress = async () => {
    const billingResponse = await imsAxios.post("/backend/billingAddressList");
    const dispatchgResponse = await imsAxios.post(
      "/backend/shipingAddressList"
    );
    const { data: billingData } = billingResponse;
    const { data: dispatchData } = dispatchgResponse;
    if (billingData) {
      if (billingData[0]) {
        let arr = billingData.map((row) => ({
          text: row.text,
          value: row.id,
        }));
        setBillingAddressOptions(arr);
      } else {
        toast.error(billingData.message.msg);
      }
    }
    if (dispatchData) {
      if (dispatchData[0]) {
        let arr = dispatchData.map((row) => ({
          text: row.text,
          value: row.id,
        }));
        setDispatchAddressOptions(arr);
      } else {
        toast.error(dispatchData.message.msg);
      }
    }
  };
  const getDispatchAddressDetails = async (code) => {
    let obj1 = createJobWorkChallanForm.getFieldsValue();
    const response = await imsAxios.post("/backend/shippingAddress", {
      shipping_code: code,
    });
    const { data } = response;
    if (data) {
      if (data.code === 200) {
        obj1 = {
          ...obj1,
          dispatch_to__line1: data.data.address.replaceAll("<br>", "\n"),
          dispatchfromgst: data.data.gstin,
          dispatch_to__pincode: data.data.pincode,
          // billingaddrpan: data.data.pan,
        };
        createJobWorkChallanForm.setFieldsValue(obj1);
      } else {
        toast.error(data.message.msg);
      }
    }
  };
  const getBillingAddressDetails = async (code) => {
    let obj1 = createJobWorkChallanForm.getFieldsValue();
    const response = await imsAxios.post("/backend/billingAddress", {
      billing_code: code,
    });
    const { data } = response;
    if (data) {
      if (data.code === 200) {
        obj1 = {
          ...obj1,
          billing_address: data.data.address.replaceAll("<br>", "\n"),
          billingaddrgst: data.data.gstin,
          billingaddrcin: data.data.cin,
          billingaddrpan: data.data.pan,
        };
        createJobWorkChallanForm.setFieldsValue(obj1);
      } else {
        toast.error(data.message.msg);
      }
    }
  };
  const columns = [
    { headerName: "Sr. No", renderCell: ({ row }) => row.index, width: 80 },
    {
      headerName: "Component",
      renderCell: ({ row }) => (
        <div style={{ width: 150 }}>
          <ToolTipEllipses text={row.component_name} />
        </div>
      ),
      width: 100,
    },
    {
      headerName: "Qty",
      renderCell: ({ row }) => (
        <div style={{ width: "100%" }}>
          <Input
            style={{ width: "100%" }}
            value={row.issue_qty}
            onChange={(e) => inputHandler("issue_qty", e.target.value, row.id)}
            suffix={row.unit_name}
          />
        </div>
      ),
      width: 120,
    },
    {
      headerName: "Rate",
      renderCell: ({ row }) => (
        <div style={{ width: "100%" }}>
          <Input
            style={{ width: "100%" }}
            value={row.part_rate}
            onChange={(e) => inputHandler("part_rate", e.target.value, row.id)}
          />
        </div>
      ),
      width: 100,
    },
    {
      headerName: "Value",
      renderCell: ({ row }) => (
        <div style={{ width: "100%" }}>
          <Input value={+row.issue_qty * +Number(row.part_rate).toFixed(2)} />
        </div>
      ),
      width: 120,
    },
    {
      headerName: "HSN",
      renderCell: ({ row }) => (
        <div style={{ width: "100%" }}>
          <Input
            value={row.hsn_code}
            onChange={(e) => inputHandler("hsn_code", e.target.value, row.id)}
          />
        </div>
      ),
      width: 120,
    },
    {
      headerName: "Description",
      renderCell: ({ row }) => (
        <div style={{ width: "100%" }}>
          <Input
            value={row.remarks}
            onChange={(e) => inputHandler("remarks", e.target.value, row.id)}
          />
        </div>
      ),
      // width: 170,
    },
  ];
  useEffect(() => {
    if (editingJWMaterials) {
      getDetails();
      getVendorBranches();
      getBillingDispatchAddress();
    }
  }, [editingJWMaterials]);
  // console.log(createJobWorkChallanForm.getFieldsValue());
  console.log(createJobWorkChallanForm.getFieldsValue());
  return (
    <Drawer
      title={`Editing Challan number: ${editingJWMaterials}`}
      width="100vw"
      open={editingJWMaterials}
      onClose={() => setEditingJWMaterials(false)}
    >
      <Row style={{ height: "100%" }}>
        <Col span={10} style={{ height: "95%", overflowY: "scroll" }}>
          <Card size="small">
            {loading === "page" && <Loading />}
            <Form
              // onFinish={submitHandler}
              form={createJobWorkChallanForm}
              layout="vertical"
            >
              <Divider style={{ marginTop: 10 }} orientation="left">
                Vendor Details
              </Divider>
              <Row gutter={4}>
                {/* <Col span={12}>
                  {loading === "fetchDetails" && (
                    <Skeleton.Input active block style={{ margin: 10 }} />
                  )}
                  {loading !== "fetchDetails" && (
                    <Form.Item label="Vendor Type" name="vendor_type">
                      <Input disabled />
                    </Form.Item>
                  )}
                </Col> */}
                <Col span={24}>
                  {loading === "fetchDetails" && (
                    <Skeleton.Input active block style={{ margin: 10 }} />
                  )}
                  {loading !== "fetchDetails" && (
                    <Form.Item label="Vendor Name" name="vendor">
                      <MyAsyncSelect
                        loadOptions={(value) =>
                          getAsyncOptions(value, "vendor")
                        }
                        selectLoading={loading === "select"}
                        optionsState={asyncOptions}
                        onChange={(value) => getVendorBranches(value)}
                        onBlur={() => setAsyncOptions([])}
                      />
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row gutter={4}>
                <Col span={12}>
                  {loading === "fetchDetails" && (
                    <Skeleton.Input active block style={{ margin: 10 }} />
                  )}
                  {loading !== "fetchDetails" && (
                    <Form.Item label="Vendor Branch" name="vendor_add_id">
                      <MySelect
                        onChange={(value) => getVendorBranchDetails(value)}
                        options={vendorBranchOptions}
                      />
                    </Form.Item>
                  )}
                </Col>
                {/* <Col span={8}>
                  {loading === "fetchDetails" && (
                    <Skeleton.Input active block style={{ margin: 10 }} />
                  )}
                  {loading !== "fetchDetails" && (
                    <Form.Item label="State" name="vendor_state">
                      <Input disabled />
                    </Form.Item>
                  )}
                </Col> */}
                <Col span={12}>
                  {loading === "fetchDetails" && (
                    <Skeleton.Input active block style={{ margin: 10 }} />
                  )}
                  {loading !== "fetchDetails" && (
                    <Form.Item label="GSTIN" name="vendor_gst">
                      <Input disabled />
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  {loading === "fetchDetails" && (
                    <Skeleton.Input active block style={{ margin: 10 }} />
                  )}
                  {loading !== "fetchDetails" && (
                    <Form.Item label="Vendor Address" name="vendor_address">
                      <Input.TextArea disabled />
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="Nature of Processing" name="nature_process">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item
                    label="Duration of Processing"
                    name="duration_process"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Vehicle Number" name="vehicle">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Other References" name="other_ref">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ marginTop: 10 }} orientation="left">
                Billing Details
              </Divider>

              <Row gutter={4}>
                <Col span={12}>
                  <Form.Item label="Billing Address ID" name="billing_id">
                    <MySelect
                      options={bilingAddressOptions}
                      onChange={getBillingAddressDetails}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item disabled label="PAN No." name="billingaddrpan">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={4}>
                <Col span={12}>
                  <Form.Item label="GSTIN." name="billingaddrgst">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="CIN" name="billingaddrcin">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="Billing Address" name="billing_address">
                    <Input.TextArea />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="left">Dispatch Details</Divider>

              <Row gutter={4}>
                <Col span={8}>
                  <Form.Item label="Dispatch Address ID" name="dispatch_to_id">
                    <MySelect
                      onChange={getDispatchAddressDetails}
                      options={dispatchAddressOptions}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="GSTIN" name="dispatchfromgst">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Pin Code" name="dispatch_to__pincode">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="Dispatch Address" name="dispatch_to__line1">
                    <Input.TextArea />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col span={14} style={{ height: "95%" }}>
          <FormTable data={rows} columns={columns} />
        </Col>
        {/* <Col span={24}>
          <Row justify="end" style={{ paddingTop: 15 }}>
            <Space>
              <Button
                loading={loading === "submit"}
                onClick={submitHandler}
                type="primary"
              >
                Submit
              </Button>
            </Space>
          </Row>
        </Col> */}
      </Row>
      <NavFooter nextLabel="Submit" submitFunction={submitHandler} />
    </Drawer>
  );
}

export default JWRMChallanEditMaterials;
