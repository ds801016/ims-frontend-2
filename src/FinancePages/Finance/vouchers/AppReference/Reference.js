import React, { useEffect, useState } from "react";
import { Button, Checkbox, Col, Divider, Input, Row, Select, Switch } from "antd";

import { toast } from "react-toastify";

import { CaretRightOutlined, CaretLeftOutlined } from "@ant-design/icons";
import { v4 } from "uuid";
import { GridActionsCellItem } from "@mui/x-data-grid";
// import { CListGroup } from "@coreui/react";
import MyAsyncSelect from "../../../../Components/MyAsyncSelect";
import MyDataTable from "../../../../Components/MyDataTable";
import { imsAxios } from "../../../../axiosInterceptor";
import ToolTipEllipses from "../../../../Components/ToolTipEllipses";

function Reference() {
  const [allRefData, setAllRefData] = useState({
    vendorName: "",

    // vCode:""
  });
  const [selectLoading, setSelectLoading] = useState(false);
  const [selectLoad, setSelectLoad] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState([]);
  const [voucherData, setVoucherData] = useState([]);
  const [tableOne, setTableOne] = useState([]);
  const [tableSecond, setTableSecond] = useState([]);

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
    if (name == "os_amm") {
      setTableOne((issueQty) =>
        issueQty.map((a) => {
          if (a.index == id) {
            {
              return { ...a, os_amm: value };
            }
          } else {
            return a;
          }
        })
      );
    }
  };
  // console.log(tableOne);

  const tableOneOsmAmount = [];
  tableOne.map((osmA) => tableOneOsmAmount.push(osmA.os_amm));

  // length check
  const lenCheck = tableOneOsmAmount.length;

  const totalOsm = [];
  for (var i = 0; i < lenCheck; i++) {
    totalOsm.push(parseInt(tableOneOsmAmount[i]));
  }
  // console.log(totalOsm);

  const finalTotalOsm = totalOsm.reduce((partialSum, a) => partialSum + a, 0);

  // second table
  const tableSecondOsmAmount = [];
  tableSecond.map((osmB) => tableSecondOsmAmount.push(osmB.so_amm));

  // length check
  const lenCheckSecond = tableSecondOsmAmount.length;

  const totalSom = [];
  for (var i = 0; i < lenCheckSecond; i++) {
    totalSom.push(parseInt(tableSecondOsmAmount[i]));
  }
  const finalTotalSo = totalSom.reduce((partialSum, a) => partialSum + a, 0);
  // console.log(totalSom);

  const finalSubstraction = finalTotalSo - finalTotalOsm;

  const columns = [
    {
      field: "invoice_date",
      headerName: "INVOICE DATE",
      width: 100,
      renderCell: ({ row }) => <ToolTipEllipses text={row.invoice_date} />,
    },
    {
      field: "invoice_number",
      headerName: "INVOICE",
      width: 130,
      renderCell: ({ row }) => <ToolTipEllipses text={row.invoice_number} />,
    },
    {
      field: "os_amm",
      headerName: "O/S  AMOUNT",
      width: 200,
      renderCell: ({ row }) => (
        <Input
          suffix={row?.os_amm}
          // disabled={tableOneOsmId == row?.id ? false : true}
          onChange={(e) => inputHandler("os_amm", e.target.value, row.index)}
        />
      ),
    },
    {
      field: "ammount",
      headerName: "BILL AMOUNT",
      width: 120,
    },
    { field: "clear_amm", headerName: "CLEAR AMOUNT", width: 130 },
  ];

  const columns1 = [
    // { field: "index", headerName: "NO.", width: 60 },
    {
      field: "voucher_code",
      headerName: "VOUCHER CODE",
      width: 130,
      renderCell: ({ row }) => <ToolTipEllipses text={row.voucher_code} />,
    },
    { field: "so_amm", headerName: "AMOUNT", width: 100 },
    {
      field: "bank",
      headerName: "BANK",
      width: 200,
      renderCell: ({ row }) => <ToolTipEllipses text={row.bank} />,
    },
    { field: "effective_date", headerName: "EFFECTIVE DATE", width: 150 },
  ];

  // Selected Row
  const setFunction = (ids) => {
    const selectedIDs = new Set(ids);
    const selectedRowData = billData.filter((row) => selectedIDs.has(row.id.toString()));
    setTableOne(selectedRowData);
  };

  const setFunctionSecond = (ids) => {
    const selectedIDs1 = new Set(ids);
    const selectedRowData1 = voucherData.filter((row) =>
      selectedIDs1.has(row.id.toString())
    );
    setTableSecond(selectedRowData1);
  };

  const saveFunction = async () => {
    setSelectLoad(true);
    const arr = [];
    const so_ref = [];
    tableOne?.map((a) => arr.push(a.v_key));
    tableSecond?.map((a) => so_ref.push(a.voucher_code));
    const conRef = so_ref.toString();
    // console.log(arr, totalOsm, totalSom, conRef);

    const { data } = await imsAxios.post("/tally/ap/insertAp", {
      ref_no: arr,
      os_ammount: totalOsm,
      so_ref_no: conRef,
      so_ammount: totalSom,
      vendor: allRefData?.vendorName,
    });
    if (data.code == 200) {
      toast.success(data.message);
      fetchData();
      setSelectLoad(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setSelectLoad(false);
    }
  };

  return (
    <div style={{ height: "90%" }}>
      <Row gutter={10} style={{ margin: "10px" }}>
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

      <Row gutter={10}>
        <Col span={11}>
          <div style={{ height: "75vh", margin: "10px" }}>
            <MyDataTable
              data={billData}
              columns={columns}
              onSelectionModelChange={(ids) => setFunction(ids)}
              checkboxSelection={true}
              loading={loading}
            />
          </div>
        </Col>

        <Col span={2}>
          <Row gutter={10}>
            <Divider />
            <Col span={24} style={{ textAlign: "center" }}>
              <span style={{ fontWeight: "bolder", fontSize: "10px" }}>Balance Amount</span>
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
              {finalSubstraction >= 0 ? (
                <span style={{ color: "green", fontWeight: "bolder" }}>
                  {finalSubstraction}
                </span>
              ) : (
                <span style={{ color: "red", fontWeight: "bolder" }}>
                  {finalSubstraction}
                </span>
              )}
            </Col>
            <Divider />
            <Col span={24} style={{ marginTop: "10px", textAlign: "center" }}>
              <span style={{ fontWeight: "bolder", fontSize: "10px" }}>
                TOTAL BILL AMOUNT
              </span>
            </Col>
            <Col span={24} style={{ textAlign: "center", fontSize: "10px" }}>
              <span>{finalTotalOsm}</span>
            </Col>

            <Divider />
            <Col span={24} style={{ marginTop: "10px", textAlign: "center" }}>
              <span style={{ fontWeight: "bolder", fontSize: "10px" }}>PAYMENT AMOUNT</span>
            </Col>
            <Col span={24} style={{ textAlign: "center", fontSize: "10px" }}>
              <span>{finalTotalSo}</span>
            </Col>

            <Divider />

            <Col span={24} style={{ marginTop: "0px", textAlign: "center" }}>
              <Button
                loading={selectLoad}
                onClick={saveFunction}
                disabled={
                  finalTotalOsm > 0 && finalTotalSo > 0 && finalSubstraction >= 0
                    ? false
                    : true
                }
                type="primary"
              >
                Settle
              </Button>
            </Col>

            <Divider />

            {/* {billData.length > 0 && (
              <Col span={24} style={{ textAlign: "center" }}>
                <Button
                  onClick={reset}
                  // block
                  style={{ backgroundColor: "red", color: "white" }}
                >
                  Reset
                </Button>
              </Col>
            )} */}
          </Row>
        </Col>

        <Col span={11}>
          <div style={{ height: "75vh", margin: "10px" }}>
            <MyDataTable
              data={voucherData}
              columns={columns1}
              checkboxSelection={true}
              loading={loading}
              onSelectionModelChange={(ids) => setFunctionSecond(ids)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Reference;
