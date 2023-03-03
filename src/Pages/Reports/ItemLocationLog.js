import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportCommonPart from "./ReportCommonPart";
import { toast } from "react-toastify";
import {
  downloadCSV,
  downloadCSVCustomColumns,
} from "../../Components/exportToCSV";
import "antd/dist/antd.css";
import { Button, Col, DatePicker, Popover, Row } from "antd";
import InternalNav from "../../Components/InternalNav";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import MySelect from "../../Components/MySelect";
import MyDataTable from "../../Components/MyDataTable";
import { IoInformationCircle } from "react-icons/io5";
import { MdOutlineDownloadForOffline } from "react-icons/md";

import { v4 } from "uuid";
import { imsAxios } from "../../axiosInterceptor";
const { RangePicker } = DatePicker;

const ItemLocationLog = () => {
  document.title = "Item Location Log";
  const [allData, setAllData] = useState([]);
  const [allDataChange, setAlldataChange] = useState([]);
  const [show, setshow] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [locDataTo, setloctionDataTo] = useState([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemLocation, setItemLocation] = useState({
    part_no_name: "",
    location: "",
  });
  // console.log(allData);

  const content = (
    <div>
      <p>
        Part/Components:
        <span
          style={{ fontWeight: "bold" }}
        >{`${allDataChange.partno} ${allDataChange.component} `}</span>
      </p>

      <p>
        CL Bal:
        <span
          style={{ fontWeight: "bold" }}
        >{`${allDataChange.closingqty} `}</span>
      </p>
      <p>
        Last In (Date / Type):
        <span
          style={{ fontWeight: "bold" }}
        >{`${allDataChange.lasttIN} `}</span>
      </p>
      <p>
        {" "}
        Last Rate:
        <span
          style={{ fontWeight: "bold" }}
        >{`${allDataChange.lastRate} `}</span>
      </p>
    </div>
  );

  const content1 = (row) => (
    <div>
      <span style={{ fontWeight: "bold" }}>{row} </span>
    </div>
  );

  // console.log(itemLocation);

  // console.log(allData);

  const columns = [
    { field: "index", headerName: "#", width: 80 },
    { field: "date", headerName: "Date", width: 160 },
    {
      field: "actions",
      headerName: "Transaction Type",
      width: 120,
      type: "actions",
      renderCell: (a) =>
        a.row.type ==
        '<span class="d-inline-block radius-round p-2 bgc-red"></span>' ? (
          <div
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50px",
              backgroundColor: "#DD5353",
            }}
          ></div>
        ) : a.row.type ==
          '<span class="d-inline-block radius-round p-2 bgc-green"></span>' ? (
          <div
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50px",
              backgroundColor: "#59CE8F",
            }}
          ></div>
        ) : a.row.type ==
          '<span class="d-inline-block radius-round p-2 bgc-grey"></span>' ? (
          <div
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50px",
              backgroundColor: "#678983",
            }}
          ></div>
        ) : a.row.type ==
          '<span class="d-inline-block radius-round p-2 bgc-yellow"></span>' ? (
          <div
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50px",
              backgroundColor: "#FFB100",
            }}
          ></div>
        ) : (
          ""
        ),
    },
    {
      field: "qty_in",
      headerName: "Qty In",
      width: 140,
      renderCell: ({ row }) => (
        <>
          <Popover content={content1(row.transaction)}>
            {row.transaction_type == "CANCELLED" ? (
              <del>{row.qty_in}</del>
            ) : (
              <span>{row.qty_in}</span>
            )}
          </Popover>
        </>
      ),
    },
    {
      field: "qty_out",
      headerName: "Qty Out",
      width: 100,
      renderCell: ({ row }) => (
        <>
          <Popover content={content1(row.transaction)}>
            {row.transaction_type == "CANCELLED" ? (
              <del>{row.qty_out}</del>
            ) : (
              <span>{row.qty_out}</span>
            )}
          </Popover>
        </>
      ),
    },
    { field: "mode", headerName: "Method", width: 150 },
    { field: "location_in", headerName: "Location Inward", width: 160 },
    { field: "location_out", headerName: "Location Outward", width: 180 },
    { field: "vendortype", headerName: "Doc. Type", width: 120 },
    { field: "vendorname", headerName: "Vendor", width: 280 },
    { field: "doneby", headerName: "Created/Arroved By", width: 200 },
  ];

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

  const getLocationFunctionTo = async (e) => {
    // if (e.length > 1) {
    const { data } = await imsAxios.post("/backend/fetchLocation", {
      searchTerm: e,
    });
    // console.log(data);
    if (data.code == 500) {
      toast.error(data.massage);
    } else {
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
    // }
    // const { data } = await imsAxios.post("/backend/fetchLocation");
    // let v = [];
    // data?.map((ad) => v.push({ text: ad.text, value: ad.id }));
    // setloctionDataTo(v);
  };

  const handleDownloadingCSV = () => {
    downloadCSV(allData, columns, "Item Location Log");
  };

  const itemAllLocatiom = async (e) => {
    setAllData([]);
    e.preventDefault();

    if (!itemLocation.part_no_name) {
      toast.error("Please enter part/name");
    } else if (!itemLocation.location) {
      toast.error("Please Select Location");
    } else {
      setLoading(true);
      const { data } = await imsAxios.post("/itemQueryL", {
        part_code: itemLocation.part_no_name,
        location: itemLocation.location,
      });
      // console.log(data);
      if (data.code == 200) {
        let arr = data.response.data2.map((row, index) => {
          return { ...row, id: v4(), index: index + 1 };
        });
        // console.log(allData);
        setAllData(arr);
        setAlldataChange(data.response.data1);
        setshow(true);
        setLoading(false);
      } else if (data.code == 500) {
        // setAllData([]);
        toast(data.message.msg);
        setLoading(false);
      }
    }
  };

  // useEffect(() => {
  //   getLocationFunctionTo();
  // }, []);

  return (
    <div style={{ height: "95%" }}>
      <Row gutter={10} style={{ margin: "5px" }}>
        <Col span={6}>
          <MyAsyncSelect
            style={{ width: "100%" }}
            onBlur={() => setAsyncOptions([])}
            loadOptions={getOption}
            optionsState={asyncOptions}
            onChange={(e) =>
              setItemLocation((itemLocation) => {
                return { ...itemLocation, part_no_name: e };
              })
            }
            placeholder="Part Code"
          />
        </Col>

        <Col span={4}>
          <MyAsyncSelect
            style={{ width: "100%" }}
            onBlur={() => setAsyncOptions([])}
            loadOptions={getLocationFunctionTo}
            // value={itemLocation.part_no_name}
            optionsState={asyncOptions}
            onChange={(e) =>
              setItemLocation((itemLocation) => {
                return { ...itemLocation, location: e };
              })
            }
            placeholder="location"
          />
          {/* <MySelect
            options={locDataTo}
            placeholder="Select Location"
            onChange={(e) =>
              setItemLocation((itemLocation) => {
                return { ...itemLocation, location: e };
              })
            }
          /> */}
        </Col>
        <Col span={2}>
          <Button loading={loading} onClick={itemAllLocatiom} type="primary">
            Fetch
          </Button>
        </Col>

        {allData.length > 1 && (
          <>
            <Col span={1} className="gutter-row">
              <Popover content={content} title="RM Details" trigger="click">
                <IoInformationCircle
                  size={25}
                  className="cursorr "
                  style={{ marginTop: "4px" }}
                />
              </Popover>
            </Col>
            <Col span={2} offset={9} className="gutter-row">
              <div>
                <Button onClick={handleDownloadingCSV}>
                  <MdOutlineDownloadForOffline style={{ fontSize: "20px" }} />
                </Button>
              </div>
            </Col>
          </>
        )}
      </Row>

      <div style={{ height: "89%", margin: "10px" }}>
        <MyDataTable loading={loading} data={allData} columns={columns} />
      </div>
    </div>
  );
};

export default ItemLocationLog;
