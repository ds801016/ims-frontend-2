import React, { useState, useEffect } from "react";
import "./r.css";
import OpenR1Modal from "../Modal/OpenR1Modal";
import "../../Store/MaterialTransfer/Modal/viewModal.css";
import { downloadCSVCustomColumns } from "../../../Components/exportToCSV";
import { Row, Col, Button } from "antd";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { PlusCircleFilled } from "@ant-design/icons";
import MyDataTable from "../../../Components/MyDataTable";

const R1 = () => {
  const [viewModal, setViewModal] = useState(false);
  const [allResponseData, setAllResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(allResponseData);

  const columns = [
    { field: "sku", headerName: "SKU", width: 60 },
    { field: "partno", headerName: "PART", width: 100 },
    { field: "components", headerName: "COMPONENT", width: 250 },
    { field: "bom_category", headerName: "CATEGORY", width: 120 },
    {
      field: "actions",
      headerName: "STATUS",
      width: 150,
      type: "actions",
      // getActions: ({ row }) => [<DownloadOutlined />],
      renderCell: (a) =>
        a.row.bom_status ==
        '<span style="color: #2db71c; font-weight: 600;">ACTIVE</span>' ? (
          <div
            style={{
              width: "80%",
              textAlign: "center",
              backgroundColor: "#03C988",
            }}
          >
            <span style={{ color: "white", fontWeight: "bolder" }}>ACTIVE</span>
          </div>
        ) : a.row.bom_status ==
          '<span style="color: #e53935; font-weight: 600;">INACTIVE</span>' ? (
          <div
            style={{
              width: "80%",
              textAlign: "center",
              backgroundColor: "#FF1E00",
            }}
          >
            <span style={{ color: "white", fontWeight: "bolder" }}>
              INACTIVE
            </span>
          </div>
        ) : a.row.bom_status ==
          '<span style="color: #ff9800; font-weight: 600;">ALTERNATIVE</span>' ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              backgroundColor: "#FFB200",
            }}
          >
            <span style={{ color: "white" }}>ALTERNATIVE</span>
          </div>
        ) : (
          ""
        ),
    },
    { field: "bomalt_name", headerName: "ALTERNATE OF", width: 120 },
    { field: "bomqty", headerName: "BOM QTY", width: 100 },
    { field: "units_name", headerName: "UOM", width: 100 },
    { field: "opening", headerName: "OPENING", width: 120 },
    { field: "inward", headerName: "INWARD", width: 120 },
    { field: "outward", headerName: "OUTWARD", width: 100 },
    { field: "closing", headerName: "CLOSING", width: 100 },
    { field: "transit_in", headerName: "ORDER IN TRANSIT", width: 150 },
    { field: "lastrate", headerName: "LAST PURCHASE PRICE", width: 180 },
  ];

  const handleDownloadingCSV = () => {
    let arr = [];
    let csvData = [];
    arr = allResponseData;
    csvData = arr.map((row) => {
      return {
        Sku: row.sku,
        Part: row.partno,
        Component: row.components,
        Category: row.bom_category,
        Status:
          row.bom_status ==
          '<span style="color: #2db71c; font-weight: 600;">ACTIVE</span>'
            ? "ACTIVE"
            : row.bom_status ==
              '<span style="color: #ff9800; font-weight: 600;">ALTERNATIVE</span>'
            ? "ALTERNATIVE"
            : "INACTIVE",
        "Alt Of": row.bomalt_name[0],
        "Bom Qty": row.bomqty,
        Uom: row.units_name,
        Opening: row.opening == 0 ? "0" : row.opening,
        Inward: row.inward == 0 ? "0" : row.inward,
        Outward: row.outward == 0 ? "0" : row.outward,
        Closing: row.closing == 0 ? "0" : row.closing,
      };
    });
    downloadCSVCustomColumns(csvData, "Bom Wise Report");
  };

  return (
    <div style={{ height: "97%" }}>
      <Row>
        <Col span={24}>
          <div style={{ textAlign: "end", marginRight: "15px" }}>
            {allResponseData.length > 1 && (
              <Button
                onClick={handleDownloadingCSV}
                style={{ marginRight: "10px" }}
              >
                <MdOutlineDownloadForOffline style={{ fontSize: "20px" }} />
              </Button>
            )}
            {/* <Button> */}
            <PlusCircleFilled
              className="cursorr"
              onClick={() => setViewModal(true)}
              style={{ fontSize: "22px" }}
            />
            {/* </Button> */}
          </div>
        </Col>
      </Row>

      <div className="hide-select" style={{ height: "87%", margin: "10px" }}>
        <MyDataTable
          checkboxSelection={true}
          data={allResponseData}
          columns={columns}
          loading={loading}
        />
      </div>

      <OpenR1Modal
        setAllResponseData={setAllResponseData}
        setViewModal={setViewModal}
        viewModal={viewModal}
        setLoading={setLoading}
      />
    </div>
  );
};

export default R1;
