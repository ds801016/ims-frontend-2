import React, { useState } from "react";
import { Col, Drawer, Input, Modal, Row, Space } from "antd";
import { EyeFilled, CloseCircleFilled } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { imsAxios } from "../../../axiosInterceptor";

function CloseModal({
  closeModalOpen,
  setCloseModalOpen,
  datewiseFetchData,
  JWFecthData,
  dataFetchSFG,
  vendorFetch,
}) {
  const [remark, setRemark] = useState("");
  const { seltype, row } = closeModalOpen;
  // console.log(row);

  const generateFun = async () => {
    const { data } = await imsAxios.post("/jobwork/closePO", {
      skucode: row.sku,
      transaction: row.po_sku_transaction,
      remark: remark,
    });
    if (data.code == 200) {
      if (seltype == "datewise") {
        setRemark("");
        datewiseFetchData();
        setCloseModalOpen(false);
      } else if (seltype == "jw_transaction_wise") {
        setRemark("");
        JWFecthData();
        setCloseModalOpen(false);
      } else if (seltype == "jw_sfg_wise") {
        setRemark("");
        dataFetchSFG();
        setCloseModalOpen(false);
      } else if (seltype == "vendorwise") {
        setRemark("");
        vendorFetch();
        setCloseModalOpen(false);
      }
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setCloseModalOpen(false);
    }
  };

  useEffect(() => {
    if (closeModalOpen) {
      console.log(closeModalOpen.seltype);
    }
  }, [closeModalOpen]);
  return (
    <form>
      <Modal
        title="are you sure you want to close the Jobwork Purchase Order ?"
        centered
        open={closeModalOpen}
        onOk={() => {
          generateFun();
          // setCloseModalOpen(false);
        }}
        onCancel={() => setCloseModalOpen(false)}
        width={800}
      >
        <Row>
          <Col span={24}>
            Once the Purchase Order will closed, users will not able to proceed
            further action against to this same purchase order{" "}
            <span style={{ fontWeight: "bolder", color: "blue" }}>
              {row?.jwid}{" "}
            </span>
            and product SKU.
          </Col>
          <Col span={24} style={{ marginTop: "10px" }}>
            Note: "CLOSE" action is an reversible action..
          </Col>
          <Col
            span={24}
            style={{
              marginTop: "10px",
              fontSize: "12px",
              fontWeight: "bolder",
            }}
          >
            type any remark in the field below for cancel PO
            <span style={{ fontWeight: "bolder", color: "blue" }}>
              {" "}
              #{row?.jwid}
            </span>{" "}
            (*mandatory)
          </Col>
          <Col span={24} style={{ marginTop: "10px" }}>
            <Input
              placeholder="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </form>
  );
}

export default CloseModal;
