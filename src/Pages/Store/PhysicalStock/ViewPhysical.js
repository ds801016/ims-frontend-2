import React, { useState, useEffect } from "react";
import { Button, Col, DatePicker, Row, Select, Space } from "antd";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import MyDataTable from "../../../Components/MyDataTable";
import MyDatePicker from "../../../Components/MyDatePicker";
import { imsAxios } from "../../../axiosInterceptor";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";
import { downloadCSV } from "../../../Components/exportToCSV";

const { RangePicker } = DatePicker;

function ViewPhysical() {
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [dateDataFrom, setDateDataFrom] = useState([]);
  const [partDataFrom, setpartDataFrom] = useState([]);
  const [loading, setLoading] = useState(false);
  const datevspart = [
    { label: "Date", value: "datewise" },
    { label: "Part", value: "partwise" },
  ];

  const [datee, setDatee] = useState("");

  const [allData, setAllData] = useState({
    selType: "",
    part: "",
  });

  const getOption = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/getComponentByNameAndNo", {
        search: e,
      });
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const dataDateWise = async () => {
    setLoading(true);

    const { data } = await imsAxios.post("/audit/fetchAudit", {
      searchBy: allData.selType,
      searchValue: datee,
    });
    if (data.code == 200) {
      let arr = data.response.data.map((row) => {
        return { ...row, id: v4() };
      });
      setDateDataFrom(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message);
      setLoading(false);
    }
    // setLoading(false);

    // console.log(data.response.data);
  };

  const fetchByPart = async () => {
    setLoading(true);
    const { data } = await imsAxios.post("/audit/fetchAudit", {
      searchBy: allData.selType,
      searchValue: allData.part,
    });
    if (data.code == 200) {
      let arr = data.response.data.map((row) => {
        return { ...row, id: v4() };
      });
      setpartDataFrom(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message);
      setLoading(false);
    }
  };

  const columns = [
    // { field: "ID", headerName: "Serial No", width: 100 },
    { field: "dt", headerName: "Date", width: 180 },
    { field: "name", headerName: "Part Name", width: 350 },
    { field: "part", headerName: "Part No", width: 100 },
    { field: "uom", headerName: "Uom", width: 100 },
    { field: "cl", headerName: "Ims Stock", width: 100 },
    { field: "rm", headerName: "Physical Stock", width: 150 },
    { field: "by", headerName: "Verified By", width: 150 },
    { field: "remark", headerName: "Remark", width: 250 },
  ];
  const handleDownloadCSV = () => {
    let rows = allData.selType == "datewise" ? dateDataFrom : partDataFrom;
    downloadCSV(rows, columns, "Physical Stock Report");
  };
  useEffect(() => {
    if (allData.selType.value) {
      console.log(allData);
    }
  }, [allData.selType.value]);
  return (
    <div style={{ height: "90%" }}>
      <Row gutter={16} style={{ margin: "5px" }}>
        <Col span={4} className="gutter-row">
          <div>
            <Select
              style={{ width: "100%" }}
              options={datevspart}
              placeholder="Select Type"
              value={allData.selType.value}
              onChange={(e) =>
                setAllData((allData) => {
                  return { ...allData, selType: e };
                })
              }
            />
          </div>
        </Col>
        {allData.selType == "datewise" ? (
          <>
            <Col span={5} className="gutter-row">
              {/* <MyDatePicker size="default" setDateRange={setDatee} /> */}
              <MyDatePicker size="default" setDateRange={setDatee} />
            </Col>
            <Col span={2} className="gutter-row">
              <Space>
                <Button onClick={dataDateWise} loading={loading} type="primary">
                  Fetch
                </Button>
                <CommonIcons
                  action="downloadButton"
                  onClick={handleDownloadCSV}
                />
              </Space>
            </Col>
          </>
        ) : (
          <>
            <Col span={5} className="gutter-row">
              <MyAsyncSelect
                style={{ width: "100%" }}
                onBlur={() => setAsyncOptions([])}
                loadOptions={getOption}
                optionsState={asyncOptions}
                onChange={(e) =>
                  setAllData((allData) => {
                    return { ...allData, part: e };
                  })
                }
              />
            </Col>
            <Col span={2} className="gutter-row">
              <Space>
                <Button onClick={fetchByPart} loading={loading} type="primary">
                  Fetch
                </Button>
                <CommonIcons
                  action="downloadButton"
                  onClick={handleDownloadCSV}
                />
              </Space>
            </Col>
          </>
        )}
        <Col span={2}></Col>
      </Row>

      <div style={{ height: "95%", padding: "0px 10px" }}>
        {allData.selType == "datewise" ? (
          <MyDataTable
            loading={loading}
            data={dateDataFrom}
            columns={columns}
          />
        ) : (
          <MyDataTable
            loading={loading}
            data={partDataFrom}
            columns={columns}
          />
        )}
      </div>
    </div>
  );
}

export default ViewPhysical;
