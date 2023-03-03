import { Button, Col, Row, Typography } from "antd";
import React, { useState } from "react";
import { imsAxios } from "../../../axiosInterceptor";
import MyDataTable from "../../../Components/MyDataTable";
import { v4 } from "uuid";
import ToolTipEllipses from "../../../Components/ToolTipEllipses";
import { downloadCSV } from "../../../Components/exportToCSV";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";

function R18() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const getRows = async () => {
    setFetchLoading(true);
    const { data } = await imsAxios.post("/report18");
    setFetchLoading(false);
    let headers = [];
    if (data.code === 200) {
      let location = {};
      let arr = data.data.map((row) => {
        let obj = JSON.parse(row.locations);
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            location = { ...location, [key]: obj[key] };
          }
        }
        return {
          ...location,
          component: row.component,
          part: row.part,
          id: v4(),
        };
      });

      let locations = JSON.parse(data.data[0].locations);
      for (const key in locations) {
        if (locations.hasOwnProperty(key)) {
          location = { headerName: key };
        }
        headers.push(location);
      }
      headers = headers.map((row) => {
        return {
          headerName: row.headerName,
          width: 100,
          field: row.headerName,
        };
      });
      headers = [
        {
          headerName: "Component",
          width: 200,
          renderCell: ({ row }) => <ToolTipEllipses text={row.component} />,
          field: "component",
        },
        {
          headerName: "Part",
          width: 150,
          renderCell: ({ row }) => <ToolTipEllipses text={row.part} />,
          field: "part",
        },
        ...headers,
      ];
      setColumns(headers);
      setRows(arr);
    }
  };
  const handleDownloadCSV = () => {
    downloadCSV(rows, columns, "R18 Report");
  };
  return (
    <Row style={{ height: "90%", padding: "0px 10px" }}>
      <Col span={24}>
        <Row justify="space-between">
          <Button loading={fetchLoading} onClick={getRows} type="primary">
            Generate
          </Button>
          <CommonIcons action="downloadButton" onClick={handleDownloadCSV} />
        </Row>
      </Col>
      <Col
        className="hide-select"
        span={24}
        style={{ height: "95%", marginTop: 5 }}
      >
        {(rows.length > 0 || fetchLoading) && (
          <MyDataTable loading={fetchLoading} data={rows} columns={columns} />
        )}
        {rows.length === 0 && !fetchLoading && (
          <>
            <Typography.Title
              level={4}
              style={{ textAlign: "center", color: "darkslategray" }}
            >
              Click Generate button to generate the report
            </Typography.Title>
          </>
        )}
      </Col>
    </Row>
  );
}

export default R18;
