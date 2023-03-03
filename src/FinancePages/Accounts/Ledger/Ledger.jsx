import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MyDataTable from "../../../Components/MyDataTable";
import MySelect from "../../../Components/MySelect";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { v4 } from "uuid";
import { Card, Col, Row, Tabs } from "antd";
import EditLedger from "./EditLedger";

import ToolTipEllipses from "../../../Components/ToolTipEllipses";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";
import { downloadCSV } from "../../../Components/exportToCSV";
import MapClient from "./MapClient";
import AddLedger from "./AddLedger";
import MapVendor from "./MapVendor";
import { imsAxios } from "../../../axiosInterceptor";

export default function CreateMaster() {
  document.title = "Create Ledger";
  const [ledgerList, setLedgerList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const columns = [
    {
      headerName: "Sr. No",
      field: "index",
      width: 60,
    },
    {
      headerName: "Name",
      field: "ladger_name",
      renderCell: ({ row }) => <ToolTipEllipses text={row.ladger_name} />,
      width: 200,
    },
    {
      headerName: "Code",
      field: "ladger_code",
      width: 120,
    },
    {
      headerName: "Search Name",
      field: "search_name",
      width: 150,
    },
    {
      headerName: "Group Name",
      field: "subgroup",
      renderCell: ({ row }) => <ToolTipEllipses text={row.subgroup} />,
      width: 200,
    },
    {
      headerName: "GST Applicable",
      field: "gst",
    },
    {
      headerName: "TDS Applicable",
      field: "tds",
    },
    {
      headerName: "Account Status",
      field: "account_status",
      width: 150,
    },
  ];
  const getLedgerList = async () => {
    setTableLoading(true);
    const { data } = await imsAxios.get("/tally/ledger/listAllLedger");
    if (data.code == 200) {
      const arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setTableLoading(false);
      setLedgerList(arr);
    }
  };

  const options = [
    { text: "YES", value: "yes" },
    { text: "NO", value: "no" },
  ];
  const statusOptions = [
    { text: "ACTIVE", value: "active" },
    { text: "INACTIVE", value: "inactive" },
  ];

  useEffect(() => {
    getLedgerList();
  }, []);
  return (
    <div style={{ height: "90%" }}>
      <Row gutter={8} style={{ height: "100%", padding: "0px 10px" }}>
        <Col span={12}>
          <Tabs type="card" size="small">
            {/* add ledger */}
            <Tabs.TabPane tab="Add new Ledger" key="1">
              <AddLedger
                getLedgerList={getLedgerList}
                options={options}
                statusOptions={statusOptions}
              />
            </Tabs.TabPane>
            {/*edit ledger  */}
            <Tabs.TabPane tab="Edit Ledger" key="2">
              <Card title="Edit Ledger" size="small">
                <EditLedger getLedgerList={getLedgerList} />
              </Card>
            </Tabs.TabPane>
            {/* map vendor */}
            <Tabs.TabPane tab="Map Vendor" key="3">
              <MapVendor statusOptions={statusOptions} options={options} />
            </Tabs.TabPane>
            {/* map customer */}
            <Tabs.TabPane tab="Map Customer" key="4">
              <MapClient />
            </Tabs.TabPane>
          </Tabs>
        </Col>
        {/* add form column ends */}
        <Col style={{ padding: "10px 0px", height: "95%" }} span={12}>
          <Row justify="end" style={{ marginBottom: 10 }}>
            <CommonIcons
              action="downloadButton"
              onClick={() => downloadCSV(ledgerList, columns, "Ledgers")}
            />
          </Row>
          <MyDataTable
            loading={tableLoading}
            columns={columns}
            data={ledgerList}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
        </Col>
      </Row>
      {/* </div> */}
    </div>
  );
}
