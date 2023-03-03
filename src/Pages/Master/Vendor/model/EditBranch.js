import React, { useEffect, useState } from "react";
import MySelect from "../../../../Components/MySelect";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  Row,
  Col,
  Input,
  Form,
  Skeleton,
  Switch,
  Space,
} from "antd";
import { imsAxios } from "../../../../axiosInterceptor";

const EditBranch = ({ fetchVendor, setEditVendor, editVendor }) => {
  const [allDetails, setallDetails] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(false);
  const [vendorStatus, setVendorStatus] = useState();
  const [statusLoading, setStatusLoading] = useState(false);
  const [allArray, setAllArray] = useState([]);
  const [allVendorLocationOptions, setAllVendorLocationOptions] = useState([]);

  const inputHandler = (name, value) => {
    setallDetails((details) => {
      return {
        ...details,
        [name]: value,
      };
    });
  };

  const getVendorAllInfo = async () => {
    setSkeletonLoading(true);
    const { data: tdsData } = await imsAxios.get("/vendor/getAllTds");
    const { data: vendorData } = await imsAxios.post("/vendor/getVendor", {
      vendor_id: editVendor?.vendor_code,
    });
    setSkeletonLoading(false);
    let arr = tdsData?.data.map((row) => {
      return { text: row.tds_name, value: row.tds_key };
    });

    let obj = {
      ...vendorData?.data[0],
      vendor_tds: vendorData?.data[0]?.vendor_tds
        ? vendorData?.data[0]?.vendor_tds?.map((row) => {
            return {
              label: arr.filter((r) => row == r.value)[0]?.text,
              value: row,
            };
          })
        : [],
      vendor_loc: vendorData.data[0].vendor_loc,
    };
    let tdsArr = [];

    if (vendorData?.data[0].vendor_tds) {
      vendorData?.data[0].vendor_tds?.map(
        (row) => (tdsArr = arr.filter((r) => r.value != row))
      );
    } else {
      tdsArr = arr;
    }
    setallDetails(obj);
    setVendorStatus(obj.vendor_status);
    setAllArray(tdsArr);
  };
  // console.log(allDetails);
  const EditVendor = async () => {
    if (!allDetails?.vendor_name) {
      return toast.error("Please enter Vendor Name");
    }
    setSubmitLoading(true);
    console.log(allDetails);
    const { data } = await imsAxios.post("/vendor/updateVendor", {
      vendorcode: editVendor?.vendor_code,
      vendorname: allDetails?.vendor_name,
      panno: allDetails?.vendor_pan,
      cinno: allDetails?.vendor_cin,
      tally_tds: allDetails.vendor_tds,
      vendor_loc: allDetails.vendor_loc,
    });
    setSubmitLoading(false);
    if (data.code == 200) {
      toast.success(data.message);
      fetchVendor();
      setEditVendor(null);
    } else {
      toast.error(data.message.msg);
    }
  };
  const changeStatus = async (value) => {
    setStatusLoading(true);
    const { data } = await imsAxios.post("/vendor/updateVendorStatus", {
      status: value ? "B" : "A",
      vendor_code: editVendor?.vendor_code,
    });
    setStatusLoading(false);
    if (data.code == 200) {
      toast.success(data.message);
      if (value) {
        setVendorStatus("B");
      } else {
        setVendorStatus("A");
      }
    }
  };
  const getAllVendorLocationOptions = async () => {
    const { data } = await imsAxios.get("/vendor/getAllLocation");
    if (data.code === 200) {
      let arr = data.data.map((row) => ({
        text: row.loc_name,
        value: row.location_key,
      }));
      setAllVendorLocationOptions(arr);
    } else {
      toast.error(data.message.msg);
      setAllVendorLocationOptions([]);
    }
  };
  // useEffect(() => {
  //   if (editVendor) {
  //     name();
  //   }
  //   getAccount();
  // }, [editVendor]);

  useEffect(() => {
    if (editVendor) {
      getVendorAllInfo();
      getAllVendorLocationOptions();
    }
  }, [editVendor]);
  console.log(allVendorLocationOptions);
  console.log(allDetails);
  return (
    <form>
      <Modal
        title={`Update Vendor: ${editVendor?.vendor_code}`}
        open={editVendor}
        width={600}
        onCancel={() => setEditVendor(false)}
        footer={[
          <Row style={{ width: "100%" }} align="middle" justify="space-between">
            <Col>
              <Form style={{ padding: 0, margin: 0 }}>
                <Form.Item label="Blocked" style={{ padding: 0, margin: 0 }}>
                  <Switch
                    loading={statusLoading}
                    checked={vendorStatus == "B"}
                    defaultChecked
                    onChange={changeStatus}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col>
              <Space>
                <Button key="back" onClick={() => setEditVendor(false)}>
                  Back
                </Button>

                <Button
                  key="submit"
                  type="primary"
                  loading={submitLoading}
                  onClick={EditVendor}
                >
                  Submit
                </Button>
              </Space>
            </Col>
          </Row>,
        ]}
      >
        {<Skeleton active loading={skeletonLoading} />}
        {<Skeleton active loading={skeletonLoading} />}
        {!skeletonLoading && (
          <Form layout="vertical" size="small">
            <Row>
              {/* <Space> */}
              <Col span={24}>
                <Form.Item label="Vendor Name">
                  <Input
                    size="default "
                    // placeholder="Vendor Name"
                    className="form-control"
                    value={allDetails?.vendor_name}
                    onChange={(e) =>
                      inputHandler("vendor_name", e.target.value)
                    }
                    // prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item label="Pan Number">
                      <Input
                        size="default "
                        // placeholder="Pan no..."
                        onChange={(e) =>
                          inputHandler("vendor_pan", e.target.value)
                        }
                        value={allDetails?.vendor_pan}
                        // prefix={<UserOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="CIN Number">
                      <Input
                        size="default "
                        value={allDetails?.vendor_cin}
                        // placeholder="CIN no..."
                        onChange={(e) =>
                          inputHandler("vendor_cin", e.target.value)
                        }
                        // prefix={<UserOutlined />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Col span={24}>
                  <Form.Item label="Vendor TDS">
                    <MySelect
                      size="default"
                      mode="multiple"
                      value={allDetails.vendor_tds}
                      onChange={(value) => inputHandler("vendor_tds", value)}
                      options={allArray ? allArray : ""}
                    />
                  </Form.Item>
                </Col>
              </Col>
              <Col span={24}>
                <Form.Item label="Vendor Locations">
                  <MySelect
                    size="default"
                    mode="multiple"
                    value={allDetails.vendor_loc}
                    onChange={(value) => inputHandler("vendor_loc", value)}
                    options={allVendorLocationOptions}
                  />
                </Form.Item>
              </Col>
              {/* </Space> */}
            </Row>
          </Form>
        )}
      </Modal>
    </form>
  );
};

export default EditBranch;
