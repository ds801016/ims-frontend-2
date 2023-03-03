import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Row, Col, Input, Form, Divider, Drawer, Space } from "antd";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { imsAxios } from "../../../axiosInterceptor";

const AddVendorSideBar = ({ setOpen, open }) => {
  const [addVendor, setAddVendor] = useState({
    vendor: {
      vname: "",
      pan: "",
      cin: "",
    },
    branch: {
      branchname: "",
      state: "",
      city: "",
      gst: "",
      pin: "",
      email: "",
      mobile: "",
      address: "",
      fax: "",
    },
  });
  const [asyncOptions, setAsyncOptions] = useState([]);
  const inputHandler = (name, value) => {
    if (name === "vname" || name === "pan" || name === "cin") {
      setAddVendor((addVendor) => {
        return { ...addVendor, vendor: { ...addVendor.vendor, [name]: value } };
      });
    } else {
      setAddVendor((addVendor) => {
        return { ...addVendor, branch: { ...addVendor.branch, [name]: value } };
      });
    }
  };
  const [selectLoading, setSelectLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const getFetchState = async (e) => {
    if (e.length > 2) {
      setSelectLoading(true);
      const { data } = await imsAxios.post("/backend/stateList", {
        search: e,
      });
      setSelectLoading(false);
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
      // return arr;
    }
  };

  const addVendorDetail = async () => {
    if (!addVendor.vendor.vname) {
      toast.error("Please provide a Vendor Name");
    } else if (!addVendor.vendor.pan) {
      toast.error("Please provide Enter Pan no");
    } else if (!addVendor.branch.branchname) {
      toast.error("Please provide a branch name");
    } else if (!addVendor.branch.state) {
      toast.error("Please select vendor state");
    } else if (!addVendor.branch.city) {
      toast.error("Please provide City");
    } else if (!addVendor.branch.gst) {
      toast.error("Please provide GST Number");
    } else if (!addVendor.branch.pin) {
      toast.error("Please provide Pin Code");
    } else if (!addVendor.branch.mobile) {
      toast.error("Please provide Mobile Number");
    } else if (!addVendor.branch.address) {
      toast.error("Please provide Address");
    } else {
      setSubmitLoading(true);
      const { data } = await imsAxios.post("/vendor/addVendor", {
        vendor: {
          vendorname: addVendor.vendor.vname,
          panno: addVendor.vendor.pan,
          cinno: addVendor.vendor.cin == "" && "--",
        },
        branch: {
          branch: addVendor.branch.branchname,
          address: addVendor.branch.address,
          state: addVendor.branch.state,
          city: addVendor.branch.city,
          pincode: addVendor.branch.pin,
          fax: addVendor.branch.fax == "" && "--",
          mobile: addVendor.branch.mobile,
          email: addVendor.branch.email == "" && "--",
          gstin: addVendor.branch.gst,
        },
      });
      setSubmitLoading(false);
      if (data.code == 200) {
        // fetchVendor();
        setAddVendor({
          vendor: {
            vname: "",
            pan: "",
            cin: "",
          },
          branch: {
            branchname: "",
            state: "",
            city: "",
            gst: "",
            pin: "",
            email: "",
            mobile: "",
            address: "",
            fax: "",
          },
        });
        toast.success(data.message.toString().replaceAll("<br/>", " "));
        setOpen(null);
        // setShowAddVendorModal(false);
      } else {
        toast.error(data.message.msg);
      }
    }
  };

  const reset = async () => {
    setAddVendor({
      vendor: {
        vname: "",
        pan: "",
        cin: "",
      },
      branch: {
        branchname: "",
        state: "",
        city: "",
        gst: "",
        pin: "",
        email: "",
        mobile: "",
        address: "",
        fax: "",
      },
    });
  };

  useEffect(() => {
    // fetchState();
  });
  return (
    <Drawer
      width="50vw"
      title="Add Vendor"
      onClose={() => setOpen(null)}
      open={open}
    >
      <Form
        size="small"
        layout="vertical"
        style={{ padding: 10, height: "95%", overflowY: "auto" }}
      >
        <Divider style={{ marginTop: -10 }} orientation="center">
          VendorDetails
        </Divider>
        <Row gutter={16}>
          <Col span={24}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Vendor Name">
                  <Input
                    size="default"
                    value={addVendor.vendor.vname}
                    onChange={(e) => inputHandler("vname", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Pan Number">
                  <Input
                    value={addVendor.vendor.pan}
                    onChange={(e) => inputHandler("pan", e.target.value)}
                    size="default"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="CIN Number">
                  <Input
                    value={addVendor.vendor.cin}
                    onChange={(e) => inputHandler("cin", e.target.value)}
                    size="default"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="GST Number">
                  <Input
                    size="default"
                    value={addVendor.branch.gst}
                    onChange={(e) => inputHandler("gst", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email">
                  <Input
                    size="default"
                    value={addVendor.branch.email}
                    onChange={(e) => inputHandler("email", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Mobile">
                  <Input
                    size="default"
                    value={addVendor.branch.mobile}
                    onChange={(e) => inputHandler("mobile", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Fax Number">
                  <Input
                    size="default"
                    value={addVendor.branch.fax}
                    onChange={(e) => inputHandler("fax", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider orientation="center">Branch Details</Divider>
        <Row gutter={16}>
          <Col span={24}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Branch Name">
                  <Input
                    size="default"
                    value={addVendor.branch.branchname}
                    onChange={(e) => inputHandler("branchname", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Select State">
                  <MyAsyncSelect
                    selectLoading={selectLoading}
                    onBlur={() => setAsyncOptions([])}
                    optionsState={asyncOptions}
                    loadOptions={getFetchState}
                    value={addVendor.branch.state}
                    onChange={(e) => inputHandler("state", e)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="City">
                  <Input
                    size="default"
                    value={addVendor.branch.city}
                    onChange={(e) => inputHandler("city", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Pin Code">
                  <Input
                    size="default"
                    value={addVendor.branch.pin}
                    onChange={(e) => inputHandler("pin", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Complete Address">
                  <Input.TextArea
                    rows={4}
                    size="default"
                    value={addVendor.branch.address}
                    onChange={(e) => inputHandler("address", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <Row justify="end">
        <Col>
          <Space>
            <Button onClick={reset}>Reset</Button>
            <Button
              loading={submitLoading}
              onClick={addVendorDetail}
              type="primary"
            >
              Submit
            </Button>
          </Space>
        </Col>
      </Row>
    </Drawer>
  );
};

export default AddVendorSideBar;
