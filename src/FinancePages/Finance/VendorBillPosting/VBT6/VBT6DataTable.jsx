import React from "react";
import MyDataTable from "../../../../Components/MyDataTable";
import { Card, Input, InputNumber } from "antd";
import MySelect from "../../../../Components/MySelect";
import ToolTipEllipses from "../../../../Components/ToolTipEllipses";
import FormTable from "../../../../Components/FormTable";
import { CommonIcons } from "../../../../Components/TableActions.jsx/TableActions";
// fun = name,value,id
export default function VBT1DataTable({ rows, inputHandler, removeRows }) {
  console.log(rows);
  const gstTypes = [
    { text: "Local", value: "local" },
    { text: "Interstate", value: "interstate" },
  ];
  const VBT1 = [
    // {
    //   headerName: "Actions",
    //   width: 40,
    //   renderCell: ({ row }) => (
    //     <CommonIcons action="removeRow" onClick={() => removeRows(row?.id)} />
    //   ),
    // },
    {
      headerName: "MIN ID",
      renderCell: ({ row }) => (
        <div style={{ width: 110 }}>
          {row.freight ? "--" : <ToolTipEllipses text={row.min_id} />}
        </div>
      ),
    },
    {
      headerName: "Part Code",
      renderCell: ({ row }) => (
        <div style={{ width: 100 }}>
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
      // width: 120,
    },
    {
      headerName: "Billing Qty", //add uom in here,
      renderCell: ({ row }) => (
        <div style={{ width: 85 }}>
          <InputNumber
            keyboard={true}
            suffix={row.uom}
            value={row.bill_qty}
            onChange={(value) => inputHandler("bill_qty", value, row.id)}
          />
        </div>
      ),
    },
    {
      headerName: "Qty", //add uom in here
      renderCell: ({ row }) => (
        <div style={{ width: 85 }}>
          <InputNumber
            keyboard={true}
            disabled
            suffix={row.uom}
            value={row.qty}
            onChange={(value) => {
              Number(value) <= Number(row.maxQty) &&
                inputHandler("qty", value, row.id);
            }}
          />
        </div>
      ),
    },
    {
      headerName: "In Rate",
      renderCell: ({ row }) => (
        <div style={{ width: 70 }}>
          <InputNumber
            style={{ width: "100%" }}
            keyboard={true}
            // disabled={!row.freight && true}
            onChange={(value) => inputHandler("in_po_rate", value, row.id)}
            value={row?.in_po_rate}
          />
        </div>
      ),
    },
    {
      headerName: "Value",
      renderCell: ({ row }) => (
        <div style={{ width: 120 }}>
          <Input
            style={{ width: "100%" }}
            disabled={true}
            onChange={(value) => inputHandler("value", value, row.id)}
            value={row?.value}
          />
        </div>
      ),
    },
    {
      headerName: "HSN/SAC",
      renderCell: ({ row }) => (
        <div style={{ width: 85 }}>
          <Input
            onChange={(e) =>
              inputHandler("in_hsn_code", e.target.value, row.id)
            }
            value={row.in_hsn_code}
          />
        </div>
      ),
    },
    {
      headerName: "GST Type",
      renderCell: ({ row }) => (
        <div style={{ width: 100 }}>
          <MySelect
            options={gstTypes}
            bordered={false}
            // disabled={true}
            value={row.in_gst_type}
            onChange={(value) => inputHandler("in_gst_type", value, row.id)}
          />
        </div>
      ),
    },
    {
      headerName: "GST Rate",
      renderCell: ({ row }) => (
        <div style={{ width: 80 }}>
          <Input
            style={{ width: "100%" }}
            onChange={(value) => inputHandler("in_gst_rate", value, row.id)}
            value={row.in_gst_rate}
          />
        </div>
      ),
    },
    // {
    //   headerName: "Freight",
    //   sortable: false,
    //   renderCell: ({ row }) => (
    //     <InputNumber
    //       keyboard={true}
    //       value={row.freight}
    //       onChange={(value) => inputHandler("freight", value, row.id)}
    //     />
    //   ), //ask
    //   width: 90,
    // },
    // {
    //   headerName: "Freight G/L",
    //   renderCell: ({ row }) => <ToolTipEllipses text={row.freightGl} />,
    //   sortable: false,
    //   width: 150,
    // },
    {
      headerName: "GST Ass. Value",
      renderCell: ({ row }) => (
        <div style={{ width: 150 }}>
          <InputNumber
            style={{ width: "100%" }}
            disabled={true}
            onChange={(value) => inputHandler("gstAssetValue", value, row.id)}
            value={row.gstAssetValue}
          />
        </div>
      ), //freight + value
    },
    {
      headerName: "CGST",
      renderCell: ({ row }) => (
        <InputNumber
          keyboard={true}
          disabled={true}
          onChange={(value) => inputHandler("in_gst_cgst", value, row.id)}
          value={Number(row.in_gst_cgst).toFixed(2)}
        />
      ),
      width: 80,
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
        <div style={{ width: 85 }}>
          <InputNumber
            keyboard={true}
            disabled={true}
            value={Number(row.in_gst_sgst).toFixed(2)}
            onChange={(value) => inputHandler("in_gst_sgst", value, row.id)}
          />
        </div>
      ),
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
        <div style={{ width: 85 }}>
          <InputNumber
            keyboard={true}
            disabled={true}
            value={row.in_gst_igst}
            onChange={(value) => inputHandler("in_gst_igst", value, row.id)}
          />
        </div>
      ),
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
      headerName: "Jobwork G/L Code",
      renderCell: ({ row }) => (
        <div style={{ width: "100%" }}>
          <MySelect
            options={row.glCodes}
            onChange={(value) => inputHandler("glCodeValue", value, row.id)}
            value={row.glCodeValue}
          />
        </div>
      ),
    },
    {
      headerName: "TDS Code",
      renderCell: ({ row }) => (
        <div style={{ width: 100 }}>
          <MySelect
            options={row.tdsCodes}
            onChange={(value) => inputHandler("tdsCodeValue", value, row.id)}
            value={row.tdsCodeValue}
          />
        </div>
      ),
    },
    {
      headerName: "TDS GL",
      renderCell: ({ row }) => (
        <div style={{ width: 120 }}>
          <Input disabled={true} value={row.tdsGl} />
        </div>
      ),
    },
    {
      headerName: "TDS Ass. Value",
      sortable: false,
      renderCell: ({ row }) => (
        <div style={{ width: 150 }}>
          <InputNumber
            style={{ width: "100%" }}
            keyboard={true}
            inputHandler
            onChange={(value) => inputHandler("tdsassetvalue", value, row.id)}
            value={row.tdsassetvalue}
          />
        </div>
      ),
    },
    {
      headerName: "TDS Amount",
      sortable: false,
      renderCell: ({ row }) => (
        <div style={{ width: 100 }}>
          <InputNumber
            style={{ width: "100%" }}
            keyboard={true}
            onChange={(value) => inputHandler("tdsAmount", value, row.id)}
            value={row.tdsAmount}
          />
        </div>
      ),
    },
    {
      headerName: "Ven Amount",
      sortable: false,
      renderCell: ({ row }) => (
        <div style={{ width: 100 }}>
          <Input
            disabled
            style={{ width: "100%" }}
            value={Number(row.vendorAmount).toFixed(2)}
          />
        </div>
      ),
    },
    // {
    //   headerName: "Action",
    //   renderCell: (row, index) => (
    //     <>
    //       {index != 0 && (
    //         <div className="delete-icon" onClick={() => removeRows(row.id)}>
    //           <FaRegTrashAlt />
    //         </div>
    //       )}
    //     </>
    //   ),
    // flex: 1,
    // },
  ];
  return (
    <Card
      size="small"
      bodyStyle={{ padding: 0, height: "100%" }}
      style={{ height: "100%" }}
    >
      <FormTable hideHeaderMenu data={rows} columns={VBT1} />
    </Card>
  );
}
