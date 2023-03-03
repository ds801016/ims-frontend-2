import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Col, Input, Row, Typography } from "antd";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import MySelect from "../../../Components/MySelect";
import FormTable from "../../../Components/FormTable";
import NavFooter from "../../../Components/NavFooter";
import { v4 } from "uuid";
import Loading from "../../../Components/Loading";
import { imsAxios } from "../../../axiosInterceptor";

function MaterialTransfer({ type, title }) {
  document.title = title;
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [dropLocationOptions, setDropLocationOptions] = useState([]);
  const [rows, setRows] = useState([
    {
      id: v4(),
      component: "",
      stockQty: 0,
      transferQty: 0,
      unit: "",
      dropLocation: "",
      dropLocationDetails: "",
    },
  ]);
  const [details, setDetails] = useState({
    checkLocation: "",
    locationDetail: "",
    description: "",
  });
  // console.log(zero);

  const getLocation = async () => {
    let link = "";
    if (type == "sftosf") {
      link = "/godown/fetchLocationForSF2SF_from";
    } else if (type == "sftorej") {
      link = "/godown/fetchLocationForSF2REJ_from";
    }
    setPageLoading(true);
    const { data } = await imsAxios.post(link);
    setPageLoading(false);
    let arr = [];
    data.data.map((a) => arr.push({ text: a.text, value: a.id }));
    setLocationOptions(arr);
  };
  const getDropLoc = async () => {
    let link = "";

    if (type == "sftosf") {
      link = "/godown/fetchLocationForSF2SF_to";
    } else if (type == "sftorej") {
      link = "/godown/fetchLocationForSF2REJ_to";
    }
    setPageLoading(true);
    const { data } = await imsAxios.post(link);
    setPageLoading(false);
    let arr = [];
    data.data.map((a) => arr.push({ text: a.text, value: a.id }));
    setDropLocationOptions(arr);
  };

  // console.log(allData);
  const getComponent = async (e) => {
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
  const inputHandler = async (name, value, id) => {
    let arr = rows;
    if (name == "component") {
      if (details.checkLocation == "") {
        return toast.error("Please Select check location first");
      }
      setPageLoading(true);
      const { data } = await imsAxios.post("/godown/godownStocks", {
        component: value.value,
        location: details.checkLocation,
      });
      setPageLoading(false);
      arr = arr.map((row) => {
        let obj = row;
        if (row.id == id) {
          obj = {
            ...obj,
            [name]: value,
            stockQty: data.data.available_qty,
            unit: data.data.unit,
          };
        }
        return obj;
      });
    } else if (name == "dropLocation") {
      const { data } = await imsAxios.post("/godown/fetchLocationDetail_to", {
        location_key: value,
      });
      if (data.code == 200) {
        arr = arr.map((row) => {
          let obj = row;
          if (row.id == id) {
            obj = {
              ...obj,
              [name]: value,
              dropLocationDetails: data.data,
            };
          }
          return obj;
        });
      } else {
        toast.error(data.message.msg);
      }
    } else {
      arr = rows.map((row) => {
        let obj = row;
        if (row.id == id) {
          obj = {
            ...obj,
            [name]: value,
          };
          return obj;
        }
      });
    }

    setRows(arr);
  };
  const { Paragraph, Text } = Typography;
  const columns = [
    {
      headerName: "Component",
      width: 200,
      renderCell: ({ row }) => (
        <MyAsyncSelect
          onBlur={() => {
            setAsyncOptions([]);
          }}
          value={row.component}
          labelInValue
          optionsState={asyncOptions}
          loadOptions={getComponent}
          onChange={(value) => inputHandler("component", value, row.id)}
        />
      ),
    },
    {
      headerName: "In Stock Qty",
      width: 120,
      renderCell: ({ row }) => (
        <Input suffix={row.unit} disabled={true} value={row.stockQty} />
      ),
    },
    {
      headerName: "Transfer Qty",
      width: 120,
      renderCell: ({ row }) => (
        <Input
          value={row.transferQty}
          suffix={row.unit}
          onChange={(e) => inputHandler("transferQty", e.target.value, row.id)}
        />
      ),
    },
    {
      headerName: "Drop (+) Loc",
      width: 150,
      renderCell: ({ row }) => (
        <MySelect
          options={dropLocationOptions}
          value={row.dropLocation}
          onChange={(value) => inputHandler("dropLocation", value, row.id)}
        />
      ),
    },
    {
      headerName: "Drop Loc details",
      width: 300,
      renderCell: ({ row }) => row.dropLocationDetails,
    },
  ];
  const submitHandler = async () => {
    rows.map((row) => {
      if (row.component == "") {
        return toast.error("Please Select a component");
      } else if (row.transferQty == "" || row.transferQty == 0) {
        return toast.error(
          "Transfer Quantity should not be blank or equal to 0"
        );
      } else if (row.dropLocation == "") {
        return toast.error("Please select a drop location");
      }
    });

    const finalObj = {
      companybranch: "BRMSC012",
      comment: details.description,
      fromlocation: details.checkLocation,
      component: rows.map((row) => row.component.value),
      tolocation: rows.map((row) => row.dropLocation),
      qty: rows.map((row) => row.transferQty),
      type: type == "sftosf" ? "SF2SF" : "SF2REJ",
    };
    setSubmitLoading(true);
    let link = "";
    if (type == "sftosf") {
      link = "/godown/transferSF2SF";
    } else if (type == "sftorej") {
      link = "/godown/transferSF2REJ";
    }
    const { data } = await imsAxios.post(link, finalObj);
    setSubmitLoading(false);
    if (data.code == 200) {
      toast.success(data.message);
      resetFunction();
    } else {
      toast.error(data.message.msg);
    }
  };
  const getFromLocationDetails = async (value) => {
    setPageLoading(true);
    const { data } = await imsAxios.post("/godown/fetchLocationDetail_from", {
      location_key: value,
    });
    setPageLoading(false);
    if (data.code == 200) {
      setDetails((details) => {
        return { ...details, locationDetail: data.data, checkLocation: value };
      });
    } else {
      toast.error(data.message.msg);
    }
  };

  useEffect(() => {
    getLocation();
    getDropLoc();
  }, []);

  const resetFunction = () => {
    setRows([
      {
        id: v4(),
        component: "",
        stockQty: 0,
        transferQty: 0,
        unit: "",
        dropLocation: "",
      },
    ]);
    setDetails({
      checkLocation: "",
      locationDetail: "",
      description: "",
    });
  };

  return (
    <div style={{ height: "100vh" }}>
      {/* <InternalNav links={type == "sftosf" ? sftosfLinks : sftorejLinks} /> */}
      {pageLoading && <Loading />}
      <Row gutter={16} style={{ padding: 10 }}>
        <Col span={6} style={{ marginTop: 10 }}>
          <Row>
            <Text style={{ marginBottom: 10 }}>Location</Text>
            <Col span={24}>
              <MySelect
                size="default"
                value={details.checkLocation}
                onChange={(e) => getFromLocationDetails(e)}
                options={locationOptions}
                placeholder="Select Location"
              />
            </Col>
          </Row>
          <Row style={{ margin: "10px 0" }}>
            <Col span={24}>
              <Input.TextArea
                value={details.locationDetail?.replaceAll("<br>", "\n")}
                rows={5}
                style={{ resize: "none " }}
                disabled
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Input.TextArea
                rows={5}
                style={{ resize: "none " }}
                value={details.description}
                onChange={(e) =>
                  setDetails((details) => {
                    return { ...details, description: e.target.value };
                  })
                }
              />
            </Col>
          </Row>
        </Col>
        <Col span={18}>
          <FormTable columns={columns} data={rows} />
        </Col>
      </Row>
      <NavFooter
        submitFunction={submitHandler}
        nextLabel="Transfer"
        loading={submitLoading}
        resetFunction={resetFunction}
      />
    </div>
  );
}

export default MaterialTransfer;
