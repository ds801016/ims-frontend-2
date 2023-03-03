import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { toast } from "react-toastify";
import "antd/dist/antd.css";
import { Button, Col, Popover, Row } from "antd";
import axios from "axios";
import MyDataTable from "../../../Components/MyDataTable";
import { v4 } from "uuid";
import InternalNav from "../../../Components/InternalNav";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import MyDatePicker from "../../../Components/MyDatePicker";
import { setNotifications } from "../../../Features/loginSlice.js/loginSlice";
import socket from "../../../Components/socket";
import { downloadCSVCustomColumns } from "../../../Components/exportToCSV";
import { imsAxios } from "../../../axiosInterceptor";

const TransactionOut = () => {
  document.title = "MIN Issue Register";
  const [loading, setLoading] = useState(false);
  const [datee, setDatee] = useState("");
  const [dateData, setDateData] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { user, notifications } = useSelector((state) => state.login);

  const content1 = (row) => (
    <div>
      <span
        style={{ fontWeight: "bold" }}
        dangerouslySetInnerHTML={{ __html: row }}
      />
    </div>
  );

  const columns = [
    { field: "DATE", headerName: "DATE", width: 170 },
    { field: "TYPE", headerName: "TYPE", width: 100 },
    { field: "PART", headerName: "PART NO", width: 150 },
    { field: "COMPONENT", headerName: "COMPONENT", width: 400 },
    { field: "FROMLOCATION", headerName: "FROM LOCATION", width: 160 },
    { field: "TOLOCATION", headerName: "TO LOCATION", width: 160 },
    { field: "OUTQTY", headerName: "OUT QTY", width: 140 },
    { field: "UNIT", headerName: "UOM", width: 140 },
    {
      field: "VENDORCODE",
      headerName: "VENDOR",
      width: 160,
      renderCell: ({ row }) => (
        // console.log(row),
        <Popover content={content1(row?.VENDORNAME)}>
          <span style={{ fontWeight: "bolder", cursor: "pointer" }}>
            {row?.VENDORCODE}
          </span>
        </Popover>
      ),
    },
    { field: "REQUESTEDBY", headerName: "REQUESTED BY", width: 160 },
    { field: "ISSUEBY", headerName: "APPROVED BY", width: 160 },
  ];

  const handleDownloadingCSV = () => {
    let newId = v4();
    socket(user?.token).emit("trans_out", {
      otherdata: JSON.stringify({ date: datee }),
      notificationId: newId,
    });
  };
  // console.log(datee);

  const rmIssue = async (e) => {
    e.preventDefault();

    if (!datee[0] || !datee[1]) {
      toast.error("a");
    } else {
      setLoading(true);
      setDateData([]);
      const { data } = await imsAxios.post("/transaction/transactionOut", {
        data: datee,
      });
      // console.log("Response", data);
      if (data.code == 200) {
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
    }
  };

  useEffect(() => {
    const ress = dateData.filter((a) => {
      return a.PART.toLowerCase().match(search.toLowerCase());
    });
    setFetchData(ress);
  }, [search]);

  // console.log(dateData);
  return (
    <div style={{ height: "95%" }}>
      <Row gutter={10} style={{ margin: "5px" }}>
        <Col span={5}>
          <MyDatePicker setDateRange={setDatee} size="default" />
        </Col>
        <Col span={2}>
          <Button onClick={rmIssue} loading={loading} block type="primary">
            Fetch
          </Button>
        </Col>
        {/* {dateData.length > 0 && ( */}
        <Col span={1} offset={16}>
          <div>
            <Button onClick={handleDownloadingCSV}>
              <MdOutlineDownloadForOffline style={{ fontSize: "20px" }} />
            </Button>
          </div>
        </Col>
        {/* // )} */}
      </Row>
      <div style={{ height: "87%", margin: "10px" }}>
        <MyDataTable loading={loading} data={dateData} columns={columns} />
      </div>
    </div>
  );
};

export default TransactionOut;

{
  /* <div
  className="m-3 p-2"
  style={{
    display: "flex",
    justifyContent: "end",
  }}
>
  <div>
    <FaDownload
      size={20}
      className="cursorr"
      color="#5D7788"
      onClick={handleDownloadingCSV}
    />
  </div>
</div>

<form>
  <div
    className="m-3"
    style={{
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <div>
      <RangePicker
        style={{ minHeight: "40px" }}
        onChange={(e) => {
          setDatee(
            e.map((item) => {
              return moment(item).format("DD-MM-YYYY");
            })
          );
        }}
      />
      <button className="btn btn-secondary px-5" onClick={rmIssue}>
        Fetch
      </button>
    </div>
    <div>
      <input
        placeholder="Enter Part No"
        type="no"
        className="form-control"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>
</form>

{loading ? (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
    }}
  >
    <Lottie animationData={waiting} loop={true} style={{ height: "220px" }} />
  </div>
) : (
  <div className="m-2">
    <DataTable
      fixedHeader="true"
      fixedHeaderScrollHeight={"420px"}
      data={fetchData}
      columns={col}
      customStyles={customStyles}
      pagination
      pointerOnHover
    />
  </div>
)} */
}
