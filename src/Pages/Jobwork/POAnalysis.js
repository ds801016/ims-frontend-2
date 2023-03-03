import React, { useState } from "react";
import { Button, Col, Input, Row, Select } from "antd";
import MyDatePicker from "../../Components/MyDatePicker";
import { v4 } from "uuid";
import MyDataTable from "../../Components/MyDataTable";
import { toast } from "react-toastify";
import ViewModal from "./Modal/ViewModal";
import CloseModal from "./Modal/CloseModal";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import printFunction from "../../Components/printFunction";
import {
  EditFilled,
  EyeFilled,
  CheckOutlined,
  CloseOutlined,
  PrinterFilled,
} from "@ant-design/icons";
import UpdateModal from "./Modal/UpdateModal";
import { imsAxios } from "../../axiosInterceptor";

function POAnalysis() {
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [datee, setDatee] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateData, setDateData] = useState([]);
  const [sfgData, setSFGData] = useState([]);
  const [jwData, setJWData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [infoModalInfo, setInfoModalInfo] = useState(false);
  const [updateModalInfo, setUpdateModalInfo] = useState(false);
  const [allData, setAllData] = useState({
    setType: "",
    sfg: "",
    jwId: "",
    vendorName: "",
  });

  // console.log(allData);
  const options = [
    { label: "Date", value: "datewise" },
    { label: "JW ID", value: "jw_transaction_wise" },
    { label: "SFG SKU", value: "jw_sfg_wise" },
    { label: "Vendor", value: "vendorwise" },
  ];

  const printShow = async (d) => {
    setLoadingBtn(true);
    //  console.log(d);
    const { data } = await imsAxios.post("/jobwork/print_jw_analysis", {
      transaction: d,
    });
    setLoadingBtn(false);
    printFunction(data.data.buffer.data);
  };

  const columns = [
    { field: "index", headerName: "S No.", width: 8 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "po_sku_transaction", headerName: "JW ID", width: 180 },
    {
      field: "vendor",
      headerName: "Vendor",
      width: 350,
    },
    { field: "skucode", headerName: "SKU", width: 100 },
    { field: "skuname", headerName: "Product", width: 350 },
    { field: "requiredqty", headerName: "Required Qty", width: 120 },
    {
      type: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: ({ row }) => (
        <div
          style={{
            // border: "1px solid red",
            width: "60%",
            display: "flex",
            justifyContent: "space-around",
            fontSize: "14px",
          }}
        >
          {row.bom_recipe == "PENDING" ? (
            <EditFilled
              style={{ color: "grey", cursor: "pointer" }}
              onClick={() =>
                setUpdateModalInfo({ selType: allData.setType, row })
              }
            />
          ) : (
            <EyeFilled
              style={{ color: "grey", cursor: "pointer" }}
              onClick={() => setViewModalOpen(row)}
            />
          )}
          {row.po_status == "C" ? (
            <CheckOutlined style={{ color: "grey", cursor: "pointer" }} />
          ) : (
            <CloseOutlined
              style={{ color: "grey", cursor: "pointer" }}
              onClick={() =>
                setCloseModalOpen({ seltype: allData.setType, row })
              }
            />
          )}
          <PrinterFilled
            style={{ color: "grey", cursor: "pointer" }}
            onClick={() => printShow(row.po_sku_transaction)}
          />
        </div>
      ),
      // getActions: ({ row }) => [
      //   <TableActions action="view" onClick={() => setViewModalOpen(row)} />,
      //   <TableActions
      //     action="cancel"
      //     onClick={() => setCloseModalOpen({ seltype: allData.setType, row })}
      //   />,
      //   <TableActions action="print" onClick={() => printShow(row.po_sku_transaction)} />,
      // ],
    },
  ];

  const getOption = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/getProductByNameAndNo", {
        search: e,
      });
      // console.log(data);
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const getVendor = async (e) => {
    if (e.length > 2) {
      const { data } = await imsAxios.post("/backend/vendorList", {
        search: e,
      });

      let arr = [];
      arr = data.map((vList) => {
        return { text: vList.text, value: vList.id };
      });
      setAsyncOptions(arr);
      // return arr;
    }
  };

  const datewiseFetchData = async () => {
    setLoadingBtn(true);
    const { data } = await imsAxios.post("/jobwork/jw_analysis", {
      data: datee,
      wise: allData.setType,
    });
    // console.log(data.data);
    // setLoading(false);
    if (data.code == 200) {
      let arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setDateData(arr);
      setLoadingBtn(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoadingBtn(false);
    }
  };

  const JWFecthData = async () => {
    setLoading(true);
    const { data } = await imsAxios.post("/jobwork/jw_analysis", {
      data: allData.jwId,
      wise: allData.setType,
    });
    // console.log(data.data);
    // setLoading(false);
    if (data.code == 200) {
      let arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setJWData(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  const dataFetchSFG = async () => {
    setLoading(true);
    const { data } = await imsAxios.post("/jobwork/jw_analysis", {
      data: allData.sfg,
      wise: allData.setType,
    });
    // console.log(data.data);
    // setLoading(false);
    if (data.code == 200) {
      let arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setSFGData(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  const vendorFetch = async () => {
    setLoading(true);
    const { data } = await imsAxios.post("/jobwork/jw_analysis", {
      data: allData.vendorName,
      wise: allData.setType,
    });
    // console.log(data.data);
    // setLoading(false);
    if (data.code == 200) {
      let arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setVendorData(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ height: "90%" }}>
        {/* <InternalNav links={JobworkLinks} /> */}
        <Row gutter={10} style={{ margin: "10px" }}>
          <Col span={4}>
            <Select
              placeholder="Select Option"
              style={{ width: "100%" }}
              options={options}
              value={allData.setType.value}
              onChange={(w) =>
                setAllData((allData) => {
                  return { ...allData, setType: w };
                })
              }
            />
          </Col>
          {allData.setType == "datewise" ? (
            <>
              <Col span={4}>
                <MyDatePicker size="default" setDateRange={setDatee} />
              </Col>
              <Col span={1}>
                <Button
                  loading={loading}
                  onClick={datewiseFetchData}
                  type="primary"
                >
                  Fetch
                </Button>
              </Col>
            </>
          ) : allData.setType == "jw_transaction_wise" ? (
            <>
              <Col span={4}>
                <Input
                  placeholder="JW ID"
                  value={allData.jwId}
                  onChange={(e) =>
                    setAllData((allData) => {
                      return { ...allData, jwId: e.target.value };
                    })
                  }
                />
              </Col>
              <Col span={1}>
                <Button type="primary" loading={loading} onClick={JWFecthData}>
                  Fetch
                </Button>
              </Col>
            </>
          ) : allData.setType == "jw_sfg_wise" ? (
            <>
              <Col span={6}>
                <MyAsyncSelect
                  style={{ width: "100%" }}
                  onBlur={() => setAsyncOptions([])}
                  loadOptions={getOption}
                  value={allData.sfg}
                  optionsState={asyncOptions}
                  onChange={(e) =>
                    setAllData((allData) => {
                      return { ...allData, sfg: e };
                    })
                  }
                  placeholder="Part/Name"
                />
              </Col>
              <Col span={1}>
                <Button type="primary" loading={loading} onClick={dataFetchSFG}>
                  Fetch
                </Button>
              </Col>
            </>
          ) : allData.setType == "vendorwise" ? (
            <>
              <Col span={6}>
                <MyAsyncSelect
                  style={{ width: "100%" }}
                  onBlur={() => setAsyncOptions([])}
                  loadOptions={getVendor}
                  value={allData.vendorName}
                  optionsState={asyncOptions}
                  onChange={(e) =>
                    setAllData((allData) => {
                      return { ...allData, vendorName: e };
                    })
                  }
                  placeholder="Part/Name"
                />
              </Col>
              <Col span={1}>
                <Button loading={loading} onClick={vendorFetch} type="primary">
                  Fetch
                </Button>
              </Col>
            </>
          ) : (
            ""
          )}
        </Row>
        <div style={{ height: "89%", margin: "10px" }}>
          {allData.setType == "datewise" ? (
            <MyDataTable
              loading={loadingBtn}
              data={dateData}
              columns={columns}
            />
          ) : allData.setType == "jw_transaction_wise" ? (
            <MyDataTable loading={loadingBtn} data={jwData} columns={columns} />
          ) : allData.setType == "jw_sfg_wise" ? (
            <MyDataTable
              loading={loadingBtn}
              data={sfgData}
              columns={columns}
            />
          ) : allData.setType == "vendorwise" ? (
            <MyDataTable
              loading={loadingBtn}
              data={vendorData}
              columns={columns}
            />
          ) : (
            <MyDataTable
              loading={loadingBtn}
              data={vendorData}
              columns={columns}
            />
          )}
        </div>
      </div>
      <ViewModal
        setViewModalOpen={setViewModalOpen}
        viewModalOpen={viewModalOpen}
        infoModalInfo={infoModalInfo}
        setInfoModalInfo={setInfoModalInfo}
      />
      <CloseModal
        closeModalOpen={closeModalOpen}
        setCloseModalOpen={setCloseModalOpen}
        datewiseFetchData={datewiseFetchData}
        JWFecthData={JWFecthData}
        dataFetchSFG={dataFetchSFG}
        vendorFetch={vendorFetch}
      />

      <UpdateModal
        setUpdateModalInfo={setUpdateModalInfo}
        updateModalInfo={updateModalInfo}
        datewiseFetchData={datewiseFetchData}
        JWFecthData={JWFecthData}
        dataFetchSFG={dataFetchSFG}
        vendorFetch={vendorFetch}
      />
    </>
  );
}

export default POAnalysis;
