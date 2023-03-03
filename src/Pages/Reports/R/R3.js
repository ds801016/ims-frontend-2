import React, { useState, useEffect } from "react";
import "./r.css";
import { toast } from "react-toastify";
import "antd/dist/antd.css";
import { Button, Col, DatePicker, Row } from "antd";
import { downloadCSVCustomColumns } from "../../../Components/exportToCSV";
import { v4 } from "uuid";
import MyDataTable from "../../../Components/MyDataTable";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import MyDatePicker from "../../../Components/MyDatePicker";
import { imsAxios } from "../../../axiosInterceptor";

const { RangePicker } = DatePicker;

const R3 = () => {
  document.title = "Manufacturing Report";
  const [responseData, setResponseData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setfilterData] = useState([]);
  const [selectDate, setSelectDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const columns = [
    { field: "transaction1", headerName: "PPR NO.", width: 100 },
    { field: "transaction2", headerName: "MFG NO.", width: 120 },
    { field: "mfginsertdate", headerName: "MFG DATE", width: 130 },
    {
      field: "approveqty",
      headerName: "QTY",
      width: 100,
    },
    { field: "approvedate", headerName: "PPR DATE", width: 100 },
    { field: "product_sku", headerName: "SKU", width: 100 },
    { field: "product_name", headerName: "PRODUCT", width: 300 },
    { field: "location", headerName: "FG LOCATION", width: 100 },
    { field: "pprcustomer", headerName: "CUSTOMER", width: 150 },
    { field: "pprcreatedby", headerName: "PPR BY", width: 120 },
    { field: "mfgapprovedby", headerName: "MFG BY", width: 130 },
  ];

  const fetch = async () => {
    if (!selectDate) {
      toast.error("Please Select Date Then Proceed Next Step");
    } else {
      setResponseData([]);
      setLoading(true);
      const { data } = await imsAxios.post("/report3", {
        date: selectDate,
        action: "search_r3",
      });
      if (data.code == 200) {
        toast.success(data.message);
        let arr = data.response.data.map((row) => {
          return {
            ...row,
            id: v4(),
          };
        });
        setResponseData(arr);
        setLoading(false);
      } else if (data.code == 500) {
        toast.error(data.message.msg);
        setLoading(false);
      }
    }
  };

  const handleDownloadingCSV = () => {
    let arr = [];
    let csvData = [];
    arr = responseData;
    csvData = arr.map((row) => {
      return {
        "PPR No.": row.transaction1,
        "MFG No": row.transaction2,
        "MFG Date": row.mfginsertdate,
        Qty: row.approveqty,
        "PPR Date": row.approvedate,
        Sku: row.product_sku,
        Product: row.product_name,
        "FG Loc": row.location,
        Customer: row.pprcustomer,
        "PPR By": row.pprcreatedby,
        "MFG By": row.mfgapprovedby,
      };
    });
    downloadCSVCustomColumns(csvData, "Manufacturing Report");
  };

  return (
    <div style={{ height: "95%" }}>
      <Row gutter={16} style={{ margin: "5px" }}>
        <Col span={4} className="gutter-row">
          {/* <SingleDatePicker setDate={setSelectDate} /> */}
          <MyDatePicker setDateRange={setSelectDate} size="default" />
        </Col>
        <Col span={2} className="gutter-row">
          <Button onClick={fetch} block type="primary">
            Fetch
          </Button>
        </Col>
        {responseData.length > 1 && (
          <Col span={1} offset={16} className="gutter-row">
            <Button
              onClick={handleDownloadingCSV}
              style={{ marginLeft: "60px" }}
            >
              <MdOutlineDownloadForOffline style={{ fontSize: "20px" }} />
            </Button>
          </Col>
        )}
      </Row>

      <div className="hide-select" style={{ height: "88%", margin: "10px" }}>
        <MyDataTable
          checkboxSelection={true}
          loading={loading}
          data={responseData}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default R3;
