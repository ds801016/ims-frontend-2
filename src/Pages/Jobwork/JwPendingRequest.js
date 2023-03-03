import { Button, Col, Input, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { imsAxios } from "../../../axiosInterceptor";
import { downloadCSV } from "../../Components/exportToCSV";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import MyDataTable from "../../Components/MyDataTable";
import MyDatePicker from "../../Components/MyDatePicker";
import MySelect from "../../Components/MySelect";
import printFunction, {
  downloadFunction,
} from "../../Components/printFunction";
import TableActions, {
  CommonIcons,
} from "../../Components/TableActions.jsx/TableActions";
import ToolTipEllipses from "../../Components/ToolTipEllipses";
import { imsAxios } from "../../axiosInterceptor";
import JWRMChallanEditAll from "./JWRMChallan/JWRMChallanEditAll";
import JWRMChallanEditMaterials from "./JWRMChallan/JWRMChallanEditMaterials";
// import JWRMChallanEditAll from "./JWRMChallanEditAll";
// import JWRMChallanEditMaterials from "./JWRMChallanEditMaterials";

function JwPendingRequest() {
  const [wise, setWise] = useState("issuedtwise");
  const [searchInput, setSearchInput] = useState("");
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [editingJWMaterials, setEditingJWMaterials] = useState(false);
  const [editiJWAll, setEditJWAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const wiseOptions = [
    { text: "Issue Request Date Wise", value: "issuedtwise" },
  ];
  const getAsyncOptions = async (search, type) => {
    let link =
      type === "sku"
        ? "/backend/getProductByNameAndNo"
        : type === "vendor" && "/backend/vendorList";
    setLoading("select");
    const { data } = await imsAxios.post(link, {
      search: search,
    });
    setLoading(false);
    if (data[0]) {
      let arr = data.map((row) => ({
        text: row.text,
        value: row.id,
      }));
      setAsyncOptions(arr);
    } else {
      setAsyncOptions([]);
    }
  };
  const getRows = async () => {
    setLoading("fetch");
    const { data } = await imsAxios.post("/jobwork/getJobworkChallan", {
      data: searchInput,
      wise: wise,
    });
    setLoading(false);
    if (data.code === 200) {
      let arr = data.data.map((row, index) => ({
        id: index + 1,
        ...row,
      }));
      setRows(arr);
    } else {
      setRows([]);
      toast.error(data.message.msg);
    }
  };
  const handlePrint = async (invoiceId, refId) => {
    setLoading("print");
    const { data } = await imsAxios.post("/jobwork/printJobworkChallan", {
      invoice_id: invoiceId,
      ref_id: refId,
    });
    setLoading(false);
    if (data.code === 200) {
      printFunction(data.data.buffer.data);
    } else {
      toast.error(data.message.msg);
    }
  };
  const handleDownload = async (invoiceId, refId) => {
    setLoading("print");
    const { data } = await imsAxios.post("/jobwork/printJobworkChallan", {
      invoice_id: invoiceId,
      ref_id: refId,
    });
    setLoading(false);
    if (data.code === 200) {
      downloadFunction(data.data.buffer.data, `JW Challan`);
    } else {
      toast.error(data.message.msg);
    }
  };
  const columns = [
    { headerName: "Sr. No", width: 80, field: "id" },
    {
      headerName: "Req. Date",
      field: "issue_challan_rm_dt",
      width: 150,
      renderCell: ({ row }) => (
        <ToolTipEllipses text={row.issue_challan_rm_dt} />
      ),
    },
    {
      headerName: "Vendor",
      flex: 1,
      field: "vendor",
      renderCell: ({ row }) => <ToolTipEllipses text={row.vendor} />,
    },
    {
      headerName: "Issue Ref ID",
      width: 100,
      field: "issue_transaction_id",
      renderCell: ({ row }) => (
        <ToolTipEllipses text={row.issue_transaction_id} />
      ),
    },
    {
      headerName: "Jobwork Id",
      width: 200,
      field: "jw_transaction_id",
      renderCell: ({ row }) => (
        <ToolTipEllipses text={row.jw_transaction_id} copy={true} />
      ),
    },
    {
      headerName: "Challan ID",
      width: 150,
      field: "challan_id",
      renderCell: ({ row }) => (
        <ToolTipEllipses text={row.challan_id} copy={true} />
      ),
    },
    {
      headerName: "SKU ID",
      width: 100,
      field: "sku_code",
      renderCell: ({ row }) => (
        <ToolTipEllipses text={row.sku_code} copy={true} />
      ),
    },
    {
      headerName: "Product",
      flex: 1,
      field: "jw_sku_name",
      renderCell: ({ row }) => <ToolTipEllipses text={row.jw_sku_name} />,
    },
    {
      headerName: "Actions",
      width: 100,
      type: "actions",
      getActions: ({ row }) => [
        // Download icon
        <TableActions
          action="download"
          onClick={() =>
            handleDownload(row.jw_transaction_id, row.issue_transaction_id)
          }
        />,
        // Print Icon
        <TableActions
          action="print"
          onClick={() =>
            handlePrint(row.jw_transaction_id, row.issue_transaction_id)
          }
        />,
        // edit Icon
        <TableActions
          action={row.btn_status === "false" ? "add" : "edit"}
          onClick={() =>
            row.btn_status === "false"
              ? setEditJWAll({
                  fetchTransactionId: row.issue_transaction_id,
                  saveTransactionId: row.jw_transaction_id,
                })
              : setEditingJWMaterials(row.challan_id)
          }
        />,
      ],
    },
  ];
  useEffect(() => {
    setSearchInput("");
  }, [wise]);
  return (
    <div style={{ height: "90%" }}>
      <JWRMChallanEditMaterials
        editingJWMaterials={editingJWMaterials}
        setEditingJWMaterials={setEditingJWMaterials}
        getRows={getRows}
      />
      <JWRMChallanEditAll
        getRows={getRows}
        editiJWAll={editiJWAll}
        setEditJWAll={setEditJWAll}
      />
      <Row
        justify="space-between"
        style={{ margin: "0px 10px", marginBottom: 6 }}
      >
        <Col>
          <Space>
            {/* <div style={{ width: 250 }}>
              <MySelect
                options={wiseOptions}
                onChange={setWise}
                placeholder="Select Option"
                //  value={wise}
                setSearchString={setSearchInput}
              />
            </div> */}
            <div style={{ width: 300 }}>
              {/* {wise === "datewise" && (
                <MyDatePicker
                  size="default"
                  setDateRange={setSearchInput}
                  dateRange={searchInput}
                  value={searchInput}
                  spacedFormat={true}
                />
              )}
              {wise === "jw_transaction_wise" && (
                <Input
                  size="default"
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
              )}
              {wise === "challan_wise" && (
                <Input
                  size="default"
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
              )}
              {wise === "jw_sfg_wise" && (
                <MyAsyncSelect
                  onBlur={() => setAsyncOptions([])}
                  value={searchInput}
                  optionsState={asyncOptions}
                  selectLoading={loading === "select"}
                  onChange={(value) => setAsyncOptions(value)}
                  loadOptions={(value) => getAsyncOptions(value, "sku")}
                />
              )}
              {wise === "vendorwise" && (
                <MyAsyncSelect
                  onBlur={() => setAsyncOptions([])}
                  value={searchInput}
                  optionsState={asyncOptions}
                  selectLoading={loading === "select"}
                  onChange={(value) => setAsyncOptions(value)}
                  loadOptions={(value) => getAsyncOptions(value, "vendor")}
                />
              )} */}
              {wise === "issuedtwise" && (
                <MyDatePicker
                  size="default"
                  setDateRange={setSearchInput}
                  dateRange={searchInput}
                  value={searchInput}
                />
              )}
            </div>
            <Button
              type="primary"
              disabled={wise === "" || searchInput === ""}
              loading={loading === "fetch"}
              onClick={getRows}
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
              onClick={() => downloadCSV(rows, columns, "JW RM Challan Report")}
              disabled={rows.length == 0}
            />
          </Space>
        </Col>
      </Row>
      <div style={{ height: "95%", margin: "0px 10px" }}>
        <MyDataTable
          loading={loading === "fetch"}
          columns={columns}
          rows={rows}
        />
      </div>
    </div>
  );
}

export default JwPendingRequest;
