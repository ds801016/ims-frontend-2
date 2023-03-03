import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import AddComponent from "./AddComponents";
import { toast } from "react-toastify";
import AddVendorSideBar from "./AddVendorSideBar";
import CreateCostModal from "./CreateCostModal";
import AddBranch from "../../Master/Vendor/model/AddBranch";
import MySelect from "../../../Components/MySelect";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import NavFooter from "../../../Components/NavFooter";
import {
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Row,
  Tabs,
  Modal,
  Button,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import Loading from "../../../Components/Loading";
import SuccessPage from "./SuccessPage";
import { imsAxios } from "../../../axiosInterceptor";

const CreatePo = () => {
  document.title = "Create PO";
  const [totalValues, setTotalValues] = useState([]);
  const [newPurchaseOrder, setnewPurchaseOrder] = useState({
    vendorname: "",
    vendortype: "v01",
    vendorbranch: "",
    vendoraddress: "",
    billaddressid: "",
    billaddress: "",
    billPan: "",
    billGST: "",
    shipaddressid: "",
    shipaddress: "",
    shipPan: "",
    shipGST: "",
    termscondition: "",
    quotationdetail: "",
    paymentterms: "",
    pocostcenter: "",
    po_comment: "",
    project_name: "",
    pocreatetype: "N",
    original_po: "",
  });
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showDetailsCondirm, setShowDetailsConfirm] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [showBranchModel, setShowBranchModal] = useState(false);
  const [showAddCostModal, setShowAddCostModal] = useState(false);
  const [billToOptions, setBillTopOptions] = useState([]);
  const [shipToOptions, setShipToOptions] = useState([]);
  const [vendorBranches, setVendorBranches] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [rowCount, setRowCount] = useState([
    {
      id: v4(),
      index: 1,
      currency: "364907247",
      exchange_rate: 1,
      component: "",
      qty: 1,
      rate: "",
      duedate: "",
      inrValue: 0,
      hsncode: "",
      gsttype: "L",
      gstrate: "",
      cgst: 0,
      sgst: 0,
      igst: 0,
      remark: "--",
      unit: "--",
    },
  ]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [successData, setSuccessData] = useState(false);
  const [form] = Form.useForm();
  const validatePO = () => {
    console.log(newPurchaseOrder);
    let newPo = {};
    let componentData = {
      currency: [],
      exchange: [],
      component: [],
      qty: [],
      rate: [],
      duedate: [],
      hsncode: [],
      gsttype: [],
      gstrate: [],
      cgst: [],
      sgst: [],
      igst: [],
      remark: [],
    };
    rowCount.map((row) => {
      componentData.currency.push(row.currency);
      componentData.component.push(row.component.value);
      componentData.qty.push(row.qty);
      componentData.rate.push(row.rate);
      componentData.duedate.push(row.duedate);
      componentData.hsncode.push(row.hsncode);
      componentData.gsttype.push(row.gsttype);
      componentData.gstrate.push(row.gstrate);
      componentData.remark.push(row.remark);
      componentData.cgst.push(row.cgst);
      componentData.sgst.push(row.sgst);
      componentData.igst.push(row.igst);
      componentData.exchange.push(row.exchange_rate);
    });
    newPo = {
      ...newPurchaseOrder,
      ...componentData,
      billaddressid: newPurchaseOrder.billaddressid,
      original_po: newPurchaseOrder.original_po,
      pocostcenter: newPurchaseOrder.pocostcenter,
      pocreatetype: newPurchaseOrder.pocreatetype,
      shipaddressid: newPurchaseOrder.shipaddressid,
      vendorbranch: newPurchaseOrder.vendorbranch,
      vendorname: newPurchaseOrder.vendorname.value,
      vendortype: newPurchaseOrder.vendortype,
      pocomment: newPurchaseOrder.po_comment,
      poproject_name: newPurchaseOrder.project_name,
    };
    let error = false;
    if (rowCount.length == 0) {
      toast.error("Please add at least one component");
      return;
    } else if (
      !newPurchaseOrder.vendorname ||
      !newPurchaseOrder.vendortype ||
      !newPurchaseOrder.vendorbranch ||
      !newPurchaseOrder.vendoraddress ||
      !newPurchaseOrder.billaddressid ||
      !newPurchaseOrder.billaddress ||
      !newPurchaseOrder.shipaddressid ||
      !newPurchaseOrder.shipaddress ||
      !newPurchaseOrder.pocostcenter ||
      !newPurchaseOrder.pocreatetype
    ) {
      toast.error("Please enter all the fields");
      return;
    } else if (
      newPurchaseOrder.pocreatetype == "S" &&
      !newPurchaseOrder.original_po
    ) {
      return toast.error("Please select a PO ID in case of supplementry PO");
    }

    rowCount.map((count) => {
      if (
        count.currency == "" ||
        count.exchange == 0 ||
        count.component == "" ||
        count.qty == 0 ||
        count.rate == ""
      ) {
        error = true;
      }
    });
    if (error) {
      toast.error("Please enter all the values for all components");
      return;
    }
    setShowSubmitConfirm(newPo);
  };
  const submitHandler = async () => {
    setSubmitLoading(true);
    if (showSubmitConfirm) {
      const { data } = await imsAxios.post("/purchaseOrder/createPO", {
        ...showSubmitConfirm,
      });
      setSubmitLoading(false);
      setShowSubmitConfirm(null);
      if (data.code == 200) {
        resetFunction();
        rowsReset();
        setActiveTab("1");
        setSuccessData({
          vendorName: newPurchaseOrder.vendorname.label,
          project: newPurchaseOrder.project_name,
          poId: data.data.po_id,
          components: rowCount.map((row, index) => {
            return {
              id: index,
              component: row.component.label,
              // part: row.qty,
              qty: row.qty,
              rate: row.rate,
              uom: row.unit,
              value: Number(row.qty).toFixed(2) * Number(row.rate).toFixed(2),
            };
          }),
        });
      } else {
        toast.error(data.message.msg);
      }
    }
  };
  const getPOs = async (searchInput) => {
    if (searchInput?.length > 2) {
      setSelectLoading(true);
      const { data } = await imsAxios.post("/backend/searchPoByPoNo", {
        search: searchInput,
      });
      setSelectLoading(false);
      let arr = [];
      if (!data.msg) {
        arr = data.map((d) => {
          return { text: d.text, value: d.id };
        });
        setAsyncOptions(arr);
      } else {
        setAsyncOptions([]);
      }
    }
  };
  const selectInputHandler = async (name, value) => {
    if (value) {
      let obj = newPurchaseOrder;
      if (name == "vendorname") {
        let arr = await getVendorBracnch(value.value);
        let { address, gstin } = await getVendorAddress({
          vendorCode: value,
          vendorBranch: arr[0].value,
        });
        obj = {
          ...obj,
          [name]: value,
          vendorbranch: arr[0].value,
          vendoraddress: address.replaceAll("<br>", "\n"),
          gstin: gstin,
        };
      } else if (name == "vendorbranch") {
        setPageLoading(true);
        let { address, gstin } = await getVendorAddress({
          vendorCode: obj.vendorname,
          vendorBranch: value,
        });
        setPageLoading(false);
        obj = {
          ...obj,
          [name]: value,
          vendorbranch: value,
          vendoraddress: address.replaceAll("<br>", "\n"),
          gstid: gstin,
        };
      } else if (name == "shipaddressid") {
        let shippingDetails = await getShippingAddress(value);
        obj = {
          ...obj,
          [name]: value,
          shipaddress: shippingDetails.address.replaceAll("<br>", "\n"),
          shipPan: shippingDetails.pan,
          shipGST: shippingDetails.gstin,
        };
      } else if (name == "billaddressid") {
        let billingDetails = await getBillingAddress(value);
        obj = {
          ...obj,
          [name]: value,
          billaddress: billingDetails.address.replaceAll("<br>", "\n"),
          billPan: billingDetails.pan,
          billGST: billingDetails.gstin,
        };
      } else {
        obj = {
          ...obj,
          [name]: value,
        };
      }
      console.log(obj);
      form.setFieldsValue(obj);
      setnewPurchaseOrder(obj);
    }
  };
  const POoption = [
    { text: "New", value: "N" },
    { text: "Supplementary", value: "S" },
  ];
  const vendorDetailsOptions = [
    { text: "JWI (Job Work In)", value: "j01" },
    { text: "Vendor", value: "v01" },
  ];
  //getting vendors in the vendor select list
  const getVendors = async (s) => {
    if (s?.length > 2) {
      setSelectLoading(true);
      const { data } = await imsAxios.post("/backend/vendorList", {
        search: s,
      });
      setSelectLoading(false);
      let arr = [];
      if (!data.msg) {
        arr = data.map((d) => {
          return { text: d.text, value: d.id };
        });
        setAsyncOptions(arr);
      } else {
        setAsyncOptions([]);
      }
    }
  };
  //getting vendor branches
  const getVendorBracnch = async (vendorCode) => {
    setPageLoading(true);
    const { data } = await imsAxios.post("/backend/vendorBranchList", {
      vendorcode: vendorCode,
    });
    setPageLoading(false);
    const arr = data.data.map((d) => {
      return { value: d.id, text: d.text };
    });
    setVendorBranches(arr);
    return arr;
  };
  // getting vendor address
  const getVendorAddress = async ({ vendorCode, vendorBranch }) => {
    const { data } = await imsAxios.post("/backend/vendorAddress", {
      vendorcode: vendorCode.value,
      branchcode: vendorBranch,
    });
    return { address: data?.data?.address, gstin: data?.data.gstid };
  };
  const getBillTo = async () => {
    setSelectLoading(true);
    const { data } = await imsAxios.post("/backend/billingAddressList", {
      search: "",
    });
    setSelectLoading(false);
    let arr = [];
    arr = data.map((d) => {
      return { text: d.text, value: d.id };
    });
    setBillTopOptions(arr);
  };
  const shipTo = async () => {
    setSelectLoading(true);
    const { data } = await imsAxios.post("/backend/shipingAddressList", {
      search: "",
    });
    setSelectLoading(false);
    let arr = [];
    arr = data.map((d) => {
      return { text: d.text, value: d.id };
    });
    setShipToOptions(arr);
  };
  const getCostCenteres = async (searchInput) => {
    if (searchInput.length > 2) {
      setSelectLoading(true);
      const { data } = await imsAxios.post("/backend/costCenter", {
        search: searchInput,
      });
      setSelectLoading(false);
      let arr = [];
      if (!data.msg) {
        arr = data.map((d) => {
          return { text: d.text, value: d.id };
        });
        setAsyncOptions(arr);
      } else {
        setAsyncOptions([]);
      }
    }
  };
  const getBillingAddress = async (billaddressid) => {
    setPageLoading(true);
    const { data } = await imsAxios.post("/backend/billingAddress", {
      billing_code: billaddressid,
    });
    setPageLoading(false);
    return {
      gstin: data.data?.gstin,
      pan: data.data?.pan,
      address: data.data?.address,
    };

    // selectInputHandler("billDetails", data.data.address);
  };

  const getShippingAddress = async (shipaddressid) => {
    setPageLoading(true);
    const { data } = await imsAxios.post("/backend/shippingAddress", {
      shipping_code: shipaddressid,
    });
    setPageLoading(false);
    return {
      gstin: data.data?.gstin,
      pan: data.data?.pan,
      address: data.data?.address,
    };
  };
  const resetFunction = () => {
    let obj = {
      vendorname: "",
      vendortype: "v01",
      vendorbranch: "",
      vendoraddress: "",
      billaddressid: "",
      billaddress: "",
      billPan: "",
      billGST: "",
      shipaddressid: "",
      shipaddress: "",
      shipPan: "",
      shipGST: "",
      termscondition: "",
      quotationdetail: "",
      paymentterms: "",
      pocostcenter: "",
      po_comment: "",
      project_name: "",
      pocreatetype: "N",
      original_po: "",
    };

    // form.reset
    // form.resetFields();
    form.setFieldsValue(obj);
    setnewPurchaseOrder(obj);
    setShowDetailsConfirm(false);
  };
  const rowsReset = () => {
    setRowCount([
      {
        id: v4(),
        index: 1,
        currency: "364907247",
        exchange_rate: 1,
        component: "",
        qty: 1,
        rate: "",
        duedate: "",
        inrValue: 0,
        hsncode: "",
        gsttype: "L",
        gstrate: "",
        cgst: 0,
        sgst: 0,
        igst: 0,
        remark: "--",
        unit: "--",
      },
    ]);
  };
  const setNewPO = () => {
    resetFunction();
    setSuccessData(false);
  }; //on selecting vendor from the list
  useEffect(() => {
    if (newPurchaseOrder.vendorname) {
      getVendorBracnch();
    }
  }, [newPurchaseOrder.vendorname]);
  // useE
  useEffect(() => {
    getBillTo();
    shipTo();
  }, []);
  //getting address of branch
  useEffect(() => {
    getVendorAddress();
  }, [newPurchaseOrder.vendorbranch]);
  //getting complete billing address
  useEffect(() => {
    getBillingAddress();
  }, [newPurchaseOrder.billaddressid]);
  useEffect(() => {
    getShippingAddress();
  }, [newPurchaseOrder.shipaddressid]);
  const finish = (values) => {
    setActiveTab("2");
    setnewPurchaseOrder(values);
  };
  return (
    <div
      style={{
        height: "90%",
      }}
    >
      {/* create confirm modal */}
      <Modal
        title="Confirm Create PO!"
        open={showSubmitConfirm}
        onCancel={() => setShowSubmitConfirm(false)}
        footer={[
          <Button key="back" onClick={() => setShowSubmitConfirm(false)}>
            No
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitLoading}
            onClick={submitHandler}
          >
            Yes
          </Button>,
        ]}
      >
        <p>Are you sure you want to generate this Purchase Order?</p>
      </Modal>
      {/* reset vendor form */}
      <Modal
        title="Confirm Reset!"
        open={showDetailsCondirm}
        onOk={resetFunction}
        onCancel={() => setShowDetailsConfirm(false)}
        footer={[
          <Button key="back" onClick={() => setShowDetailsConfirm(false)}>
            No
          </Button>,
          <Button key="submit" type="primary" onClick={resetFunction}>
            Yes
          </Button>,
        ]}
      >
        <p>Are you sure to reset details of this Purchase Order?</p>
      </Modal>
      <AddVendorSideBar
        open={showAddVendorModal}
        setOpen={setShowAddVendorModal}
      />
      <AddBranch
        getVendorBracnch={getVendorBracnch}
        setOpenBranch={setShowBranchModal}
        openBranch={showBranchModel}
      />
      <CreateCostModal
        showAddCostModal={showAddCostModal}
        setShowAddCostModal={setShowAddCostModal}
      />
      {!successData && (
        <div style={{ height: "100%", overflow: "auto" }}>
          <Tabs
            style={{
              padding: "0 10px",
              height: "100%",
            }}
            activeKey={activeTab}
            size="small"
          >
            <Tabs.TabPane tab=" Purchase Order Details" key="1">
              <div
                style={{
                  height: "100%",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  padding: "0vh 20px",
                }}
              >
                {pageLoading && <Loading />}
                {/* vendor */}
                <Form
                  form={form}
                  size="small"
                  scrollToFirstError={true}
                  name="create-po"
                  layout="vertical"
                  initialValues={newPurchaseOrder}
                  onFinish={finish}
                  onFieldsChange={(value, allFields) => {
                    if (value.length == 1) {
                      selectInputHandler(value[0].name[0], value[0].value);
                    }
                  }}
                >
                  <Row>
                    <Col span={4}>
                      <Descriptions size="small" title="PO Type">
                        <Descriptions.Item
                          contentStyle={{
                            fontSize: window.innerWidth < 1600 && "0.7rem",
                          }}
                        >
                          Provide Purchase Order type as in
                          <br /> (New Or Supplementary)
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col span={20}>
                      <Row gutter={16}>
                        {/* PO type */}
                        <Col span={6}>
                          <Form.Item
                            name="pocreatetype"
                            label="PO Type"
                            rules={[
                              {
                                required: true,
                                message: "Please Select a PO Type!",
                              },
                            ]}
                          >
                            <MySelect size="default" options={POoption} />
                          </Form.Item>
                        </Col>

                        {newPurchaseOrder.pocreatetype == "S" && (
                          <Col span={6}>
                            <Form.Item
                              name="original_po"
                              label={
                                <span
                                  style={{
                                    fontSize:
                                      window.innerWidth < 1600 && "0.7rem",
                                  }}
                                >
                                  Original PO
                                </span>
                              }
                              rules={[
                                {
                                  required:
                                    newPurchaseOrder.pocreatetype == "S",
                                  message: "Please Select a PO Type!",
                                },
                              ]}
                            >
                              <MyAsyncSelect
                                selectLoading={selectLoading}
                                size="default"
                                onBlur={() => setAsyncOptions([])}
                                loadOptions={getPOs}
                                optionsState={asyncOptions}
                              />
                            </Form.Item>
                          </Col>
                        )}
                      </Row>
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    <Col span={4}>
                      <Descriptions size="small" title="Vendor Details">
                        <Descriptions.Item
                          contentStyle={{
                            fontSize: window.innerWidth < 1600 && "0.7rem",
                          }}
                        >
                          Type Name or Code of the vendor
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>

                    <Col span={20}>
                      <Row gutter={16}>
                        {/* vendor type */}
                        <Col span={6}>
                          <Form.Item
                            name="vendortype"
                            label={
                              <span
                                style={{
                                  fontSize:
                                    window.innerWidth < 1600 && "0.7rem",
                                }}
                              >
                                Vendor Type
                              </span>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please Select a vendor Type!",
                              },
                            ]}
                          >
                            <MySelect
                              size="default"
                              options={vendorDetailsOptions}
                            />
                          </Form.Item>
                        </Col>
                        {/* vendor name */}
                        <Col span={6}>
                          <Form.Item
                            name="vendorname"
                            label={
                              <div
                                style={{
                                  fontSize:
                                    window.innerWidth < 1600 && "0.7rem",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: 350,
                                }}
                              >
                                Vendor Name
                                <span
                                  onClick={() => setShowAddVendorModal(true)}
                                  style={{
                                    color: "#1890FF",
                                    cursor: "pointer",
                                  }}
                                >
                                  Add Vendor
                                </span>
                              </div>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please Select a vendor Name!",
                              },
                            ]}
                          >
                            <MyAsyncSelect
                              selectLoading={selectLoading}
                              size="default"
                              labelInValue
                              onBlur={() => setAsyncOptions([])}
                              optionsState={asyncOptions}
                              loadOptions={getVendors}
                            />
                          </Form.Item>
                        </Col>
                        {/* venodr branch */}
                        <Col span={6}>
                          <Form.Item
                            name="vendorbranch"
                            label={
                              <div
                                style={{
                                  fontSize:
                                    window.innerWidth < 1600 && "0.7rem",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: 350,
                                }}
                              >
                                Vendor Branch
                                <span
                                  onClick={() => {
                                    newPurchaseOrder.vendorname.value
                                      ? setShowBranchModal({
                                          vendor_code:
                                            newPurchaseOrder.vendorname.value,
                                        })
                                      : toast.error(
                                          "Please Select a vendor first"
                                        );
                                  }}
                                  style={{ color: "#1890FF" }}
                                >
                                  Add Branch
                                </span>
                              </div>
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please Select a vendor Branch!",
                              },
                            ]}
                          >
                            <MySelect options={vendorBranches} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item name="gstin" label="GSTIN">
                            <Input size="default" disabled />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={8}>
                        <Col span={18}>
                          <Form.Item
                            name="vendoraddress"
                            label="Bill From Address"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter bill from address!",
                              },
                            ]}
                          >
                            <TextArea rows={4} style={{ resize: "none" }} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Divider />
                  {/* PO TERMS */}
                  <Row>
                    <Col span={4}>
                      <Descriptions size="small" title="PO Terms">
                        <Descriptions.Item
                          contentStyle={{
                            fontSize: window.innerWidth < 1600 && "0.7rem",
                          }}
                        >
                          Provide PO terms and other information
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col span={20}>
                      <Row gutter={16}>
                        {/* terms and conditions */}
                        <Col span={6}>
                          <Form.Item
                            name="termscondition"
                            label=" Terms and Conditions"
                          >
                            <Input size="default" />
                          </Form.Item>
                        </Col>
                        {/* quotations */}
                        <Col span={6}>
                          <Form.Item name="quotationdetail" label="Quotation">
                            <Input size="default" name="quotationdetail" />
                          </Form.Item>
                        </Col>
                        {/* payment terms */}
                        <Col span={6}>
                          <Form.Item name="paymentterms" label=" Payment Terms">
                            <Input size="default" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        {/* terms and conditions */}

                        <Col span={6}>
                          <Form.Item
                            name="pocostcenter"
                            label="Cost Center"
                            rules={[
                              {
                                required: true,
                                message: "Please Select a Cost Center!",
                              },
                            ]}
                          >
                            <MyAsyncSelect
                              selectLoading={selectLoading}
                              onBlur={() => setAsyncOptions([])}
                              loadOptions={getCostCenteres}
                              optionsState={asyncOptions}
                            />
                          </Form.Item>
                        </Col>
                        {/* project name */}
                        <Col span={6}>
                          <Form.Item name="project_name" label="Project">
                            <Input size="default" />
                          </Form.Item>
                        </Col>
                        {/* comments */}
                        <Col span={6}>
                          <Form.Item label="Comments" name="po_comment">
                            <Input size="default" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Divider />
                  <Row>
                    <Col span={4}>
                      <Descriptions size="small" title="Billing Details">
                        <Descriptions.Item
                          contentStyle={{
                            fontSize: window.innerWidth < 1600 && "0.7rem",
                          }}
                        >
                          Provide billing information
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col span={20}>
                      <Row gutter={16}>
                        {/* billing id */}
                        <Col span={6}>
                          <Form.Item
                            name="billaddressid"
                            label="Billing Id"
                            rules={[
                              {
                                required: true,
                                message: "Please Select a Billing Address!",
                              },
                            ]}
                          >
                            <MySelect options={billToOptions} />
                          </Form.Item>
                        </Col>
                        {/* pan number */}
                        <Col span={6}>
                          <Form.Item
                            name="billPan"
                            label="Pan No."
                            rules={[
                              {
                                required: true,
                                message: "Please enter Billing PAN Number!",
                              },
                            ]}
                          >
                            <Input
                              size="default"
                              value={newPurchaseOrder.billPan}
                            />
                          </Form.Item>
                        </Col>
                        {/* gstin uin */}
                        <Col span={6}>
                          <Form.Item
                            name="billGST"
                            label="GSTIN / UIN"
                            rules={[
                              {
                                required: true,
                                message: "Please enter Billing GSTIN Number!",
                              },
                            ]}
                          >
                            <Input
                              size="default"
                              value={newPurchaseOrder.billGST}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      {/* billing address */}
                      <Row>
                        <Col span={18}>
                          <Form.Item
                            name="billaddress"
                            label="Billing Address"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Billing Address!",
                              },
                            ]}
                          >
                            <TextArea style={{ resize: "none" }} rows={4} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Divider />
                  <Row>
                    <Col span={4}>
                      <Descriptions size="small" title="Shipping Details">
                        <Descriptions.Item
                          contentStyle={{
                            fontSize: window.innerWidth < 1600 && "0.7rem",
                          }}
                        >
                          Provide shipping information
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>

                    <Col span={20}>
                      <Row gutter={16}>
                        {/* shipping id */}
                        <Col span={6}>
                          <Form.Item
                            name="shipaddressid"
                            label="Shipping Id"
                            rules={[
                              {
                                required: true,
                                message: "Please Select a Shipping Address!",
                              },
                            ]}
                          >
                            <MySelect options={shipToOptions} />
                          </Form.Item>
                        </Col>
                        {/* pan number */}
                        <Col span={6}>
                          <Form.Item
                            label="Pan No."
                            name="shipPan"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Shipping PAN Number!",
                              },
                            ]}
                          >
                            <Input
                              size="default"
                              value={newPurchaseOrder.shipPan}
                            />
                          </Form.Item>
                        </Col>
                        {/* gstin uin */}
                        <Col span={6}>
                          <Form.Item
                            name="shipGST"
                            label=" GSTIN / UIN"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Shipping GSTIN!",
                              },
                            ]}
                          >
                            <Input
                              size="default"
                              value={newPurchaseOrder.shipGST}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      {/* shipping address */}
                      <Row>
                        <Col span={18}>
                          <Form.Item
                            label="Shipping Address"
                            name="shipaddress"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Shipping Address!",
                              },
                            ]}
                          >
                            <TextArea style={{ resize: "none" }} rows={4} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <NavFooter
                      submithtmlType="submit"
                      submitButton={true}
                      formName="create-po"
                      resetFunction={() => setShowDetailsConfirm(true)}
                    />
                  </Row>
                </Form>
                <Divider />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="Add Components Details"
              style={{ height: "98%" }}
              key="2"
            >
              <div style={{ height: "100%" }}>
                <AddComponent
                  newPurchaseOrder={newPurchaseOrder}
                  setTotalValues={setTotalValues}
                  setRowCount={setRowCount}
                  rowCount={rowCount}
                  setActiveTab={setActiveTab}
                  resetFunction={resetFunction}
                  submitHandler={validatePO}
                  submitLoading={submitLoading}
                  totalValues={totalValues}
                />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      )}
      {successData && (
        <SuccessPage
          resetFunction={resetFunction}
          po={successData}
          setNewPO={setNewPO}
        />
      )}
    </div>
  );
};

export default CreatePo;
