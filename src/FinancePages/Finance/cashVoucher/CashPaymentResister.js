import React, { useState } from "react";
import { Button, Col, Row, Select } from "antd";
import MyDatePicker from "../../../Components/MyDatePicker";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import MyDataTable from "../../../Components/MyDataTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { EyeFilled, CloseCircleFilled } from "@ant-design/icons";
import CashPaymentModal from "./model/CashPaymentModal";
import { imsAxios } from "../../../axiosInterceptor";
import ToolTipEllipses from "../../../Components/ToolTipEllipses";

function CashPaymentResister() {
  document.title = "Cash Payment register";
  const [open, setOpen] = useState(null);
  const [datee, setDatee] = useState("");
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState({
    selType: "",
  });
  const selevalue = [{ label: "Date Wise", value: "date_wise" }];
  const [dateData, setDateData] = useState([]);
  //   console.log(dateData);

  const fetchData = async () => {
    setDateData([]);
    setLoading(true);
    const { data } = await imsAxios.post("/tally/cash/cashpayment_list", {
      wise: allData.selType,
      data: datee,
    });
    if (data.code == 200) {
      let arr = data?.data?.map((row) => {
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
  };

  const columns = [
    {
      field: "actions",
      headerName: "View",
      width: 100,
      type: "actions",
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EyeFilled onClick={() => setOpen(row?.module_used)} />}
        />,
      ],
    },
    { field: "ref_date", headerName: "DATE", width: 120 },
    { field: "bank_name", headerName: "BANK NAME", width: 180 },
    { field: "perticular", headerName: "PERTICULAR", width: 250 },
    { field: "perticular_code", headerName: "PERTICULAR CODE", width: 160 },
    { field: "which_module", headerName: "VOUCHER TYPE", width: 120 },
    {
      field: "module_used",
      headerName: "VOUCHER ID",
      width: 200,
      renderCell: ({ row }) => (
        <ToolTipEllipses copy={true} text={row.module_used}>
          {row?.module_used}
        </ToolTipEllipses>
      ),
    },
    { field: "payment", headerName: "PAYMENT", width: 140 },
    {
      field: "comment",
      headerName: "COMMENT",
      width: 240,
      renderCell: ({ row }) => (
        <ToolTipEllipses text={row.comment}>{row?.comment}</ToolTipEllipses>
      ),
    },
    { field: "status", headerName: "STATUS", width: 140 },
  ];

  return (
    <>
      <div style={{ height: "90%", margin: "10px" }}>
        <Row gutter={10}>
          <Col span={4}>
            <Select
              options={selevalue}
              style={{ width: "100%" }}
              value={allData?.selType.value}
              placeholder="Select option"
              onChange={(e) =>
                setAllData((allData) => {
                  return { ...allData, selType: e };
                })
              }
            />
          </Col>
          <Col span={4}>
            <MyDatePicker setDateRange={setDatee} size="default" />
          </Col>
          <Col span={1}>
            <Button loading={loading} type="primary" onClick={fetchData}>
              Fecth
            </Button>
          </Col>
        </Row>
        <div style={{ height: "87%", marginTop: "5px" }}>
          <MyDataTable
            //  checkboxSelection={true}
            loading={loading}
            data={dateData}
            columns={columns}
          />
        </div>
      </div>

      <CashPaymentModal setOpen={setOpen} open={open} />
    </>
  );
}

export default CashPaymentResister;
