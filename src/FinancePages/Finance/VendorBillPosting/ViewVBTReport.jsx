import React, { useState, useEffect } from "react";
import MyDataTable from "../../../Components/MyDataTable";
import { PrinterFilled } from "@ant-design/icons";
import axios from "axios";
import printFunction from "../../../Components/printFunction";
import { Button, Col, Drawer, Row, Space } from "antd";
import TaxModal from "../../../Components/TaxModal";
import ToolTipEllipses from "../../../Components/ToolTipEllipses";
import { imsAxios } from "../../../axiosInterceptor";

export default function ViewVBTReport({ viewReportData, setViewReportData }) {
  const [loading, setLoading] = useState(false);
  const [totalValues, setTotalValues] = useState([
    { label: "Net Amount", sign: "", values: [] },
    { label: "cgst", sign: "+", values: [] },
    { label: "sgst", sign: "+", values: [] },
    { label: "igst", sign: "+", values: [] },
    { label: "freight", sign: "+", values: [] },
    { label: "Round Off", sign: "+", values: [] },
  ]);
  const [printLoading, setPrintLoading] = useState(false);
  const [showMoreData, setShowMoreData] = useState(null);
  const printFun = async () => {
    // setLoading(true);
    setPrintLoading(true);
    const { data } = await imsAxios.post("/tally/vbt_report/print_vbt_report", {
      vbt_key: viewReportData[0]?.vbt_code,
    });
    setPrintLoading(false);
    printFunction(data.buffer.data);

    setLoading(false);
  };
  useEffect(() => {
    let arr = [
      {
        label: "Net Amount",
        sign: "",
        values: viewReportData.map((row) => Number(row?.value)?.toFixed(2)),
      },
      {
        label: "CGST",
        sign: "+",
        values: viewReportData.map((row) =>
          row?.cgst == "--" ? 0 : Number(row?.cgst)?.toFixed(2)
        ),
      },
      {
        label: "SGST",
        sign: "+",
        values: viewReportData.map((row) =>
          row.sgst == "--" ? 0 : Number(row.sgst).toFixed(2)
        ),
      },
      {
        label: "IGST",
        sign: "+",
        values: viewReportData.map((row) =>
          row.igst == "--" ? 0 : Number(row.igst).toFixed(2)
        ),
      },
      {
        label: "Freight",
        sign: "+",
        values: viewReportData.map((row) => Number(row.freight)?.toFixed(2)),
      },

      {
        label: "Vendor Amount",
        sign: "",
        values: viewReportData.map((row) => Number(row.ven_amm)?.toFixed(2)),
      },
      // {
      //   label: "Vendor Amount",
      //   sign: "",
      //   values: [totalVendorAmountWithRoundOff],
      // },
    ];

    setTotalValues(arr);
  }, [viewReportData]);
  const vbtReportColumns = [
    {
      headerName: "Part Code",
      width: 100,
      field: "part_code",
      sortable: false,
    },
    {
      headerName: "Part Name",
      field: "part",
      renderCell: ({ row }) => <ToolTipEllipses text={row.part} />,
      width: 150,
    },
    {
      headerName: "Qty", //add uom in here
      width: 100,
      field: "qty",
      sortable: false,
    },
    {
      headerName: "Bill Qty", //add uom in here
      width: 100,
      field: "bill_qty",
      sortable: false,
    },
    {
      headerName: "Unit", //add uom in here
      width: 100,
      field: "unit",
      sortable: false,
    },
    {
      headerName: "In Rate",
      width: 100,
      field: "in_rate",
      sortable: false,
    },
    {
      headerName: "Value",
      width: 120,
      field: "value",
      sortable: false,
    },
    {
      headerName: "HSN/SAC",
      field: "hsn_sac",
      width: 100,
      sortable: false,
    },
    {
      headerName: "GST Type",
      field: "gst_type",
      width: 100,
      sortable: false,
    },
    {
      headerName: "GST Rate",
      field: "gst_rate",
      width: 100,
      sortable: false,
    },
    {
      headerName: "Custom Duty",
      field: "custom_duty",
      width: 100,
      sortable: false,
    },
    {
      headerName: "Freight",
      field: "freight",
      width: 100,
      sortable: false,
    },
    {
      headerName: "Freight G/L",
      field: "freight_gl",
      width: 150,
      sortable: false,
    },
    {
      headerName: "Other Charges",
      field: "other_charges",
      width: 100,
      sortable: false,
    },
    {
      headerName: "GST Ass. Value",
      field: "gst_ass_val",
      width: 120,
      sortable: false,
    },
    {
      headerName: "CGST",
      field: "cgst",
      // field: 'row'),
      width: 100,
      sortable: false,
    },
    {
      headerName: "CGST G/L",
      field: "cgst_gl",
      // field: 'row'),
      width: 100,
      sortable: false,
    },
    {
      headerName: "SGST",
      field: "sgst",
      width: 100,
      sortable: false,
    },
    {
      headerName: "SGST G/L",
      field: "sgst_gl",
      width: 150,
      sortable: false,
    },
    {
      headerName: "IGST",
      field: "igst",
      width: 100,
      sortable: false,
    },
    {
      headerName: "IGST G/L",
      field: "igst_gl",
      width: 150,
      sortable: false,
    },
    {
      headerName: "Purchase G/L Code",
      // field: 'c_name',
      field: "gl_name", /////////////////////////////////////
      width: 150,
      sortable: false,
    },
    {
      headerName: "TDS Code",
      // field: 'c_name',
      field: "tds_code",
      width: 150,
      sortable: false,
    },
    {
      headerName: "TDS GL",
      // field: (row)'.'c_name,
      field: "tds_gl",
      width: 150,
      sortable: false,
    },
    {
      headerName: "TDS Ass. Value",
      field: "tds_ass_val",
      width: 120,
      sortable: false,
    },
    {
      headerName: "TDS Amount",
      // field: 'c_name',
      field: "tds_amm",
      width: 120,
      sortable: false,
    },
    {
      headerName: "Ven Amount",
      field: "ven_amm",
      width: 120,
      sortable: false,
    },
  ];
  const backFunction = () => {
    setViewReportData([]);
  };
  const handlerMoreData = () => {
    const obj = {
      vendorCode: viewReportData[0]?.ven_code,
      vendorName: viewReportData[0]?.vendor,
      vendorAddress: viewReportData[0]?.ven_address?.replaceAll("<br>"),
      invoiceDate: viewReportData[0]?.invoice_dt,
      gstin: viewReportData[0]?.gst_in_no,
      minId: viewReportData[0]?.min_id,
      invoiceNumber: viewReportData[0].invoice_no,
      comments: viewReportData[0]?.comment,
    };
    setShowMoreData(obj);
  };
  const DescriptionItem = ({ title, content }) => (
    <div
      style={{ display: "flex", paddingBottom: 30 }}
      className="site-description-item-profile-wrapper"
    >
      <p
        style={{ marginRight: 10, fontWeight: 500, whiteSpace: "nowrap" }}
        className="site-description-item-profile-p-label"
      >
        {title}:
      </p>
      {content}
    </div>
  );
  return (
    <Drawer
      title={
        <span style={{ color: viewReportData[0]?.vbt_status == "D" && "red " }}>
          {viewReportData[0]?.vbt_key}
        </span>
      }
      width="100vw"
      onClose={() => backFunction(null)}
      open={viewReportData.length > 0}
      extra={
        <Space>
          {/* <AiFillPrinter onClick={printFun} className="view-icon" /> */}
          <Button
            type="primary"
            shape="round"
            loading={printLoading}
            icon={<PrinterFilled />}
            onClick={printFun}
          />
          <Button type="primary" onClick={handlerMoreData}>
            More Info
          </Button>
        </Space>
      }
    >
      <Drawer
        width="30vw"
        onClose={() => setShowMoreData(null)}
        open={showMoreData}
      >
        <Row>
          <Col span={24}>
            <DescriptionItem title="MIN ID" content={showMoreData?.minId} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Invoice"
              content={showMoreData?.invoiceNumber}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title=" Invoice Date"
              content={showMoreData?.invoiceDate}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title=" Vendor"
              content={`${showMoreData?.vendorName} / ${showMoreData?.vendorCode}`}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Vendor Address"
              content={showMoreData?.vendorAddress}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="GST-In Number"
              content={showMoreData?.gstin}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Comments"
              content={showMoreData?.comments}
            />
          </Col>
        </Row>
      </Drawer>
      <div
        className="remove-table-footer"
        style={{ height: "100%", opacity: loading ? 0.5 : 1 }}
      >
        <MyDataTable
          loading={loading}
          data={viewReportData}
          columns={vbtReportColumns}
        />
      </div>
      <TaxModal bottom={-100} visibleBottom={125} totalValues={totalValues} />
    </Drawer>
  );
}
// vendorCode: viewReportData[0]?.ven_code,
// vendorAddress: viewReportData[0]?.ven_address,
// invoiceDate: viewReportData[0]?.vbt_invoice_date,
// gstin: viewReportData[0]?.vbt_gstin,
// minId: viewReportData[0]?.min_id,
// comments: viewReportData[0]?.vbt_comment,
