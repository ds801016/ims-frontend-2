import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import { Button, Col, DatePicker, Row, Select } from "antd";
import { downloadCSVCustomColumns } from "../../../Components/exportToCSV";
import { v4 } from "uuid";
import MyDataTable from "../../../Components/MyDataTable";
import MyDatePicker from "../../../Components/MyDatePicker";
import { imsAxios } from "../../../axiosInterceptor";

const { RangePicker } = DatePicker;

function ViewTransaction() {
  document.title = "View Transaction";
  const [loading, setLoading] = useState(false);
  const options = [{ label: "Date Wise", value: "datewise" }];
  const [allData, setAllData] = useState({
    selectdate: "",
  });
  const [datee, setDatee] = useState("");
  const [dataComesFromDateWise, setDataComesFromDateWise] = useState([]);
  console.log(dataComesFromDateWise);
  const col = [
    { name: "Date", selector: (row) => row.date },
    { name: "Part", selector: (row) => row.part },
    { name: "Component", selector: (row) => row.name },
    { name: "Out Location", selector: (row) => row.out_location },
    { name: "In Location", selector: (row) => row.in_location },
    { name: "Qty", selector: (row) => row.qty },
    { name: "UOM", selector: (row) => row.uom },
    { name: "Txd In", selector: (row) => row.transaction },
    { name: "Shiffed By", selector: (row) => row.date },
  ];

  const columns = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "part", headerName: "Part", width: 150 },
    { field: "name", headerName: "Component", width: 250 },
    { field: "out_location", headerName: "Out Location", width: 150 },
    { field: "in_location", headerName: "In Location", width: 150 },
    { field: "uom", headerName: "Qty", width: 100 },
    { field: "transaction", headerName: "Transaction In", width: 150 },
    { field: "completed_by", headerName: "Shiffed By", width: 150 },
  ];
  const handleDownloadingCSV = () => {
    let arr = [];
    let csvData = [];
    arr = dataComesFromDateWise;
    csvData = arr.map((row) => {
      return {
        Date: row.approvedate,
        Part: row.part,
        Component: row.name,
        "Out Location": row.out_location,
        "In Location": row.in_location,
        Qty: row.qty,
        Uom: row.uom,
        "Txd In": row.transaction,
        "Shiffed By": row.data,
      };
    });
    downloadCSVCustomColumns(csvData, "View Transaction");
  };

  const dateWise = async (e) => {
    e.preventDefault();
    if (!allData.selectdate) {
      toast.error("Please Select Mode Then Proceed Next");
    } else if (!datee[0]) {
      toast.error("Please Select Date");
    } else {
      setLoading(true);

      // console.log("datee->>>", c);

      const { data } = await imsAxios.post("/godown/report_rmsf_same", {
        data: datee,
        wise: allData.selectdate,
      });
      // console.log(data);
      if (data.code == 200) {
        let arr = data.data.map((row) => {
          return {
            ...row,
            id: v4(),
          };
        });
        setDataComesFromDateWise(arr);
        setLoading(false);
      } else if (data.code == 500) {
        toast.error(data.message.msg);
        setLoading(false);
      }
    }
  };
  return (
    <div style={{ height: "90%" }}>
      <Row gutter={16} style={{ margin: "10px" }}>
        <Col span={4} className="gutter-row">
          <div>
            <Select
              options={options}
              style={{ width: "100%" }}
              placeholder="Select"
              value={allData.selectdate}
              onChange={(e) =>
                setAllData((allData) => {
                  return { ...allData, selectdate: e };
                })
              }
            />
          </div>
        </Col>
        <Col span={5} className="gutter-row">
          <MyDatePicker size="default" setDateRange={setDatee} />
        </Col>
        <Col span={1} className="gutter-row">
          <div>
            <Button onClick={dateWise} loading={loading} type="primary">
              Fetch
            </Button>
          </div>
        </Col>
        {dataComesFromDateWise.length > 1 && (
          <Col span={1} offset={12} className="gutter-row">
            <div>
              <Button
                onClick={handleDownloadingCSV}
                style={{
                  backgroundColor: "#4090FF",
                  color: "white",
                  marginLeft: "60px",
                }}
              >
                <FaDownload />
              </Button>
            </div>
          </Col>
        )}
      </Row>
      <div style={{ height: "90%", margin: "10px" }}>
        <MyDataTable
          loading={loading}
          data={dataComesFromDateWise}
          columns={columns}
        />
      </div>
    </div>
  );
}

export default ViewTransaction;

// <form>
//   <div className="d-flex justify-content-between m-3 mt-4">
//     <div className="d-flex">
//       <div className="mr-2" style={{ width: "150px" }}>
//         <Select
//           options={options}
//           placeholder="Select"
//           value={allData.selectdate}
//           onChange={(e) =>
//             setAllData((allData) => {
//               return { ...allData, selectdate: e };
//             })
//           }
//         />
//       </div>
//       <>
//         <div>
//           <RangePicker
//             style={{
//               minHeight: "39px",
//               borderRadius: "4px",
//               width: "300px",
//             }}
//             onChange={(e) => {
//               setDatee(
//                 e.map((item) => {
//                   return moment(item).format("DD-MM-YYYY");
//                 })
//               );
//             }}
//           />
//         </div>
//         <div>
//           <button className="btn btn-secondary" type="button" onClick={dateWise}>
//             Date Wise
//           </button>
//         </div>
//       </>
//     </div>
//     <div className="cursorr">
//       <FaDownload size={20} color="#5D7788" onClick={handleDownloadingCSV} />
//     </div>
//   </div>
// </form>

// {loading ? (
//   <div
//     style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: "70vh",
//       zIndex: "999999",
//     }}
//   >
//     <Lottie animationData={waiting} loop={true} style={{ height: "200px" }} />
//   </div>
// ) : (
//   <div className="m-2">
//     <DataTable
//       fixedHeader="true"
//       fixedHeaderScrollHeight={"55vh"}
//       data={dataComesFromDateWise}
//       customStyles={customStyles}
//       columns={col}
//       pagination
//       highlightOnHover
//       pointerOnHover
//     />
//   </div>
// )}
