import React, { useState } from "react";
import { toast } from "react-toastify";
import "antd/dist/antd.css";
import { Button, Col, DatePicker, Popover, Row, Select } from "antd";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import MyDataTable from "../../../Components/MyDataTable";
import { v4 } from "uuid";
import InternalNav from "../../../Components/InternalNav";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import MyDatePicker from "../../../Components/MyDatePicker";
import socket from "../../../Components/socket";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { setNotifications } from "../../../Features/loginSlice.js/loginSlice";
import { imsAxios } from "../../../axiosInterceptor";

const { RangePicker } = DatePicker;

const TransactionIn = () => {
  document.title = "MIN Register";
  const [loading, setLoading] = useState(false);
  const [asyncSelect, setAsyncSelect] = useState([]);
  const [all, setAll] = useState({
    allminAndpo: "",
    selOption: "",
  });
  const [datee, setDatee] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [poMinData, setPoMinData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const [dateRange, setDateRange] = useState("");
  const { user, notifications } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const options = [
    { label: "All MIN", value: "M" },
    { label: "PO(s) MIN", value: "P" },
  ];

  const getOption = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/searchPoByPoNo", {
        search: e,
      });
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncSelect(arr);
      // return arr;
    }
  };

  const content = (row) => (
    <div>
      <span
        style={{ fontWeight: "bold" }}
        dangerouslySetInnerHTML={{ __html: row }}
      />
    </div>
  );
  const columns = [
    { field: "DATE", headerName: "DATE & TIME", width: 170 },
    { field: "TYPE", headerName: "TRANSACTION TYPE", width: 150 },
    { field: "PART", headerName: "PART NO", width: 100 },
    {
      field: "COMPONENT",
      headerName: "COMPONENT",
      width: 200,
      renderCell: ({ row }) => (
        <Popover content={content(row?.COMPONENT)}>
          <span style={{ cursor: "pointer" }}>{row?.COMPONENT}</span>
        </Popover>
      ),
    },
    { field: "LOCATION", headerName: "IN LOCATION", width: 120 },
    { field: "RATE", headerName: "RATE", width: 100 },
    { field: "CURRENCY", headerName: "CURRENCY", width: 100 },
    { field: "INQTY", headerName: "IN QTY", width: 140 },
    {
      field: "VENDOR",
      headerName: "VENDOR",
      width: 200,
      renderCell: ({ row }) => (
        <Popover content={content(row?.VENDOR)}>
          <span style={{ cursor: "pointer" }}>{row?.VENDOR}</span>
        </Popover>
      ),
    },
    { field: "INVOIVENUMBER", headerName: "DOC.ID", width: 160 },
    { field: "TRANSACTION", headerName: "TRANSACTION ID", width: 160 },
    { field: "ISSUEBY", headerName: "BY", width: 160 },
  ];

  const callPOdata = async () => {
    setLoading(true);
    setPoMinData([]);
    const { data } = await imsAxios.post("/transaction/transactionIn", {
      min_types: all.allminAndpo,
      data: all.selOption,
    });
    if (data.code == 200) {
      setLoading(true);
      let arr = data.data.map((row) => {
        return {
          ...row,
          id: v4(),
        };
      });
      setPoMinData(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  const callMindata = async (e) => {
    setLoading(true);
    setDateData([]);
    e.preventDefault();

    const { data } = await imsAxios.post("/transaction/transactionIn", {
      min_types: all.allminAndpo,
      data: datee,
    });
    // console.log(data);
    if (data.code == 200) {
      setLoading(true);
      let arr = data.data.map((row) => {
        return {
          ...row,
          id: v4(),
        };
      });
      // toast.success(data.message);
      setDateData(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  const handleDownloadingCSV = () => {
    let newId = v4();

    socket(user?.token).emit("trans_in", {
      otherdata: JSON.stringify({ date: datee }),
      notificationId: newId,
    });
  };

  return (
    <div style={{ height: "90%" }}>
      <Row gutter={16} style={{ margin: "5px" }}>
        <Col span={5}>
          <div>
            <Select
              placeholder="Please Select Option"
              style={{ width: "100%" }}
              options={options}
              value={all.allminAndpo.value}
              onChange={(e) =>
                setAll((all) => {
                  return { ...all, allminAndpo: e };
                })
              }
            />
          </div>
        </Col>
        <>
          {all.allminAndpo == "M" ? (
            <>
              <Col span={5}>
                <div>
                  <MyDatePicker setDateRange={setDatee} size="default" />
                </div>
              </Col>
              <Col span={1}>
                <Button onClick={callMindata} type="primary">
                  Fetch
                </Button>
              </Col>
              {dateData.length > 0 && (
                <Col span={1} offset={12}>
                  <div>
                    <Button onClick={handleDownloadingCSV}>
                      <MdOutlineDownloadForOffline
                        style={{ fontSize: "20px" }}
                      />
                    </Button>
                  </div>
                </Col>
              )}
            </>
          ) : all.allminAndpo == "P" ? (
            <>
              <Col span={5}>
                <div>
                  <MyAsyncSelect
                    placeholder={"PO"}
                    style={{ width: "100%" }}
                    onBlur={() => setAsyncSelect([])}
                    loadOptions={getOption}
                    optionsState={asyncSelect}
                    value={all.selOption.value}
                    onChange={(e) =>
                      setAll((all) => {
                        return { ...all, selOption: e };
                      })
                    }
                  />
                </div>
              </Col>
              <Col span={2}>
                <Button onClick={callPOdata} type="primary">
                  Fetch
                </Button>
              </Col>
              {/* <CommonIcons
                action="downloadButton"
                onClick={handleDownloadingCSV}
              /> */}
              {/* {poMinData.length > 0 && ( */}
              <Col span={1} offset={10}>
                <div>
                  <Button onClick={handleDownloadingCSV}>
                    <MdOutlineDownloadForOffline style={{ fontSize: "20px" }} />
                  </Button>
                </div>
              </Col>
              {/* )} */}
            </>
          ) : (
            ""
          )}
        </>
      </Row>

      <div style={{ height: "93%", margin: "10px" }}>
        {all.allminAndpo == "M" ? (
          <MyDataTable loading={loading} data={dateData} columns={columns} />
        ) : (
          <MyDataTable loading={loading} data={poMinData} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default TransactionIn;
