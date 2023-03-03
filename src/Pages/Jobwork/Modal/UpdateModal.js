import React, { useState, useEffect } from "react";
import { EyeFilled, CloseCircleFilled, DeleteTwoTone } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { Button, Col, Drawer, Row, Skeleton, Space, Input } from "antd";
import MyDataTable from "../../../Components/MyDataTable";
import { imsAxios } from "../../../axiosInterceptor";

function UpdateModal({
  updateModalInfo,
  setUpdateModalInfo,
  datewiseFetchData,
  JWFecthData,
  dataFetchSFG,
  vendorFetch,
}) {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState([]);
  const [mainData, setMainData] = useState([]);

  let row = updateModalInfo.row;

  const getAllData = async () => {
    setLoading(true);
    const { data } = await imsAxios.post("/jobwork/fetchJwAnlyUpdate", {
      jw_transaction: row?.jwid,
      po_transaction: row?.jwid,
      skucode: row?.sku,
    });
    setView(data?.headers);

    if ((data.code = 200)) {
      let arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setMainData(arr);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  const compInputHandler = async (name, value, id) => {
    console.log(name, value, id);
    if (name == "bom_req") {
      setMainData((issueQty) =>
        issueQty.map((a) => {
          if (a.id == id) {
            {
              return { ...a, bom_req: value };
            }
          } else {
            return a;
          }
        })
      );
    }
  };

  const reset = (i) => {
    setMainData((allDataComes) => {
      return allDataComes.filter((row) => row.id != i);
    });
  };

  const columns = [
    { field: "index", headerName: "S No.", width: 8 },
    { field: "component_name", headerName: "COMPONENT NAME", width: 450 },
    { field: "bom_req_qty", headerName: "BOM REQUIRED QTY", width: 180 },
    { field: "uom", headerName: "UOM", width: 100 },
    {
      // field: "bom_req_qty",
      headerName: "UPDATE QTY",
      width: 240,
      renderCell: ({ row }) => (
        <>
          <Input
            // value={row?.bom_req_qty}
            onChange={(e) =>
              compInputHandler("bom_req", e.target.value, row.id)
            }
          />
        </>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 150,
      renderCell: ({ row }) => (
        <>
          <DeleteTwoTone
            onClick={() => reset(row.id)}
            // onClick={() => console.log(row)}
            style={{ fontSize: "20px", marginLeft: "10px" }}
          />
        </>
      ),
    },
  ];

  const updateFun = async () => {
    let allCompArray = [];
    let allQtyArray = [];

    mainData.map((a) => allCompArray.push(a.component_key));
    mainData.map((a) => allQtyArray.push(a.bom_req_qty));

    //  console.log(view);

    const { data } = await imsAxios.post("/jobwork/updateJwAnlyComp", {
      component: allCompArray,
      qty: allQtyArray,
      sku_trans_id: view?.jobwork_sku_id,
      trans_id: view?.jobwork_id,
    });
    if (data.code == 200) {
      if (updateModalInfo.selType == "datewise") {
        datewiseFetchData();
        setUpdateModalInfo(false);
      } else if (updateModalInfo.selType == "jw_transaction_wise") {
        JWFecthData();
        setUpdateModalInfo(false);
      } else if (updateModalInfo.selType == "jw_sfg_wise") {
        dataFetchSFG();
        setUpdateModalInfo(false);
      } else if (updateModalInfo.selType == "vendorwise") {
        vendorFetch();
        setUpdateModalInfo(false);
      }
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setUpdateModalInfo(false);
    }
    //  console.log(data)
  };

  useEffect(() => {
    if (updateModalInfo) {
      getAllData();
    }
  }, [updateModalInfo]);
  return (
    <Space>
      <Drawer
        width="100vw"
        title={
          <span style={{ fontSize: "15px", color: "#1890ff" }}>
            {`${row?.jwid} / ${row?.vendor}`}
          </span>
        }
        placement="right"
        closable={false}
        onClose={() => setUpdateModalInfo(false)}
        open={updateModalInfo}
        getContainer={false}
        style={
          {
            //  position: "absolute",
          }
        }
        extra={
          <Space>
            <CloseCircleFilled onClick={() => setUpdateModalInfo(false)} />
          </Space>
        }
      >
        <Skeleton active loading={loading}>
          <Row>
            <Col span={24}>
              <Row gutter={5}>
                <Col span={8} style={{ fontSize: "12px", fontWeight: "bold" }}>
                  JW PO ID:
                  <span>{view.jobwork_id}</span>
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: "12px", fontWeight: "bolder" }}
                >
                  Jobwork ID : <span>{view.jobwork_id}</span>
                </Col>

                <Col
                  span={8}
                  style={{ fontSize: "12px", fontWeight: "bolder" }}
                >
                  FG/SFG Name & SKU :<span>{view.product_name}</span>
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: "12px", fontWeight: "bolder" }}
                >
                  JW PO created by :<span>{view.created_by}</span>
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: "12px", fontWeight: "bolder" }}
                >
                  FG/SFG BOM of Recipe :<span>{view.subject_name}</span>
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: "12px", fontWeight: "bolder" }}
                >
                  Regisered Date & Time :<span>{view.registered_date}</span>
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: "12px", fontWeight: "bolder" }}
                >
                  FG/SFG Ord Qty :<span>{view.ordered_qty}</span>
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: "12px", fontWeight: "bolder" }}
                >
                  Job ID Status :<span>{view.jw_status}</span>
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: "12px", fontWeight: "bolder" }}
                >
                  FG/SFG processed Qty:
                  <span>{view.proceed_qty}</span>
                </Col>
                <Col
                  span={8}
                  style={{ fontSize: "12px", fontWeight: "bolder" }}
                >
                  FG/SFG processed Qty:
                  <span>{view.vendor_name}</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Skeleton>

        <Skeleton loading={loading} active>
          <div style={{ height: "75%", marginTop: "20px" }}>
            <div style={{ height: "100%" }}>
              <MyDataTable
                loading={loading}
                columns={columns}
                data={mainData}
              />
            </div>
          </div>
        </Skeleton>

        <Skeleton loading={loading} active>
          <Row>
            <Col span={24}>
              <div style={{ textAlign: "end", marginTop: "30px" }}>
                <Button onClick={updateFun} type="primary">
                  Update
                </Button>
              </div>
            </Col>
          </Row>
        </Skeleton>
      </Drawer>
    </Space>
  );
}

export default UpdateModal;
