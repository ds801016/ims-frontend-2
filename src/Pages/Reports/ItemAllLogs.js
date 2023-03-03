import React, { useState, useEffect } from "react";
import { Button, Col, Popover, Row, Select } from "antd";
import { IoInformationCircle } from "react-icons/io5";
import axios from "axios";
import ReportCommonPart from "./ReportCommonPart";
import { toast } from "react-toastify";
import {
  PictureTwoTone,
  CloseOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  AlertOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { downloadCSVCustomColumns } from "../../Components/exportToCSV";
import InternalNav from "../../Components/InternalNav";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import MyDataTable from "../../Components/MyDataTable";
import { v4 } from "uuid";
import MyDatePicker from "../../Components/MyDatePicker";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { imsAxios } from "../../axiosInterceptor";

const ItemAllLogs = () => {
  document.title = "Item All Logs";
  const [loading, setLoading] = useState(false);
  const [datee, setDatee] = useState("");
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [itemLog, setItemLog] = useState({
    part_no_name: "",
  });

  // console.log(itemLog);
  // console.log(datee);

  const [allData, setAlldata] = useState([]);
  const [allData1, setAlldata1] = useState([]);

  const columns = [
    { field: "index", headerName: "#", width: 80 },
    { field: "date", headerName: "Date", width: 160 },
    {
      field: "actions",
      headerName: "Transaction Type",
      width: 150,
      type: "actions",
      renderCell: (a) =>
        a.row.type ==
        '<span class="d-inline-block radius-round p-2 bgc-red"></span>' ? (
          // <CloseOutlined style={{ color: "red", fontSize: "18px" }} />
          <div
            style={{
              height: "12px",
              width: "12px",
              borderRadius: "50px",
              backgroundColor: "#DD5353",
            }}
          ></div>
        ) : a.row.type ==
          '<span class="d-inline-block radius-round p-2 bgc-green"></span>' ? (
          // <CheckOutlined style={{ color: "#03C988", fontSize: "18px" }} />
          <div
            style={{
              height: "12px",
              width: "12px",
              borderRadius: "50px",
              backgroundColor: "#03C988",
            }}
          ></div>
        ) : a.row.type ==
          '<span class="d-inline-block radius-round p-2 bgc-grey"></span>' ? (
          <div
            style={{
              height: "12px",
              width: "12px",
              borderRadius: "50px",
              backgroundColor: "#497174",
            }}
          ></div>
        ) : // <AlertOutlined style={{ color: "#567189", fontSize: "18px" }} />
        // <LoadingOutlined style={{ color: "#678983", fontSize: "18px" }} />
        a.row.type ==
          '<span class="d-inline-block radius-round p-2 bgc-yellow"></span>' ? (
          <div
            style={{
              height: "12px",
              width: "12px",
              borderRadius: "50px",
              backgroundColor: "#FFB100",
            }}
          ></div>
        ) : (
          // <InfoCircleOutlined style={{ color: "#FFB100", fontSize: "18px" }} />
          ""
        ),
    },
    { field: "qty_in", headerName: "Qty In", width: 100 },
    { field: "qty_out", headerName: "Qty Out", width: 100 },
    { field: "mode", headerName: "Method", width: 150 },
    { field: "location_in", headerName: "Location Inward", width: 160 },
    { field: "location_out", headerName: "Location Outward", width: 180 },
    { field: "vendortype", headerName: "Doc. Type", width: 120 },
    { field: "vendorname", headerName: "Vendor", width: 380 },
    { field: "doneby", headerName: "Created/Approved By", width: 180 },
  ];

  const handleDownloadingCSV = () => {
    let arr = [];
    let csvData = [];
    arr = allData;
    csvData = arr.map((row) => {
      return {
        "#": row.serial_no,
        "Date & Time": row.date,
        "Transaction Type":
          row.type ==
          '<span class="d-inline-block radius-round p-2 bgc-red"></span>'
            ? "Issue"
            : row.type ==
              '<span class="d-inline-block radius-round p-2 bgc-yellow"></span>'
            ? "Transfer"
            : row.type ==
              '<span class="d-inline-block radius-round p-2 bgc-grey"></span>'
            ? "Inward"
            : row.type ==
              '<span class="d-inline-block radius-round p-2 bgc-green"></span>'
            ? "Consumption"
            : "",
        "Qty In": row.qty_in,
        "Qty Out": row.qty_out,
        Method: row.mode,
        "Location Inward": row.location_in,
        "Location Outward": row.location_out,
        "Doc. Type": row.vendortype,
        Vendor: row.vendorname,
        "Created/ Approved By": row.doneby,
      };
    });
    downloadCSVCustomColumns(csvData, "Item All Logs");
  };

  const getOption = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/getComponentByNameAndNo", {
        search: e,
      });
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const itemAllLogdata = async (e) => {
    e.preventDefault();

    if (!itemLog.part_no_name) {
      toast.error("Please enter part/name");
    } else if (datee.length == 0) {
      toast.error("Please select a date");
    } else {
      setLoading(true);
      setAlldata([]);
      const { data } = await imsAxios.post("/itemQueryA/fetchRM_logs", {
        data: itemLog.part_no_name,
        wise: "C",
        range: datee,
      });
      if (data.code == 200) {
        // toast.success(data.status);
        let arr = data.response.data2.map((row, index) => {
          return { ...row, id: v4(), index: index + 1 };
        });
        setAlldata(arr);
        setAlldata1(data.response.data1);
        setLoading(false);
      } else if (data.code == 500) {
        toast.error(data.message.msg);
        setLoading(false);
      }
    }
  };

  const content = (
    <div>
      <p>
        Part/Components:
        <span
          style={{ fontWeight: "bold" }}
        >{`${allData1.partno} ${allData1.component} `}</span>
      </p>
      <p>
        OP Bal:
        <span style={{ fontWeight: "bold" }}>{`${allData1.openingqty} `}</span>
      </p>
      <p>
        CL Bal:
        <span style={{ fontWeight: "bold" }}>{`${allData1.closingqty} `}</span>
      </p>
      <p>
        {" "}
        Last In Date:
        <span style={{ fontWeight: "bold" }}>{`${allData1.lasttIN} `}</span>
      </p>
      <p>
        {" "}
        Last Rate:
        <span style={{ fontWeight: "bold" }}>{`${allData1.lastRate} `}</span>
      </p>
    </div>
  );
  const getImages = async () => {
    const { data } = await imsAxios.post("/component/fetchImageComponent", {
      component: itemLog.part_no_name,
    });
  };
  return (
    <div style={{ height: "95%" }}>
      <Row gutter={10} style={{ margin: "10px" }}>
        <Col span={5}>
          <MyAsyncSelect
            style={{ width: "100%" }}
            onBlur={() => setAsyncOptions([])}
            loadOptions={getOption}
            value={itemLog.part_no_name}
            optionsState={asyncOptions}
            onChange={(e) =>
              setItemLog((itemLog) => {
                return { ...itemLog, part_no_name: e };
              })
            }
            placeholder="Part/Name"
          />
        </Col>
        <Col span={5}>
          <MyDatePicker setDateRange={setDatee} size="default" />
        </Col>

        <Col span={2}>
          <Button type="primary" onClick={itemAllLogdata}>
            Fetch
          </Button>
        </Col>
        {itemLog.part_no_name?.length > 0}
        {
          <Col span={1} className="gutter-row">
            <PictureTwoTone
              onClick={getImages}
              style={{
                fontSize: "20px",
                marginTop: "5px",
                cursor: "pointer",
              }}
            />
          </Col>
        }
        {allData.length > 0 && (
          <>
            <Col span={1}>
              <Popover content={content} title="RM Details" trigger="click">
                <IoInformationCircle
                  size={25}
                  className="cursorr "
                  style={{ marginTop: "4px" }}
                />
              </Popover>
            </Col>
            <Col span={1} offset={8} className="gutter-row">
              <div>
                <Button onClick={handleDownloadingCSV}>
                  <MdOutlineDownloadForOffline style={{ fontSize: "20px" }} />
                </Button>
              </div>
            </Col>
          </>
        )}
      </Row>

      <div style={{ height: "87%", margin: "15px" }}>
        <MyDataTable loading={loading} data={allData} columns={columns} />
      </div>
    </div>
  );
};

export default ItemAllLogs;
