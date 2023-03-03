import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Drawer,
  Row,
  Skeleton,
  Space,
  Input,
  Button,
  Select,
  Popconfirm,
} from "antd";
import { EyeFilled, CloseCircleFilled } from "@ant-design/icons";
import axios from "axios";
import { v4 } from "uuid";
import MyDataTable from "../../../Components/MyDataTable";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { toast } from "react-toastify";
import { imsAxios } from "../../../axiosInterceptor";

const JwReturnModel = ({ setEditModal, editModal }) => {
  //   console.log(editModal);

  const [locValue, setLocValue] = useState([]);
  const [header, setHeaderData] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [modalLoad, setModalLoad] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [modalUploadLoad, setModalUploadLoad] = useState(false);

  const getLocation = async (e) => {
    const { data } = await imsAxios.get("/jobwork/jw_rm_return_location");
    //  console.log(data);
    let arr = [];
    arr = data.data.map((d) => {
      return { label: d.text, value: d.id };
    });
    //  console.log(arr);
    setLocValue(arr);
    //  }
  };

  const getModalFunction = async () => {
    setModalLoad(true);
    const { data } = await imsAxios.post("/jobwork/getJwRmReturnData", {
      skucode: editModal?.row?.sku,
      transaction: editModal?.row?.transaction_id,
    });
    if (data.code == 200) {
      let arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setMainData(arr);
      setHeaderData(data.header);
      setModalLoad(false);
    }
  };

  const inputHandler = async (name, id, value) => {
    console.log(name, id, value);
    if (name == "componentname") {
      setMainData((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, componentKey: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "orderqty") {
      setMainData((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, orderqty: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "rate") {
      setMainData((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, rate: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "invoice") {
      setMainData((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, invoice: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "remark") {
      setMainData((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, remark: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "location") {
      setMainData((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, location: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "hsncode") {
      setMainData((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, hsncode: value };
            }
          } else {
            return aa;
          }
        })
      );
    }
  };

  const columns = [
    {
      field: "component",
      headerName: "PART NAME",
      width: 320,
    },
    {
      field: "orderqty",
      headerName: "QTY|UOM",
      width: 120,
      renderCell: ({ row }) => (
        <Input
          suffix={row.unitsname}
          value={row.orderqty}
          placeholder="Qty"
          onChange={(e) => inputHandler("orderqty", row.id, e.target.value)}
        />
      ),
    },
    {
      field: "rate",
      headerName: "Rate",
      width: 120,
      renderCell: ({ row }) => (
        <Input
          placeholder="Rate"
          onChange={(e) => inputHandler("rate", row.id, e.target.value)}
        />
      ),
    },
    {
      field: "value",
      headerName: "Value",
      width: 120,
      renderCell: ({ row }) => (
        <Input
          disabled
          value={row.orderqty * row.rate ? row.orderqty * row.rate : "--"}
          placeholder="Value"
          //   onChange={(e) => inputHandler("value", row.id, e.target.value)}
        />
      ),
    },
    {
      field: "invoice",
      headerName: "Invoice Id",
      width: 220,
      renderCell: ({ row }) => (
        <Input
          placeholder="Invoice"
          onChange={(e) => inputHandler("invoice", row.id, e.target.value)}
        />
      ),
    },
    {
      field: "location",
      headerName: "Location",
      width: 120,
      renderCell: ({ row }) => (
        <Select
          style={{ width: "100%" }}
          options={locValue}
          onChange={(e) => inputHandler("location", row.id, e)}
        />
      ),
    },
    {
      field: "hsncode",
      headerName: "HSN",
      width: 150,

      renderCell: ({ row }) => (
        <Input
          placeholder="HSN"
          value={row.hsncode}
          onChange={(e) => inputHandler("hsncode", row.id, e.target.value)}
        />
      ),
    },
    {
      field: "remark",
      headerName: "REMARK",
      width: 180,
      renderCell: ({ row }) => (
        <Input
          placeholder="remark"
          onChange={(e) => inputHandler("remark", row.id, e.target.value)}
        />
      ),
    },
  ];

  const text = "Are you sure to update this jw sf Inward?";

  const saveFunction = async () => {
    setModalUploadLoad(true);
    const compArray = [];
    const qtyArray = [];
    const locArray = [];
    const rateArray = [];
    const invoiceArray = [];
    const remarkArray = [];
    const hsnArray = [];

    mainData.map((comp) => compArray.push(comp.component_key));
    mainData.map((qt) => qtyArray.push(qt.orderqty));
    mainData.map((loca) => locArray.push(loca.location));
    mainData.map((r) => rateArray.push(r.rate));
    mainData.map((invoi) => invoiceArray.push(invoi.invoice));
    //   mainData.map((in) => invoiceArray.push(in.invoice));
    mainData.map((re) => remarkArray.push(re.remark));
    mainData.map((hs) => hsnArray.push(hs.hsncode));

    const { data } = await imsAxios.post("/jobwork/saveJwRmReturn", {
      trans_id: editModal?.row?.transaction_id,
      companybranch: "BRMSC012",
      component: compArray,
      qty: qtyArray,
      location: locArray,
      rate: mainData[0]?.rate,
      invoice: invoiceArray,
      remark: remarkArray,
      hsncode: hsnArray,
    });
    if (data.code == 200) {
      setModalUploadLoad(false);
      setEditModal(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setModalUploadLoad(false);
    }
  };

  useEffect(() => {
    if (editModal) {
      getModalFunction();
      getLocation();
      // console.log(mainData);
    }
  }, [editModal]);

  return (
    <Space>
      <Drawer
        width="100vw"
        //   title="JW Purchase Order (PO) - IN"
        title={
          <span style={{ fontSize: "15px", color: "#1890ff" }}>
            {editModal?.row?.vendor}
          </span>
        }
        placement="right"
        closable={false}
        onClose={() => setEditModal(false)}
        open={editModal}
        getContainer={false}
        style={
          {
            //  position: "absolute",
          }
        }
        extra={
          <Space>
            <CloseCircleFilled onClick={() => setEditModal(false)} />
          </Space>
        }
      >
        <Skeleton active loading={modalLoad}>
          <Card type="inner" title={header?.jobwork_id}>
            <Row gutter={10}>
              <Col span={8} style={{ fontSize: "12px", fontWeight: "bolder" }}>
                JW PO ID: {header?.jobwork_id}
              </Col>
              <Col span={8} style={{ fontSize: "12px", fontWeight: "bolder" }}>
                Jobwork ID: {header?.jobwork_id}
              </Col>
              <Col span={8} style={{ fontSize: "12px", fontWeight: "bolder" }}>
                FG/SFG Name & SKU:{" "}
                {`${header?.product_name} / ${header?.sku_code}`}
              </Col>
              <Col span={8} style={{ fontSize: "12px", fontWeight: "bolder" }}>
                JW PO created by: {header?.created_by}
              </Col>
              <Col span={8} style={{ fontSize: "12px", fontWeight: "bolder" }}>
                Regisered Date & Time: {header?.registered_date}
              </Col>
              <Col span={8} style={{ fontSize: "12px", fontWeight: "bolder" }}>
                FG/SFG Ord Qty: {header?.ordered_qty}
              </Col>
              <Col span={8} style={{ fontSize: "12px", fontWeight: "bolder" }}>
                Job ID Status: {header?.jw_status}
              </Col>
              <Col span={8} style={{ fontSize: "12px", fontWeight: "bolder" }}>
                FG/SFG processed Qty: {header?.proceed_qty}
              </Col>
              <Col span={8} style={{ fontSize: "12px", fontWeight: "bolder" }}>
                Job Worker: {header?.vendor_name}
              </Col>
            </Row>
          </Card>

          <div style={{ height: "65%", marginTop: "5px" }}>
            <div style={{ height: "100%" }}>
              <MyDataTable data={mainData} columns={columns} />
            </div>
          </div>

          <Row style={{ marginTop: "30px" }}>
            <Col span={24}>
              <div style={{ textAlign: "end" }}>
                <Popconfirm
                  placement="topLeft"
                  title={text}
                  onConfirm={saveFunction}
                  // loading={modalUploadLoad}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary">Save</Button>
                </Popconfirm>
              </div>
            </Col>
          </Row>
        </Skeleton>
      </Drawer>
    </Space>
  );
};

export default JwReturnModel;
