import React, { useState, useEffect } from "react";
import { Button, Col, Input, Row, Space } from "antd";
import MyDatePicker from "../../../Components/MyDatePicker";
import { toast } from "react-toastify";
import printFunction, {
  downloadFunction,
} from "../../../Components/printFunction";
import ViewComponentSideBar from "./Sidebars/ViewComponentSideBar";
import EditPO from "./EditPO/EditPO";
import MateirialInward from "./MaterialIn/MateirialInward";
import CancelPO from "./Sidebars/CancelPO";
import MyDataTable from "../../../Components/MyDataTable";
import MySelect from "../../../Components/MySelect";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import UploadDoc from "./UploadDoc";
import { downloadCSV } from "../../../Components/exportToCSV";
import TableActions, {
  CommonIcons,
} from "../../../Components/TableActions.jsx/TableActions";
import ToolTipEllipses from "../../../Components/ToolTipEllipses";
import { imsAxios } from "../../../axiosInterceptor";

const ManagePO = () => {
  document.title = "Manage PO";

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [showViewSidebar, setShowViewSideBar] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [componentData, setComponentData] = useState(null);
  const [wise, setWise] = useState("powise");
  const [rows, setRows] = useState([]);
  const [updatePoId, setUpdatePoId] = useState(null);
  const [materialInward, setMaterialInward] = useState(null);
  const [searchDateRange, setSearchDateRange] = useState("");
  const [showUploadDocModal2, setShowUploadDocModal2] = useState(null);
  const [showCancelPO, setShowCancelPO] = useState(null);

  const wiseOptions = [
    { value: "datewise", text: "Date Wise" },
    { value: "powise", text: "PO ID Wise" },
    { value: "vendorwise", text: "Vendor Wise" },
  ];
  const printFun = async (poid) => {
    setLoading(true);
    const { data } = await imsAxios.post("/poPrint", {
      poid: poid,
    });

    printFunction(data.data.buffer.data);
    setLoading(false);
  };

  const handleCancelPO = async (poid) => {
    setLoading(true);
    const { data } = await imsAxios.post("/purchaseOrder/fetchStatus4PO", {
      purchaseOrder: poid,
    });
    setLoading(false);
    if (data.code == 200) {
      setShowCancelPO(poid);
    } else {
      toast.error("PO is already cancelled");
    }
  };
  const handleDownload = async (poid) => {
    setLoading(true);
    const { data } = await imsAxios.post("/poPrint", {
      poid: poid,
    });
    setLoading(false);
    let filename = `PO ${poid}`;
    downloadFunction(data.data.buffer.data, filename);
  };

  const columns = [
    {
      headerName: "Serial No.",
      field: "index",
      width: 100,
    },
    {
      headerName: "PO ID",
      field: "po_transaction",
      renderCell: ({ row }) => (
        <ToolTipEllipses text={row.po_transaction} copy={true} />
      ),
      flex: 1,
    },
    {
      headerName: "Cost Center",
      field: "cost_center",
      renderCell: ({ row }) => <ToolTipEllipses text={row.cost_center} />,
      flex: 1,
    },

    {
      headerName: "Vendor Name",
      field: "vendor_name",
      renderCell: ({ row }) => <ToolTipEllipses text={row.vendor_name} />,
      flex: 2,
    },
    {
      headerName: "Vendor Code",
      field: "vendor_id",
      renderCell: ({ row }) => (
        <ToolTipEllipses text={row.vendor_id} copy={true} />
      ),
      flex: 1,
    },

    {
      headerName: "Po Reg. Date",
      field: "po_reg_date",
      renderCell: ({ row }) => <ToolTipEllipses text={row.po_reg_date} />,
      flex: 1,
    },
    {
      headerName: "Created By",
      field: "po_reg_by",
      renderCell: ({ row }) => <ToolTipEllipses text={row.po_reg_by} />,
      flex: 1,
    },
    {
      headerName: "Comment",
      field: "po_comment",
      renderCell: ({ row }) => <ToolTipEllipses text={row.po_comment} />,
      flex: 1,
    },

    {
      headerName: "Actions",
      type: "actions",
      width: 300,
      getActions: ({ row }) => [
        // MIN icon
        // <TableActions
        //   action="add"
        //   disable={row.po_status == "C"}
        //   onClick={() => setMaterialInward(row.po_transaction)}
        //   label="MIN"
        // />,
        // Edit icon
        <TableActions
          action="edit"
          onClick={() => getPoDetail(row.po_transaction)}
        />,
        // VIEW Icon
        <TableActions
          action="view"
          onClick={() => getComponentData(row.po_transaction, row.po_status)}
        />,
        // Download icon
        <TableActions
          action="download"
          onClick={() => handleDownload(row.po_transaction)}
        />,
        // Print Icon
        <TableActions
          action="print"
          onClick={() => printFun(row.po_transaction)}
        />,

        // Close PO icon
        <TableActions
          action="cancel"
          disabled={row.po_status == "C"}
          onClick={() => handleCancelPO(row.po_transaction)}
        />,

        // Upload DOC Icon
        <TableActions
          action="upload"
          disabled={row.po_status == "C"}
          onClick={() => setShowUploadDocModal2(row.po_transaction)}
        />,
      ],
    },
  ];
  //getting rows from database from all 3 filter po wise, data wise, vendor wise
  const getSearchResults = async () => {
    setRows([]);
    let search;
    if (wise == "datewise") {
      search = searchDateRange;
    } else {
      search = null;
    }
    if (searchInput || search) {
      setSearchLoading(true);
      const { data } = await imsAxios.post(
        "/purchaseOrder/fetchPendingData4PO",
        {
          data:
            wise == "vendorwise"
              ? searchInput
              : wise == "powise"
              ? searchInput.trim()
              : wise == "datewise" && searchDateRange,
          wise: wise,
        }
      );
      setSearchLoading(false);
      if (data.code == 200) {
        let arr = data.response?.data?.map((row, index) => ({
          ...row,
          id: row.po_transaction,
          index: index + 1,
        }));
        setRows(arr);
      } else {
        if (data.message) {
          toast.error(data.message);
        } else {
          toast.error(data.message.msg);
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
  //getting vendors list for filter by vendors
  const getVendors = async (productSearchInput) => {
    if (productSearchInput?.length > 2) {
      setSelectLoading(true);
      const { data } = await imsAxios.post("/backend/vendorList", {
        search: productSearchInput,
      });
      setSelectLoading(false);
      let arr = [];
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
  //getting component view data
  const getComponentData = async (poid, status) => {
    setViewLoading(true);
    const { data } = await imsAxios.post(
      "/purchaseOrder/fetchComponentList4PO",
      {
        poid,
      }
    );
    setViewLoading(false);
    if (data.code == 200) {
      const arr = data.data.data.map((row, index) => {
        return {
          ...row,
          id: index,
        };
      });
      setComponentData({ poid: poid, components: arr, status: status });

      setShowViewSideBar(true);
    } else {
      toast.error(data.message);
    }
  };
  const getPoDetail = async (poid) => {
    setLoading(true);
    const { data } = await imsAxios.post("/purchaseOrder/fetchData4Update", {
      pono: poid.replaceAll("_", "/"),
    });
    setLoading(false);
    if (data.code == 200) {
      setUpdatePoId({
        ...data.data.bill,
        materials: data.data.materials,
        ...data.data.ship,
        ...data.data.vendor[0],
      });
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="manage-po" style={{ position: "relative", height: "100%" }}>
      <Row
        justify="space-between"
        style={{ padding: "0px 10px", paddingBottom: 5 }}
      >
        <Col>
          <Space>
            <div style={{ width: 150 }}>
              <MySelect
                size={"default"}
                options={wiseOptions}
                defaultValue={wiseOptions.filter((o) => o.value === wise)[0]}
                onChange={setWise}
                value={wise}
                setSearchString={setSearchInput}
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
              ) : wise === "powise" ? (
                <Input
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Enter Po Number"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              ) : (
                wise === "vendorwise" && (
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
                )
              )}
            </div>
            <Button
              disabled={
                wise === "datewise"
                  ? searchDateRange === ""
                    ? true
                    : false
                  : !searchInput
                  ? true
                  : false
              }
              type="primary"
              loading={searchLoading}
              onClick={getSearchResults}
              id="submit"
            >
              Search
            </Button>
          </Space>
        </Col>
        <Col>
          <Space>
            <CommonIcons
              action="downloadButton"
              onClick={() => downloadCSV(rows, columns, "Pending PO Report")}
              disabled={rows.length == 0}
            />
          </Space>
        </Col>
      </Row>
      <UploadDoc
        setShowUploadDocModal2={setShowUploadDocModal2}
        showUploadDocModal2={showUploadDocModal2}
      />
      <CancelPO
        getSearchResults={getSearchResults}
        setShowCancelPO={setShowCancelPO}
        showCancelPO={showCancelPO}
        setRows={setRows}
        rows={rows}
      />

      {updatePoId && (
        <EditPO updatePoId={updatePoId} setUpdatePoId={setUpdatePoId} />
      )}
      <MateirialInward
        materialInward={materialInward}
        setMaterialInward={setMaterialInward}
        asyncOptions={asyncOptions}
        setAsyncOptions={setAsyncOptions}
      />
      <div
        style={{
          height: "85%",
          padding: "0 10px",
        }}
      >
        <MyDataTable
          loading={loading || viewLoading || searchLoading}
          rows={rows}
          columns={columns}
        />
      </div>
      <ViewComponentSideBar
        setShowViewSideBar={setShowViewSideBar}
        showViewSidebar={showViewSidebar}
        componentData={componentData}
      />
    </div>
  );
};

export default ManagePO;
