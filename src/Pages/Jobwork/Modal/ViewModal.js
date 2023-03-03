import React, { useState, useEffect } from "react";
import { Button, Col, Drawer, Row, Skeleton, Space } from "antd";
import {
  EyeFilled,
  CloseCircleFilled,
  InfoCircleTwoTone,
} from "@ant-design/icons";
import { v4 } from "uuid";
import axios from "axios";
import InfoModal from "./InfoModal";
import MyDataTable from "../../../Components/MyDataTable";
import { toast } from "react-toastify";
import { imsAxios } from "../../../axiosInterceptor";

const ViewModal = ({
  viewModalOpen,
  setViewModalOpen,
  infoModalInfo,
  setInfoModalInfo,
}) => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState([]);
  const [mainData, setMainData] = useState([]);
  // console.log(view);
  const getFecthData = async () => {
    setLoading(true);
    const { data } = await imsAxios.post("/jobwork/fetchTableAnly", {
      skucode: viewModalOpen.sku,
      jw_transaction: viewModalOpen.jwid,
      po_transaction: viewModalOpen.po_sku_transaction,
    });
    data.header.map((a) => setView(a));
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

  const columns = [
    { field: "index", headerName: "S No.", width: 8 },
    { field: "part_code", headerName: "Part Code", width: 120 },
    { field: "component_name", headerName: "Part Name", width: 350 },
    { field: "bom_uom", headerName: "Uom", width: 100 },
    { field: "bom_qty", headerName: "BOM Qty", width: 100 },
    { field: "required_qty", headerName: "Req Qty", width: 100 },
    { field: "issue_qty", headerName: "Issue Qty", width: 100 },
    { field: "pending_qty", headerName: "Short/Access", width: 180 },
    { field: "comsump_qty", headerName: "Consumption", width: 120 },
    { field: "required_qty", headerName: "RT RTN", width: 120 },
    { field: "p_with_jw", headerName: "Pending With JW", width: 150 },
    { field: "outward_value", headerName: "Outward", width: 120 },
    { field: "inward_value", headerName: "Inward", width: 120 },
    { field: "rm_return_qty", headerName: "RM RTN Value", width: 120 },
  ];

  const cancel = () => {
    setMainData([]);
    setViewModalOpen(false);
  };

  useEffect(() => {
    if (viewModalOpen) {
      getFecthData();
    }
  }, [viewModalOpen]);
  return (
    <Space>
      <Drawer
        width="100vw"
        title={`FG/SFG : ${viewModalOpen.skucode} | ${viewModalOpen.po_sku_transaction}`}
        //   title={`${closeModalOpen?.vendor}`}
        placement="right"
        closable={false}
        onClose={() => setViewModalOpen(false)}
        open={viewModalOpen}
        getContainer={false}
        style={{
          position: "absolute",
        }}
        extra={
          <Space>
            <CloseCircleFilled onClick={cancel} />
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
          <div style={{ height: "83%", marginTop: "20px" }}>
            <div style={{ height: "100%" }}>
              <MyDataTable
                loading={loading}
                columns={columns}
                data={mainData}
              />
            </div>
          </div>
        </Skeleton>
      </Drawer>
    </Space>
  );
};

export default ViewModal;
