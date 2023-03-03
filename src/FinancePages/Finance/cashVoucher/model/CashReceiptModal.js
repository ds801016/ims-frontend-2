import React, { useEffect, useState } from "react";
import { Col, Drawer, Row, Space, Tooltip } from "antd";
import { EyeFilled, CloseCircleFilled, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { v4 } from "uuid";
import MyDataTable from "../../../../Components/MyDataTable";
import { imsAxios } from "../../../../axiosInterceptor";

function CashReceiptModal({ open, setOpen }) {
  const [cashReceiptRow, setCashReceiptRow] = useState([]);
  //   console.log(open);
  const getAllDataFetch = async () => {
    const { data } = await imsAxios.post("/tally/cash/cash_report", {
      v_code: open,
    });
    if (data.code == 200) {
      // setFetch(data.data[0].insert_date);

      const arr = data.data.map((row) => {
        return {
          ...row,
          id: v4(),
        };
      });
      setCashReceiptRow(arr);
    }
  };

  const columns = [
    {
      headerName: "GL Code",
      field: "value",
      flex: 1,
      sortable: false,
    },
    {
      headerName: "Payment",
      renderCell: ({ row }) => row.debit,
      //   row.which_module == "BP" ? <span>{row.debit}</span> : <span>{row.credit}</span>,

      field: "type",
      flex: 1,
      sortable: false,
    },
    {
      headerName: "Comment",
      //   width: "12.5vw",
      flex: 1,
      field: "comment",
      renderCell: ({ row }) => (
        <Tooltip title={row.comment}>{row.comment}</Tooltip>
      ),
      sortable: false,
    },
  ];

  useEffect(() => {
    if (open) {
      getAllDataFetch();
    }
  }, [open]);
  return (
    <Space>
      <Drawer
        width="50vw"
        height="100vh"
        title={`Cash Receipt Voucher: ${open}`}
        //   title={<CloseOutlined onClick={() => setOpen(false)} />}
        placement="right"
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        getContainer={false}
        //   style={{
        //     position: "absolute",
        //   }}
        extra={
          <Space>
            <CloseOutlined onClick={() => setOpen(false)} />
          </Space>
        }
      >
        <>
          <Row justify="space-between">
            <Col span={24} style={{ padding: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Created</span>
                <span>Voucher Type :{cashReceiptRow[0]?.which_module}</span>
              </div>
            </Col>
            <Col span={24} style={{ padding: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{cashReceiptRow[0]?.insert_date}</span>
                <span>Account: {cashReceiptRow[0]?.account_name}</span>
              </div>
            </Col>
            <Col span={24} style={{ padding: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Effective Date: </span>
              </div>
            </Col>
            <Col span={24} style={{ padding: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span> {cashReceiptRow[0]?.ref_date}</span>
              </div>
            </Col>
          </Row>
          <div
            className="remove-table-footer"
            style={{ height: "75%", paddingTop: "10px" }}
          >
            <MyDataTable data={cashReceiptRow} columns={columns} />
          </div>
        </>
      </Drawer>
    </Space>
  );
}

export default CashReceiptModal;
