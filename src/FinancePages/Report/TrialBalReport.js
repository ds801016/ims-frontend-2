import React, { useState } from "react";
import { imsAxios } from "../../axiosInterceptor";
import MyDatePicker from "../../Components/MyDatePicker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import { Button, Card, Form, Row, Space, Col, Skeleton } from "antd";
import { v4 } from "uuid";
import Loading from "../../Components/Loading";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadCSVCustomColumns } from "../../Components/exportToCSV";

function TrialBalReport() {
  document.title = "Trial Balance Repot";
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);

  let arr = [];

  const fetchTrialBalanceFun = async () => {
    setLoading(true);
    const { data } = await imsAxios.post("/tally/reports/trailBalanaceReport", {
      date: date,
    });
    //  console.log("All DATA->", data.data);
    setLoading(false);
    setAllData(flatArray(data.data));
  };

  const handleDownloadCSV = () => {
    let csvData = [];
    csvData = allData.map((row) => {
      return {
        Code: row.code,
        Name: row.label
          ? row.label
              .toString()
              .replaceAll("&amp;", "&")
              // .replaceAll("amp", "")
              .replaceAll(";", "")
          : " ",

        Type: row.parent
          ? row.parent == "--"
            ? "Master"
            : "Sub Group"
          : !row.type
          ? "Ledger"
          : row.type,
        Debit: row.debit && row.debit,
        "Credit.": row.credit && row.credit,
      };
    });
    // downloadCSVCustomColumns
    downloadCSVCustomColumns(csvData, "Trial Balance Report");
  };

  const flatArray = (array) => {
    array?.map((row) => {
      if (row.nodes) {
        arr = [...arr, row];
        flatArray(row.nodes);
        if (row.legers) {
          // let total row.legers.
          arr = [...arr, ...row.legers];
        }
      } else {
        arr = [...arr, row];
        if (row.legers) {
          arr = [
            ...arr,
            ...row.legers,
            {
              type: "End Total",
              label: row.label + " Total",
              debit: row.total_debit,
              credit: row.total_credit,
            },
          ];
        }
      }
    });
    arr = arr.map((row) => {
      return {
        ...row,
        id: v4(),
        type: row.parent
          ? row.parent == "--"
            ? "Master"
            : "Sub Group"
          : !row.type
          ? "Ledger"
          : row.type,
        lable:
          row.label &&
          row.label.replaceAll("&amp;", "&").replaceAll("amp", "").replaceAll(";", ""),
      };
    });
    return arr;
  };

  //   allData.map((a) => console.log(a.label));
  return (
    <div
      style={
        {
          //   position: "relative",
          //   width: "100%",
          //   height: "90%",
          //   padding: "0 10px",
          //   overflow: "hidden",
        }
      }
    >
      <Row gutter={16} style={{ margin: "5px" }}>
        <Col span={5}>
          <MyDatePicker setDateRange={setDate} size="default" />
        </Col>
        <Col span={1}>
          <Button
            loading={loading}
            type={date ? "primary" : "default"}
            onClick={fetchTrialBalanceFun}
          >
            Fetch
          </Button>
        </Col>
        <Col span={1} offset={17}>
          <Button
            disabled={allData.length > 0 ? false : true}
            type={allData.length > 0 ? "primary" : "default"}
            onClick={handleDownloadCSV}
          >
            <DownloadOutlined />
          </Button>
        </Col>
      </Row>
      <Card size="small" style={{ height: "92%", margin: "10px" }}>
        <TableContainer sx={{ maxHeight: "75vh" }}>
          <Skeleton
            active
            loading={loading}
            paragraph={{
              rows: 15,
            }}
          >
            <Table stickyHeader sx={{ width: "100%" }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  {/* <TableCell>Opening</TableCell> */}
                  <TableCell>Debit</TableCell>
                  <TableCell>Credit</TableCell>
                  {/* <TableCell>Closing</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {allData.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* code */}
                    <TableCell
                      style={{ fontWeight: row.type === "End Total" && "bold" }}
                      component="th"
                      scope="row"
                    >
                      {row.code}
                    </TableCell>
                    {/* name */}
                    <TableCell style={{ fontWeight: row.type === "End Total" && "bold" }}>
                      {row.label}
                    </TableCell>
                    {/* type */}
                    <TableCell style={{ fontWeight: row.type === "End Total" && "bold" }}>
                      {row.parent
                        ? row.parent == "--"
                          ? "Master"
                          : "Sub Group"
                        : !row.type
                        ? "Ledger"
                        : row.type}
                    </TableCell>

                    {/* debit */}
                    <TableCell style={{ fontWeight: row.type === "End Total" && "bold" }}>
                      {row.debit}
                    </TableCell>
                    {/* credit */}
                    <TableCell style={{ fontWeight: row.type === "End Total" && "bold" }}>
                      {row.credit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Skeleton>
        </TableContainer>
      </Card>
    </div>
  );
}

export default TrialBalReport;
