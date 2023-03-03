import React, { useState } from 'react'
import { Button, Col, Input, Row, Select, Tooltip, Popconfirm } from 'antd'
import MyDatePicker from '../../../Components/MyDatePicker';
import { imsAxios } from '../../../axiosInterceptor';
import { v4 } from "uuid";
import { toast } from "react-toastify";
import MyDataTable from '../../../Components/MyDataTable';
import printFunction, {
  downloadFunction,
} from "../../../Components/printFunction";
import {
  CloudDownloadOutlined,
  PrinterFilled,
  EyeFilled,
  DeleteFilled,
  EditFilled,
} from "@ant-design/icons";
import { GridActionsCellItem } from "@mui/x-data-grid";
import JounralPostingView from "./JounralPostingView";
import EditJournalVoucher from "./EditJournalVoucher";


function JVReport() {
  const options = [
    { label: "Date", value: "date_wise" },
    { label: "JV Wise", value: "code_wise" },
  ];
  const [rows, setRows] = useState([]);
  const [Jv, setJv] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchDateRange, setSearchDateRange] = useState("");
  const [viewJVDetail, setViewJVDetail] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null);

  const [allData, setAllData] = useState({
    setType: "",
    jvId: ""
  });

  // console.log(allData)

  const getRows = async () => {
    setRows([])
    setLoading(true);
    setSearchLoading(true);
    const { data } = await imsAxios.post("/tally/jv/jv_list", {
      wise: allData?.setType,
      data: searchDateRange,
    });
    setSearchLoading(false);
    setLoading(false);
    if (data.code == 200) {
      const arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
          status: row.status == "D" ? "Deleted" : "--",
        };
      });
      setRows(arr);
    } else {
      setRows([]);
      toast.error(data.message.msg);
    }
  };

  const getjv = async () => {
    setLoading(true);
    setSearchLoading(true);
    const { data } = await imsAxios.post("/tally/jv/jv_list", {
      wise: allData?.setType,
      data: allData?.jvId,
    });
    setSearchLoading(false);
    setLoading(false);
    if (data.code == 200) {
      const arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
          status: row.status == "D" ? "Deleted" : "--",
        };
      });
      setJv(arr);
    } else {
      setJv([]);
      toast.error(data.message.msg);
    }
  };

  const deleteFun = async () => {
    setLoading(true);
    if (deleteConfirm) {
      const { data } = await imsAxios.post("/tally/jv/jv_delete", {
        jv_code: deleteConfirm,
      });
      setLoading(false);
      if (data.code == 200) {
        setDeleteConfirm(null);
        toast.success(data.message);
        getRows();
      } else {
        toast.error(data.message.msg);
      }
    }
  };

  const columns = [
    {
      headerName: "Serial No.",
      field: "index",
      width: 80,
      // sortable: false,
    },
    {
      headerName: "Date",
      field: "ref_date",
      width: 80,
      // sortable: false,
    },

    {
      headerName: "JV Code",
      field: "module_used",
      // sortable: false,
      flex: 1,
    },
    {
      headerName: "Account",
      field: "account",
      renderCell: ({ row }) => (
        <Tooltip title={row.account}>
          <span>{row.account}</span>
        </Tooltip>
      ),
      // sortable: false,
      flex: 1,
    },
    {
      headerName: "Account Code",
      field: "account_code",
      // sortable: false,
      flex: 1,
    },
    {
      headerName: "Credit",
      field: "credit",
      // sortable: false,
      flex: 1,
    },
    {
      headerName: "Debit",
      field: "debit",
      // sortable: false,
      flex: 1,
    },
    {
      headerName: "Comment",
      renderCell: ({ row }) => (
        <Tooltip title={row.comment}>
          <span>{row.comment}</span>
        </Tooltip>
      ),
      field: "comment",
      // sortable: false,
      flex: 1,
    },

    {
      headerName: "Status",
      field: "status",
      renderCell: ({ row }) => (
        <span style={{ color: row.status == "Deleted" && "red" }}>
          {row.status}
        </span>
      ),
      // sortable: false,
      flex: 1,
    },

    {
      headerName: "Action",
      field: "action",
      type: "actions",
      flex: 1,
      getActions: ({ row }) => [
        // view voucher
        <GridActionsCellItem
          disabled={loading}
          icon={<EyeFilled className="view-icon" />}
          onClick={() => {
            setViewJVDetail(row.module_used);
          }}
          label="view"
        />,
        <GridActionsCellItem
          // print voucher
          disabled={loading}
          icon={<PrinterFilled className="view-icon" />}
          onClick={() => {
            printFun(row.module_used);
          }}
          label="print"
        />,
        <GridActionsCellItem
          // download voucher
          disabled={loading}
          icon={<CloudDownloadOutlined className="view-icon" />}
          onClick={() => {
            handleDownload(row.module_used);
          }}
          label="download"
        />,
        <GridActionsCellItem
          // edit voucher
          disabled={loading}
          icon={<EditFilled className="view-icon" />}
          onClick={() => {
            setEditVoucher(row.module_used);
          }}
          label="download"
        />,
        <GridActionsCellItem
          // delete voucher
          style={{ marginTop: -5 }}
          disabled={row.status == "Deleted"}
          icon={
            <Popconfirm
              title="Are you sure to delete this Voucher?"
              onConfirm={deleteFun}
              onCancel={() => {
                setDeleteConfirm(null);
              }}
              okText="Yes"
              cancelText="No"
            >
              <DeleteFilled
                className={`view-icon ${row.status == "Deleted" && "disable"}`}
              />{" "}
            </Popconfirm>
          }
          onClick={() => {
            setDeleteConfirm(row.module_used);
          }}
          label="Delete"
        />,
      ],
    },
  ];

  const printFun = async (key) => {
    setLoading(true);
    const { data } = await imsAxios.post("/tally/jv/jv_print", {
      jv_key: key,
    });
    setLoading(false);
    printFunction(data.buffer.data);
    // module_used
  };

  const handleDownload = async (id) => {
    setLoading(true);
    let link = "/tally/jv/jv_print";
    let filename = "Journal Voucher " + id;

    const { data } = await imsAxios.post(link, {
      jv_key: id,
    });
    downloadFunction(data.buffer.data, filename);
    setLoading(false);
  };

  // console.log(rows)
  return (
    <div style={{ height: "90%" }}>
      <Row gutter={10} style={{ margin: "10px" }}>

        <Col span={4}>
          <Select placeholder="Select Option"
            style={{ width: "100%" }}
            options={options}
            value={allData.setType.value}
            onChange={(w) =>
              setAllData((allData) => {
                return { ...allData, setType: w };
              })
            } />
        </Col>
        {allData?.setType == "date_wise" ? (
          <>

            <Col span={4}>
              <MyDatePicker size="default" setDateRange={setSearchDateRange} />
            </Col>
            <Col span={1}>
              <Button
                loading={loading}
                onClick={getRows}
                type="primary"
              >
                Fetch
              </Button>
            </Col>
          </>


        ) : allData?.setType == "code_wise" ?

          <>
            <Col span={4}>
              <Input placeholder="JV ID"
                value={allData.jvId}
                onChange={(e) =>
                  setAllData((allData) => {
                    return { ...allData, jvId: e.target.value };
                  })
                } />
            </Col>
            <Col span={1}>
              <Button
                loading={loading}
                onClick={getjv}
                type="primary"
              >
                Fetch
              </Button>
            </Col>
          </>
          : (<Col span={4}>
            <MyDatePicker size="default" setDateRange={setSearchDateRange} />
          </Col>)}

      </Row>
      <div style={{ height: "89%", margin: "10px" }}>
        {allData?.setType == "date_wise" ? (
          <MyDataTable
            loading={loading}
            data={rows}
            pagination={true}
            columns={columns} />
        ) : ((
          <MyDataTable
            loading={loading}
            data={Jv}
            columns={columns} />
        ))}
      </div>
      <JounralPostingView setJvId={setViewJVDetail} jvId={viewJVDetail} />
      <EditJournalVoucher
        editVoucher={editVoucher}
        setEditVoucher={setEditVoucher}
      />
    </div>
  )
}

export default JVReport