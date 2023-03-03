import React, { useEffect, useState } from "react";
import { Button, Input, Space, Table, Row, Col } from "antd";
import { toast } from "react-toastify";
import { downloadCSVAntTable } from "../../../Components/exportToCSV";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import SingleDatePicker from "../../../Components/SingleDatePicker";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";
import { imsAxios } from "../../../axiosInterceptor";

export default function CPMAnalysis() {
  document.title = "Client Project Management";
  const [projectId, setProjectId] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [nestedTableLoading, setNestedTableLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [detail, setDetail] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [search, setSearch] = useState("");

  const getRows = async () => {
    setSearchLoading(true);
    let search = { date: dateSearch, project: projectId };
    const { data } = await imsAxios.post(
      "/ppr/fetch_finalProjectBomReport",
      search
    );
    setSearchLoading(false);
    if (data.code == 200) {
      setDetail(data);
      let arr = data.data.map((row) => ({ ...row, uniqueKey: row.key }));
      arr[0] = { ...arr[0], date: search.date };
      setRows(arr);
      setFilteredRows(arr);
    } else {
      setRows([]);
      toast.error(data.message.msg);
    }
  };

  const columns = [
    {
      title: "Sr. No.",

      dataIndex: "serial",
      key: "serial",
      width: "7%",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Part",
      dataIndex: "part",
      key: "part",
      width: "7%",
      filterSearch: true,
      filterMode: "tree",
      onFilter: (value, record) => record.name.startsWith(value),
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      filterSearch: true,
      filterMode: "tree",
      onFilter: (value, record) => record.name.startsWith(value),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Req. QTY",
      dataIndex: "requirement",
      key: "requirement",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "PO Ord. QTY",
      dataIndex: "order_qty",
      key: "order_qty",
      width: "15%",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Recvd. QTY",
      dataIndex: "inward_qty",
      key: "inward_qty",
      width: "15%",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Pending QTY",
      dataIndex: "pending_qty",
      key: "pending_qty",
      sorter: (a, b) => a.age - b.age,
    },
  ];
  const nestedColumns = [
    { title: "Sr. No", dataIndex: "index", key: "index", width: "7%" },
    { title: "Part", dataIndex: "part", key: "part", width: "7.5%" },
    { title: "Code", dataIndex: "ven_code", key: "ven_code", width: "10%" },
    { title: "Name", dataIndex: "ven_name", key: "ven_name", width: "27.5%" },
    {
      title: "PO Ord Qty",
      dataIndex: "total_ord",
      key: "total_ord",
      width: "15.5%",
    },
    {
      title: "Recv. Qty",
      dataIndex: "inward_qty",
      key: "inward_qty",
      width: "15.5%",
    },
    { title: "Pending Qty", dataIndex: "pending_qty", key: "pending_qty" },
  ];
  const getDetails = async (record) => {
    if (record.uniqueKey) {
      setNestedTableLoading(record.part);
      const { data } = await imsAxios.post("/ppr/fetch_groupProjectBomReport", {
        project: projectId,
        part: record.key,
      });
      setNestedTableLoading(false);
      record.uniqueKey = null;
      let arr = filteredRows;
      let arr1 = data.data.map((row, index) => {
        return {
          ...row,
          index: index + 1,
        };
      });
      arr = arr.map((row) => {
        if (row.part == data.data[0].part) {
          return {
            ...row,
            details: arr1,
          };
        } else {
          return row;
        }
      });
      setRows((rows) =>
        rows.map((row) => {
          if (row.part == data.data[0].part) {
            return {
              ...row,
              details: arr1,
            };
          } else {
            return row;
          }
        })
      );
      setFilteredRows(arr);
    }
  };

  const getProjectBySearch = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/poProjectName", {
        search: e,
      });
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const inputHandler = (name, value) => {
    setDetail((aa) => {
      return {
        ...aa,
        [name]: value,
      };
    });
  };

  const getUpdate = async () => {
    const { data } = await imsAxios.post("/ppr/updatePPRDetail", {
      project: projectId,
      detail: detail?.detail,
    });
    if (data.code == 200) {
      toast.success(data.message.msg);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
    }
  };

  useEffect(() => {
    let arr = rows;
    let fil = [];
    arr = arr.map((row) => {
      if (row.part.toLowerCase().includes(filterText.toLowerCase())) {
        fil.push(row);
      } else if (row.name.toLowerCase().includes(filterText.toLowerCase())) {
        fil.push(row);
      }
    });
    setFilteredRows(fil);
  }, [filterText]);
  return (
    <div>
      <Row
        style={{ padding: "0px 10px", paddingBottom: 5 }}
        justify="space-between"
      >
        <Space>
          <div style={{ width: 250 }}>
            {/* <Input
              size={"default"}
              onChange={(e) => setProjectId(e.target.value)}
              value={projectId}
              placeholder="Enter Project Id"
            /> */}
            <MyAsyncSelect
              style={{ width: "100%" }}
              onBlur={() => setAsyncOptions([])}
              optionsState={asyncOptions}
              placeholder="Project ID"
              loadOptions={getProjectBySearch}
              onInputChange={(e) => setSearch(e)}
              onChange={(e) => setProjectId(e)}
              value={projectId}
            />
          </div>
          <div style={{ width: 150 }}>
            <SingleDatePicker
              setDate={setDateSearch}
              placeholder="Select Date.."
              selectedDate={dateSearch}
              daysAgo={89}
            />
          </div>
          <Button
            disabled={projectId == "" || dateSearch == "" ? true : false}
            type="primary"
            loading={searchLoading}
            onClick={getRows}
            id="submit"
          >
            Search
          </Button>
          <CommonIcons
            action="downloadButton"
            onClick={() =>
              downloadCSVAntTable(
                rows,
                columns,
                `CPM Analysis project:${rows[0]?.project} from-${rows[0]?.date}`
              )
            }
            disabled={rows.length == 0}
          />
          {/* <div style={{ width: 150, marginLeft: "250px" }}>
            <Input
              value={detail.detail}
              onChange={(e) => inputHandler("detail", e.target.value)}
            />
          </div>
          <Button
            // disabled={projectId === "" || dateSearch === "" ? true : false}
            // type="primary"
            // loading={searchLoading}
            onClick={getUpdate}
            // id="submit"
          >
            <SaveOutlined />
          </Button> */}
        </Space>
        <Col span={4}>
          <Input
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search part..."
          />
        </Col>
      </Row>
      <div style={{ padding: "0px 10px" }}>
        <Table
          bordered={true}
          columns={columns}
          showSorterTooltip={false}
          expandable={{
            expandedRowRender: (record) => {
              getDetails(record);
              return (
                <Table
                  bordered={true}
                  className="nested-table "
                  showSorterTooltip={false}
                  columns={nestedColumns}
                  pagination={false}
                  loading={record.part == nestedTableLoading ? true : false}
                  dataSource={
                    filteredRows.filter((row) => row.part == record.part)[0]
                      ?.details
                  }
                />
              );
            },
          }}
          scroll={{ y: "75vh" }}
          dataSource={filteredRows}
          pagination={false}
          size="small"
        />
      </div>
    </div>
  );
}
