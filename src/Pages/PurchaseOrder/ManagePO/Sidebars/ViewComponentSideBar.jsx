import React, { useState } from "react";
import { Button, Drawer, Space } from "antd";
import MyDataTable from "../../../../Components/MyDataTable";
import printFunction, {
  downloadFunction,
} from "../../../../Components/printFunction";
import { CommonIcons } from "../../../../Components/TableActions.jsx/TableActions";
import { imsAxios } from "../../../../axiosInterceptor";

export default function ViewComponentSideBar({
  showViewSidebar,
  setShowViewSideBar,
  componentData,
}) {
  const [loading, setLoading] = useState(null);
  const printFun = async () => {
    setLoading("print");
    const { data } = await imsAxios.post("/poPrint", {
      poid: componentData?.poid,
    });

    printFunction(data.data.buffer.data);
    setLoading(null);
  };
  const handleDownload = async () => {
    setLoading("download");
    const { data } = await imsAxios.post("/poPrint", {
      poid: componentData?.poid,
    });
    setLoading(null);
    let filename = `PO ${componentData?.poid}`;
    downloadFunction(data.data.buffer.data, filename);
  };
  const columns = [
    {
      headerName: "SR. No",
      field: "po_transaction",
      valueGetter: ({ row }) => {
        return `${componentData?.components?.indexOf(row) + 1}`;
      },
      width: 80,
      id: "Sr. No",
    },
    {
      headerName: "Component Name / Part No.",
      field: "componentPartId",
      valueGetter: ({ row }) => {
        return `{${row.po_components} / ${row.componentPartID}`;
      },
      id: "po_components",
      flex: 1,
    },
    {
      headerName: "Ordered Qty",
      field: "ordered_qty",
      id: "ordered_qty",
      width: 120,
    },
    {
      headerName: "Pending QTY",
      field: "pending_qty",

      id: "pending_qty",
      width: 120,
    },
  ];
  console.log(componentData);
  return (
    <Drawer
      title={
        <>
          <span
            style={{
              color: componentData?.status == "C" && "red",
            }}
          >
            {componentData?.poid}
          </span>
          <span> / </span>
          <span>
            {componentData?.components?.length} Item
            {componentData?.components?.length > 1 ? "s" : ""}
          </span>
        </>
      }
      width="50vw"
      onClose={() => setShowViewSideBar(null)}
      open={showViewSidebar}
      extra={
        <Space>
          <CommonIcons
            action="printButton"
            loading={loading == "print"}
            onClick={printFun}
          />
          <CommonIcons
            action="downloadButton"
            loading={loading == "download"}
            onClick={handleDownload}
          />
        </Space>
      }
    >
      <div style={{ height: "100%" }} className="remove-table-footer">
        <MyDataTable
          pagination={undefined}
          rows={componentData?.components}
          columns={columns}
        />
      </div>
    </Drawer>
  );
}
