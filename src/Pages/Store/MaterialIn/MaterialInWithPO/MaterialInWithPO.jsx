import React, { useState, useEffect } from "react";
import NavFooter from "../..//../../Components/NavFooter";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Skeleton,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  QuantityCell,
  taxableCell,
  foreignCell,
  invoiceIdCell,
  invoiceDateCell,
  HSNCell,
  gstTypeCell,
  CGSTCell,
  SGSTCell,
  IGSTCell,
  locationCell,
  remarkCell,
  rateCell,
  autoConsumptionCell,
  gstRate,
} from "./TableCollumns";
import CurrenceModal from "../CurrenceModal";
import UploadDocs from "./UploadDocs";
import MyAsyncSelect from "../../../../Components/MyAsyncSelect";
import ToolTipEllipses from "../../../../Components/ToolTipEllipses";
import FormTable from "../../../../Components/FormTable";
import { CommonIcons } from "../../../../Components/TableActions.jsx/TableActions";
import SuccessPage from "../SuccessPage";
import { imsAxios } from "../../../../axiosInterceptor";

export default function MaterialInWithPO({}) {
  document.title = "Material IN with PO";
  const [poData, setPoData] = useState({ materials: [] });
  const [resetPoData, setResetPoData] = useState({ materials: [] });
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [materialInward, setMaterialInward] = useState(null);
  const [selectLoading, setSelectLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    vendor: "",
    poNumber: "",
  });
  const [showCurrency, setShowCurrenncy] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [showUploadDoc, setShowUploadDoc] = useState(false);
  const [autoConsumptionOptions, setAutoConsumptionOption] = useState([]);
  const [totalValues, setTotalValues] = useState([
    { label: "cgst", sign: "+", values: [] },
    { label: "sgst", sign: "+", values: [] },
    { label: "cigst", sign: "+", values: [] },
    { label: "Sub-Total value before Taxes", sign: "", values: [] },
  ]);
  const [currencies, setCurrencies] = useState([]);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showVendorInfo, setShowVendorInfo] = useState(false);
  const [materialInSuccess, setMaterialInSuccess] = useState(false);
  const [showMINSubmitConfirm, setShowMINSubmitConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);

  const validateData = async () => {
    let validation = false;
    poData.materials.map((row) => {
      if (
        row.c_partno &&
        row.currency &&
        row.gstrate &&
        row.invoiceDate &&
        row.invoiceId &&
        row.location &&
        row.orderqty
      ) {
        validation = true;
      } else {
        validation = false;
      }
    });
    let componentData = {
      qty: [],
      rate: [],
      currency: [],
      exchange: [],
      invoice: [],
      invoiceDate: [],
      hsncode: [],
      gsttype: [],
      gstrate: [],
      cgst: [],
      sgst: [],
      igst: [],
      remark: [],
      location: [],
      out_location: [],
      component: [],
    };
    if (validation == true) {
      let formData = new FormData();
      if (invoices.length) {
        invoices.map((file) => {
          formData.append("files", file);
          poData.materials.map((row) => {
            componentData = {
              component: [...componentData.component, row.componentKey],
              qty: [...componentData.qty, row.orderqty],
              rate: [...componentData.rate, row.orderrate],
              currency: [...componentData.currency, row.currency],
              exchange: [
                ...componentData.exchange,
                row.exchange_rate == 0 && 1,
              ],
              invoice: [...componentData.invoice, row.invoiceId],
              invoiceDate: [...componentData.invoiceDate, row.invoiceDate],
              hsncode: [...componentData.hsncode, row.hsncode],
              gsttype: [...componentData.gsttype, row.gsttype],
              gstrate: [...componentData.gstrate, row.gstrate],
              cgst: [...componentData.cgst, row.cgst],
              sgst: [...componentData.sgst, row.sgst],
              igst: [...componentData.igst, row.igst],
              remark: [...componentData.remark, row.orderremark],
              location: [...componentData.location, row.location],
              out_location: [
                ...componentData.out_location,
                row.autoConsumption,
              ],
            };
          });
        });
        if (
          (componentData.currency.filter((v, i, a) => v === a[0]).length ===
            componentData.currency.length) !=
          true
        ) {
          validation = false;
          return toast.error("Currency of all components should be the same");
        } else if (
          (componentData.gsttype.filter((v, i, a) => v === a[0]).length ===
            componentData.gsttype.length) !=
          true
        ) {
          validation = false;
          return toast.error("gst type of all components should be the same");
        }
        //uploading invoices
        setShowMINSubmitConfirm({
          formData: formData,
          componentData: componentData,
        });
      } else {
        toast.error("Please add at least one document");
      }
    } else {
      toast.error("Please Provide all the values of all the components");
    }
  };

  const submitMIN = async () => {
    if (showMINSubmitConfirm.formData) {
      setSubmitLoading(true);
      const { data: fileData } = await imsAxios.post(
        "/transaction/upload-invoice",
        showMINSubmitConfirm.formData
      );
      if (fileData.code == "200") {
        let final = {
          companybranch: "BRMSC012",
          invoices: fileData.data,
          poid: poData.vendor_type.transaction,
        };
        final = { ...final, ...showMINSubmitConfirm.componentData };
        const { data } = await imsAxios.post("/purchaseOrder/poMIN", final);
        setSubmitLoading(false);
        setShowMINSubmitConfirm(false);
        if (data.code == "200") {
          setSearchData({
            vendor: "",
            poNumber: "",
          });
          setInvoices([]);
          setMaterialInSuccess({
            materialInId: data.transaction_id,
            poId: poData.vendor_type.transaction,
            vendor: poData.vendor_type,
            components: poData.materials.map((row) => {
              return {
                id: row.c_partno,
                componentName: row.component_fullname,
                partNo: row.c_partno,
                inQuantity: row.orderqty,
                invoiceNumber: row.invoiceId,
                invoiceDate: row.invoiceDate,
                location: row.locationName,
                poQuantity: row.po_order_qty,
              };
            }),
          });
        } else {
          toast.error(data.message.msg);
        }
      } else {
        toast.error(
          "Some error occured while uploading invoices, Please try again"
        );
      }
    }
  };
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
    setCurrencies(arr);
  };
  const getLocation = async () => {
    const { data } = await imsAxios.post("/transaction/getLocationInMin", {
      search: "",
    });
    let arr = data.data.data;
    if (data.code == 200) {
      let arr = data.data.data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setLocationOptions(arr);
    } else {
      setAsyncOptions([]);
    }
    return arr;
  };
  const getAutoComnsumptionOptions = async () => {
    const { data } = await imsAxios.get(
      "/transaction/fetchAutoConsumpLocation"
    );
    if (data.code == 200) {
      let arr = data.data.map((row) => {
        return {
          value: row.id,
          text: row.text,
        };
      });
      arr = [{ value: 0, text: "NO" }, ...arr];
      setAutoConsumptionOption(arr);
    }
  };
  const inputHandler = (name, value, id) => {
    console.log(poData);
    let arr = poData?.materials;
    arr = arr.map((row) => {
      let obj = row;
      if (id == row.serial_no) {
        if (name == "orderqty") {
          if (value <= row.maxQty) {
            obj = {
              ...obj,
              [name]: value,
              inrValue: value * row.orderrate,
              usdValue: value * row.orderrate * row.exchange_rate,
              igst:
                row.gsttype == "L"
                  ? 0
                  : (value * row.orderrate * row.gstrate) / 100,
              sgst:
                row.gsttype == "I"
                  ? 0
                  : (value * row.orderrate * row.gstrate) / 200,
              cgst:
                row.gsttype == "I"
                  ? 0
                  : (value * row.orderrate * row.gstrate) / 200,
            };
          }
          return obj;
        } else if (name == "orderrate") {
          obj = {
            ...obj,
            [name]: value,
            inrValue: value * row.orderqty,
            usdValue: value * row.orderqty * row.exchange_rate,
            igst:
              row.gsttype == "L"
                ? 0
                : (value * row.orderqty * row.gstrate) / 100,
            sgst:
              row.gsttype == "I"
                ? 0
                : (value * row.orderqty * row.gstrate) / 200,
            cgst:
              row.gsttype == "I"
                ? 0
                : (value * row.orderqty * row.gstrate) / 200,
          };
          return obj;
        } else if (name == "gsttype") {
          if (value == "I") {
            obj = {
              ...obj,
              [name]: value,
              igst: (row.inrValue * row.gstrate) / 100,
              sgst: 0,
              cgst: 0,
            };
          } else if (value == "L") {
            obj = {
              ...obj,
              igst: 0,
              [name]: value,
              sgst: (row.inrValue * row.gstrate) / 200,
              cgst: (row.inrValue * row.gstrate) / 200,
            };
          }
          return obj;
        } else if (name == "gstrate") {
          obj = {
            ...obj,
            [name]: value,
            igst: row.gsttype == "L" ? 0 : (value * row.inrValue) / 100,
            sgst: row.gsttype == "I" ? 0 : (value * row.inrValue) / 200,
            cgst: row.gsttype == "I" ? 0 : (value * row.inrValue) / 200,
          };
          return obj;
        } else if (name == "currency") {
          if (value == "364907247") {
            obj = {
              ...obj,
              currency: value,
              usdValue: 0,
              exchange_rate: 1,
            };
          } else {
            obj = {
              ...obj,
              [name]: value,
            };
            setShowCurrenncy({
              currency: value,
              price: row.inrValue,
              exchange_rate: row.exchange_rate,
              symbol: currencies.filter((cur) => cur.value == value)[0].text,
              rowId: row.serial_no,
              inputHandler: inputHandler,
            });
          }

          return obj;
        } else if (name == "exchange_rate") {
          obj = {
            ...obj,
            exchange_rate: value.rate,
            currency: value.currency,
            usdValue: row.inrValue * value.rate,
          };
          return obj;
        } else if (name == "location") {
          obj = {
            ...obj,
            [name]: value?.value,
            locationName: value?.label,
          };
          return obj;
        } else {
          obj = { ...obj, [name]: value };
          return obj;
        }
      } else {
        return row;
      }
    });
    setPoData((poData) => {
      return {
        ...poData,
        materials: arr,
      };
    });
  };
  const backFunction = () => {
    setMaterialInward(null);
  };
  const getVendors = async (productSearchInput) => {
    if (productSearchInput?.length > 2) {
      setSelectLoading(true);
      const { data } = await imsAxios.post("/backend/vendorList", {
        search: productSearchInput,
      });
      setSelectLoading(false);
      let arr = [];
      if (!data.msg) {
        arr = data.map((d) => {
          return { text: d.text, value: d.id };
        });
        setAsyncOptions(arr);
      } else {
        setAsyncOptions([]);
      }
    }
  };
  const resetFunction = () => {
    setPoData(resetPoData);
    setInvoices([]);
    setShowResetConfirm(false);
  };

  const getDetail = async () => {
    setSearchLoading(true);
    setPoData({ materials: [] });
    let search = {
      po: searchData.poNumber.trim(),
      vendor: searchData.vendor,
    };
    const { data } = await imsAxios.post(
      "/purchaseOrder/fetchVendorPO",
      search
    );
    setSearchLoading(false);

    if (data.code == 200) {
      let obj = data.data;
      obj = {
        ...obj,
        poId: searchData.poNumber,
        materials: obj.materials.map((mat, index) => {
          let percentage = mat.gstrate;
          return {
            // adding properties in materials array
            ...mat,
            id: index,
            gsttype: mat.gsttype,
            inrValue: mat?.orderqty * mat?.orderrate,
            cgst:
              mat.gsttype == "I"
                ? 0
                : (mat?.orderqty * mat?.orderrate * (percentage / 2)) / 100,
            sgst:
              mat.gsttype == "I"
                ? 0
                : (mat?.orderqty * mat?.orderrate * (percentage / 2)) / 100,
            igst:
              mat.gsttype == "L"
                ? 0
                : (mat?.orderqty * mat?.orderrate * percentage) / 100,
            invoiceDate: "",
            invoiceId: "",
            location: "",
            maxQty: mat?.orderqty,
            autoConsumption: 0,
          };
        }),
      };
      setPoData(obj);
      setResetPoData(obj);
    } else {
      toast.error(data.message.msg);
      setPoData({ materials: [] });
      //   toast.error("Some error Occurred");
    }
  };
  const removeRow = (id) => {
    let arr = poData?.materials;
    arr = arr.filter((row) => row.id != id);
    setPoData((data) => ({ ...data, materials: arr }));
  };
  const columns = [
    {
      headerName: <></>,
      width: 40,
      field: "add",
      sortable: false,
      renderCell: ({ row }) => (
        // row.index >= 2 && (
        <CommonIcons action="removeRow" onClick={() => removeRow(row?.id)} />
      ),
      // ),
      // sortable: false,
    },
    {
      headerName: "Component",
      field: "component_fullname",
      // sortable: false,
      width: 200,
      renderCell: ({ row }) => (
        <ToolTipEllipses text={row.component_fullname} />
      ),
      // width: 150,
    },
    {
      headerName: "Part No.",
      field: "c_partno",
      renderCell: ({ row }) => <ToolTipEllipses text={row.c_partno} />,
      sortable: false,
      width: 80,
    },
    {
      headerName: "QTY",
      field: "gstqty",
      sortable: false,
      renderCell: (params) => QuantityCell(params, inputHandler),
      width: 120,
    },
    {
      headerName: "Rate",
      field: "orderrate",
      sortable: false,
      renderCell: (params) => rateCell(params, inputHandler, currencies),
      width: 180,
    },
    {
      headerName: "Taxable Value",
      field: "inrValue",
      sortable: false,
      renderCell: taxableCell,
      width: 120,
    },
    {
      headerName: "Foreign Value",
      field: "usdValue",
      sortable: false,
      renderCell: foreignCell,
      width: 120,
    },
    {
      headerName: "Invoice ID",
      field: "invoiceId",
      sortable: false,
      renderCell: (params) => invoiceIdCell(params, inputHandler),
      width: 200,
    },
    {
      headerName: "Invoice Date",
      field: "invoiceDate",
      sortable: false,
      renderCell: (params) => invoiceDateCell(params, inputHandler),
      width: 120,
    },
    {
      headerName: "HSN Code",
      field: "hsncode",
      sortable: false,
      renderCell: (params) => HSNCell(params, inputHandler),
      width: 150,
    },
    {
      headerName: "GST Type",
      field: "gsttype",
      sortable: false,
      renderCell: (params) => gstTypeCell(params, inputHandler),
      // flex: 1,
      width: 200,
    },
    {
      headerName: "GST Rate",
      field: "gstrate",
      sortable: false,
      renderCell: (params) => gstRate(params, inputHandler),
      // flex: 1,
      width: 100,
    },
    {
      headerName: "CGST",
      renderCell: (params) => CGSTCell(params, inputHandler),
      // flex: 1,
      field: "cgst",
      sortable: false,
      width: 120,
    },
    {
      headerName: "SGST",
      renderCell: (params) => SGSTCell(params, inputHandler),
      // flex: 1,
      field: "sgst",
      sortable: false,
      width: 120,
    },
    {
      headerName: "IGST",
      renderCell: (params) => IGSTCell(params, inputHandler),
      // flex: 1,
      field: "igst",
      sortable: false,
      width: 120,
    },
    {
      headerName: "Location",
      field: "location",
      sortable: false,
      renderCell: (params) =>
        locationCell(params, inputHandler, locationOptions),
      width: 150,
    },
    {
      headerName: "Auto Consump",
      field: "autoConsumption",
      sortable: false,
      renderCell: (params) =>
        autoConsumptionCell(params, inputHandler, autoConsumptionOptions),
      width: 150,
    },
    {
      headerName: "Remarks",
      field: "orderremark",
      sortable: false,
      renderCell: (params) => remarkCell(params, inputHandler),
      width: 250,
    },
  ];
  const successColumns = [
    {
      headerName: "Component",
      renderCell: ({ row }) => <ToolTipEllipses text={row.componentName} />,
      field: "componentName",
      flex: 1,
    },
    { headerName: "Part No.", field: "partNo", flex: 1 },
    { headerName: "PO Quantity", field: "poQuantity", flex: 1 },
    { headerName: "In Quantity", field: "inQuantity", flex: 1 },
    { headerName: "Invoice Number", field: "invoiceNumber", flex: 1 },
    { headerName: "Invoice Date", field: "invoiceDate", flex: 1 },
    { headerName: "Location", field: "location", flex: 1 },
  ];
  const newMinFunction = () => {
    setMaterialInSuccess(false);
    setPoData({ materials: [] });
    setResetPoData({ materials: [] });
  };
  const additional = () => (
    <Space>
      <div style={{ width: 250 }}>
        <MyAsyncSelect
          allowClear
          size="default"
          selectLoading={selectLoading}
          onBlur={() => setAsyncOptions([])}
          value={searchData.vendor == "" ? null : searchData.vendor}
          onChange={(value) =>
            setSearchData((searchData) => ({ ...searchData, vendor: value }))
          }
          loadOptions={getVendors}
          optionsState={asyncOptions}
          placeholder="Select Vendor..."
        />
      </div>
      <div style={{ width: 150 }}>
        <Input
          allowClear
          placeholder="PO Number"
          value={searchData.poNumber}
          onChange={(e) =>
            setSearchData((searchData) => ({
              ...searchData,
              poNumber: e.target.value,
            }))
          }
        />
      </div>
      <Button
        disabled={searchData.vendor == "" || searchData.poNumber == ""}
        type="primary"
        loading={searchLoading}
        onClick={getDetail}
        id="submit"
      >
        Search
      </Button>

      {/* <CommonIcons
        action="downloadButton"
        onClick={() => downloadCSV(rows, columns, "Pending PO Report")}
        disabled={rows.length == 0}
      /> */}
    </Space>
  );

  useEffect(() => {
    // getDetail();
    getLocation();
    getCurrencies();
    getAutoComnsumptionOptions();
  }, []);
  useEffect(() => {
    let grandTotal = poData?.materials.map((row) =>
      Number(row?.cgst + row?.sgst + row?.igst + row.inrValue)
    );
    let cgsttotal = poData?.materials.map((row) => Number(row?.cgst));
    let sgsttotal = poData?.materials.map((row) => Number(row?.sgst));
    let igsttotal = poData?.materials.map((row) => Number(row?.igst));
    let inrValue = poData?.materials.map((row) => Number(row?.inrValue));
    let obj = [
      { label: "Sub-Total value before Taxes", sign: "", values: inrValue },
      { label: "CGST", sign: "+", values: cgsttotal },
      { label: "SGST", sign: "+", values: sgsttotal },
      { label: "IGST", sign: "+", values: igsttotal },
      { label: "Sub-Total values after Taxes", sign: "", values: grandTotal },
    ];
    setTotalValues(obj);
  }, [poData]);
  const { Text } = Typography;
  return (
    <div style={{ height: "90%", position: "relative" }}>
      <Row
        justify="space-between"
        style={{ padding: "0px 10px", paddingBottom: 5 }}
      >
        <Col>
          <Space>
            <div style={{ width: 250 }}>
              <MyAsyncSelect
                allowClear
                size="default"
                selectLoading={selectLoading}
                onBlur={() => setAsyncOptions([])}
                value={searchData.vendor}
                onChange={(value) =>
                  setSearchData((searchData) => ({
                    ...searchData,
                    vendor: value,
                  }))
                }
                loadOptions={getVendors}
                optionsState={asyncOptions}
                placeholder="Select Vendor..."
              />
            </div>
            <div style={{ width: 150 }}>
              <Input
                allowClear
                placeholder="PO Number"
                value={searchData.poNumber}
                onChange={(e) =>
                  setSearchData((searchData) => ({
                    ...searchData,
                    poNumber: e.target.value,
                  }))
                }
              />
            </div>
            <Button
              disabled={searchData.vendor == "" || searchData.poNumber == ""}
              type="primary"
              loading={searchLoading}
              onClick={getDetail}
              id="submit"
            >
              Search
            </Button>
          </Space>
        </Col>
        <Col>
          <Space>
            {/* <CommonIcons
              action="downloadButton"
              onClick={() => downloadCSV(rows, columns, "Pending PO Report")}
              disabled={rows.length == 0}
            /> */}
          </Space>
        </Col>
      </Row>
      {/* vendor info modal */}
      <Modal
        style={{
          top: 10,
        }}
        width={600}
        title={`Vendor Info : ${poData?.vendor_type?.vendorcode}`}
        open={showVendorInfo}
        onCancel={() => setShowVendorInfo(false)}
        footer={[]}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Row>
              <Col span={6}>
                <Text style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                  Vendor Name :
                </Text>
              </Col>
              <Col style={{ whiteSpace: "nowrap" }} span={18}>
                {poData?.vendor_type?.vendorname}
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row>
              <Col span={6}>
                <Text style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                  Vendor Address :
                </Text>
              </Col>
              <Col span={18}>
                {poData?.vendor_type?.vendoraddress?.replaceAll("<br>", " ")}
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row>
              <Col span={6}>
                <Text style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                  Vendor GST :
                </Text>
              </Col>
              <Col style={{ whiteSpace: "nowrap" }} span={18}>
                {poData?.vendor_type?.gstin}
              </Col>
            </Row>
          </Col>
        </Row>
        {/* <Row>
          <Col span={24}>
            <DescriptionItem
              title="Vendor Address"
              content={poData?.vendor_type?.vendoraddress?.replaceAll(
                "<br>",
                " "
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="Vendor GST" content="" />
          </Col>
        </Row> */}
      </Modal>
      {/* submit confirm modal */}
      <Modal
        title="Confirm MIN!"
        open={showMINSubmitConfirm}
        onCancel={() => setShowMINSubmitConfirm(false)}
        footer={[
          <Button key="back" onClick={() => setShowMINSubmitConfirm(false)}>
            No
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitLoading}
            onClick={submitMIN}
          >
            Yes
          </Button>,
        ]}
      >
        <p>Are you sure you want to create this MIN?</p>
      </Modal>
      {/* reset confirm modal */}
      <Modal
        title="Reset!"
        open={showResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
        footer={[
          <Button key="back" onClick={() => setShowResetConfirm(false)}>
            No
          </Button>,
          <Button key="submit" type="primary" onClick={resetFunction}>
            Yes
          </Button>,
        ]}
      >
        <p>Are you sure you want to reset the entered data?</p>
      </Modal>

      {/* currency modal */}
      {showCurrency != null && (
        <CurrenceModal
          showCurrency={showCurrency}
          setShowCurrencyModal={setShowCurrenncy}
        />
      )}
      {/* upload doc modal */}

      {!materialInSuccess && (
        <Row gutter={8} style={{ height: "100%", padding: "0px 10px" }}>
          <Col span={6}>
            <Row
              style={{
                height: "76%",
              }}
              gutter={[0, 4]}
            >
              {/* vendor details */}
              <Row style={{ height: "50%", width: "100%" }}>
                <Card
                  size="small"
                  style={{ height: "100%", width: "100%" }}
                  bodyStyle={{ overflowY: "auto", maxHeight: "80%" }}
                  title="Vendor Details"
                >
                  <Row gutter={[0, 8]}>
                    <Col span={24}>
                      {!searchLoading && (
                        <Typography.Title
                          style={{
                            fontSize:
                              window.innerWidth < 1600 ? "0.85rem" : "0.95rem",
                          }}
                          level={5}
                        >
                          Vendor Type
                        </Typography.Title>
                      )}
                      {!searchLoading && (
                        <Typography.Text
                          style={{
                            fontSize:
                              window.innerWidth < 1600 ? "0.7rem" : "0.8rem",
                          }}
                        >
                          {poData?.vendor_type?.vendortype}
                        </Typography.Text>
                      )}
                      <Skeleton
                        paragraph={false}
                        style={{ width: "100%" }}
                        rows={1}
                        loading={searchLoading}
                        active
                      />
                    </Col>
                    <Col span={24}>
                      {!searchLoading && (
                        <Typography.Title
                          style={{
                            fontSize:
                              window.innerWidth < 1600 ? "0.85rem" : "0.95rem",
                          }}
                          level={5}
                        >
                          Vendor Name
                        </Typography.Title>
                      )}
                      {!searchLoading && (
                        <Typography.Text
                          style={{
                            fontSize:
                              window.innerWidth < 1600 ? "0.7rem" : "0.8rem",
                          }}
                        >
                          {poData?.vendor_type?.vendorname}
                        </Typography.Text>
                      )}
                      <Skeleton
                        paragraph={false}
                        style={{ width: "100%" }}
                        rows={1}
                        loading={searchLoading}
                        active
                      />
                    </Col>
                    <Col span={24}>
                      {!searchLoading && (
                        <Typography.Title
                          style={{
                            fontSize:
                              window.innerWidth < 1600 ? "0.85rem" : "0.95rem",
                          }}
                          level={5}
                        >
                          Vendor Address
                        </Typography.Title>
                      )}
                      {!searchLoading && (
                        <Typography.Text
                          style={{
                            fontSize:
                              window.innerWidth < 1600 ? "0.7rem" : "0.8rem",
                          }}
                        >
                          <ToolTipEllipses
                            type="Paragraph"
                            text={poData?.vendor_type?.vendoraddress?.replaceAll(
                              "<br>",
                              " "
                            )}
                          />
                        </Typography.Text>
                      )}
                      <Skeleton
                        paragraph={false}
                        style={{ width: "100%" }}
                        rows={1}
                        loading={searchLoading}
                        active
                      />
                    </Col>
                    <Col span={24}>
                      {!searchLoading && (
                        <Typography.Title
                          style={{
                            fontSize:
                              window.innerWidth < 1600 ? "0.85rem" : "0.95rem",
                          }}
                          level={5}
                        >
                          Vendor GSTIN
                        </Typography.Title>
                      )}
                      {!searchLoading && (
                        <Typography.Text
                          style={{
                            fontSize:
                              window.innerWidth < 1600 ? "0.7rem" : "0.8rem",
                          }}
                        >
                          {poData?.vendor_type?.gstin}
                        </Typography.Text>
                      )}
                      <Skeleton
                        paragraph={false}
                        style={{ width: "100%" }}
                        rows={1}
                        loading={searchLoading}
                        active
                      />
                    </Col>
                  </Row>
                </Card>
              </Row>
              {/* tax details */}
              <Col span={24} style={{ width: "100%", height: "50%" }}>
                <Card
                  size="small"
                  style={{ width: "100%", height: "100%" }}
                  bodyStyle={{ overflowY: "auto", maxHeight: "74%" }}
                  title="Tax Details"
                >
                  <Row gutter={[0, 4]}>
                    {totalValues?.map((row) => (
                      <Col span={24} key={row.label}>
                        <Row>
                          <Col
                            span={18}
                            style={{
                              fontSize: "0.8rem",
                              fontWeight:
                                totalValues?.indexOf(row) ==
                                  totalValues.length - 1 && 600,
                            }}
                          >
                            {row.label}
                          </Col>
                          <Col span={6} className="right">
                            {row.sign.toString() == "" ? (
                              ""
                            ) : (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight:
                                    totalValues?.indexOf(row) ==
                                      totalValues.length - 1 && 600,
                                }}
                              >
                                ({row.sign.toString()}){" "}
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: "0.8rem",
                                fontWeight:
                                  totalValues?.indexOf(row) ==
                                    totalValues.length - 1 && 600,
                              }}
                            >
                              {Number(
                                row.values?.reduce((partialSum, a) => {
                                  return partialSum + Number(a);
                                }, 0)
                              ).toFixed(2)}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
              <Col span={24} style={{ height: "10%" }}>
                <Row className="material-in-upload">
                  <UploadDocs
                    disable={poData?.materials?.length == 0}
                    setShowUploadDoc={setShowUploadDoc}
                    showUploadDoc={showUploadDoc}
                    setFiles={setInvoices}
                    files={invoices}
                  />
                </Row>
              </Col>
            </Row>
          </Col>
          <Col
            span={18}
            style={{ height: "85%", padding: 0, border: "1px solid #eeeeee " }}
          >
            <FormTable columns={columns} data={poData?.materials} />
          </Col>

          <NavFooter
            backFunction={backFunction}
            hideHeaderMenu
            nextLabel="Submit"
            loading={submitLoading}
            resetFunction={() => {
              setShowResetConfirm(true);
            }}
            submitFunction={validateData}
            disabled={{
              uploadDoc: !poData.vendor_type,
              reset: !poData.vendor_type,
              next: !poData.vendor_type,
              back: !poData.vendor_type,
            }}
          />
        </Row>
      )}
      {materialInSuccess && (
        <SuccessPage
          newMinFunction={newMinFunction}
          po={materialInSuccess}
          successColumns={successColumns}
        />
      )}
    </div>
  );
}
