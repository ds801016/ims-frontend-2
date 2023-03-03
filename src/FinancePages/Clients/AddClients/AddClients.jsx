import { useState, useEffect } from "react";
import { clientAxios } from "../../../axiosInterceptor";
import {
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Row,
  Modal,
  Button,
} from "antd";
import MySelect from "../../../Components/MySelect";
import NavFooter from "../../../Components/NavFooter";
import { toast } from "react-toastify";
import Loading from "../../../Components/Loading";

function AddClients() {
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(83);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [addClientForm] = Form.useForm();

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
  const submitHandler = async () => {
    if (!showSubmitConfirm) {
      return;
    }
    const newObj = {
      name: showSubmitConfirm.clientname,
      salesperson: showSubmitConfirm.salesperson,
      gst: showSubmitConfirm.gst,
      panno: showSubmitConfirm.pan,
      email: showSubmitConfirm.email,
      phone: showSubmitConfirm.phone,
      mobile: showSubmitConfirm.mobile,
      country: showSubmitConfirm.country,
      state: showSubmitConfirm.state,
      city: showSubmitConfirm.city,
      zipcode: showSubmitConfirm.zipcode,
      address: showSubmitConfirm.address,
      website: showSubmitConfirm.website,
    };
    setSubmitLoading(true);
    const { data } = await clientAxios.post("/client/createclient", newObj);
    setSubmitLoading(false);
    if (data.code === 200) {
      toast.success(data.message);
      resetFunction();
      setShowSubmitConfirm(false);
    } else {
      toast.error(data.message.msg);
    }
  };
  const resetFunction = () => {
    addClientForm.setFieldsValue({
      clientname: "",
      salesperson: "",
      gst: "",
      pan: "",
      email: "",
      phone: "",
      mobile: "",
      country: 83,
      state: "",
      city: "",
      zipcode: "",
      address: "",
      website: "",
    });
    setShowResetConfirm(false);
  };
  useEffect(() => {
    getCountries();
    addClientForm.setFieldsValue({
      clientname: "",
      salesperson: "",
      gst: "",
      pan: "",
      email: "",
      phone: "",
      mobile: "",
      country: 83,
      state: "",
      city: "",
      zipcode: "",
      address: "",
      website: "",
    });
  }, []);
  useEffect(() => {
    let obj = addClientForm.getFieldsValue(true);
    addClientForm.setFieldsValue({
      ...obj,
      state: "",
    });
    if (selectedCountry === 83) {
      getState();
    }
  }, [selectedCountry]);
  return (
    <div style={{ height: "90%", padding: 20 }}>
      {pageLoading && <Loading />}
      {/* submit confirm modal */}
      <Modal
        open={showSubmitConfirm}
        title="Add Client"
        onOk={submitHandler}
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
        Are you sure you want to add this client?
      </Modal>
      {/* reset cofirm modal */}
      <Modal
        open={showResetConfirm}
        title="Reset Info"
        onOk={resetFunction}
        onCancel={() => setShowResetConfirm(false)}
        footer={[
          <Button key="back" onClick={() => setShowResetConfirm(false)}>
            No
          </Button>,
          <Button key="submit" type="primary" onClick={resetFunction}>
            Yes
          </Button>,
        ]}
      >
        Are you sure you want to want to reset the entered Info?
      </Modal>
      <Form
        layout="vertical"
        size="small"
        form={addClientForm}
        onFinish={(values) => setShowSubmitConfirm(values)}
      >
        <Row>
          <Col span={4}>
            <Descriptions size="small" title="Client Information">
              <Descriptions.Item
                contentStyle={{
                  fontSize: window.innerWidth < 1600 && "0.7rem",
                  marginTop: window.innerWidth < 1600 && -15,
                }}
              >
                Please provide client basic info
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={20}>
            <Row gutter={16}>
              {/* Client Name */}
              <Col span={6}>
                <Form.Item
                  name="clientname"
                  label="Client Name"
                  rules={[
                    {
                      required: true,
                      message: "Please Input Client's Name!",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>

              {/* Client sales person */}
              <Col span={6}>
                <Form.Item name="salesperson" label="Sales Person Name">
                  <Input size="default" />
                </Form.Item>
              </Col>

              {/* GST Number */}
              <Col span={6}>
                <Form.Item
                  name="gst"
                  label="GST Number"
                  rules={[
                    {
                      required: true,
                      message: "Please Input the client's GST Number !",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>

              {/* Pan Number */}
              <Col span={6}>
                <Form.Item
                  name="pan"
                  label="PAN Number"
                  rules={[
                    {
                      required: true,
                      message: "Please Input the client's PAN Number!",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              {/* Client email */}
              <Col span={6}>
                <Form.Item name="email" label="Email">
                  <Input size="default" />
                </Form.Item>
              </Col>

              {/* Client number */}
              <Col span={6}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter client's phone number!",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>

              {/* Client mobile */}
              <Col span={6}>
                <Form.Item name="mobile" label="Mobile Number">
                  <Input size="default" />
                </Form.Item>
              </Col>

              {/* Client website */}
              <Col span={6}>
                <Form.Item name="website" label="Website">
                  <Input size="default" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={4}>
            <Descriptions size="small" title="Client Address Information">
              <Descriptions.Item
                contentStyle={{
                  fontSize: window.innerWidth < 1600 && "0.7rem",
                  marginTop: window.innerWidth < 1600 && -15,
                }}
              >
                Please provide client address info
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={20}>
            <Row gutter={16}>
              {/* Client Country */}
              <Col span={6}>
                <Form.Item
                  name="country"
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: "Please select Client's Country!",
                    },
                  ]}
                >
                  <MySelect
                    options={countriesOptions}
                    size="default"
                    onChange={(value) => {
                      setSelectedCountry(value);
                      value === 83 && getState();
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Client State */}
              <Col span={6}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[
                    {
                      required: true,
                      message: "Please select client's state",
                    },
                  ]}
                >
                  {selectedCountry == 83 ? (
                    <MySelect options={stateOptions} size="default" />
                  ) : (
                    <Input size="default" />
                  )}
                </Form.Item>
              </Col>

              {/* Client's city */}
              <Col span={6}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[
                    {
                      required: true,
                      message: "Please enter client's City",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>

              {/* zip code */}
              <Col span={6}>
                <Form.Item
                  name="zipcode"
                  label="ZIP Code"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Clients zip code!",
                    },
                  ]}
                >
                  <Input size="default" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              {/* Client address */}
              <Col span={12}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Client's Address!",
                    },
                  ]}
                >
                  <Input.TextArea rows={4} size="default" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <NavFooter
          submithtmlType="submit"
          submitButton={true}
          nextLabel="Submit"
          formName="add-client"
          resetFunction={setShowResetConfirm}
        />
      </Form>
    </div>
  );
}

export default AddClients;
