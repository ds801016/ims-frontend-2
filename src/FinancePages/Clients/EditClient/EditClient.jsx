import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Space,
} from "antd";
import axios from "axios";
import { clientAxios } from "../../../axiosInterceptor";
import { toast } from "react-toastify";
import MySelect from "../../../Components/MySelect";

function EditLedger({ updatingClient, setUpdatingClient }) {
  const [resetData, setResetData] = useState();
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const closeUpdatingClient = () => {
    setUpdatingClient(null);
  };
  const [updateClientForm] = Form.useForm();
  const getCountries = async () => {
    setPageLoading(true);
    const { data } = await clientAxios.get("/others/countries");
    setPageLoading(false);
    let arr = [];
    if (data.data[0]) {
      arr = data.data.map((row) => ({ text: row.name, value: row.code }));
      setCountriesOptions(arr);
    }
  };
  const getState = async () => {
    setPageLoading(true);
    const { data } = await clientAxios.get("/others/states");
    setPageLoading(false);
    if (data.data[0]) {
      let arr = data.data.map((row) => ({
        text: row.name,
        value: row.code,
      }));
      setStateOptions(arr);
    }
  };
  const getDetails = async () => {
    const { data } = await clientAxios.post("/client/edit", {
      c_code: updatingClient.clientCode,
    });
    if (data.code === 200) {
      setCountry(+data.data.country);
      setState(+data.data.state);
      let obj = {
        name: data.data.name,
        salesperson: data.data.salesperson,
        gst: data.data.gst,
        pan: data.data.panno,
        phone: data.data.phone,
        mobile: data.data.mobile,
        website: data.data.website,
        country: data.data.country,
        state: data.data.state,
        city: data.data.city,
        zipcode: data.data.zipcode,
        address: data.data.address,
        email: data.data.email,
      };
      updateClientForm.setFieldsValue(obj);
      setResetData(obj);
    } else {
      toast.error(data.message.msg);
    }
  };
  const resetFunction = () => {
    setCountry(+resetData.country);
    setState(+resetData.state);
    updateClientForm.setFieldsValue(resetData);
  };
  const validateHandler = (values) => {
    if (country === "") {
      return toast.error("Please select client's country");
    } else if (state === "") {
      return toast.error("Please select client's state");
    }
    let obj = {
      ...values,
      c_code: updatingClient.clientCode,
      country: country,
      state: state,
      panno: values.pan,
    };
    setShowSubmitConfirm(obj);
  };
  const submitHandler = async () => {
    if (showSubmitConfirm) {
      console.log(showSubmitConfirm);
      const { data } = await clientAxios.post(
        "/client/update",
        showSubmitConfirm
      );
      setShowSubmitConfirm(false);
      if (data.code === 200) {
        toast.success(data.message);
        setUpdatingClient(false);
      } else {
        toast.error(data.message.msg);
      }
    }
  };
  useEffect(() => {
    if (updatingClient) {
      getDetails();
      getCountries();
    }
  }, [updatingClient]);
  useEffect(() => {
    setState();
    if (country === 83) {
      getState();
    }
  }, [country]);
  return (
    <Drawer
      open={updatingClient}
      onClose={closeUpdatingClient}
      bodyStyle={{ paddingTop: -20 }}
      width="40vw"
      title={`Updating client ${updatingClient?.clientName} / ${updatingClient?.clientCode}`}
    >
      <Divider orientation="left">Client Basic Details</Divider>
      <Modal
        open={showSubmitConfirm}
        title="Title"
        // onOk={handleOk}
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
        Are you sure you want to update this client?
      </Modal>
      <Form
        form={updateClientForm}
        onFinish={validateHandler}
        style={{ height: "100%" }}
        size="small"
        layout="vertical"
      >
        <Row>
          <Col span={24}>
            <Row gutter={6}>
              <Col span={12}>
                <Form.Item
                  label="Client Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the name of the client",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Sales Person Name" name="salesperson">
                  <Input size="default" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={6}>
              <Col span={12}>
                <Form.Item
                  label="GST Number"
                  name="gst"
                  rules={[
                    {
                      required: true,
                      message: "Please enter GST Number",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="PAN Number"
                  name="pan"
                  rules={[
                    { required: true, message: "Please enter PAN Number" },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={6}>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input size="default" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter client's Phone Number",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={6}>
              <Col span={12}>
                <Form.Item label="Mobile" name="mobile">
                  <Input size="default" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Website" name="website">
                  <Input size="default" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Divider orientation="left">Address Details</Divider>
          {/* address details */}
          <Col span={24}>
            <Row gutter={6}>
              <Col span={12}>
                <Form.Item
                  label="Country"
                  // name="country"
                  rules={[
                    {
                      required: true,
                      message: "Please select a country",
                    },
                  ]}
                >
                  <MySelect
                    options={countriesOptions}
                    value={country}
                    onChange={(value) => {
                      setCountry(value);
                      value == "83" && getState();
                    }}
                    size="default"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="state" label="State">
                  {country == "83" && (
                    <MySelect
                      value={state}
                      options={stateOptions}
                      size="default"
                    />
                  )}
                  {country != "83" && <Input value={state} size="default" />}
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={6}>
              <Col span={12}>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Please enter client's city",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="ZIP"
                  name="zipcode"
                  rules={[
                    {
                      required: true,
                      message: "Please enter client's Zip code",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>
            </Row>
            <Col span={24}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please enter client's Complete address",
                  },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Col>
          <Row style={{ marginTop: 5, width: "100%" }} justify="end">
            <Space>
              <Form.Item>
                <Button
                  size="default"
                  onClick={resetFunction}
                  htmlType="button"
                >
                  Reset
                </Button>
              </Form.Item>
              <Form.Item>
                <Button size="default" htmlType="submit" type="primary">
                  Save
                </Button>
              </Form.Item>
            </Space>
          </Row>
        </Row>
      </Form>
    </Drawer>
  );
}

export default EditLedger;
