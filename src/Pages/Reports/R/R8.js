import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "antd/dist/antd.css";
import moment from "moment";
import { Button, Col, DatePicker, Drawer, Row, Space } from "antd";
import AllComponent from "../Modal/AllComponent";
import { downloadCSV } from "../../../Components/exportToCSV";
import InternalNav from "../../../Components/InternalNav";
import MyDataTable from "../../../Components/MyDataTable";
import { v4 } from "uuid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { EyeFilled, CloseCircleFilled } from "@ant-design/icons";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import SingleDatePicker from "../../../Components/SingleDatePicker";
import MyDatePicker from "../../../Components/MyDatePicker";
import { imsAxios } from "../../../axiosInterceptor";

const { RangePicker } = DatePicker;

const R8 = () => {
  document.title = "Datailed Production Report";
  const [open, setOpen] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [componentData, setComponentData] = useState([]);
  const [selectDate, setSelectDate] = useState("");
  const [loading, setLoading] = useState(false);

  const columns = [
    // { field: "dt", headerName: "S.No.", width: 150 },
    { field: "mfg_id", headerName: "MFG No.", width: 120 },
    { field: "date", headerName: "Date", width: 190 },
    { field: "productsku", headerName: "SKU", width: 130 },
    { field: "fg_loc", headerName: "FG Type", width: 140 },
    { field: "mfg_qty", headerName: "PRD MFG", width: 140 },
    { field: "unit", headerName: "UOM", width: 130 },
    { field: "fg_loc", headerName: "FG Loc", width: 130 },
    { field: "user", headerName: "MFG By", width: 130 },
    {
      field: "actions",
      headerName: "View",
      width: 120,
      type: "actions",
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EyeFilled onClick={() => setOpen(row)} />}
        />,
      ],
    },
  ];

  const fetch = async () => {
    if (!selectDate) {
      toast.error("Please Select Date First Then Proceed Next Step");
    } else {
      setLoading(true);
      const { data } = await imsAxios.post("/report8", {
        date: selectDate,
        action: "search_r8",
      });

      // console.log("Product", data.response.product);
      // console.log("Component", data.response.component);

      // console.log(data.response.component, data.response.product);
      if (data.code == 200) {
        let arr = data.response.product.map((row) => {
          return {
            ...row,
            id: v4(),
          };
        });
        setResponseData(arr);
        setComponentData(data.response.component);
        setLoading(false);
      } else if (data.code == 500) {
        toast.error(data.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {}, [componentData]);

  return (
    <>
      <div style={{ height: "95%" }}>
        <Row gutter={24} style={{ margin: "0px" }}>
          <Col className="gutter-row" span={5}>
            {/* <SingleDatePicker setDate={setSelectDate} /> */}
            <MyDatePicker setDateRange={setSelectDate} size="default" />
          </Col>
          <Col className="gutter-row" span={2}>
            <Button onClick={fetch} type="primary" block>
              Fetch
            </Button>
          </Col>
        </Row>

        <div className="hide-select" style={{ height: "90%", margin: "10px" }}>
          <MyDataTable
            checkboxSelection={true}
            loading={loading}
            data={responseData}
            columns={columns}
          />
        </div>
      </div>

      <Space>
        <Drawer
          width="100vw"
          title={`Product Name: ${open?.productname}`}
          placement="right"
          closable={false}
          onClose={() => setOpen(false)}
          open={open}
          getContainer={false}
          style={{
            position: "absolute",
          }}
          extra={
            <Space>
              <CloseCircleFilled onClick={() => setOpen(false)} />
            </Space>
          }
        >
          <AllComponent
            open={open}
            setOpen={setOpen}
            component={componentData}
            setComponentData={setComponentData}
          />
        </Drawer>
      </Space>
    </>
  );
};

export default R8;
