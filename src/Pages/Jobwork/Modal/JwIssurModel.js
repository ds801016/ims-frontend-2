import React, { useState, useEffect } from "react";
import { Button, Col, Drawer, Input, Row, Skeleton, Space } from "antd";
import { EyeFilled, CloseCircleFilled, DeleteTwoTone } from "@ant-design/icons";
import { v4 } from "uuid";
import axios from "axios";
import MyDataTable from "../../../Components/MyDataTable";
import { toast } from "react-toastify";
import { imsAxios } from "../../../axiosInterceptor";

const JwIssurModel = ({ openModal, setOpenModal, datewiseFetchData }) => {
  const [loading, setLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [view, setView] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [mat, setMat] = useState([]);
  // console.log(mainData);
  // console.log(openModal);

  const getFecthData = async () => {
    setLoading(true);
    const { data } = await imsAxios.post("/jobwork/jw_material_request_list", {
      jw_transaction: openModal.jw_transaction_id,
      po_transaction: openModal.sku_transaction_id,
      skucode: openModal.sku,
    });
    if (data.code == 200) {
      data.headers.map((a) => setView(a));
      let arr = data.components.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setMainData(arr);
      // setOpenModal(false);
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setOpenModal(false);
      setLoading(false);
    }
  };

  const compInputHandler = async (name, value, id) => {
    console.log(name, value, id);
    if (name == "qty") {
      setMainData((issueQty) =>
        issueQty.map((a) => {
          if (a.id == id) {
            {
              return { ...a, qty: value };
            }
          } else {
            return a;
          }
        })
      );
    }
  };

  const columns = [
    { field: "index", headerName: "S No.", width: 8 },
    { field: "part_code", headerName: "Part Code", width: 120 },
    { field: "component_name", headerName: "Component", width: 400 },
    { field: "available_qty", headerName: "Available Qty", width: 150 },
    { field: "bom_req_qty", headerName: "Required Qty", width: 150 },
    { field: "pending_qty", headerName: "Pending Qty", width: 150 },
    {
      field: "qty",
      headerName: "Issue Qty",
      width: 120,
      renderCell: ({ row }) => (
        <>
          <Input
            onChange={(e) => compInputHandler("qty", e.target.value, row.id)}
          />
          {/* <DeleteTwoTone
            onClick={() => console.log(row.index)}
            style={{ fontSize: "20px", marginLeft: "10px" }}
          /> */}
        </>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 100,
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

  const saveFun = async () => {
    setCloseLoading(true);
    let componentKey = [];
    let qtyArray = [];
    mainData.map((comKey) => componentKey.push(comKey.component_key));
    mainData.map((comKey) => qtyArray.push(comKey.qty));

    const { data } = await imsAxios.post("/jobwork/save_jw_material_issue", {
      jobwork_jw_trans_id: openModal.jw_transaction_id,
      jobwork_po_trans_id: openModal.sku_transaction_id,
      component: componentKey,
      issue_qty: qtyArray,
    });
    if (data.code == 200) {
      setOpenModal(false);
      setCloseLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setCloseLoading(false);
    }
    console.log(data);
  };

  const reset = (i) => {
    setMainData((allDataComes) => {
      return allDataComes.filter((row) => row.id != i);
    });
  };
  const cancel = () => {
    setMainData([]);
    setOpenModal(false);
  };
  useEffect(() => {
    if (openModal) {
      getFecthData();
    }
  }, [openModal]);
  return (
    <Space>
      <Drawer
        width="100vw"
        //   title="op"
        title={`FG/SFG:${openModal.skucode} |  JW ID:${openModal.jw_transaction_id}`}
        //   title={`${closeModalOpen?.vendor}`}
        placement="right"
        closable={false}
        onClose={cancel}
        open={openModal}
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
          <Row
            gutter={10}
            style={{ border: "1px solid grey", padding: "10px" }}
          >
            <Col span={8} style={{ fontWeight: "bolder", fontSize: "12px" }}>
              JW OP Id:{view.jw_jobwork_id}
            </Col>
            <Col span={8} style={{ fontWeight: "bolder", fontSize: "12px" }}>
              Jobwork ID:{view.jw_jobwork_id}
            </Col>
            <Col span={8} style={{ fontWeight: "bolder", fontSize: "12px" }}>
              FG/SFG Name & SKU:{`${view.product_name}/ ${view.sku_code}`}
            </Col>
            <Col span={8} style={{ fontWeight: "bolder", fontSize: "12px" }}>
              JW PO created by:{view.created_by}
            </Col>
            <Col span={8} style={{ fontWeight: "bolder", fontSize: "12px" }}>
              FG/SFG BOM of Recipe:{view.subject_name}
            </Col>
            <Col span={8} style={{ fontWeight: "bolder", fontSize: "12px" }}>
              Regisered Date & Time:{view.registered_date}
            </Col>
            <Col span={8} style={{ fontWeight: "bolder", fontSize: "12px" }}>
              FG/SFG Ord Qty:{view.ordered_qty}
            </Col>
            <Col span={8} style={{ fontWeight: "bolder", fontSize: "12px" }}>
              Job ID Status:{view.jw_status}
            </Col>
            <Col span={8} style={{ fontWeight: "bolder", fontSize: "12px" }}>
              FG/SFG processed Qty:{view.proceed_qty}
            </Col>
            <Col span={8} style={{ fontWeight: "bolder", fontSize: "12px" }}>
              Job Worker :{view.vendor_name}
            </Col>
          </Row>

          <div style={{ height: "70%", marginTop: "20px" }}>
            <div style={{ height: "100%" }}>
              <MyDataTable
                loading={loading}
                columns={columns}
                data={mainData}
              />
            </div>
          </div>
          <Row>
            <Col span={24}>
              <div style={{ textAlign: "end", marginTop: "40px" }}>
                <Button loading={closeLoading} type="primary" onClick={saveFun}>
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </Skeleton>
      </Drawer>
    </Space>
  );
};

export default JwIssurModel;
