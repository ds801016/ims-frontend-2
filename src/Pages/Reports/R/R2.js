import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "antd/dist/antd.css";
import { Button, Col, DatePicker, Row, Select } from "antd";
import { downloadCSVCustomColumns } from "../../../Components/exportToCSV";
import MyDataTable from "../../../Components/MyDataTable";
import { v4 } from "uuid";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import MyDatePicker from "../../../Components/MyDatePicker";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { imsAxios } from "../../../axiosInterceptor";

// const { RangePicker } = DatePicker;

const R2 = () => {
  document.title = "PO Report";
  const [datee, setDatee] = useState("");
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState({
    selType: "",
    part: "",
  });
  const [responseData, setResponseData] = useState([]);
  const [responsePartData, setResponsePartData] = useState([]);

  const [asyncOptions, setAsyncOptions] = useState([]);

  const options = [
    { label: "All", value: "A" },
    { label: "Pending", value: "P" },
    { label: "Project", value: "PROJECT" },
  ];

  const columns = [
    { field: "slno", headerName: "Sr. No.", width: 8 },
    { field: "reg_date", headerName: "PO DATE", width: 100 },
    { field: "reg_by", headerName: "CREATE BY", width: 130 },
    {
      field: "po_order_id",
      headerName: "PO ORDER ID",
      width: 120,
    },
    { field: "part_no", headerName: "PART", width: 100 },
    { field: "component_name", headerName: "COMPONENT", width: 350 },
    { field: "unit_name", headerName: "UOM", width: 80 },
    { field: "po_rate", headerName: "RATE", width: 100 },
    { field: "ordered_qty", headerName: "ORDER QTY", width: 120 },
    { field: "ordered_pending", headerName: "PENDING Qty", width: 150 },
    { field: "vendor_code", headerName: "VENDOR CODE", width: 100 },
    { field: "vendor_name", headerName: "VENDOR NAME", width: 280 },
    { field: "due_date", headerName: "DUE DATE", width: 100 },
    { field: "po_cost_center", headerName: "COST CENTER", width: 150 },
    { field: "po_project", headerName: "PROJECT NAME", width: 120 },
  ];

  const handleDownloadingCSV = () => {
    let arr = [];
    let csvData = [];
    arr = responseData;
    csvData = arr.map((row) => {
      return {
        SNO: row.slno,
        "PO Date": row.reg_date,
        "Created By": row.reg_by,
        "PO Order ID": row.po_order_id,
        Part: row.part_no,
        Component: row.component_name,
        UOM: row.unit_name,
        Rate: row.po_rate,
        "Order Qty": row.ordered_qty,
        "Pending Qty": row.ordered_pending,
        "Vendor Code": row.vendor_code,
        "Vendor name": row.vendor_name,
        "Due Date": row.due_date,
        "Cost Center": row.po_cost_center,
        "Project Name": row.po_project,
      };
    });
    downloadCSVCustomColumns(csvData, "PO Report");
  };

  const handleDownloadingCSV1 = () => {
    let arr = [];
    let csvData = [];
    arr = responsePartData;
    csvData = arr.map((row) => {
      return {
        SNO: row.slno,
        "PO Date": row.reg_date,
        "Created By": row.reg_by,
        "PO Order ID": row.po_order_id,
        Part: row.part_no,
        Component: row.component_name,
        UOM: row.unit_name,
        Rate: row.po_rate,
        "Order Qty": row.ordered_qty,
        "Pending Qty": row.ordered_pending,
        "Vendor Code": row.vendor_code,
        "Vendor name": row.vendor_name,
        "Due Date": row.due_date,
        "Cost Center": row.po_cost_center,
        "Project Name": row.po_project,
      };
    });
    downloadCSVCustomColumns(csvData, "PO Report");
  };

  const fetch = async () => {
    // console.log(c)
    if (!allData.selType) {
      toast.error("Please Select Type");
    } else if (!datee[0]) {
      toast.error("Please Select Date First");
    } else {
      setResponseData([]);
      setLoading(true);
      const { data } = await imsAxios.post("/report2", {
        data: datee,
        wise: allData?.selType,
      });
      if (data.code == 200) {
        // setLoading(true);
        toast.success(data.message);
        let arr = data.response.data.map((row) => {
          return {
            ...row,
            id: v4(),
          };
        });
        setResponseData(arr);
        setLoading(false);
      } else if (data.code == 500) {
        toast.error(data.message.msg);
        setLoading(false);
      }
    }
  };

  const fetchPart = async () => {
    setResponsePartData([]);
    setLoading(true);
    const { data } = await imsAxios.post("/report2", {
      data: allData.part,
      wise: allData?.selType,
    });
    if (data.code == 200) {
      // setLoading(true);
      toast.success(data.message);
      let arr = data.response.data.map((row) => {
        return {
          ...row,
          id: v4(),
        };
      });
      setResponsePartData(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  const getOption = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/poProjectName", {
        search: e,
      });
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  return (
    <div style={{ height: "90%" }}>
      <Row gutter={16} style={{ margin: "5px" }}>
        <Col span={3}>
          <Select
            placeholder="Select Option"
            options={options}
            value={allData?.selType.value}
            onChange={(e) =>
              setAllData((allData) => {
                return { ...allData, selType: e };
              })
            }
            style={{
              width: "100%",
            }}
          />
        </Col>
        {allData.selType == "A" || allData.selType == "P" ? (
          <>
            <Col span={4}>
              <MyDatePicker size="default" setDateRange={setDatee} />
            </Col>
            <Col span={1}>
              <Button onClick={fetch} type="primary">
                Fetch
              </Button>
            </Col>
            {responseData.length > 1 && (
              <Col span={1} offset={15}>
                <Button onClick={handleDownloadingCSV}>
                  <MdOutlineDownloadForOffline style={{ fontSize: "20px" }} />
                </Button>
              </Col>
            )}
          </>
        ) : allData.selType == "PROJECT" ? (
          <>
            <Col span={4} className="gutter-row">
              <MyAsyncSelect
                style={{ width: "100%" }}
                onBlur={() => setAsyncOptions([])}
                loadOptions={getOption}
                value={allData.part}
                optionsState={asyncOptions}
                onChange={(e) =>
                  setAllData((allData) => {
                    return { ...allData, part: e };
                  })
                }
                placeholder="Part/Name"
              />
            </Col>
            <Col span={2} className="gutter-row">
              <Button onClick={fetchPart} type="primary">
                Fetch
              </Button>
            </Col>
            {responsePartData.length > 1 && (
              <Col span={1} offset={14} className="gutter-row">
                <Button onClick={handleDownloadingCSV1}>
                  <MdOutlineDownloadForOffline style={{ fontSize: "20px" }} />
                </Button>
              </Col>
            )}
          </>
        ) : (
          ""
        )}
      </Row>

      <div className="hide-select" style={{ height: "95%", margin: "10px" }}>
        {allData.selType == "A" || allData.selType == "P" ? (
          <MyDataTable
            loading={loading}
            data={responseData}
            columns={columns}
            checkboxSelection={true}
          />
        ) : (
          <MyDataTable
            checkboxSelection={true}
            loading={loading}
            data={responsePartData}
            columns={columns}
          />
        )}
        {/* )} */}
      </div>
    </div>
  );
};

export default R2;
