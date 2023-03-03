import React from "react";
import MyDataTable from "../../../../Components/MyDataTable";
import { Input, InputNumber, Tooltip } from "antd";
import MySelect from "../../../../Components/MySelect";
import ToolTipEllipses from "../../../../Components/ToolTipEllipses";
import FormTable from "../../../../Components/FormTable";
// fun = name,value,id
export default function VBT5DataTable({ rows, inputHandler, removeRows }) {
  const VBT5 = [
    {
      headerName: "MIN ID",
      width: 130,
      renderCell: ({ row }) => (
        <div style={{ width: 100 }}>
          <ToolTipEllipses text={row.min_id} />
        </div>
      ),
    },
    {
      headerName: "Part Code",
      width: 90,
      renderCell: ({ row }) => (
        <div style={{ width: 70 }}>
          <ToolTipEllipses text={row.c_part_no} />
        </div>
      ),
    },
    {
      headerName: "Part Name",
      renderCell: ({ row }) => (
        <div style={{ width: 120 }}>
          <ToolTipEllipses text={row.c_name} />
        </div>
      ),
      width: 150,
    },
    {
      headerName: "Billing Qty", //add uom in here
      width: 150,
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          suffix={row.uom}
          value={row.bill_qty}
          onChange={(value) => inputHandler("bill_qty", value, row.id)}
        />
      ),
    },
    {
      headerName: "Qty",
      width: 120,
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          suffix={row.uom}
          disabled
          value={row.qty}
          onChange={(value) => {
            Number(value) <= Number(row.maxQty) &&
              inputHandler("qty", value, row.id);
          }}
        />
      ),
    },
    {
      headerName: "In Rate",
      width: 90,
      renderCell: ({ row }) => (
        <Input
          disabled={true}
          onChange={(value) => inputHandler("in_po_rate", value, row.id)}
          value={row?.in_po_rate}
        />
      ),
    },
    {
      headerName: "Value",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          disabled={true}
          onChange={(value) => inputHandler("value", value, row.id)}
          value={row?.value}
        />
      ),
    },
    {
      headerName: "HSN/SAC",
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          onChange={(e) => inputHandler("in_hsn_code", e.target.value, row.id)}
          value={row.in_hsn_code}
        />
      ),
      width: 90,
    },
    {
      headerName: "GST Type",
      renderCell: ({ row }) => (
        <Input
          disabled={true}
          value={row.in_gst_type}
          onChange={(e) => inputHandler("in_gst_type", e.target.value, row.id)}
        />
      ),
      width: 150,
    },
    {
      headerName: "GST Rate",
      renderCell: ({ row }) => (
        <InputNumber
          keyboard={true}
          disabled={true}
          onChange={(value) => inputHandler("in_gst_rate", value, row.id)}
          value={row.in_gst_rate}
        />
      ),
      width: 80,
    },
    {
      headerName: "Freight",
      renderCell: ({ row }) => (
        <InputNumber
          keyboard={true}
          value={row.freight}
          onChange={(value) => inputHandler("freight", value, row.id)}
        />
      ),
      width: 90,
    },
    {
      headerName: "Freight G/L",
      renderCell: ({ row }) => (
        <div style={{ width: 100 }}>
          <ToolTipEllipses text={row.freightGl} />
        </div>
      ),
    },
    {
      headerName: "GST Ass. Value",
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          disabled={true}
          onChange={(value) => inputHandler("gstAssetValue", value, row.id)}
          value={row.gstAssetValue}
        />
      ), //freight + value
      width: 150,
    },
    {
      headerName: "CGST",
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          disabled={true}
          onChange={(value) => inputHandler("in_gst_cgst", value, row.id)}
          value={Number(row.in_gst_cgst).toFixed(2)}
        />
      ),
      width: 100,
    },
    {
      headerName: "CGST G/L",
      renderCell: ({ row }) => (
        <div style={{ width: 100 }}>
          <ToolTipEllipses text={row.CGSTGL} />
        </div>
      ),
    },
    {
      headerName: "SGST",
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          disabled={true}
          value={Number(row.in_gst_sgst).toFixed(2)}
          onChange={(value) => inputHandler("in_gst_sgst", value, row.id)}
        />
      ),
      width: 100,
    },
    {
      headerName: "SGST G/L",
      renderCell: ({ row }) => (
        <div style={{ width: 100 }}>
          <ToolTipEllipses text={row.SGSTGL} />
        </div>
      ),
    },
    {
      headerName: "IGST",
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          disabled={true}
          value={row.in_gst_igst}
          onChange={(value) => inputHandler("in_gst_igst", value, row.id)}
        />
      ),
      width: 100,
    },
    {
      headerName: "IGST G/L",
      renderCell: ({ row }) => (
        <div style={{ width: 100 }}>
          <ToolTipEllipses text={row.IGSTGL} />
        </div>
      ),
    },
    {
      headerName: "Purchase G/L Code",
      renderCell: ({ row }) => (
        <MySelect
          options={row.glCodes}
          onChange={(value) => inputHandler("glCodeValue", value, row.id)}
          value={row.glCodeValue}
        />
      ),
      width: 150,
    },
    {
      headerName: "TDS Code",
      renderCell: ({ row }) => (
        <MySelect
          options={row.tdsCodes}
          onChange={(value) => inputHandler("tdsCodeValue", value, row.id)}
          value={row.tdsCodeValue}
        />
      ),
      width: 200,
    },
    {
      headerName: "TDS GL",
      renderCell: ({ row }) => <Input disabled={true} value={row.tdsGl} />,
      width: 150,
    },
    {
      headerName: "TDS Ass. Value",
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          inputHandler
          onChange={(value) => inputHandler("tdsassetvalue", value, row.id)}
          value={row.tdsAssetValue}
        />
      ),
      width: 150,
    },
    {
      headerName: "TDS Amount",
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          onChange={(value) => inputHandler("tdsAmount", value, row.id)}
          value={row.tdsAmount}
        />
      ),
      width: 150,
    },
    {
      headerName: "Ven Amount",
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          disabled
          value={Number(row.vendorAmount).toFixed(2)}
        />
      ),
      width: 150,
    },
  ];
  return <FormTable hideHeaderMenu data={rows} columns={VBT5} />;
}
