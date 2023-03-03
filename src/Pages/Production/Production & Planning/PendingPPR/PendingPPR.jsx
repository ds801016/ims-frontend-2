import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Row, Space } from "antd";
import MySelect from "../../../../Components/MySelect";
import MyDatePicker from "../../../../Components/MyDatePicker";
import { v4 } from "uuid";
import MyDataTable from "../../../../Components/MyDataTable";
import ClosePPR from "./ClosePPR";
import EditPPR from "./EditPPR";
import { downloadCSV } from "../../../../Components/exportToCSV";
import TableActions, {
  CommonIcons,
} from "../../../../Components/TableActions.jsx/TableActions";
import MyAsyncSelect from "../../../../Components/MyAsyncSelect";
import ToolTipEllipses from "../../../../Components/ToolTipEllipses";
import { imsAxios } from "../../../../axiosInterceptor";

const PendingPPR = () => {
  document.title = "Pending PPR";
  const [cancelPPR, setsCancelPPR] = useState(null);
  const [editPPR, setEditPPR] = useState(null);
  const [selectLoading, setSelectLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [rows, setRows] = useState([]);
  const [wise, setWise] = useState("skuwise");
  const [asyncOptions, setAsyncOptions] = useState([]);
  const pprWiseOptions = [
    { text: "New", value: "new" },
    { text: "Repair", value: "repair" },
    { text: "Testing", value: "testing" },
    { text: "Packing", value: "packing" },
  ];

  const wiseOptions = [
    { text: "Date Wise", value: "datewise" },
    { text: "Product Wise", value: "skuwise" },
    { text: "PPR Status", value: "pprtype" },
  ];

  const getProducts = async (e) => {
    if (e?.length > 2) {
      setSelectLoading(true);
      const { data } = await imsAxios.post("/backend/fetchAllProduct", {
        searchTerm: e,
      });
      setSelectLoading(true);
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const getRows = async () => {
    setSearchLoading(true);
    if (searchInput != "") {
      const { data } = await imsAxios.post("/ppr/fetchPendingPpr", {
        searchBy: wise,
        searchValue: searchInput.value ?? searchInput,
      });

      setSearchLoading(false);
      if (data.code == 200) {
        const arr = data.data.map((row, index) => {
          return {
            ...row,
            id: v4(),
            serial_no: index + 1,
          };
        });
        setRows(arr);
      } else if (data.code == 500) {
        toast.error(data.message.msg);
        setRows([]);
      }
    }
  };

  const columns = [
    {
      headerName: "Action",
      field: "action",
      type: "actions",
      width: 120,
      getActions: ({ row }) => [
        // edit ppr
        <TableActions
          action="edit"
          onClick={() => {
            setEditPPR(row);
          }}
        />,
        // close ppr
        <TableActions
          action="cancel"
          onClick={() => {
            setsCancelPPR(row);
          }}
        />,
      ],
    },
    { headerName: "Sr. No", width: 60, field: "serial_no" },
    {
      headerName: "Req No.",
      minWidth: 100,
      field: "prod_transaction",
      renderCell: ({ row }) => (
        <ToolTipEllipses text={row.prod_transaction} copy={true} />
      ),
    },
    { headerName: "Type", width: 100, field: "prod_type" },
    {
      headerName: "Project",
      width: 150,
      field: "prod_project",
      renderCell: ({ row }) => <ToolTipEllipses text={row.prod_project} />,
    },
    {
      headerName: "Customer",
      width: 120,
      field: "prod_customer",
      renderCell: ({ row }) => <ToolTipEllipses text={row.prod_customer} />,
    },
    {
      headerName: "Create By",
      width: 150,
      field: "prod_insert_by",
      renderCell: ({ row }) => <ToolTipEllipses text={row.prod_insert_by} />,
    },
    {
      headerName: "Req Data/Time",
      width: 150,
      field: "prod_insert_dt",
      renderCell: ({ row }) => <ToolTipEllipses text={row.prod_insert_dt} />,
    },
    {
      headerName: "Product Sku",
      width: 120,
      field: "prod_product_sku",
    },
    {
      headerName: "Product Name",
      minWidth: 150,
      flex: 1,
      field: "prod_name",
      renderCell: ({ row }) => <ToolTipEllipses text={row.prod_name} />,
    },
    {
      headerName: "Planned Qty",
      width: 100,
      field: "prod_planned_qty",
    },
    { headerName: "Due Date", width: 120, field: "prod_due_date" },
    { headerName: "Qty Exceuted", width: 100, field: "totalConsumption" },
    { headerName: "Qty Remained", width: 120, field: "consumptionRemaining" },

    // {
    //   headerName: "Action",
    //   cell: (row) => (
    //     <>
    //       <div className="p-1">
    //         <RiAddCircleFill
    //           className="cursorr"
    //           size={20}
    //           onClick={() => setShowModal(row)}
    //         />
    //       </div>
    //       <div className="p-1">
    //         <RiCloseCircleFill
    //           className="cursorr"
    //           size={20}
    //           onClick={() => setViewModal(row)}
    //         />
    //       </div>
    //     </>
    //   ),
    // },
  ];
  useEffect(() => {
    // console.log(wise);
    if (wise == "pprtype") {
      setSearchInput("new");
    } else {
      setSearchInput("");
    }
  }, [wise]);
  return (
    <div style={{ height: "90%" }}>
      <ClosePPR
        setsCancelPPR={setsCancelPPR}
        cancelPPR={cancelPPR}
        getRows={getRows}
      />
      <EditPPR getRows={getRows} editPPR={editPPR} setEditPPR={setEditPPR} />
      <Row
        justify="space-between"
        style={{ padding: "0px 10px", paddingBottom: 5 }}
      >
        <div>
          <Space>
            <div style={{ width: 200 }}>
              <MySelect options={wiseOptions} onChange={setWise} value={wise} />
            </div>
            <div style={{ width: 300 }}>
              {wise === "datewise" ? (
                <MyDatePicker
                  size="default"
                  setDateRange={setSearchInput}
                  value={searchInput}
                />
              ) : wise == "skuwise" ? (
                <MyAsyncSelect
                  selectLoading={selectLoading}
                  onBlur={() => setAsyncOptions([])}
                  value={searchInput}
                  onChange={(value) => setSearchInput(value)}
                  loadOptions={getProducts}
                  optionsState={asyncOptions}
                  placeholder="Select Product..."
                />
              ) : (
                wise == "pprtype" && (
                  <MySelect
                    options={pprWiseOptions}
                    value={searchInput}
                    labelInValue
                    onChange={(value) => setSearchInput(value)}
                  />
                )
              )}
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
          <CommonIcons
            action="downloadButton"
            onClick={() => downloadCSV(rows, columns, "Pending PPR Report")}
            disabled={rows.length == 0}
          />
        </Space>
      </Row>
      <div style={{ height: "95%", padding: "0px 10px" }}>
        <MyDataTable columns={columns} data={rows} loading={searchLoading} />
      </div>
    </div>
  );
};

export default PendingPPR;
