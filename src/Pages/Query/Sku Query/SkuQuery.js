import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IoInformationCircle } from "react-icons/io5";
import { Button, Col, Popover, Row, Card } from "antd";
import { toast } from "react-toastify";
import { downloadCSVCustomColumns } from "../../../Components/exportToCSV";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import MyDataTable from "../../../Components/MyDataTable";
import { v4 } from "uuid";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { imsAxios } from "../../../axiosInterceptor";

function SkuQuery() {
  document.title = "SKU Query";
  const [asyncOptions, setAsyncOptions] = useState([]);
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [allDataFetch, setAllDAtaFetch] = useState([]);
  const { data1, data2 } = allDataFetch;
  const [allData, setAllData] = useState({
    sku: "",
  });

  const getComponent = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/getProductByNameAndNo", {
        search: e,
      });
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
      // return arr;
    }
  };

  const columns = [
    // { field: "ID", headerName: "Serial No", width: 100 },
    { field: "serial_no", headerName: "#", width: 100 },
    { field: "date", headerName: "DATE", width: 200 },
    {
      field: "actions",
      headerName: "TRANSPORT TYPE",
      width: 250,
      type: "actions",
      renderCell: (a) =>
        a.row.type ==
        '<span class="d-inline-block radius-round p-2 bgc-red"></span>' ? (
          <div
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50px",
              backgroundColor: "#FF0032",
            }}
          ></div>
        ) : (
          <div
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50px",
              backgroundColor: "#227C70",
            }}
          ></div>
        ),
    },
    { field: "qty", headerName: "QTY", width: 150 },
    { field: "uom", headerName: "UOM", width: 150 },
    { field: "doneby", headerName: "CREATED/APPROVED BY", width: 200 },
    // { field: "rm", headerName: "Physical Stock", width: 150 },
  ];

  const content = (
    // <Card title="Card title">
    <Card type="inner" title="RM Details">
      <Row>
        <Col span={24}>
          <span style={{ padding: "5px" }}>
            SKU/Product: {`${data1?.sku}/${data1?.product}`}
          </span>
        </Col>
        <Col span={24} style={{ marginTop: "2px" }}>
          <span style={{ padding: "5px" }}>
            Closing Balance: {`${data1?.closingqty} ${data1?.uom}`}
          </span>
        </Col>
      </Row>
    </Card>
  );

  const getInfo = async () => {
    if (!allData.sku) {
      toast.error("Please Select Sku");
    } else {
      setLoading(true);
      setMainData([]);
      const { data } = await imsAxios.post("/skuQueryA/fetchSKU_logs", {
        sku_code: allData?.sku,
      });
      // console.log(data);
      if (data.code == 200) {
        let arr = data.response.data2.map((row) => {
          return { ...row, id: v4() };
        });
        setMainData(arr);
        setAllDAtaFetch(data?.response);
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
    arr = data2;
    csvData = arr.map((row) => {
      return {
        "#": row.serial_no,
        "Date & Time": row.date,
        "Transaction Type":
          row.type ==
          '<span class="d-inline-block radius-round p-2 bgc-red"></span>'
            ? "Dispatch"
            : row.type ==
              '<span class="d-inline-block radius-round p-2 bgc-green"></span>'
            ? "Consumption"
            : "",
        Qty: row.qty,
        UOM: row.uom,
        "Created/ Approved By": row.doneby,
      };
    });
    downloadCSVCustomColumns(csvData, "SKU All Report");
  };
  useEffect(() => {
    if (getInfo) {
      // console.log(allDataFetch.data2);
    }
  }, [getInfo]);
  return (
    <div style={{ height: "95%" }}>
      <Row gutter={16} style={{ margin: "5px" }}>
        <Col span={6}>
          <div>
            <MyAsyncSelect
              placeholder="SKU"
              style={{ width: "100%" }}
              onBlur={() => setAsyncOptions([])}
              loadOptions={getComponent}
              optionsState={asyncOptions}
              onChange={(e) =>
                setAllData((allData) => {
                  return { ...allData, sku: e };
                })
              }
              value={allData.sku}
            />
          </div>
        </Col>
        <Col span={2}>
          <div>
            <Button loading={loading} type="primary" onClick={getInfo}>
              Fetch
            </Button>
          </div>
        </Col>
        {mainData.length > 1 && (
          <>
            <Col span={1}>
              <Popover content={content} trigger="click">
                {/* <Button type="primary"> */}
                <IoInformationCircle size={28} style={{ marginTop: "3px" }} />
                {/* </Button> */}
              </Popover>
            </Col>
            <Col span={2} offset={13}>
              <Button onClick={handleDownloadingCSV}>
                <MdOutlineDownloadForOffline style={{ fontSize: "21px" }} />
              </Button>
            </Col>
          </>
        )}
      </Row>
      <div style={{ height: "89%", margin: "10px" }}>
        <MyDataTable loading={loading} data={mainData} columns={columns} />
      </div>
    </div>
  );
}
export default SkuQuery;
