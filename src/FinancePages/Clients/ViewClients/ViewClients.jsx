import { Col, Layout, Row } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { clientAxios } from "../../../axiosInterceptor";
import { downloadCSV } from "../../../Components/exportToCSV";
import MyDataTable from "../../../Components/MyDataTable";
import TableActions, {
  CommonIcons,
} from "../../../Components/TableActions.jsx/TableActions";
import ToolTipEllipses from "../../../Components/ToolTipEllipses";
import EditClient from "../EditClient/EditClient";

function ViewClients() {
  const [rows, setRows] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [updatingClient, setUpdatingClient] = useState(null);

  const getRows = async () => {
    setFetchLoading(true);
    const { data } = await clientAxios.get("/client/viewclients");
    setFetchLoading(false);
    if (data.code === 200) {
      let arr = data.data.map((row, index) => ({
        ...row,
        id: index,
        index: index + 1,
      }));
      setRows(arr);
    } else {
      toast.error(data.message.msg);
      setRows([]);
    }
  };
  const handleDownloadExcel = () => {
    downloadCSV(rows, columns, "Clients Report");
  };
  const columns = [
    { headerName: "Sr. No.", field: "index", width: 80 },
    {
      headerName: "Client ID",
      field: "code",
      flex: 1,
      renderCell: ({ row }) => <ToolTipEllipses copy={true} text={row.code} />,
    },
    {
      headerName: "Name",
      field: "name",
      flex: 1,
      renderCell: ({ row }) => <ToolTipEllipses text={row.name} />,
    },
    {
      headerName: "City",
      field: "city",
      flex: 1,
      renderCell: ({ row }) => <ToolTipEllipses text={row.city} />,
    },
    {
      headerName: "Mobile",
      field: "mobile",
      flex: 1,
      renderCell: ({ row }) => <ToolTipEllipses text={row.mobile} />,
    },
    { headerName: "Email", field: "email", flex: 1 },
    { headerName: "GSTID", field: "gst", flex: 1 },
    {
      headerName: "Actions",
      type: "actions",
      width: 300,
      getActions: ({ row }) => [
        <TableActions
          action="edit"
          onClick={() =>
            setUpdatingClient({ clientName: row.name, clientCode: row.code })
          }
        />,
      ],
    },
  ];
  useEffect(() => {
    getRows();
  }, []);
  return (
    <div style={{ height: "90%", padding: 5 }}>
      <EditClient
        updatingClient={updatingClient}
        setUpdatingClient={setUpdatingClient}
      />
      <Row justify="end">
        <CommonIcons onClick={handleDownloadExcel} action="downloadButton" />
      </Row>
      <div style={{ paddingTop: 5, height: "95%" }}>
        <MyDataTable loading={fetchLoading} rows={rows} columns={columns} />
      </div>
    </div>
  );
}

export default ViewClients;
