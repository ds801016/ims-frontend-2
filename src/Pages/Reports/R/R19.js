import React, { useState, useEffect } from "react";
import { Button, Col, Row, Select } from "antd";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import axios from "axios";
import { toast } from "react-toastify";
import MyDataTable from "../../../Components/MyDataTable";
import { v4 } from "uuid";
import { CaretRightOutlined, ArrowRightOutlined } from "@ant-design/icons";
import ModalR19 from "../Modal/ModalR19";
import { imsAxios } from "../../../axiosInterceptor";

function R19() {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [search, setSearch] = useState("");
  const [bomName, setBomName] = useState([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [allData, setAllData] = useState({
    selectProduct: "",
    selectBom: "",
  });
  const getDataBySearch = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/fetchProduct", {
        searchTerm: e,
      });
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const getBom = async () => {
    const { data } = await imsAxios.post("/backend/fetchBomForProduct", {
      search: allData?.selectProduct,
    });
    //  console.log(data);
    const arr = data.data.map((d) => {
      return { value: d.bomid, label: d.bomname };
    });
    setBomName(arr);

    //  setBranch(arr);
  };

  const fetchData = async () => {
    setLoading(true);
    setMainData([]);
    const { data } = await imsAxios.post("/report19", {
      sku: allData?.selectProduct,
      bom: allData?.selectBom,
    });

    if (data.code == 200) {
      let arr = data.data.map((row, i) => {
        return { ...row, id: v4(), i: i + 1 };
      });
      setMainData(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
    //  console.log(data);
  };

  const columns = [
    { field: "i", headerName: "S.No.", width: 80 },
    { field: "vendor_code", headerName: "CODE", width: 100 },
    { field: "vendor_name", headerName: "VENDER", width: 300 },
    { field: "part_code", headerName: "PART", width: 100 },
    { field: "part_name", headerName: "COMPONENT", width: 250 },
    { field: "order_qty", headerName: "PO QTY", width: 100 },
    { field: "inward_qty", headerName: "INWARD QTY", width: 120 },
    { field: "pending_qty", headerName: "PENDING QTY", width: 150 },
    { field: "closing_qty", headerName: "CLOSING QTY", width: 150 },
    { field: "estmt_qty", headerName: "NO. OF SB", width: 100 },
    { field: "del_per", headerName: "DELETE %", width: 100 },
  ];

  useEffect(() => {
    if (allData.selectProduct) {
      getBom();
    }
  }, [allData.selectProduct]);

  //   useEffect(() => {
  //     console.log(allData);
  //   }, [allData]);

  return (
    <div style={{ height: "97%" }}>
      <Row gutter={10} style={{ margin: "5px" }}>
        <Col span={5}>
          <MyAsyncSelect
            style={{ width: "100%" }}
            onBlur={() => setAsyncOptions([])}
            optionsState={asyncOptions}
            placeholder="Select Product"
            loadOptions={getDataBySearch}
            onInputChange={(e) => setSearch(e)}
            value={allData.selectProduct.value}
            onChange={(e) =>
              setAllData((allData) => {
                return { ...allData, selectProduct: e };
              })
            }
          />
        </Col>

        <Col span={5}>
          <Select
            style={{ width: "100%" }}
            placeholder="Select Bom"
            options={bomName}
            value={allData?.selectBom.value}
            onChange={(e) =>
              setAllData((allData) => {
                return { ...allData, selectBom: e };
              })
            }
          />
        </Col>

        <Col span={1}>
          <Button type="primary" onClick={fetchData}>
            Fetch
          </Button>
        </Col>

        {/* {mainData?.length > 0 && ( */}
        <Col span={1} offset={12}>
          <Button
            onClick={() => setModalOpen(true)}
            disabled={mainData?.length > 0 ? false : true}
          >
            <ArrowRightOutlined />
            {/* <CaretRightOutlined /> */}
          </Button>
        </Col>
        {/* )} */}
      </Row>

      <div className="hide-select" style={{ height: "90%", margin: "10px" }}>
        <MyDataTable
          checkboxSelection={true}
          loading={loading}
          data={mainData}
          columns={columns}
        />
      </div>

      <ModalR19
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        allData={allData}
        fetchData={fetchData}
      />
    </div>
  );
}

export default R19;
