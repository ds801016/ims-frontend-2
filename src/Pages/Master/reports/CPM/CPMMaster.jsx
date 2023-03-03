import { useState } from "react";
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Typography,
} from "antd";
import MyAsyncSelect from "../../../../Components/MyAsyncSelect";
import NavFooter from "../../../../Components/NavFooter";
import validateResponse from "../../../../Components/validateResponse";
import Loading from "../../../../Components/Loading";
import { imsAxios } from "../../../../axiosInterceptor";

function CPMMaster() {
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [projectExistingDetail, setProjectExistingDetail] = useState({
    detail: "--",
  });

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [form] = Form.useForm();
  const getProject = async (searchTerm) => {
    setSelectLoading(true);
    const { data } = await imsAxios.post("/backend/poProjectName", {
      search: searchTerm,
    });
    setSelectLoading(false);
    let arr = data.map((row) => ({
      text: row.text,
      value: row.id,
    }));
    setAsyncOptions(arr);
  };
  const getProjectDetails = async (projectId) => {
    if (projectId) {
      setPageLoading(true);
      const { data } = await imsAxios.post("/ppr/fetchProjectInfo", {
        project: projectId,
      });
      setPageLoading(false);
      validateResponse(data);
      setProjectExistingDetail((existing) => ({
        ...existing,
        detail: data.detail,
      }));
    }
  };
  const updateProject = async () => {
    if (showSubmitConfirm) {
      setSubmitLoading(true);
      const { data } = await imsAxios.post("/ppr/updatePPRDetail", {
        project: showSubmitConfirm.projectId,
        detail: showSubmitConfirm.updatedName,
      });
      setSubmitLoading(false);
      validateResponse(data, true);
      setShowSubmitConfirm(false);
      if (data.code == 200) {
        resetFunction();
      }
    }
  };
  const validateData = async (values) => {
    setShowSubmitConfirm(values);
  };
  const resetFunction = async () => {
    form.resetFields();
    setProjectExistingDetail((existing) => ({
      ...existing,
      detail: "--",
    }));
  };
  return (
    <div style={{ height: "90%", padding: 30 }}>
      <Modal
        title="Confirm Update Project!"
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
            onClick={updateProject}
          >
            Yes
          </Button>,
        ]}
      >
        <p>
          Are you sure you want update project {form.getFieldValue()?.projectId}
          ?
        </p>
      </Modal>
      {pageLoading && <Loading />}
      <Form
        name="edit-project"
        layout="vertical"
        form={form}
        onFinish={validateData}
        onFieldsChange={(value, allFields) => {
          if (value.length == 1) {
            const name = value[0].name[0];
            if (name == "projectId") {
              getProjectDetails(value[0].value);
            }
            // selectInputHandler(value[0].name[0], value[0].value);
          }
        }}
      >
        <Row>
          <Col span={4}>
            <Descriptions size="small" title="CPM ID">
              <Descriptions.Item
                contentStyle={{
                  fontSize: window.innerWidth < 1600 && "0.7rem",
                }}
              >
                Provide CPM Project ID
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={20}>
            <Row gutter={16}>
              {/* CPM ID */}
              <Col span={6}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please select a Project!",
                    },
                  ]}
                  label="Project Id"
                  name="projectId"
                >
                  <MyAsyncSelect
                    selectLoading={selectLoading}
                    onBlur={() => setAsyncOptions([])}
                    loadOptions={getProject}
                    optionsState={asyncOptions}
                    size="default"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={4}>
            <Descriptions size="small" title="CPM Details">
              <Descriptions.Item
                contentStyle={{
                  fontSize: window.innerWidth < 1600 && "0.7rem",
                }}
              >
                Project information and update detail
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={20}>
            <Row gutter={16}>
              {/* CPM ID */}
              <Col span={6}>
                <Form.Item name="existingName" label="Existing Name">
                  <Typography.Text>
                    {projectExistingDetail.detail}
                  </Typography.Text>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please Enter a new Project Name!",
                    },
                  ]}
                  name="updatedName"
                  label="New Name"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider />
        <NavFooter
          submithtmlType="submit"
          submitButton={true}
          formName="edit-project"
          nextLabel="Submit"
          resetFunction={resetFunction}
        />
      </Form>
    </div>
  );
}

export default CPMMaster;
