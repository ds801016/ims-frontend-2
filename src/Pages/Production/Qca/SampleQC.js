import React, { useEffect, useState } from "react";
import { Button, Input, Row, Space, Modal, Typography } from "antd";
import MyDatePicker from "../../../Components/MyDatePicker";
import MySelect from "../../../Components/MySelect";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import MyDataTable from "../../../Components/MyDataTable";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadCSV } from "../../../Components/exportToCSV";
import { imsAxios } from "../../../axiosInterceptor";

function SampleQC() {
  document.title = "Create Sample QC";
  const [wise, setWise] = useState("datewise");
  const [searchInput, setSearchInput] = useState("");
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [samples, setsSamples] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const wiseOptions = [
    { text: "Date Wise", value: "datewise" },
    { text: "PO Wise", value: "powise" },
    { text: "Vendor Wise", value: "vendorwise" },
    { text: "MIN Wise", value: "minwise" },
    { text: "Part Wise", value: "partwise" },
  ];
  const getVendors = async (search) => {
    setSelectLoading(true);
    const { data } = await imsAxios.post("/backend/vendorList", {
      search: search,
    });
    setSelectLoading(false);
    const arr = data.map((row) => {
      return {
        value: row.id,
        text: row.text,
      };
    });
    setAsyncOptions(arr);
  };
  const getPartOptions = async (search) => {
    setSelectLoading(true);
    const { data } = await imsAxios.post("/backend/getComponentByNameAndNo", {
      search: search,
    });
    setSelectLoading(false);
    const arr = data.map((row) => {
      return {
        value: row.id,
        text: row.text,
      };
    });
    setAsyncOptions(arr);
  };
  const getRows = async () => {
    setSearchLoading(true);
    const { data } = await imsAxios.post("/qc/fetchQCSamples", {
      data: searchInput,
      wise: wise,
    });
    setSearchLoading(false);
    if (data.code == 200) {
      const arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
          sampleQty: 0,
          remark: "",
        };
      });
      setRows(arr);
    } else {
      toast.error(data.message.msg);
      setRows([]);
    }
  };
  const inputHandler = (name, value, id) => {
    let arr = rows;
    arr = arr.map((row) => {
      let obj = row;
      if (row.id == id) {
        obj = {
          ...obj,
          [name]: value,
        };
        return obj;
      } else {
        return row;
      }
    });
    setRows(arr);
  };
  const columns = [
    { headerName: "Serial No.", width: 100, field: "index" },
    { headerName: "MIN Date", width: 150, field: "date" },
    { headerName: "PO TXN", width: 120, field: "pono" },
    { headerName: "MIN TXN", width: 150, field: "min_txn" },
    { headerName: "MIN Doc No.", width: 150, field: "invoice" },
    { headerName: "Vendor", field: "vendorcode" },
    { headerName: "Vendor Name", width: 180, field: "vendorname" },
    { headerName: "Part", width: 100, field: "part" },
    { headerName: "Component", width: 180, field: "component" },
    { headerName: "MIN Qty", width: 100, field: "inQty" },
    { headerName: "UOM", width: 100, field: "unit" },
    {
      headerName: "Sample Qty",
      field: "sampleQty",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          value={row.sampleQty}
          onChange={(e) => inputHandler("sampleQty", e.target.value, row.id)}
        />
      ),
    },
    {
      headerName: "Remark",
      field: "remark",
      width: 180,
      renderCell: ({ row }) => (
        <Input
          value={row.remark}
          placeholder="Enter Remarks..."
          onChange={(e) => inputHandler("remark", e.target.value, row.id)}
        />
      ),
    },
  ];
  const confirmColumns = [
    { headerName: "Part Code", flex: 1, field: "part" },
    { headerName: "Component", width: 350, field: "component" },
    { headerName: "Sample Qty", flex: 1, field: "sampleQty" },
    { headerName: "Remarks", width: 300, field: "remark" },
  ];
  const openConfirmModal = () => {
    let arr = rows.filter((row) => row.sampleQty != "" && row.sampleQty != 0);
    if (arr.length == 0) {
      return toast.error("No Samples to preview");
    }
    setsSamples(arr);
    setShowConfirmModal(true);
  };
  const submitHandler = async () => {
    const finalObj = {
      remark: samples.map((sample) => sample.remark),
      authKey: samples.map((sample) => sample.authKey),
      min_txn: samples.map((sample) => sample.min_txn),
      vendor: samples.map((sample) => sample.vendorcode),
      min_dt: samples.map((sample) => sample.date),
      component: samples.map((sample) => sample.componentKey),
      samQty: samples.map((sample) => sample.sampleQty),
    };
    setSubmitLoading(true);
    const { data } = await imsAxios.post("/qc/addSampling_stage1", finalObj);
    setSubmitLoading(false);
    if (data.code == 200) {
      toast.success(data.message);
      setShowConfirmModal(false);
      setsSamples([]);
    } else {
      toast.error(data.message.msg);
    }
  };
  const resetFun = () => {
    let arr = rows;
    arr = arr.map((row) => {
      return {
        ...row,
        sampleQty: 0,
        remark: "",
      };
    });
    setRows(arr);
  };
  useEffect(() => {
    setSearchInput("");
  }, [wise]);

  const { Paragraph, Text } = Typography;

  return (
    <>
      <Modal
        title={`Confirm Samples : ${samples.length} Item${
          samples.length == 1 ? "" : "s"
        }`}
        width={1000}
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onOk={submitHandler}
        confirmLoading={submitLoading}
        extra
      >
        <div
          className="remove-table-footer"
          style={{ height: "50vh", overflow: "auto" }}
        >
          <MyDataTable columns={confirmColumns} data={samples} />
          {/* <Row>
            <Col span={3}>Part Code</Col>
            <Col span={7} style={{ marginRight: 15 }}>
              Component
            </Col>
            <Col span={3}>Sample QTY</Col>
            <Col span={7}>Remark</Col> */}
          {/* </Row>
          <Divider />
          {samples.map((sample) => (
            <Row>
              <Col span={3}>{sample?.part}</Col>
              <Col style={{ marginRight: 15 }} span={7}>
                <Paragraph ellipsis={{ rows: 1, tooltip: true }}>
                  {sample?.component}
                </Paragraph>
              </Col>
              <Col span={3}>{sample?.sampleQty}</Col>
              <Col span={7}>
                <Text ellipsis={{ rows: 1, tooltip: true }}>
                  {sample?.remark}
                </Text>
              </Col>
            </Row>
          ))} */}
        </div>
      </Modal>
      <Row
        justify="space-between"
        style={{ padding: "0px 10px", paddingBottom: 5 }}
      >
        <div>
          <Space>
            <div style={{ width: 200 }}>
              <MySelect
                size={"default"}
                options={wiseOptions}
                defaultValue={wiseOptions.filter((o) => o.value === wise)[0]}
                onChange={setWise}
                value={wise}
              />
            </div>
            <div style={{ width: 300 }}>
              {wise === "datewise" ? (
                <MyDatePicker
                  size="default"
                  setDateRange={setSearchInput}
                  dateRange={setSearchInput}
                  value={setSearchInput}
                />
              ) : wise === "powise" ? (
                <Input
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Enter Po Number"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              ) : wise === "vendorwise" ? (
                <div>
                  <MyAsyncSelect
                    size="default"
                    selectLoading={selectLoading}
                    onBlur={() => setAsyncOptions([])}
                    value={searchInput}
                    onChange={(value) => setSearchInput(value)}
                    loadOptions={getVendors}
                    optionsState={asyncOptions}
                    placeholder="Select Vendor..."
                  />
                </div>
              ) : wise === "minwise" ? (
                <div>
                  <Input
                    value={searchInput}
                    placeholder="Enter MIN Number"
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              ) : (
                wise == "partwise" && (
                  <div>
                    <MyAsyncSelect
                      size="default"
                      selectLoading={selectLoading}
                      onBlur={() => setAsyncOptions([])}
                      value={searchInput}
                      onChange={(value) => setSearchInput(value)}
                      loadOptions={getPartOptions}
                      optionsState={asyncOptions}
                      placeholder="Select Vendor..."
                    />
                  </div>
                )
              )}{" "}
            </div>
            <Button
              disabled={!searchInput ? true : false}
              type="primary"
              loading={searchLoading}
              onClick={getRows}
              id="submit"
              // className="primary-button search-wise-btn"
            >
              Search
            </Button>
          </Space>
        </div>
        <Space>
          <Button
            type="primary"
            onClick={() => downloadCSV(rows, columns, "Stage 1 QC Report")}
            shape="circle"
            icon={<DownloadOutlined />}
            disabled={rows.length == 0}
          />
          <Button onClick={resetFun}>Reset</Button>
          <Button onClick={openConfirmModal} type="primary">
            Save Samples
          </Button>
        </Space>
      </Row>
      <div style={{ height: "85%", padding: "0px 10px" }}>
        <MyDataTable loading={searchLoading} columns={columns} data={rows} />
      </div>
    </>
  );
}

export default SampleQC;
