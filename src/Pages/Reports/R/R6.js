import React, { useState } from "react";
import "./r.css";
import { Row, Space, Typography } from "antd";
import MyDatePicker from "../../../Components/MyDatePicker";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";
import socket from "../../../Components/socket";
import { v4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";

const R6 = () => {
  document.title = "Date Wise RM Stock";
  const [responseData, setResponseData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setfilterData] = useState([]);
  const [searchDateRange, setSearchDateRange] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, notifications } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const emitDownloadEvent = () => {
    let newId = v4();
    let arr = notifications;
    arr = [{ notificationId: newId, loading: true, type: "file" }, ...arr];
    console.log("this is the arr", searchDateRange);
    socket(user?.token).emit("allComp", {
      // otherdata: JSON.stringify({ date: searchDateRange }),
      otherdata: { date: searchDateRange },
      notificationId: newId,
    });
    // dispatch(
    //   setNotifications([
    //     { notificationId: newId, loading: true, type: "file" },
    //     ...notifications,
    //   ])
    // );
    console.log(notifications);
  };
  const additional = () => (
    <Space>
      <div style={{ width: 300 }}>
        <MyDatePicker
          size="default"
          setDateRange={setSearchDateRange}
          dateRange={searchDateRange}
          value={searchDateRange}
        />
      </div>

      <CommonIcons
        action="downloadButton"
        onClick={emitDownloadEvent}
        // disabled={rows.length == 0}
      />
    </Space>
  );
  return (
    <>
      <div
        style={{
          height: "90%",
        }}
      >
        <Row justify="start" style={{ padding: "0px 10px", paddingBottom: 5 }}>
          <Space>
            <div style={{ width: 300 }}>
              <MyDatePicker
                size="default"
                setDateRange={setSearchDateRange}
                dateRange={searchDateRange}
                value={searchDateRange}
              />
            </div>

            <CommonIcons
              action="downloadButton"
              onClick={emitDownloadEvent}
              // disabled={rows.length == 0}
            />
          </Space>
        </Row>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <SettingTwoTone style={{ fontSize: "80px" }} /> */}
          <div>
            <Typography.Title level={5}>
              Select the date range and click on download button to download
              this report
            </Typography.Title>
          </div>
        </div>
      </div>

      {/* <div
        className="m-3 p-2"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span style={{ fontWeight: "bold" }}>Date Wise RM Stock</span>
        </div>
        <div>
          <FaDownload
            size={20}
            className="cursorr"
            color="#5D7788"
            onClick={handleDownloadingCSV}
          />
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "85vh",
          }}
        >
          <Lottie animationData={waiting} loop={true} style={{ height: "200px" }} />
        </div>
      ) : (
        <DataTable
          // title="Finish Goods Stock"
          fixedHeader="true"
          fixedHeaderScrollHeight={"55vh"}
          className="p-1"
          data={filterData}
          customStyles={customStyles}
          columns={col}
          pagination
          highlightOnHover
          subHeader
          subHeaderComponent={
            <div
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "space-between",
                // border: "1px solid red",
                padding: "1px",
              }}
            >
              <div className="" style={{ display: "flex" }}>
                <div>
                  <DatePicker
                    style={{
                      minHeight: "39px",
                      borderRadius: "4px",
                      width: "350px",
                    }}
                    onChange={(e) => setSelectDate(moment(e).format("DD-MM-YYYY"))}
                  />
                </div>
                <div>
                  <button className="btn btn-secondary px-3 mr-1" onClick={fetch}>
                    Fetch
                  </button>
                </div>
              </div>
              <div>
                <input
                  style={{ minHeight: "40px" }}
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search By SKU"
                />
              </div>
            </div>
          }
        />
      )} */}
    </>
  );
};

export default R6;
