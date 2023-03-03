import React, { useEffect, useState } from "react";
import { Button, Col, Drawer, Input, Row, Space } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import MyDataTable from "../../../../Components/MyDataTable";
import { CloseCircleTwoTone } from "@ant-design/icons";
import { imsAxios } from "../../../../axiosInterceptor";

function BomComponentModal({
  dataModal,
  setDataModal,
  addRowData,
  setAddRowData,
}) {
  const [allData, setAllData] = useState([]);

  const getAllComponentList = async () => {
    const { data } = await imsAxios.post("/ppr/fetchBOMComponent", {
      sku: dataModal.product,
      bom: dataModal.bomRecipe,
      qty: dataModal.quantity,
      serverref: dataModal.serverId ?? "",
      cilentref: dataModal?.id,
    });

    if (data.code == 200) {
      let arr = data.data.map((row, index) => {
        return {
          ...row,
          id: v4(),
          index: index + 1,
        };
      });
      setAllData(arr);
    } else if (data.code == 500) {
      toast.error(data.message.sku);
    }
  };

  const inputHandler = (name, id, value) => {
    console.log(name, id, value);
    if (name == "qty") {
      setAllData((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, qty: value };
            }
          } else {
            return aa;
          }
        })
      );
    }
  };

  const reset = (i) => {
    setAllData((allDataComes) => {
      return allDataComes.filter((row) => row.id != i);
    });
  };
  const resetData = (i) => {
    console.log(i);
    // setAllData((allDataComes) => {
    //   return allDataComes.filter((row) => row.id != i);
    // });
  };

  const columns = [
    // { field: "index", headerName: "S No.", width: 8 },
    { field: "part", headerName: "Part", width: 70 },
    { field: "name", headerName: "Name", width: 400 },
    {
      field: "qty",
      headerName: "Required Qty",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          suffix={row?.uom}
          value={row?.qty}
          placeholder="Qty"
          onChange={(e) => inputHandler("qty", row.id, e.target.value)}
        />
      ),
    },
    {
      type: "actions",
      headerName: "Delete",
      width: 100,
      getActions: ({ row }) => [
        <CloseCircleTwoTone
          onClick={() => reset(row?.id)}
          // onClick={() => console.log(row.serial)}
          style={{ color: "#1890ff", fontSize: "15px" }}
        />,
      ],
    },
  ];

  const updateFunction = async () => {
    // console.log(dataModal);
    const compArray = [];
    const reqArray = [];
    allData.map((a) => compArray.push(a.component));
    allData.map((aa) => reqArray.push(aa.qty));

    const { data } = await imsAxios.post("/ppr/save_pprBomRM", {
      skucode: dataModal.product,
      bom: dataModal.bomRecipe,
      ord_qty: dataModal.quantity,
      component: compArray,
      req_qty: reqArray,
      serverref: "",
      cilentref: dataModal.id,
    });

    if (data.code == 200) {
      let arr = addRowData.map((row) => {
        if (row.id == dataModal.id) {
          return {
            ...row,
            serverId: data.data.serverref,
            aD: allData,
          };
        } else {
          return row;
        }
      });
      setAddRowData(arr);

      setDataModal((dm) => ({ ...dm, showModal: false }));
    } else if (data.code == 500) {
      toast.error(data.message.msg);
    }
  };

  useEffect(() => {
    if (dataModal) {
      getAllComponentList();
    }
  }, [dataModal]);

  return (
    <Space>
      <Drawer
        width="55vw"
        title="BOM Component(s) List"
        placement="right"
        closable={false}
        onClose={() => setDataModal((dm) => ({ ...dm, showModal: false }))}
        open={dataModal.showModal}
        getContainer={false}
        style={{
          position: "absolute",
        }}
        extra={
          <Space>
            <CloseCircleFilled
              onClick={() =>
                setDataModal((dm) => ({ ...dm, showModal: false }))
              }
            />
          </Space>
        }
      >
        <div style={{ height: "85%" }}>
          <div style={{ height: "100%" }}>
            <MyDataTable columns={columns} data={allData} />
          </div>
        </div>
        <Row gutter={10} style={{ marginTop: "30px" }}>
          <Col span={24}>
            <div style={{ textAlign: "end" }}>
              <Button
                onClick={() => setDataModal(false)}
                // onClick={() => setDataModal(false)}
                style={{
                  marginRight: "5px",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Reset
              </Button>
              <Button
                onClick={updateFunction}
                // loading={updteModal}
                type="primary"
              >
                Update
              </Button>
            </div>
          </Col>
        </Row>
      </Drawer>
    </Space>
  );
}

export default BomComponentModal;
