import React, { useState, useEffect } from "react";
import { Breadcrumb, Button, Col, Input, Row } from "antd";
import axios from "axios";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import {
  UserOutlined,
  MailOutlined,
  MobileOutlined,
  PrinterTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { FaUserCircle } from "react-icons/fa";
import MyDataTable from "../../Components/MyDataTable";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { imsAxios } from "../../axiosInterceptor";

function UpdateRM() {
  document.title = "Update MIN";
  const [updteModal, setUpdteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputStore, setInputStore] = useState("");
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [headerData, setHeaderData] = useState([]);

  // console.log(mainData);
  const getOption = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/getMinTransactionByNo", {
        search: e,
      });
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const fetchInputData = async () => {
    setLoading(true);
    const { data } = await imsAxios.post("/transaction/fetchMINData", {
      min_transaction: inputStore,
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
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  const reset = (i) => {
    setMainData((allDataComes) => {
      return allDataComes.filter((row) => row.id != i);
    });
  };

  const inputHandler = async (name, id, value) => {
    console.log(name, id, value);
    if (name == "invoice_id") {
      setMainData((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, invoice_id: value };
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
    }
  };

  const columns = [
    {
      type: "actions",
      headerName: "Delete",
      width: 80,
      getActions: ({ row }) => [
        <CloseCircleTwoTone
          onClick={() => reset(row?.id)}
          style={{ color: "#1890ff", fontSize: "15px" }}
        />,
      ],
    },
    {
      field: "componentName",
      headerName: "COMPONENT",
      width: 450,
      renderCell: ({ row }) => (
        <span>{`${row?.componentName} / ${row?.partno}`}</span>
        // <Input
        //   suffix={row?.uom}
        //   disabled
        //   value={row?.inward_qty}
        //   placeholder="Qty"
        //   // onChange={(e) => inputHandler("rate", row.id, e.target.value)}
        // />
      ),
    },

    {
      field: "hsncode",
      headerName: "HSN",
      width: 100,
    },
    {
      field: "gstrate",
      headerName: "GST",
      width: 80,
    },
    {
      field: "inward_qty",
      headerName: "QTY",
      width: 90,
      renderCell: ({ row }) => (
        <span>{`${row?.inward_qty} ${row?.uom}`}</span>
        // <Input
        //   suffix={row?.uom}
        //   disabled
        //   value={row?.inward_qty}
        //   placeholder="Qty"
        //   // onChange={(e) => inputHandler("rate", row.id, e.target.value)}
        // />
      ),
    },
    {
      field: "min_date",
      headerName: "MIN DATE",
      width: 160,
    },
    {
      field: "invoice_id",
      headerName: "INVOICE",
      width: 160,
      renderCell: ({ row }) => (
        <Input
          value={row?.invoice_id}
          placeholder="Invoice"
          onChange={(e) => inputHandler("invoice_id", row.id, e.target.value)}
        />
      ),
    },
    {
      field: "remark",
      headerName: "REMARK",
      width: 300,
      renderCell: ({ row }) => (
        <Input
          value={row?.remark}
          placeholder="Remark"
          onChange={(e) => inputHandler("remark", row.id, e.target.value)}
        />
      ),
    },
  ];

  const resetFun = () => {
    setMainData([]);
  };

  const updateFunction = async () => {
    setUpdteModal(true);
    const keyArray = [];
    const compKeyArray = [];
    const invoiceArray = [];
    const remarkArray = [];
    mainData.map((key) => keyArray.push(key.key));
    mainData.map((comp) => compKeyArray.push(comp.componentKey));
    mainData.map((invo) => invoiceArray.push(invo.invoice_id));
    mainData.map((rem) => remarkArray.push(rem.remark));

    const { data } = await imsAxios.post("/transaction/updateMIN", {
      branch: "BRMSC012",
      key: keyArray,
      component: compKeyArray,
      invoice: invoiceArray,
      remark: remarkArray,
      min_transaction: inputStore,
    });
    if (data.code == 200) {
      setUpdteModal(false);
      resetFun();
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setUpdteModal(false);
    }
    console.log(data);
  };
  return (
    <div style={{ height: "90%" }}>
      <Row gutter={8} style={{ margin: "5px" }}>
        <Col span={5}>
          <MyAsyncSelect
            style={{ width: "100%" }}
            onBlur={() => setAsyncOptions([])}
            loadOptions={getOption}
            value={inputStore}
            optionsState={asyncOptions}
            onChange={(a) => setInputStore(a)}
            placeholder="Part/Name"
          />
        </Col>
        <Col span={2}>
          <div>
            <Button loading={loading} type="primary" onClick={fetchInputData}>
              Fetch
            </Button>
          </div>
        </Col>
        {mainData?.length > 0 ? (
          <Col span={4} offset={13} style={{ fontWeight: "bolder" }}>
            <Breadcrumb style={{ fontSize: "13px" }}>
              <Breadcrumb.Item>
                <UserOutlined />:{headerData?.insert_by}
              </Breadcrumb.Item>
            </Breadcrumb>
            <Breadcrumb style={{ fontSize: "13px" }}>
              <Breadcrumb.Item>
                <MailOutlined />:{headerData?.insert_by_useremail}
              </Breadcrumb.Item>
            </Breadcrumb>
            <Breadcrumb style={{ fontSize: "13px" }}>
              <Breadcrumb.Item>
                <MobileOutlined />:{headerData?.insert_by_usermobile}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        ) : (
          ""
        )}
      </Row>

      <div style={{ height: "85%", padding: "0px 10px" }}>
        <MyDataTable data={mainData} columns={columns} />
      </div>

      {mainData?.length > 0 && (
        <Row gutter={10} style={{ margin: "10px" }}>
          <Col span={24}>
            <div style={{ textAlign: "end" }}>
              <Button
                onClick={resetFun}
                style={{
                  marginRight: "5px",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Reset
              </Button>
              <Button
                onClick={updateFunction}
                loading={updteModal}
                type="primary"
              >
                Update
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}

{
  /* <div>
  <FaUserCircle size={25} style={{ marginTop: "5px" }} />:{headerData?.insert_by}
</div>insert_by_useremail/insert_by_usermobile */
}
export default UpdateRM;
