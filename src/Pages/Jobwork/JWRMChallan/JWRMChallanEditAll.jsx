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
import { toast } from "react-toastify";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import Loading from "../../../Components/Loading";
import NavFooter from "../../../Components/NavFooter";
import errorToast from "../../../Components/errorToast";

function JWRMChallanEditAll({ setEditJWAll, editiJWAll, getRows }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [asyncOptions, setAsyncOptions] = useState([]);

  const [createJobWorkChallanForm] = Form.useForm();

  const getDetails = async () => {
    setLoading("fetchDetails");
    const response = await imsAxios.post("/jobwork/createJwChallan", {
      transaction: editiJWAll.fetchTransactionId,
    });
    setLoading(false);
    if (response.data.code === 200) {
      let arr = response.data.data.data.map((row, index) => ({
        id: v4(),
        index: index + 1,
        issue_qty: 0,
        part_rate: 0,
        out_loc: "20210910142629",
        remarks: "",
        ...row,
      }));
      setRows(arr);
      let obj = response.data.data.header;
      obj = {
        ...obj,
        billingaddrid: "",
        dispatchfromaddrid: "",
        vendor_address: obj.vendor_address?.replaceAll("<br>", "\n"),
      };
      createJobWorkChallanForm.setFieldsValue(obj);
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
    let obj = await createJobWorkChallanForm.validateFields();
    obj = {
      ...obj,
      reference_id: rows[0].ref_id,
    };
    const finalObj = {
      ...obj,
      component: rows.map((row) => row.component_key),
      hsncode: rows.map((row) => row.hsn_code),
      qty: rows.map((row) => row.issue_qty),
      rate: rows.map((row) => row.part_rate),
      remark: rows.map((row) => row.remarks),
      picklocation: rows.map((row) => row.out_loc),
      transaction_id: editiJWAll.saveTransactionId,
    };
    setLoading("submit");
    const response = await imsAxios.post(
      "/jobwork/saveCreateChallan",
      finalObj
    );
    setLoading(false);
    if (response.data.code === 200) {
      toast.success(response.data.message);
      setEditJWAll(false);
      getRows();
    } else {
      if (response.data.message.msg) {
        toast.error(response.data.message.msg);
      } else {
        toast.error(errorToast(response.data.message));
      }
    }
  };
  const getLocations = async () => {
    const response = await imsAxios.get("/jobwork/jwChallanLocations");
    if (response.data.code === 200) {
      let arr = response.data.data.map((row) => ({
        text: row.text,
        value: row.id,
      }));
      setLocationOptions(arr);
    } else {
      setLocationOptions([]);
      toast.error(response.data.message.msg);
    }
  };
  const getAsyncOptions = async (search, type) => {
    let link =
      type === "dispatch"
        ? "/backend/dispatchAddressList"
        : type === "billing" && "/backend/billingAddressList";
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
  const getDispatchAddress = async (value) => {
    setLoading("page");
    const response = await imsAxios.post("/backend/dispatchAddress", {
      dispatch_code: value,
    });
    setLoading(false);
    if (response.data.code === 200) {
      let obj = createJobWorkChallanForm.getFieldsValue();
      obj = {
        ...obj,
        dispatchfromaddr: response.data.data.address.replaceAll("<br>", "\n"),
        dispatchfromaddrid: value,
        dispatchfromgst: response.data.data.gstin,
        dispatchfrompincode: response.data.data.pincode,
      };
      createJobWorkChallanForm.setFieldsValue(obj);
    } else {
      toast.error(response.data.message.msg);
    }
  };
  const getBillingAddress = async (value) => {
    setLoading("page");
    const response = await imsAxios.post("/backend/billingAddress", {
      billing_code: value,
    });
    setLoading(false);
    if (response.data.code === 200) {
      let obj = createJobWorkChallanForm.getFieldsValue();
      obj = {
        ...obj,
        billingaddr: response.data.data.address.replaceAll("<br>", "\n"),
        billingaddrid: value,
        billingaddrgst: response.data.data.gstin,
        billingaddrcin: response.data.data.cin,
        billingaddrpan: response.data.data.pan,
      };
      createJobWorkChallanForm.setFieldsValue(obj);
    } else {
      toast.error(response.data.message.msg);
    }
  };
  const columns = [
    { headerName: "Sr. No", renderCell: ({ row }) => row.index, width: 80 },
    {
      headerName: "Part No.",
      renderCell: ({ row }) => (
        <div style={{ width: 80 }}>
          <ToolTipEllipses text={row.part_no} />
        </div>
      ),
      width: 80,
    },
    {
      headerName: "Component",
      renderCell: ({ row }) => (
        <div style={{ width: 150 }}>
          <ToolTipEllipses text={row.component_name} />
        </div>
      ),
      width: 150,
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
      headerName: "Out Location",
      renderCell: ({ row }) => (
        <div style={{ width: "100%" }}>
          <MySelect
            options={locationOptions}
            value={row.out_loc}
            onChange={(value) => inputHandler("out_loc", value, row.id)}
          />
        </div>
      ),
      width: 120,
    },
    {
      headerName: "Description",
      renderCell: ({ row }) => (
        <div style={{ width: 200 }}>
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
    if (editiJWAll) {
      getDetails();
      getLocations();
    }
  }, [editiJWAll]);
  return (
    <Drawer
      title={`Creating Jobwork Challan`}
      width="100vw"
      open={editiJWAll}
      onClose={() => setEditJWAll(false)}
    >
      <Row style={{ height: "100%" }}>
        <Col span={10} style={{ height: "95%", overflowY: "scroll" }}>
          <Card size="small">
            {loading === "page" && <Loading />}
            <Form
              onFinish={submitHandler}
              form={createJobWorkChallanForm}
              layout="vertical"
            >
              <Divider style={{ marginTop: 10 }} orientation="left">
                Vendor Details
              </Divider>
              <Row gutter={4}>
                <Col span={12}>
                  {loading === "fetchDetails" && (
                    <Skeleton.Input active block style={{ margin: 10 }} />
                  )}
                  {loading !== "fetchDetails" && (
                    <Form.Item label="Vendor Type" name="vendor_type">
                      <Input disabled />
                    </Form.Item>
                  )}
                </Col>
                <Col span={12}>
                  {loading === "fetchDetails" && (
                    <Skeleton.Input active block style={{ margin: 10 }} />
                  )}
                  {loading !== "fetchDetails" && (
                    <Form.Item label="Vendor Name" name="vendor_name">
                      <Input disabled />
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row gutter={4}>
                <Col span={8}>
                  {loading === "fetchDetails" && (
                    <Skeleton.Input active block style={{ margin: 10 }} />
                  )}
                  {loading !== "fetchDetails" && (
                    <Form.Item label="Country" name="vendor_country">
                      <Input disabled />
                    </Form.Item>
                  )}
                </Col>
                <Col span={8}>
                  {loading === "fetchDetails" && (
                    <Skeleton.Input active block style={{ margin: 10 }} />
                  )}
                  {loading !== "fetchDetails" && (
                    <Form.Item label="State" name="vendor_state">
                      <Input disabled />
                    </Form.Item>
                  )}
                </Col>
                <Col span={8}>
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
                  <Form.Item label="Nature of Processing" name="nature">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item label="Duration of Processing" name="duration">
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
                  <Form.Item label="Billing Address ID" name="billingaddrid">
                    <MyAsyncSelect
                      selectLoading={loading === "select"}
                      optionsState={asyncOptions}
                      onBlur={() => setAsyncOptions([])}
                      loadOptions={(search) =>
                        getAsyncOptions(search, "billing")
                      }
                      onChange={getBillingAddress}
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
                  <Form.Item label="Billing Address" name="billingaddr">
                    <Input.TextArea />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="left">Dispatch Details</Divider>

              <Row gutter={4}>
                <Col span={8}>
                  <Form.Item
                    label="Dispatch Address ID"
                    name="dispatchfromaddrid"
                  >
                    <MyAsyncSelect
                      selectLoading={loading === "select"}
                      optionsState={asyncOptions}
                      onChange={getDispatchAddress}
                      onBlur={() => setAsyncOptions([])}
                      loadOptions={(search) =>
                        getAsyncOptions(search, "dispatch")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="GSTIN" name="dispatchfromgst">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Pin Code" name="dispatchfrompincode">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="Dispatch Address" name="dispatchfromaddr">
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
        <NavFooter
          backFunction={() => setEditJWAll(false)}
          submitFunction={submitHandler}
          nextLabel="Submit"
          loading={loading === "submit"}
        />
      </Row>
    </Drawer>
  );
}

export default JWRMChallanEditAll;
