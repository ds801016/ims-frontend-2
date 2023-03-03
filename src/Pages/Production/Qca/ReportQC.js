import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Row, Space, Tooltip, Popover } from "antd";
import MySelect from "../../../Components/MySelect";
import MyDatePicker from "../../../Components/MyDatePicker";
import MyDataTable from "../../../Components/MyDataTable";
import { v4 } from "uuid";
import { downloadCSV } from "../../../Components/exportToCSV";
import { DownloadOutlined, MessageOutlined } from "@ant-design/icons";
import { imsAxios } from "../../../axiosInterceptor";

function ReportQC() {
  document.title = "QC Report";
  const [searchStatus, setSearchStatus] = useState("A");
  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const statusOptions = [
    { text: "Pass", value: "A" },
    { text: "Fail", value: "R" },
  ];
  const getRows = async () => {
    setRows([]);
    setSearchLoading(true);
    const { data } = await imsAxios.post("/qc/final_qc_report", {
      data: searchInput,
      type: searchStatus,
    });
    setSearchLoading(false);
    if (data.code == 200) {
      const arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setRows(arr);
    } else {
      toast.error(data.message.msg);
      setRows([]);
    }
  };

  const content1 = (row) => (
    // <div>
    <span
      style={{ fontWeight: "bold", fontSize: "14px" }}
      dangerouslySetInnerHTML={{ __html: row }}
    />
    // </div>
  );

  const columns = [
    {
      headerName: "#",
      width: 50,
      field: "index",
    },
    {
      headerName: "Comment",
      width: 80,
      field: "comment",
      renderCell: ({ row }) => (
        <>
          <Popover content={content1(row.comment)}>
            {/* <span>{row.index}</span> */}
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                width: "50%",
              }}
            >
              <MessageOutlined />
            </span>
          </Popover>
        </>
      ),
    },
    {
      headerName: "Status",
      flex: 1,
      field: "status",
      renderCell: ({ row }) => (
        <span
          style={{
            color: row.status?.toLowerCase() == "pass" ? "green" : "brown",
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      headerName: "Sample No.",
      flex: 1,
      field: "smp_txn",
      renderCell: ({ row }) => (
        <span
          style={{
            color: row.status?.toLowerCase() == "pass" ? "green" : "brown",
          }}
        >
          {row.smp_txn}
        </span>
      ),
    },
    { headerName: "MIN No.", width: 150, field: "min_txn" },
    { headerName: "MIN Date", width: 150, field: "min_dt" },
    {
      headerName: "Component",
      width: 180,
      field: "component",
      renderCell: ({ row }) => (
        <Tooltip title={row.component}>{row.component}</Tooltip>
      ),
    },
    { headerName: "Part", flex: 1, field: "part" },
    {
      headerName: "Vendor Name",
      width: 180,
      field: "vname",
      renderCell: ({ row }) => <Tooltip title={row.vname}>{row.vname}</Tooltip>,
    },
    { headerName: "In Qty", flex: 1, field: "min_qty" },
    { headerName: "Sample Qty", flex: 1, field: "smp_qty" },
    { headerName: "UOM", flex: 1, field: "uom" },
    { headerName: "Approval Date", width: 150, field: "apv_dt" },
  ];
  return (
    <>
      <Row
        justify="space-between"
        style={{ padding: "0px 10px", paddingBottom: 5 }}
      >
        <div>
          <Space>
            <div style={{ width: 200 }}>
              <MySelect
                size={"default"}
                options={statusOptions}
                defaultValue={
                  statusOptions.filter((o) => o.value === searchStatus)[0]
                }
                onChange={setSearchStatus}
                value={searchStatus}
              />
            </div>
            <div style={{ width: 300 }}>
              <MyDatePicker
                size="default"
                setDateRange={setSearchInput}
                dateRange={setSearchInput}
                value={setSearchInput}
              />
            </div>
            <Button
              disabled={!searchInput ? true : false}
              type="primary"
              loading={searchLoading}
              onClick={getRows}
              id="submit"
            >
              Search
            </Button>
          </Space>
        </div>
        <Space>
          <Button
            type="primary"
            onClick={() => downloadCSV(rows, columns, "Final QC Report")}
            shape="circle"
            icon={<DownloadOutlined />}
            disabled={rows.length == 0}
          />
        </Space>
      </Row>
      <div style={{ height: "85%", padding: "0px 10px" }}>
        <MyDataTable columns={columns} data={rows} loading={searchLoading} />
      </div>
    </>
  );
}

export default ReportQC;
