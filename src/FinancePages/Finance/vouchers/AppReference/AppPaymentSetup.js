import React, { useEffect, useState } from "react";
import { Col, Row, Button, Divider, Input } from "antd";
import MyAsyncSelect from "../../../../Components/MyAsyncSelect";
import axios from "axios";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import MyDataTable from "../../../../Components/MyDataTable";
import { CaretRightOutlined, CaretLeftOutlined } from "@ant-design/icons";
import { imsAxios } from "../../../../axiosInterceptor";
import ToolTipEllipses from "../../../../Components/ToolTipEllipses";

function AppPaymentSetup() {
  const [allRefData, setAllRefData] = useState({
    vendorName: "",
  });

  const [selectLoading, setSelectLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState([]);
  const [voucherData, setVoucherData] = useState([]);

  const [tableOne, setTableOne] = useState([]);
  const [tableOne1, setTableOne1] = useState([]);
  // console.log(tableOne1);
  const getInfo = async (search) => {
    allRefData.vendorName = "";
    allRefData.vendorID = "";
    setSelectLoading(true);
    const { data } = await imsAxios.post("/tally/ap/fetchVendorLedger", {
      search: search,
    });
    setSelectLoading(false);
    const arr = data.map((row) => {
      return { value: row.id, text: row.text };
    });
    setAsyncOptions(arr);
  };

  const fetchData = async () => {
    setLoading(true);
    setBillData([]);
    setVoucherData([]);
    const { data } = await imsAxios.post("/tally/ap/fetchApData", {
      vendor: allRefData?.vendorName,
    });
    if (data.code == 200) {
      const arr = data?.bill_data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      const arr1 = data?.voucher_data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setBillData(arr);
      setVoucherData(arr1);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setAllRefData({
        vendorName: "",
      });
      setLoading(false);
    }
  };

  const inputHandler = async (name, value, id) => {
    // console.log(name, value, id);
    if (name == "so_amm") {
      setTableOne1((issueQty) =>
        issueQty.map((a) => {
          if (a.index == id) {
            {
              return { ...a, so_amm: value };
            }
          } else {
            return a;
          }
        })
      );
    }
  };

  // --------------
  const arrAmount = [];
  const arrVourcher = [];
  tableOne1.map((a) => arrAmount.push(a.so_amm));
  tableOne1.map((a) => arrVourcher.push(a.voucher_code));
  // console.log(arrAmount);

  // length check
  const lenCheck = arrAmount.length;

  const totalAmount = [];
  for (var i = 0; i < lenCheck; i++) {
    totalAmount.push(parseInt(arrAmount[i]));
  }
  const finalTotalAmount = totalAmount.reduce((partialSum, a) => partialSum + a, 0);

  // second table
  const arrAmountSecond = [];
  tableOne.map((a) => arrAmountSecond.push(a.os_amm));

  // length check
  const lenCheckSecond = arrAmountSecond.length;

  const totalSomSecond = [];
  for (var i = 0; i < lenCheckSecond; i++) {
    totalSomSecond.push(parseInt(arrAmountSecond[i]));
  }
  const finalTotalSo = totalSomSecond.reduce((partialSum, a) => partialSum + a, 0);
  // console.log(finalTotalSo);

  const columns1 = [
    { field: "effective_date", headerName: "EFFECTIVE DATE", width: 130 },
    {
      field: "voucher_code",
      headerName: "VOUCHER CODE",
      width: 120,
      renderCell: ({ row }) => <ToolTipEllipses text={row.voucher_code} />,
    },
    {
      field: "so_amm",
      headerName: "S/O AMOUNT",
      width: 200,
      renderCell: ({ row }) => (
        <Input
          suffix={row?.so_amm}
          onChange={(e) => inputHandler("so_amm", e.target.value, row.index)}
        />
      ),
    },
    {
      field: "bank",
      headerName: "BANK",
      width: 150,
      renderCell: ({ row }) => <ToolTipEllipses text={row.bank} />,
    },
  ];

  const columns = [
    { field: "v_code", headerName: "VENDOR CODE", width: 120 },
    { field: "invoice_date", headerName: "INVOICE DATE", width: 120 },
    { field: "invoice_number", headerName: "INVOICE", width: 130 },
    {
      field: "os_amm",
      headerName: "O/S  AMOUNT",
      width: 130,
      renderCell: ({ row }) => (
        <span style={{ fontWeight: "bolder" }}>₹ {row?.os_amm}</span>
      ),
    },
    {
      field: "ammount",
      headerName: "AMOUNT",
      width: 120,
      renderCell: ({ row }) => (
        <span style={{ fontWeight: "bolder" }}>₹ {row?.ammount.toString(2)}</span>
      ),
    },
    {
      field: "clear_amm",
      headerName: "CLEAR AMOUNT",
      width: 130,
      renderCell: ({ row }) => (
        <span style={{ fontWeight: "bolder" }}>₹ {row?.clear_amm}</span>
      ),
    },
  ];

  const saveFunction = async () => {
    setLoad(true);
    const refNo = [];

    tableOne?.map((a) => refNo.push(a.v_key));

    const conRef = refNo.toString();
    const cona = totalSomSecond.toString();

    const { data } = await imsAxios.post("/tally/ap/paymentSetup", {
      ref_no: conRef,
      os_ammount: cona,
      so_ref_no: arrVourcher,
      so_ammount: totalAmount,
      vendor: allRefData?.vendorName,
    });
    // console.log(data);
    if (data.code == 200) {
      toast.success(data.message);
      fetchData();
      setLoad(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoad(false);
    }
  };

  const setFunction1 = (ids) => {
    const selectedIDs1 = new Set(ids);
    const selectedRowData1 = voucherData.filter((row) =>
      selectedIDs1.has(row.id.toString())
    );
    setTableOne1(selectedRowData1);
  };

  const setFunction = (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRowData = billData.filter((row) => selectedIDs.has(row.id.toString()));
    setTableOne(selectedRowData);
  };

  // {finalTotalSo}finalTotalAmount
  const totalFinalSubstraction = finalTotalSo - finalTotalAmount;

  return (
    <div style={{ height: "90%" }}>
      <Row gutter={10} style={{ margin: "5px" }}>
        <Col span={6}>
          <MyAsyncSelect
            size="default"
            sectLoading={selectLoading}
            optionsState={asyncOptions}
            onBlur={() => setAsyncOptions([])}
            loadOptions={getInfo}
            value={allRefData?.vendorName}
            placeholder="Vendor name"
            onChange={(e) =>
              setAllRefData((allRefData) => {
                return { ...allRefData, vendorName: e };
              })
            }
          />
        </Col>
        <Col span={1}>
          <Button
            onClick={fetchData}
            type="primary"
            loading={loading}
            disabled={allRefData?.vendorName?.length > 0 ? false : true}
          >
            Fetch
          </Button>
        </Col>
      </Row>

      <Row gutter={10} style={{ margin: "5px", height: "94%" }}>
        <Col span={11}>
          <MyDataTable
            data={voucherData}
            columns={columns1}
            checkboxSelection={true}
            loading={loading}
            onSelectionModelChange={(ids) => setFunction1(ids)}
          />
        </Col>

        <Col span={2}>
          <Row gutter={10}>
            <Divider />
            <Col span={24} style={{ textAlign: "center" }}>
              <span style={{ fontWeight: "bolder", fontSize: "10px" }}>Balance Amount</span>
            </Col>
            {totalFinalSubstraction >= 0 ? (
              <Col style={{ textAlign: "center" }} span={24}>
                <span style={{ color: "green", fontWeight: "bolder" }}>
                  {totalFinalSubstraction}
                </span>
              </Col>
            ) : (
              <Col style={{ textAlign: "center" }} span={24}>
                <span style={{ color: "red", fontWeight: "bolder" }}>
                  {totalFinalSubstraction}
                </span>
              </Col>
            )}

            <Divider />
            <Col span={24} style={{ marginTop: "10px", textAlign: "center" }}>
              <span style={{ fontWeight: "bolder", fontSize: "10px" }}>PAYMENT AMOUNT</span>
            </Col>
            <Col span={24} style={{ textAlign: "center", fontSize: "10px" }}>
              {finalTotalAmount}
            </Col>
            <Divider />

            <Col span={24} style={{ marginTop: "10px", textAlign: "center" }}>
              <span style={{ fontWeight: "bolder", fontSize: "10px" }}>
                TOTAL BILL AMOUNT
              </span>
            </Col>
            <Col span={24} style={{ textAlign: "center", fontSize: "10px" }}>
              {finalTotalSo}
            </Col>

            <Divider />

            <Col span={24} style={{ marginTop: "0px", textAlign: "center" }}>
              <Button
                loading={load}
                disabled={
                  finalTotalSo > 0 && finalTotalAmount > 0 && totalFinalSubstraction >= 0
                    ? false
                    : true
                }
                onClick={saveFunction}
                type="primary"
              >
                Settle
              </Button>
            </Col>

            <Divider />

            {/* <Col span={24} style={{ textAlign: "center" }}>
              <Button
                // onClick={reset}
                // block
                style={{ backgroundColor: "red", color: "white" }}
              >
                Reset
              </Button>
            </Col> */}
          </Row>
        </Col>

        <Col span={11} style={{}}>
          <MyDataTable
            data={billData}
            columns={columns}
            onSelectionModelChange={(ids) => setFunction(ids)}
            checkboxSelection={true}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
}

export default AppPaymentSetup;
