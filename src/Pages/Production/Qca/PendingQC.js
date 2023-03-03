import React, { useEffect, useState } from "react";
import { Button, Input, Popconfirm, Row, Space } from "antd";
import { toast } from "react-toastify";
import MySelect from "../../../Components/MySelect";
import MyDatePicker from "../../../Components/MyDatePicker";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { v4 } from "uuid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  CheckSquareFilled,
  CloseSquareFilled,
  DownloadOutlined,
} from "@ant-design/icons";
import MyDataTable from "../../../Components/MyDataTable";
import { downloadCSV } from "../../../Components/exportToCSV";
import { imsAxios } from "../../../axiosInterceptor";

function PendingQC() {
  document.title = "Pending Sample QC";
  const [wise, setWise] = useState("datewise");
  const [searchInput, setSearchInput] = useState("");
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const wiseOptions = [
    { text: "Sample Date Wise", value: "datewise" },
    { text: "Vendor Wise", value: "vendorwise" },
    { text: "Part Wise", value: "partwise" },
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

    const { data } = await imsAxios.post("/qc/pendingSample", {
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
          status: "",
        };
      });
      setRows(arr);
    } else if (data.code == 500) {
      toast.error(data.message.data);
      setRows([]);
    }
  };
  const submitSample = async (row) => {
    setRows([]);
    const { data } = await imsAxios.post("/qc/updateSampling_stage2", {
      component: row.componentKey,
      sample_txn: row.transaction,
      min_txn: row.qc_transaction,
      authKey: row.authkey,
      status: "P",
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
    const { data } = await imsAxios.post("/qc/updateSampling_stage2", {
      component: row.componentKey,
      sample_txn: row.transaction,
      min_txn: row.qc_transaction,
      authKey: row.authkey,
      status: "F",
      remark: row.remark,
    });
    if (data.code == 200) {
      toast.success(data.message);
      getRows();
    } else {
      toast.error(data.message.msg);
    }
  };
  const columns = [
    { headerName: "Serial No.", width: 100, field: "index" },
    { headerName: "Sample No.", flex: 1, field: "transaction" },
    { headerName: "Sample Date", width: 150, field: "sample_dt" },
    { headerName: "MIN No.", field: "qc_transaction", width: 200 },
    { headerName: "Component", field: "component", width: 250 },
    { headerName: "Part", flex: 1, field: "part" },
    { headerName: "In Qty", flex: 1, field: "inQty" },
    { headerName: "Sample Qty.", flex: 1, field: "samQty", flex: 1 },
    { headerName: "UOM.", flex: 1, field: "unit" },
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
          title={`Are you sure to pass Sample ${row.transaction}?`}
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
          title={`Are you sure to reject Sample ${row.transaction}?`}
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
      <Row justify="space-between" style={{ margin: "10px" }}>
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
            onClick={() => downloadCSV(rows, columns, "Stage 2 QC Report")}
            shape="circle"
            icon={<DownloadOutlined />}
            disabled={rows.length == 0}
          />
        </Space>
      </Row>
      <div style={{ height: "85%", margin: "10px" }}>
        <MyDataTable columns={columns} data={rows} loading={tableLoading} />
      </div>
    </>
  );
}

export default PendingQC;
