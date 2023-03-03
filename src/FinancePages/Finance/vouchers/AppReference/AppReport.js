import React, { useState, useEffect } from "react";
import { Button, Col, message, Divider, Popconfirm, Row } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import MyDataTable from "../../../../Components/MyDataTable";
import { PlusOutlined } from "@ant-design/icons";
import { v4 } from "uuid";
import { imsAxios } from "../../../../axiosInterceptor";
import MyAsyncSelect from "../../../../Components/MyAsyncSelect";
import { DeleteTwoTone } from "@ant-design/icons";

function AppReport() {
  // const description = "Anuj";
  const [allReportData, setAllReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectLoading, setSelectLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [allRefData, setAllRefData] = useState({
    vendorName: "",
  });

  const getInfo = async (search) => {
    allRefData.vendorName = "";
    allRefData.vendorID = "";
    setSelectLoading(true);
    const { data } = await imsAxios.post("/tally/ap/fetchVendorLedger", {
      search: search,
    });
    setSelectLoading(false);
    const arr = data.map((row) => {
      return { value: row.id, text: row.text };
    });
    setAsyncOptions(arr);
  };

  const fetchReport = async () => {
    setLoading(true);
    setAllReportData([]);
    const { data } = await imsAxios.post("/tally/ap/fetchApReport", {
      vendor: allRefData?.vendorName,
    });
    if (data.code == 200) {
      const arr = data?.data?.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setAllReportData(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  const deleteFun = async (a) => {
    const { data } = await imsAxios.post("/tally/ap/openAp", {
      ap_code: a?.ap_code,
      vbt_code: a?.ref_no,
      bank_code: a?.so_ref_no,
    });

    if (data.code == 200) {
      fetchReport();
      toast.success(data.message);
    } else if (data.cade == 500) {
      toast.error(data.message.msg);
    }
  };

  const cancel = () => {
    message.success("Data Not Delete");
  };

  const columns = [
    {
      headerName: "Action",
      width: 100,
      renderCell: ({ row }) => (
        <Popconfirm
          placement="right"
          title="Are you sure to delete this entry?"
          description="Are you sure to delete this task?"
          onConfirm={() => deleteFun(row)}
          okButtonProps={{
            loading: deleteLoading,
          }}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <DeleteTwoTone style={{ cursor: "pointer" }} />
        </Popconfirm>
      ),
    },
    // { field: "vendor", headerName: "VENDOR", width: 120 },
    { field: "invoice_number", headerName: "INVOICE NO", width: 200 },
    { field: "ref_no", headerName: "REFERENCE NO", width: 250 },
    // { field: "ap_code", headerName: "APP REFERENCE", width: 200 },
    { field: "bill_amm", headerName: "BILL AMOUNT", width: 200 },
    { field: "os_ammount", headerName: "SETTLE AMOUNT", width: 200 },
    // { field: "so_amm", headerName: "SO AMOUNT", width: 130 },
    { field: "so_ref_no", headerName: "SO REFERENCE NO", width: 300 },
    { field: "bank", headerName: "PARTICULARS", width: 300 },
    {
      field: "status",
      headerName: "STATUS",
      width: 150,
      renderCell: ({ row }) => (
        <div
          style={{
            fontWeight: "bolder",
            color: row?.status == "CLOSED" ? "green" : "red",
          }}
        >
          {row?.status == "CLOSED" ? "CLOSED" : "OPEN"}
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: "90%" }}>
      <Row gutter={10} style={{ margin: "5px" }}>
        <Col span={6}>
          <MyAsyncSelect
            size="default"
            sectLoading={selectLoading}
            optionsState={asyncOptions}
            onBlur={() => setAsyncOptions([])}
            loadOptions={getInfo}
            value={allRefData?.vendorName}
            placeholder="Vendor name"
            onChange={(e) =>
              setAllRefData((allRefData) => {
                return { ...allRefData, vendorName: e };
              })
            }
          />
        </Col>
        <Col span={2}>
          <Button loading={loading} type="primary" onClick={fetchReport}>
            Search
          </Button>
        </Col>
        {/* <Col span={4} offset={18} style={{ border: "1px solid red" }}></Col> */}
        {/* <Divider /> */}
      </Row>

      <div style={{ height: "79vh", margin: "10px" }}>
        <MyDataTable loading={loading} data={allReportData} columns={columns} />
      </div>
    </div>
  );
}

export default AppReport;
