import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import MyDataTable from "../../../Components/MyDataTable";
import axios from "axios";
import NavFooter from "../../../Components/NavFooter";
import { toast } from "react-toastify";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Card, Col, Form, Input, Row } from "antd";
import SingleDatePicker from "../../../Components/SingleDatePicker";
import FormTable from "../../../Components/FormTable";
import MySelect from "../../../Components/MySelect";
import SummaryCard from "../../../Components/SummaryCard";
import { imsAxios } from "../../../axiosInterceptor";

export default function BankPayment() {
  document.title = "Bank Payment Voucher";
  const [bankPaymentRows, setBankPaymentRows] = useState([
    {
      id: v4(),
      glCode: "",
      debit: "",
      comment: "",
      currency: "364907247",
      exchangeRate: 1,
      foreignValue: 0,
    },
  ]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [headerAccount, setHeaderAccount] = useState("");
  const [effectiveDate, setSetEffective] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [totalValues, setTotalValues] = useState({
    totalINR: 0,
    totalForeign: 0,
  });

  const getCurrencies = async () => {
    const { data } = await imsAxios.get("/backend/fetchAllCurrecy");
    let arr = [];
    arr = data.data.map((d) => {
      return {
        text: d.currency_symbol,
        value: d.currency_id,
        notes: d.currency_notes,
      };
    });
    setCurrencyOptions(arr);
  };
  const addRows = () => {
    setBankPaymentRows((rows) => {
      return [
        ...rows,
        {
          id: v4(),
          glCode: "",
          debit: "",
          comment: "",
          currency: "364907247",
          exchangeRate: 1,
          foreignValue: 0,
        },
      ];
    });
  };
  const removeRow = (id) => {
    let arr = bankPaymentRows;
    arr = arr.filter((row) => row.id != id);
    setBankPaymentRows(arr);
  };
  const BankPaymentTable = [
    {
      headerName: (
        <span>
          <AiOutlinePlusSquare
            onClick={addRows}
            style={{
              cursor: "pointer",
              fontSize: "1.7rem",
              marginTop: 10,
              opacity: "0.7",
            }}
          />
        </span>
      ),
      width: 50,
      type: "actions",
      field: "add",
      sortable: false,
      renderCell: ({ row }) => [
        <GridActionsCellItem
          icon={
            <AiOutlineMinusSquare
              style={{
                fontSize: "1.7rem",
                cursor: "pointer",
                pointerEvents:
                  bankPaymentRows.indexOf(row) <= 0 ? "none" : "all",
                opacity: bankPaymentRows.indexOf(row) <= 0 ? 0.5 : 1,
              }}
            />
          }
          onClick={() => {
            let del = null;
            del = bankPaymentRows.indexOf(row) > 0;

            del && removeRow(row.id);
          }}
          label="Delete"
        />,
      ],
    },
    {
      headerName: "Particulars",
      width: 350,
      renderCell: ({ row }) => (
        <div style={{ width: "100%" }}>
          <MyAsyncSelect
            sectLoading={selectLoading}
            onBlur={() => setAsyncOptions([])}
            value={row?.glCode}
            onChange={(value) => {
              inputHandler("glCode", value, row?.id);
            }}
            loadOptions={getLedger}
            optionsState={asyncOptions}
            placeholder="Select Ledger.."
          />
        </div>
      ),
    },
    {
      headerName: "Debit",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          value={row.debit}
          disabled={row.currency !== "364907247"}
          onChange={(e) => {
            inputHandler("debit", e.target.value, row.id);
          }}
          placeholder="0"
        />
      ),
    },
    {
      headerName: "Currency/Rate",

      width: 130,
      renderCell: ({ row }) => (
        <Input.Group compact>
          <Input
            style={{ width: "55%" }}
            disabled={row.currency === "364907247"}
            value={row.exchangeRate}
            onChange={(e) =>
              inputHandler("exchangeRate", e.target.value, row.id)
            }
          />
          <div style={{ width: "45%" }}>
            <MySelect
              options={currencyOptions}
              value={row.currency}
              onChange={(value) => inputHandler("currency", value, row.id)}
            />
          </div>
        </Input.Group>
      ),
    },
    {
      headerName: "Foreign Value",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          value={row.foreignValue}
          disabled={row.currency === "364907247"}
          onChange={(e) => inputHandler("foreignValue", e.target.value, row.id)}
          placeholder="0"
        />
      ),
    },
    {
      headerName: "Comment",
      field: "comment",
      sortable: false,
      flex: 1,
      //   width: "12.5vw",
      renderCell: ({ row }) =>
        !row.total && (
          <Input
            fun={inputHandler}
            onChange={(e) => {
              inputHandler("comment", e.target.value, row.id);
            }}
            value={row?.comment}
            placeholder="Enter a comment..."
          />
        ), //ask
    },
  ];
  const getLedger = async (search) => {
    setSelectLoading(true);
    const { data } = await imsAxios.post("/tally/ledger/ledger_options", {
      search: search,
    });
    setSelectLoading(false);
    if (data.code == 200) {
      const arr = data.data.map((row) => {
        return { text: row.text, value: row.id };
      });
      setAsyncOptions(arr);
    } else {
      setAsyncOptions([]);
    }
  };
  const getHeaderAccount = async (search) => {
    setSelectLoading(true);
    const { data } = await imsAxios.post("/tally/backend/fetchBankLedger", {
      search: search,
    });
    setSelectLoading(false);
    const arr = data.map((row) => {
      return { value: row.id, text: row.text };
    });
    setAsyncOptions(arr);
  };
  const inputHandler = (name, value, id) => {
    let arr = [];
    arr = bankPaymentRows;
    arr = arr.map((row) => {
      console.log(name, value);
      if (row.id == id) {
        let obj = row;
        if (name === "foreignValue") {
          obj = {
            ...obj,
            debit: +Number(+Number(value) * +Number(row.exchangeRate)).toFixed(
              2
            ),
          };
        } else if (name === "currency" && value === "364907247") {
          obj = {
            ...obj,
            exchangeRate: 1,
            foreignValue: 0,
          };
        } else if (name === "exchangeRate") {
          obj = {
            ...obj,
            debit: +Number(+Number(value) * +Number(row.foreignValue)).toFixed(
              2
            ),
          };
        }
        obj = {
          ...obj,
          [name]: value,
        };
        return obj;
      } else {
        return row;
      }
    });
    setBankPaymentRows(arr);
  };
  const submitFunction = async () => {
    let validating = { status: true, message: "" };
    let gls = [];
    let debit = [];
    let comment = [];
    let currency = [];
    let exchangeRate = [];
    if (headerAccount == "") {
      return toast.error("A account is required");
    } else if (effectiveDate == "") {
      return toast.error("Effective date is required");
    }
    bankPaymentRows.map((row) => {
      if (row.gls == "") {
        validating = {
          status: false,
          message: "GLS is required in all the fields",
        };
      } else if (row.debit == "") {
        validating = {
          status: false,
          message: "Debit is required in all the fields",
        };
      }

      if (validating) {
        gls.push(row.glCode ? row.glCode : "");
        debit.push(row.debit);
        comment.push(row.comment);
        currency.push(row.currency);
        exchangeRate.push(row.exchangeRate);
      }
    });
    if (validating.status == false) {
      toast.error(validating.message);
    } else if (validating.status == true) {
      setLoading(true);
      const { data } = await imsAxios.post("/tally/voucher/insert_bp", {
        gls: gls,
        debit: debit,
        comment: comment,
        currency_type: currency,
        exchange_rate: exchangeRate,
        account: headerAccount ? headerAccount : "",
        effective_date: effectiveDate,
      });
      setLoading(false);
      if (data.code == 200) {
        resetFunction();
        toast.success(data.message);
      }
    }
  };
  const resetFunction = () => {
    setHeaderAccount("");
    setBankPaymentRows([
      {
        id: v4(),
        glCode: "",
        credit: "",
        comment: "",
        currency: "364907247",
        exchangeRate: 1,
        foreignValue: 0,
      },
    ]);
  };
  const totalCard = [
    { title: "Total Value", description: totalValues.totalINR },
    { title: "Total Foreign Value", description: totalValues.totalForeign },
  ];
  useEffect(() => {
    getCurrencies();
  }, []);
  useEffect(() => {
    let totalINR = bankPaymentRows.map((row) => +Number(row.debit).toFixed(2));
    let totalForeign = bankPaymentRows.map(
      (row) => +Number(row.foreignValue).toFixed(2)
    );
    let totalINRValue = () => {
      let sum = 0;
      for (let i = 0; i < totalINR.length; i++) {
        sum += totalINR[i];
      }
      return sum;
    };
    let totalForeignValue = () => {
      let sum = 0;
      for (let i = 0; i < totalForeign.length; i++) {
        sum += totalForeign[i];
      }
      return sum;
    };
    setTotalValues({
      totalINR: totalINRValue(),
      totalForeign: totalForeignValue(),
    });
  }, [bankPaymentRows]);
  return (
    <div
      style={{
        height: "90%",
      }}
    >
      <Row gutter={8} style={{ height: "100%", padding: "0px 10px" }}>
        <Col span={6}>
          <Row gutter={[0, 6]}>
            <Col span={24}>
              <Card title="Header Detail" size="small">
                <Form layout="vertical" size="small">
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label="Select Account"
                        rules={[
                          {
                            required: true,
                            message: "Select Account",
                          },
                        ]}
                      >
                        <MyAsyncSelect
                          size="default"
                          sectLoading={selectLoading}
                          optionsState={asyncOptions}
                          onBlur={() => setAsyncOptions([])}
                          loadOptions={getHeaderAccount}
                          value={headerAccount}
                          placeholder="Select Account.."
                          onChange={(value) => setHeaderAccount(value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="Select Effective Date"
                        rules={[
                          {
                            required: true,
                            message: "Select Effective Date",
                          },
                        ]}
                      >
                        <SingleDatePicker
                          size="default"
                          setDate={setSetEffective}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
            <Col span={24}>
              <SummaryCard title="Summary" summary={totalCard} />
            </Col>
          </Row>
        </Col>
        <Col
          style={{
            height: "90%",
            border: "1px solid #eeeeee",
            padding: "0px 0px",
          }}
          span={18}
        >
          <FormTable
            hideHeaderMenu
            data={bankPaymentRows}
            columns={BankPaymentTable}
          />
        </Col>
      </Row>
      <NavFooter
        resetFunction={resetFunction}
        submitFunction={submitFunction}
        nextLabel="SUBMIT"
        loading={loading}
      />
    </div>
  );
}
