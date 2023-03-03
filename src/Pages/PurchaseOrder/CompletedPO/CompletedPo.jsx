import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ViewComponentSideBar from "./ViewComponentSideBar";
import MyDatePicker from "../../../Components/MyDatePicker";
import MyDataTable from "../../../Components/MyDataTable";
import MySelect from "../../../Components/MySelect";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { Button, Col, Input, Row, Space } from "antd";
import printFunction, {
  downloadFunction,
} from "../../../Components/printFunction";
import { downloadCSV } from "../../../Components/exportToCSV";
import TableActions, {
  CommonIcons,
} from "../../../Components/TableActions.jsx/TableActions";
import ToolTipEllipses from "../../../Components/ToolTipEllipses";
import { imsAxios } from "../../../axiosInterceptor";

const CompletedPo = () => {
  document.title = "Completed PO";
  const [loading, setLoading] = useState(false);
  const [showComponentSideBar, setShowComponentSideBar] = useState(false);
  const [searchDateRange, setSearchDateRange] = useState("");
  const [searchInput, setSearchInput] = useState(null);
  const [vendorSearchInput, setVendorSearchInput] = useState("");
  const [wise, setWise] = useState("powise");
  const [rows, setRows] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [viewLoading, seViewLoading] = useState(false);

  const [componentData, setComponentData] = useState(null);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const wiseOptions = [
    { value: "datewise", text: "Date Wise" },
    { value: "powise", text: "PO ID Wise" },
    { value: "vendorwise", text: "Vendor Wise" },
  ];

  const getSearchResults = async () => {
    setLoading(true);
    let w = null;
    if (wise === "vendorwise" || wise === "powise") {
      w = searchInput;
    } else if (wise === "datewise") {
      w = searchDateRange;
    }
    if (w) {
      setSearchLoading(true);
      const { data } = await imsAxios.post("/purchaseOrder/fetchCompletePO", {
        data:
          wise === "vendorwise"
            ? searchInput
            : wise === "powise"
            ? searchInput.trim()
            : wise === "datewise" && searchDateRange,
        wise: wise,
      });
      setSearchLoading(false);
      setLoading(false);
      // console.log(data.data);
      if (data.code === 200) {
        let arr = data.data.data;
        arr = arr.map((row, index) => {
          return { ...row, id: row.po_transaction_code, index: index + 1 };
        });
        setRows(arr);
      } else {
        toast.error(data.message.msg);
        setRows([]);
      }
    } else {
      setLoading(false);
      if (wise === "datewise") {
        toast.error("Please select start and end dates for the results");
      } else if (wise === "powise") {
        toast.error("Please enter a PO id");
      } else if (wise === "vendorwise") {
        toast.error("Please select a vendor");
      }
    }
  };
  // setLoading(false);
  const getVendors = async (productSearchInput) => {
    if (productSearchInput?.length > 2) {
      setSelectLoading(true);
      const { data } = await imsAxios.post("/backend/vendorList", {
        search: productSearchInput,
      });
      setSelectLoading(true);
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
  const getComponentData = async (poid) => {
    seViewLoading(true);
    const { data } = await imsAxios.post(
      "/purchaseOrder/fetchComponentList4PO",
      {
        poid,
      }
    );
    seViewLoading(false);
    if (data.code === 200) {
      let arr = data.data.data;
      arr = arr.map((row) => {
        return { ...row, id: row.componentPartID };
      });
      setComponentData({ poId: poid, components: arr });
      setShowComponentSideBar(true);
    } else {
      toast.error("Some error occured please try again");
    }
  };
  const printFun = async (poid) => {
    setLoading(true);
    const { data } = await imsAxios.post("/poPrint", {
      poid: poid,
    });
    printFunction(data.data.buffer.data);
    setLoading(false);
  };
  const handleDownload = async (poid) => {
    setLoading("download");
    const { data } = await imsAxios.post("/poPrint", {
      poid: poid,
    });
    setLoading(null);
    let filename = poid;
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
      renderCell: ({ row }) => (
        <span dangerouslySetInnerHTML={{ __html: row.po_transaction_style }} />
      ),
      field: "po_transaction_code",
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

      flex: 1,
    },
    {
      headerName: "PO REG. DATE",
      field: "po_reg_date",
      flex: 1,
    },
    {
      headerName: "Created By",
      field: "po_reg_by",
      renderCell: ({ row }) => <ToolTipEllipses text={row.po_reg_by} />,
      flex: 1,
    },
    {
      headerName: "Comments",
      field: "po_comment",
      renderCell: ({ row }) => <ToolTipEllipses text={row.po_comment} />,
      flex: 1,
    },
    {
      headerName: "Actions",
      type: "actions",
      id: "actions",
      flex: 1,
      getActions: ({ row }) => [
        <TableActions
          action="view"
          onClick={() => getComponentData(row.po_transaction_code)}
        />,

        <TableActions
          action="print"
          onClick={() => {
            printFun(row.po_transaction_code);
          }}
        />,

        <TableActions
          action="download"
          onClick={() => handleDownload(row.po_transaction_code)}
        />,
      ],
    },
  ];
  const additional = () => (
    <Space>
      <div style={{ width: 150 }}>
        <MySelect
          size="default"
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
            size="default"
            placeholder="Enter Po Number"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        ) : (
          wise === "vendorwise" && (
            <div>
              <MyAsyncSelect
                selectLoading={selectLoading}
                size="default"
                onBlur={() => setAsyncOptions([])}
                value={searchInput}
                onChange={(value) => setSearchInput(value)}
                loadOptions={getVendors}
                optionsState={asyncOptions}
                defaultOptions
                placeholder="Select Vendor..."
              />
            </div>
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
        // className="primary-button search-wise-btn"
      >
        Search
      </Button>
      <CommonIcons
        action="downloadButton"
        onClick={() => downloadCSV(rows, columns, "Completed PO Report")}
        disabled={rows.length == 0}
      />
    </Space>
  );
  useEffect(() => {
    getVendors(vendorSearchInput);
  }, [vendorSearchInput]);
  const closeAllModal = () => {
    setShowComponentSideBar(false);
  };
  useEffect(() => {
    setSearchInput("");
    // console.log(filterData);
  }, [wise]);

  return (
    <div style={{ height: "100%" }}>
      <Row
        justify="space-between"
        style={{
          padding: "0px 10px",
          paddingBottom: 5,
          width: "100%",
        }}
      >
        <Col className="left">
          <Space>
            <div style={{ width: 150 }}>
              <MySelect
                size="medium"
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
                  size="default"
                  placeholder="Enter Po Number"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              ) : (
                wise === "vendorwise" && (
                  <div>
                    <MyAsyncSelect
                      selectLoading={selectLoading}
                      size="default"
                      onBlur={() => setAsyncOptions([])}
                      value={searchInput}
                      onChange={(value) => setSearchInput(value)}
                      loadOptions={getVendors}
                      optionsState={asyncOptions}
                      defaultOptions
                      placeholder="Select Vendor..."
                    />
                  </div>
                )
              )}{" "}
            </div>
            <Button
              loading={searchLoading}
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
              onClick={() => downloadCSV(rows, columns, "Completed PO Report")}
              disabled={rows.length == 0}
            />
          </Space>
        </Col>
      </Row>
      <div style={{ height: "85%", padding: "0px 10px" }}>
        <MyDataTable
          loading={loading || viewLoading}
          data={rows}
          columns={columns}
          pagination={true}
          headText="center"
        />
      </div>

      <ViewComponentSideBar
        setShowComponentSideBar={setShowComponentSideBar}
        showComponentSideBar={showComponentSideBar}
        componentData={componentData}
      />
    </div>
  );
};

export default CompletedPo;
