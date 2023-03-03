import React, { useEffect, useState } from "react";
import { Col, Drawer, Row, Space, Tooltip } from "antd";
import { EyeFilled, CloseCircleFilled, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { v4 } from "uuid";
import MyDataTable from "../../../../Components/MyDataTable";
import { imsAxios } from "../../../../axiosInterceptor";

function CashPaymentModal({ setOpen, open }) {
  const [fetch, setFetch] = useState("");
  const [loading, setLoading] = useState(false);
  const [voucherRows, setVoucherRows] = useState([]);
  const [voucherType, setVoucherType] = useState("");
  //   console.log(voucherRows[0].account_name);

  const getFetchData = async () => {
    if (open) {
      setLoading(true);
      const { data } = await imsAxios.post("/tally/cash/cash_report", {
        v_code: open,
      });
      setFetch(data?.data);
      setVoucherType(data.data[0].which_module);
      if (data.code == 200) {
        setFetch(data.data[0].insert_date);

        const arr = data.data.map((row) => {
          return {
            ...row,
            id: v4(),
          };
        });
        setVoucherRows(arr);
      }
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
      getFetchData();
    }
  }, [open]);
  return (
    <Space>
      <Drawer
        width="50vw"
        height="100vh"
        title={`Cash Payment Voucher: ${open}`}
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
        <div
          style={{
            justifyContent: "space-between",
            display: "flex",
            padding: "5px",
          }}
        >
          <span>Created Date</span>
          <span>Voucher Type: {voucherType}</span>
        </div>
        <div
          style={{
            justifyContent: "space-between",
            display: "flex",
            padding: "5px",
          }}
        >
          <span>{fetch}</span>
          <span>Account: {voucherRows[0]?.account_name}</span>
        </div>
        <div
          style={{
            padding: "5px",
          }}
        >
          <span>Effective Date: </span>
        </div>
        <div
          style={{
            padding: "5px",
          }}
        >
          <span>{voucherRows[0]?.ref_date}</span>
        </div>
        <div
          className="remove-table-footer"
          style={{ height: "75%", paddingTop: "10px" }}
        >
          <MyDataTable data={voucherRows} columns={columns} />
        </div>
      </Drawer>
    </Space>
  );
}

export default CashPaymentModal;
