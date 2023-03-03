import React, { useEffect, useState } from "react";
import axios from "axios";
import "antd/dist/antd.css";
import moment from "moment";
import { DatePicker, Select } from "antd";
import { toast } from "react-toastify";
import MyDatePicker from "../../../Components/MyDatePicker";
import { v4 } from "uuid";
import { Button, Modal, Row, Col, Input } from "antd";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { imsAxios } from "../../../axiosInterceptor";

const { RangePicker } = DatePicker;

const OpenR1Modal = ({
  viewModal,
  setViewModal,
  setAllResponseData,
  // loading,
  setLoading,
  setFilterData,
}) => {
  document.title = "Bom Wise Report";
  const [seacrh, setSearch] = useState(null);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [date, setDate] = useState("");
  const [dataa, setData] = useState({
    selectProduct: "",
    bom: "",
  });

  // console.log(dataa);
  const [bomName, setBomName] = useState([]);
  const opt = [{ label: "Bom Wise", value: "Bom Wise" }];

  const getProductNameFecth = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/fetchProduct", {
        searchTerm: e,
      });
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      // return arr;
      setAsyncOptions(arr);
    }
  };

  const getBom = async () => {
    const { data } = await imsAxios.post("/backend/fetchBomForProduct", {
      search: dataa?.selectProduct,
    });
    const arr = data.data.map((d) => {
      return { value: d.bomid, label: d.bomname };
    });
    setBomName(arr);

    //  setBranch(arr);
  };

  useEffect(() => {
    if (dataa.selectProduct) {
      getBom();
    }
  }, [dataa.selectProduct]);

  const generateFun = async () => {
    setLoading(true);

    const { data } = await imsAxios.post("/report1", {
      product: dataa.selectProduct,
      subject: dataa.bom,
      date: date,
      action: "search_r1",
    });
    if (data.code == 200) {
      setData({
        selectProduct: "",
        bom: "",
      });
      let arr = data.response.data.map((row) => {
        return {
          ...row,
          id: v4(),
        };
      });
      setAllResponseData(arr);
      // setShow(false);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message);
      // setViewModal(false);
      // setShow(false);
      setLoading(false);
    }
  };

  if (!viewModal) {
    return null;
  }

  return (
    <form>
      <Modal
        title="BOM Wise Report"
        centered
        open={viewModal}
        onOk={() => {
          generateFun();
          setViewModal(false);
        }}
        onCancel={() => setViewModal(false)}
        width={800}
      >
        <Row justify="center" gutter={16}>
          <Col span={12}>
            <MyAsyncSelect
              style={{ width: "100%" }}
              loadOptions={getProductNameFecth}
              onBlur={() => setAsyncOptions([])}
              onInputChange={(e) => setSearch(e)}
              value={dataa.selectProduct.value}
              placeholder="Product Name / SKU"
              optionsState={asyncOptions}
              onChange={(e) =>
                setData((dataa) => {
                  return { ...dataa, selectProduct: e };
                })
              }
            />
          </Col>
          <Col span={12}>
            <Select
              style={{ width: "100%" }}
              placeholder="Select Bom"
              options={bomName}
              value={dataa.bom.value}
              onChange={(e) =>
                setData((dataa) => {
                  return { ...dataa, bom: e };
                })
              }
            />
          </Col>
          <Col span={12} style={{ marginTop: "5px" }}>
            <Select
              options={opt}
              placeholder="Bom Wise"
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={12} style={{ marginTop: "5px" }}>
            <MyDatePicker setDateRange={setDate} size="default" />
          </Col>
        </Row>
      </Modal>
    </form>
  );
};

export default OpenR1Modal;
