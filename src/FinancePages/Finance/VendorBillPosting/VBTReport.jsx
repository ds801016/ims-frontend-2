import React, { useState, useEffect } from "react";
import MyDataTable from "../../../Components/MyDataTable";
import MyDatePicker from "../../../Components/MyDatePicker";
import axios from "axios";
import { toast } from "react-toastify";
import ViewVBTReport from "./ViewVBTReport";
import MySelect from "../../../Components/MySelect";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { Button, Col, Input, Popconfirm, Row, Space } from "antd";
import { v4 } from "uuid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import printFunction, {
  downloadFunction,
} from "../../../Components/printFunction";
import {
  CloudDownloadOutlined,
  PrinterFilled,
  EyeFilled,
  DeleteFilled,
  EditFilled,
} from "@ant-design/icons";
import EditVBT1 from "./VBT1/EditVBT1";
import { downloadCSV } from "../../../Components/exportToCSV";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";
import ToolTipEllipses from "../../../Components/ToolTipEllipses";
import { imsAxios } from "../../../axiosInterceptor";

export default function VBTReport() {
  document.title = "VBT Report";

  const [searchInput, setSearchInput] = useState("MIN/22-23/");
  const [wise, setWise] = useState("minwise");
  const [selectLoading, setSelectLoading] = useState(false);
  const [viewReportData, setViewReportData] = useState([]);
  const [searchDateRange, setSearchDateRange] = useState("");
  const [rows, setRows] = useState([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editingVBT, setEditingVBT] = useState(null);
  const wiseOptions = [
    { value: "datewise", text: "Date Wise" },
    { value: "minwise", text: "MIN Wise" },
    { value: "vendorwise", text: "Vendor Wise" },
    { value: "vbtwise", text: "VBT Code Wise" },
    { value: "effectivewise", text: "Effective Date Wise" },
  ];

  const printFun = async (vbtId) => {
    setLoading(true);
    const { data } = await imsAxios.post("/tally/vbt_report/print_vbt_report", {
      vbt_key: vbtId,
    });
    printFunction(data.buffer.data);
    setLoading(false);
  };
  const handleDownload = async (id) => {
    setLoading(true);
    let link = "/tally/vbt_report/print_vbt_report";
    let filename = id;

    const { data } = await imsAxios.post(link, {
      vbt_key: id,
    });

    downloadFunction(data.buffer.data, filename);
    setLoading(false);
  };
  const deleteFun = async () => {
    const { data } = await imsAxios.post("/tally/vbt01/vbt_delete", {
      vbt_code: deleteConfirm,
    });
    if (data.code == 200) {
      toast.success(data.message);
      getSearchResults();
    }
  };
  const getEditVBTDetails = async (code) => {
    setLoading(true);

    const { data } = await imsAxios.post("/tally/vbt01/vbt_edit", {
      vbt_code: code,
    });
    setLoading(false);
    if (data.code == 200) {
      setEditingVBT(data.message);
    } else {
      toast.error(data.message.msg);
    }
  };
  const columns = [
    {
      headerName: "Actions",
      field: "actions",
      width: 200,
      type: "actions",
      getActions: ({ row }) => [
        <GridActionsCellItem
          disabled={loading}
          icon={<EyeFilled className="view-icon" />}
          onClick={() => {
            getVBTDetails(row.vbt_code);
          }}
          label="Delete"
        />,
        // <GridActionsCellItem
        //   disabled={loading}
        //   icon={<EditFilled className="view-icon" />}
        //   onClick={() => {
        //     getEditVBTDetails(row.vbt_code);
        //   }}
        //   label="Delete"
        // />,
        <GridActionsCellItem
          disabled={loading}
          icon={<PrinterFilled className="view-icon" />}
          onClick={() => printFun(row.vbt_code)}
          label="Print"
        />,
        <GridActionsCellItem
          disabled={loading}
          icon={<CloudDownloadOutlined className="view-icon" />}
          onClick={() => {
            handleDownload(row.vbt_code);
          }}
          label="Delete"
        />,
        <GridActionsCellItem
          disabled={row.status == "Deleted" || loading}
          icon={
            <Popconfirm
              title="Are you sure to delete this Transaction?"
              onConfirm={deleteFun}
              onCancel={() => {
                setDeleteConfirm(null);
              }}
              okText="Yes"
              cancelText="No"
            >
              <DeleteFilled
                style={{ marginBottom: 10 }}
                className={`view-icon ${row.status == "Deleted" && "disable"}`}
              />{" "}
            </Popconfirm>
          }
          onClick={() => {
            setDeleteConfirm(row.vbt_code);
          }}
          label="Delete"
        />,
      ],
    },
    {
      headerName: "VBT Code",
      field: "vbt_code",
      renderCell: ({ row }) => (
        <Tooltip title={row.vbt_code}>
          <span>{row.vbt_code}</span>
        </Tooltip>
      ),
      width: 180,
    },
    {
      headerName: "MIN ID",
      field: "min_id",
      width: 150,
    },
    {
      headerName: "VBT Status",
      field: "status",
      renderCell: ({ row }) => (
        <span style={{ color: row.status == "Deleted" && "red" }}>
          {row.status}
        </span>
      ),
      width: 100,
    },
    {
      headerName: "VBT Type",
      field: "type",
      width: 80,
    },
    {
      headerName: "Invoice No.",
      field: "invoice_no",
      renderCell: ({ row }) => <ToolTipEllipses text={row.invoice_no} />,
      width: 100,
    },
    {
      headerName: "Vendor Name",
      field: "vendor",
      renderCell: ({ row }) => <ToolTipEllipses text={row.vendor} />,
      width: 150,
    },
    {
      headerName: "Vendor Code",
      field: "ven_code",
      width: 100,
    },
    // {
    //   headerName: "Vendor Address",
    //   field: "ven_address",
    //   renderCell: ({ row }) => (
    //     <Tooltip title={row.ven_address}>
    //       <span>{row.ven_address}</span>
    //     </Tooltip>
    //   ),
    //   width: 120,
    // },
    {
      headerName: "Item Name",
      field: "part",
      renderCell: ({ row }) => <ToolTipEllipses text={row.part} />,
      width: 120,
    },
    {
      headerName: "Part Code",
      field: "part_code",
      width: 100,
    },
    {
      headerName: "Actual Quantity",
      field: "act_qty",
      width: 100,
    },
    {
      headerName: "Rate",
      field: "rate",
      width: 80,
    },
    {
      headerName: "Taxable Value",
      renderCell: ({ row }) => <ToolTipEllipses text={row.taxable_value} />,
      field: "taxable_value",
      width: 100,
    },
    {
      headerName: "CGST",
      field: "cgst",
      width: 100,
    },
    {
      headerName: "SGST",
      field: "sgst",
      width: 100,
    },
    {
      headerName: "IGST",
      field: "igst",
      width: 100,
    },
    {
      headerName: "TDS",
      field: "vbt_tds_amount",
      width: 100,
    },
    {
      headerName: "Custom",
      field: "custum",
      width: 100,
    },
    {
      headerName: "Freight",
      field: "freight",
      width: 100,
    },
    {
      headerName: "Ven. Bill Amount",
      field: "ven_bill_amm",
      renderCell: ({ row }) => <ToolTipEllipses text={row.ven_bill_amm} />,
      width: 100,
    },
    {
      headerName: "Purchase GL",
      field: "vbt_gl",
      renderCell: ({ row }) => <ToolTipEllipses text={row.vbt_gl} />,
      width: 120,
    },
    {
      headerName: "CGST GL",
      field: "cgst_gl",
      renderCell: ({ row }) => <ToolTipEllipses text={row.cgst_gl} />,
      width: 120,
    },
    {
      headerName: "SGST GL",
      field: "sgst_gl",
      renderCell: ({ row }) => <ToolTipEllipses text={row.sgst_gl} />,
      width: 120,
    },
    {
      headerName: "IGST GL",
      field: "igst_gl",
      renderCell: ({ row }) => <ToolTipEllipses text={row.igst_gl} />,
      width: 120,
    },
    {
      headerName: "TDS GL",
      field: "tds_gl",
      renderCell: ({ row }) => <ToolTipEllipses text={row.tds_gl} />,
      width: 180,
    },
  ];

  //getting vendors list for filter by vendors
  const getVendors = async (productSearchInput) => {
    if (productSearchInput?.length > 2) {
      setSelectLoading(true);
      const { data } = await imsAxios.post("/backend/vendorList", {
        search: productSearchInput,
      });
      let arr = [];
      setSelectLoading(true);
      if (!data.msg) {
        arr = data.map((d) => {
          return { text: d.text, value: d.id };
        });
        setAsyncOptions(arr);
      } else {
        setAsyncOptions([]);
      }
    }
  };

  //getting rows from database from all 3 filter po wise, data wise, vendor wise
  const getSearchResults = async () => {
    setRows([]);
    setLoading(true);
    let search;
    if (wise === "datewise" || wise === "effectivewise") {
      search = searchDateRange;
    } else {
      search = null;
    }
    if (searchInput || search) {
      setLoading(true);
      const { data } = await imsAxios.post("/tally/vbt_report/vbt_report", {
        data:
          wise == "vendorwise"
            ? searchInput
            : wise == "minwise"
            ? searchInput.trim()
            : wise == "vbtwise"
            ? searchInput.trim()
            : wise == "datewise"
            ? searchDateRange
            : wise == "effectivewise" && searchDateRange,

        wise: wise,
      });
      setLoading(false);
      if (data.code == 200) {
        const arr = data.data.map((row) => {
          return {
            ...row,
            id: v4(),
            index: data.data.indexOf(row) + 1,
            status: row.status == "D" ? "Deleted" : "--",
            taxableValue: row.vbp_inqty * row.vbp_inrate,
          };
        });

        setRows(arr);
      } else {
        // console.log(data.message);
        if (data.message.msg) {
          toast.error(data.message.msg);
        } else if (data.message) {
          toast.error(data.message.msg);
        } else {
          toast.error("Something wrong happened");
        }
      }
    } else {
      if (wise == "datewise" && searchDateRange == null) {
        toast.error("Please select start and end dates for the results");
      } else if (wise == "powise") {
        toast.error("Please enter a PO id");
      } else if (wise == "vendorwise") {
        toast.error("Please select a vendor");
      }
    }
  };

  const getVBTDetails = async (vbtId) => {
    setLoading(true);
    const { data } = await imsAxios.post("/tally/vbt_report/vbt_report_data", {
      vbt_key: vbtId,
    });
    // console.log(data);
    setLoading(false);
    if (data.code == 200) {
      console.log(vbtId);
      const arr = data.data.map((row) => {
        return {
          ...row,
          id: v4(),
          vbt_code: vbtId,
        };
      });
      setViewReportData(arr);
    } else {
      if (data.message.msg) {
        toast.error(data.message.msg);
      } else if (data.message) {
        toast.error(data.message.msg);
      } else {
        toast.error("Something wrong happened");
      }
    }
  };
  useEffect(() => {
    if (wise == "minwise") {
      setSearchInput("MIN/22-23/");
    } else {
      setSearchInput("");
    }
    setSearchDateRange("");
  }, [wise]);
  return (
    <div style={{ height: "90%" }}>
      <ViewVBTReport
        viewReportData={viewReportData}
        setViewReportData={setViewReportData}
      />
      <Row
        justify="space-between"
        style={{ padding: "0px 10px", paddingBottom: 5 }}
      >
        <Col>
          <Space>
            <div style={{ width: 150 }}>
              <MySelect
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
                  setDateRange={setSearchDateRange}
                  dateRange={searchDateRange}
                  value={searchDateRange}
                />
              ) : wise === "minwise" ? (
                <Input
                  type="text"
                  size="default"
                  placeholder="Enter MIN Number"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              ) : wise === "powise" ? (
                <>
                  <Input
                    size="default"
                    type="text"
                    placeholder="Enter Po Number"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </>
              ) : wise === "vbtwise" ? (
                <div>
                  <Input
                    size="default"
                    type="text"
                    placeholder="Enter VBT Code..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              ) : wise === "vendorwise" ? (
                <>
                  <MyAsyncSelect
                    size="default"
                    selectLoading={selectLoading}
                    onBlur={() => setAsyncOptions([])}
                    value={searchInput}
                    onChange={(value) => setSearchInput(value)}
                    loadOptions={getVendors}
                    optionsState={asyncOptions}
                    defaultOptions
                    placeholder="Select Vendor..."
                  />
                </>
              ) : (
                wise == "effectivewise" && (
                  <MyDatePicker
                    size="default"
                    setDateRange={setSearchDateRange}
                    dateRange={searchDateRange}
                    value={searchDateRange}
                  />
                )
              )}
            </div>
            <Button
              disabled={
                wise === "datewise" || wise === "effectivewise"
                  ? searchDateRange === ""
                    ? true
                    : false
                  : !searchInput
                  ? true
                  : false
              }
              type="primary"
              onClick={getSearchResults}
            >
              Search
            </Button>
          </Space>
        </Col>
        <Col>
          <Space>
            <CommonIcons
              action="downloadButton"
              onClick={() => downloadCSV(rows, columns, "VBT Report")}
              disabled={rows.length == 0}
            />
          </Space>
        </Col>
      </Row>
      <EditVBT1 editingVBT={editingVBT} setEditingVBT={setEditingVBT} />

      {/* data table here */}

      <div style={{ height: "95%", padding: "0 10px" }}>
        <MyDataTable loading={loading} columns={columns} data={rows} />
      </div>
    </div>
  );
}
