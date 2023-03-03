import React, { useState } from "react";
import { Button, Col, Row, Select } from "antd";
import MyDatePicker from "../../../Components/MyDatePicker";
import axios from "axios";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import MyDataTable from "../../../Components/MyDataTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { EyeFilled, CloseCircleFilled } from "@ant-design/icons";
import CashReceiptModal from "./model/CashReceiptModal";
import { imsAxios } from "../../../axiosInterceptor";

function CashReceiptReport() {
  const selevalue = [{ label: "Date Wise", value: "date_wise" }];
  const [allData, setAllData] = useState({
    selType: "",
  });
  const [open, setOpen] = useState(false);
  const [datee, setDatee] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateData, setDateData] = useState([]);

  //   console.log(dateData);

  const fetchData = async () => {
    setDateData([]);
    setLoading(true);
    const { data } = await imsAxios.post("/tally/cash/cashreceipt_list", {
      wise: allData.selType,
      data: datee,
    });
    //  console.log(data);
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
    { field: "ref_date", headerName: "DATE", width: 100 },
    { field: "bank_name", headerName: "BANK NAME", width: 400 },
    { field: "perticular", headerName: "PERTICULAR", width: 250 },
    { field: "perticular_code", headerName: "BANK CODE", width: 100 },
    { field: "which_module", headerName: "VOUCHER TYPE", width: 120 },
    { field: "module_used", headerName: "VOUCHER ID", width: 180 },
    { field: "payment", headerName: "PAYMENT", width: 140 },
    { field: "comment", headerName: "COMMENT", width: 140 },
    { field: "status", headerName: "STATUS", width: 140 },
  ];

  return (
    <>
      <div style={{ height: "90%" }}>
        <Row gutter={10} style={{ margin: "5px" }}>
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
          <Col span={5}>
            <MyDatePicker setDateRange={setDatee} size="default" />
          </Col>
          <Col span={1}>
            <Button loading={loading} type="primary" onClick={fetchData}>
              Fetch
            </Button>
          </Col>
        </Row>
        <div style={{ height: "87%", margin: "10px" }}>
          <MyDataTable
            //  checkboxSelection={true}
            loading={loading}
            data={dateData}
            columns={columns}
          />
        </div>
      </div>
      <CashReceiptModal setOpen={setOpen} open={open} />
    </>
  );
}

export default CashReceiptReport;
