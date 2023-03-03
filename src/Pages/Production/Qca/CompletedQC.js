import React, { useEffect, useState } from "react";
import { Button, Input, Popconfirm, Row, Space, Popover } from "antd";
import { toast } from "react-toastify";
import MySelect from "../../../Components/MySelect";
import MyDatePicker from "../../../Components/MyDatePicker";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { v4 } from "uuid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  CheckSquareFilled,
  CloseSquareFilled,
  MessageOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import MyDataTable from "../../../Components/MyDataTable";
import { downloadCSV } from "../../../Components/exportToCSV";
import { imsAxios } from "../../../axiosInterceptor";

function CompletedQC() {
  document.title = "Completed Sample QC";
  const [wise, setWise] = useState("datewise");
  const [searchInput, setSearchInput] = useState("");
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const wiseOptions = [
    { text: "Pending Sample Date Wise", value: "datewise" },
    { text: "Vendor", value: "vendorwise" },
    { text: "Part", value: "partwise" },
  ];

  const getPartOptions = async (search) => {
    setSelectLoading(false);
    const { data } = await imsAxios.post("/backend/getComponentByNameAndNo", {
      search: search,
    });
    setSelectLoading(true);
    const arr = data.map((row) => {
      return {
        text: row.text,
        value: row.id,
      };
    });
    setAsyncOptions(arr);
  };

  const getVendors = async (search) => {
    setSelectLoading(true);
    const { data } = await imsAxios.post("/backend/vendorList", {
      search: search,
    });
    setSelectLoading(false);
    const arr = data.map((row) => {
      return {
        text: row.text,
        value: row.id,
      };
    });
    setAsyncOptions(arr);
  };

  const getRows = async () => {
    setSearchLoading(true);
    setTableLoading(true);

    const { data } = await imsAxios.post("/qc/qcApproval", {
      data: searchInput,
      wise: wise,
    });
    setTableLoading(false);
    setSearchLoading(false);

    if (data.code == 200) {
      const arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
          remark: "",
          finalStatus: "",
        };
      });
      setRows(arr);
    } else {
      toast.error(data.message.msg);
      setRows([]);
    }
  };

  const submitSample = async (row) => {
    const { data } = await imsAxios.post("/qc/updateSampling_stage3", {
      component: row.componentKey,
      sample_txn: row.sample_txn,
      min_txn: row.min_txn,
      authKey: row.authkey,
      status: "A",
      remark: row.remark,
    });
    if (data.code == 200) {
      toast.success(data.message);
      getRows();
    } else {
      toast.error(data.message.msg);
    }
  };

  const rejectSample = async (row) => {
    const { data } = await imsAxios.post("/qc/updateSampling_stage3", {
      component: row.componentKey,
      sample_txn: row.sample_txn,
      min_txn: row.min_txn,
      authKey: row.authkey,
      status: "R",
      remark: row.remark,
    });
    if (data.code == 200) {
      toast.success(data.message);
      getRows();
    } else {
      toast.error(data.message.msg);
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
    { headerName: "Serial No.", width: 100, field: "index" },
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
      width: 80,
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
      width: 120,
      field: "sample_txn",
      renderCell: ({ row }) => (
        <span
          style={{
            color: row.status?.toLowerCase() == "pass" ? "green" : "brown",
          }}
        >
          {row.sample_txn}
        </span>
      ),
    },
    { headerName: "Sample Date", width: 150, field: "sample_qc_date" },
    { headerName: "MIN No.", field: "min_txn", width: 150 },
    { headerName: "MIN Date", field: "min_txn_dt", width: 180 },
    { headerName: "Component", field: "component", width: 250 },
    { headerName: "Part", width: 100, field: "part" },
    { headerName: "In Qty", width: 100, field: "inQty" },
    { headerName: "Sample Qty", width: 100, field: "samQty" },
    { headerName: "UOM.", width: 100, field: "unit" },

    {
      headerName: "Remarks",
      field: "remark",
      width: 200,
      renderCell: ({ row }) => (
        <Input
          value={row.remark}
          onChange={(e) => inputHandler("remark", e.target.value, row.id)}
        />
      ),
    },
    {
      headerName: "Actions",
      field: "actions",
      type: "actions",
      // width: 100,
      getActions: ({ row }) => [
        <Popconfirm
          title={`Are you sure to pass Sample ${row.sample_txn}?`}
          onConfirm={() => submitSample(row)}
          onCancel={() => {
            setShowConfirmModal(null);
          }}
          okText="Yes"
          cancelText="No"
        >
          <GridActionsCellItem
            icon={<CheckSquareFilled className="view-icon table" />}
            // onClick={() => setMaterialInward(row.po_transaction)}
          />
        </Popconfirm>,
        <Popconfirm
          title={`Are you sure to reject Sample ${row.sample_txn}?`}
          onConfirm={() => rejectSample(row)}
          onCancel={() => {
            setShowConfirmModal(null);
          }}
          okText="Yes"
          cancelText="No"
        >
          <GridActionsCellItem
            icon={<CloseSquareFilled className="view-icon table" />}
          />
        </Popconfirm>,
      ],
    },
  ];

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
  useEffect(() => {
    setSearchInput("");
  }, [wise]);

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
                size="default"
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
              ) : wise === "partwise" ? (
                <MyAsyncSelect
                  size="default"
                  selectLoading={selectLoading}
                  onBlur={() => setAsyncOptions([])}
                  value={searchInput}
                  onChange={(value) => setSearchInput(value)}
                  loadOptions={getPartOptions}
                  optionsState={asyncOptions}
                  placeholder="Select Part..."
                />
              ) : (
                wise === "vendorwise" && (
                  <div>
                    <MyAsyncSelect
                      size="default"
                      onBlur={() => setAsyncOptions([])}
                      selectLoading={selectLoading}
                      value={searchInput}
                      onChange={(value) => setSearchInput(value)}
                      loadOptions={getVendors}
                      optionsState={asyncOptions}
                      placeholder="Select Vendor..."
                    />
                  </div>
                )
              )}
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
            onClick={() => downloadCSV(rows, columns, "Stage 3 QC Report")}
            shape="circle"
            icon={<DownloadOutlined />}
            disabled={rows.length == 0}
          />
        </Space>
      </Row>
      <div style={{ height: "85%", padding: "0px 10px" }}>
        <MyDataTable columns={columns} data={rows} loading={tableLoading} />
      </div>
    </>
  );
}

export default CompletedQC;
