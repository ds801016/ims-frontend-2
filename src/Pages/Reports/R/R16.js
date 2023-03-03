import React, { useState } from "react";
import { Button, Col, Row } from "antd";
import MyDatePicker from "../../../Components/MyDatePicker";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import MyDataTable from "../../../Components/MyDataTable";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadCSVCustomColumns } from "../../../Components/exportToCSV";
import { imsAxios } from "../../../axiosInterceptor";

function R16() {
  const [datee, setDatee] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateData, setDateData] = useState([]);

  const columns = [
    { field: "DATE", headerName: "DATE & TIME", width: 150 },
    { field: "TYPE", headerName: "TRANFER TYPE", width: 120 },
    { field: "PART", headerName: "PART NO.", width: 80 },
    {
      field: "COMPONENT",
      headerName: "COMPONENT",
      width: 320,
    },
    { field: "FROMLOCATION", headerName: "OUT LOCATION", width: 120 },
    { field: "TOLOCATION", headerName: "IN LOCATION", width: 120 },
    { field: "OUTQTY", headerName: "QTY", width: 90 },
    { field: "UNIT", headerName: "UOM", width: 90 },
    { field: "VENDORCODE", headerName: "VENDOR", width: 90 },
    { field: "REQUESTEDBY", headerName: "REQUESTED BY", width: 120 },
    { field: "ISSUEBY", headerName: "APPROVED BY", width: 130 },
  ];

  const fetch = async () => {
    setDateData([]);
    setLoading(true);
    const { data } = await imsAxios.post("/transaction/transactionOut", {
      data: datee,
    });

    if (data.code == 200) {
      // setLoading(true);
      toast.success(data.message);
      let arr = data.data.map((row) => {
        return {
          ...row,
          id: v4(),
        };
      });
      setDateData(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  const handleDownloadingCSV = () => {
    let arr = [];
    let csvData = [];
    arr = dateData;
    csvData = arr.map((row) => {
      return {
        DATE: row.DATE,
        "TRANFER TYPE": row.TYPE,
        PART: row.PART,
        COMPONENT: row.COMPONENT,
        "IN LOCATION": row.FROMLOCATION,
        QTY: row.OUTQTY,
        UOM: row.UNIT,
        VENDOR: row.VENDORCODE,
        "REQUESTED BY": row.REQUESTEDBY,
        "APPROVED BY": row.ISSUEBY,
      };
    });
    downloadCSVCustomColumns(csvData, "RM Issue Register Report");
  };

  return (
    <div style={{ height: "90%" }}>
      <Row gutter={16} style={{ margin: "5px" }}>
        <Col span={4}>
          <MyDatePicker size="default" setDateRange={setDatee} />
        </Col>

        <Col span={1}>
          <Button onClick={fetch} loading={loading} type="primary">
            Fetch
          </Button>
        </Col>
        {dateData.length > 0 && (
          <Col span={1} offset={18}>
            <Button onClick={handleDownloadingCSV}>
              <DownloadOutlined style={{ fontSize: "20px" }} />
            </Button>
          </Col>
        )}
      </Row>

      <div className="hide-select" style={{ height: "95%", margin: "10px" }}>
        <MyDataTable
          checkboxSelection={true}
          loading={loading}
          data={dateData}
          columns={columns}
        />
      </div>
    </div>
  );
}

export default R16;
