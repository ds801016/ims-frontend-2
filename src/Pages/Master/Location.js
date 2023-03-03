import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Select, Tree } from "antd";
import MySelect from "../../Components/MySelect";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import Loading from "../../Components/Loading";
import { imsAxios } from "../../axiosInterceptor";

function Location() {
  document.title = "Locations";
  const [treeData, setTreeData] = useState([]);
  const [treeLoading, setTreeLoading] = useState([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [addLocationForm] = Form.useForm();

  const LocationTypeOptions = [
    { text: "Storage", value: "1" },
    { text: "Non-Storage", value: "2" },
  ];
  const jobworkLocationOptions = [
    { text: "Yes", value: "Y" },
    { text: "No", value: "N" },
  ];
  const getDataTree = async () => {
    setTreeLoading(true);
    const { data } = await imsAxios.post("/location/fetchLocationTree");
    setTreeLoading(false);
    flatArray(data.data);
    setTreeData(data.data);
  };
  // for the tree
  const flatArray = (array) => {
    let arr = [];
    array?.map((row) => {
      if (row.nodes || row.children) {
        // delete row.nodes;]
        row.children = row.children;
        row.title = row.name;
        row.key = v4();
        arr = [...arr, { ...row }];
        flatArray(row.children);
      } else {
        row.title = row.name;
        row.key = v4();
        arr = [...arr, { ...row }];
      }
    });
    setTreeData(arr);
  };

  const getParentLocationOptions = async (search) => {
    setSelectLoading(true);
    const { data } = await imsAxios.post("/location/fetchLocation", {
      searchTerm: search,
    });
    setSelectLoading(false);
    if (data[0]) {
      let arr = data.map((row) => ({
        value: row.id,
        text: row.text,
      }));
      setAsyncOptions(arr);
    } else {
      setAsyncOptions([]);
    }
  };

  const submitHandler = async (values) => {
    let obj = {
      location_name: values?.locationName,
      location_under: values?.locationUnder,
      location_type: values?.locationType,
      location_address: values?.address,
      mapping_user: values?.username,
      vendor_loc: values?.jobworkLocation,
    };
    setSubmitLoading(true);
    const { data } = await imsAxios.post("/location/insertLocation", obj);
    setSubmitLoading(false);
    if (data.code === 200) {
      toast.success(data.message);
      getDataTree();
    } else {
      toast.error(data.message.msg);
    }
  };

  useEffect(() => {
    addLocationForm.setFieldsValue({
      locationName: "",
      locationUnder: "",
      locationType: "1",
      username: "",
      jobworkLocation: "N",
      address: "",
    });
    getDataTree();
  }, []);
  return (
    <div style={{ height: "90%", overflow: "auto" }}>
      <Row gutter={10} style={{ margin: "10px", height: "80%" }}>
        <Col span={8}>
          <Card size="small" title="Add Location">
            <Form
              onFinish={submitHandler}
              form={addLocationForm}
              layout="vertical"
              size="small"
            >
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="locationName"
                    label="Location Name"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter a location Name",
                      },
                    ]}
                  >
                    <Input size="default" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Row gutter={4}>
                    <Col span={12}>
                      <Form.Item
                        name="locationUnder"
                        label="Parent Location"
                        rules={[
                          {
                            required: true,
                            message: "Please Select a Parent Location",
                          },
                        ]}
                      >
                        <MyAsyncSelect
                          loadOptions={getParentLocationOptions}
                          onBlur={() => setAsyncOptions([])}
                          optionsState={asyncOptions}
                          selectLoading={selectLoading}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="locationType"
                        label="Location Type"
                        rules={[
                          {
                            required: true,
                            message: "Please Select a Location Type",
                          },
                        ]}
                      >
                        <MySelect options={LocationTypeOptions} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row gutter={4}>
                    <Col span={12}>
                      <Form.Item name="username" label="User Name">
                        <Input size="default" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="jobworkLocation"
                        label="Job Work Location?"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please Select if this is a Jobwork Location",
                          },
                        ]}
                      >
                        <MySelect options={jobworkLocationOptions} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Form.Item name="address" label="Address">
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Row gutter={10} justify="end">
                    <Col>
                      <Form.Item>
                        <Button htmlType="button" size="default">
                          Reset
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item>
                        <Button
                          loading={submitLoading}
                          htmlType="submit"
                          size="default"
                          type="primary"
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col span={16} style={{ height: "90%" }}>
          <Card title="Locations" size="small">
            {treeLoading && <Loading />}
            <Tree showLine={true} height={500} treeData={treeData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Location;
