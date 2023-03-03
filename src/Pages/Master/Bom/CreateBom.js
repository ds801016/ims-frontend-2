import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import MySelect from "../../../Components/MySelect";
import { Button, Card, Col, Form, Input, Row, Space } from "antd";
import MyDataTable from "../../../Components/MyDataTable";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import NavFooter from "../../../Components/NavFooter";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";
import { imsAxios } from "../../../axiosInterceptor";

const CreateBom = () => {
  document.title = "Create Bom";
  const [getDataLoading, setGetDataLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [dataStore, setdataStore] = useState([]);
  const [newBom, setNewBom] = useState({
    bom: "",
    sku: "",
    selbom: "N",
    pname: "",
    pcode: "",
    bomCom: {
      componentkey: [],
      quantity: [],
    },
  });
  const [bomComponent, setBomCOmponent] = useState([
    {
      id: v4(),
      compkey: "",
      qty: "",
    },
  ]);

  const opt = [
    { text: "FG", value: "N" },
    { text: "Semi FG", value: "Y" },
  ];

  const addComponentRow = () => {
    setBomCOmponent((bomComponent) => [
      ...bomComponent,
      {
        id: v4(),
        compkey: "",
        qty: "",
      },
    ]);
  };

  const compInputHandler = (name, id, value) => {
    if (name == "componentkey") {
      setBomCOmponent((componentkey) =>
        componentkey.map((h) => {
          if (h.id == id) {
            {
              return { ...h, compkey: value };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "quantity") {
      setBomCOmponent((componentkey) =>
        componentkey.map((h) => {
          if (h.id == id) {
            {
              return { ...h, qty: value };
            }
          } else {
            return h;
          }
        })
      );
    }
    setBomCOmponent((componentkey) => {
      if (componentkey.id == id) {
        return {
          ...componentkey,
          [name]: value,
        };
      } else {
        return componentkey;
      }
    });
  };

  const removeComponentRow = (id) => {
    setBomCOmponent((bomComponent) => {
      return bomComponent.filter((row) => row.id != id);
    });
  };

  const componentInputHandler = (name, id, value) => {
    setBomCOmponent((rows) =>
      rows.map((row) => {
        if (row.id == id) {
          return { ...row, [name]: value };
        } else {
          return row;
        }
      })
    );
  };

  const getOption = async (productSearchInput) => {
    if (productSearchInput?.length > 2) {
      setSelectLoading(true);

      const { data } = await imsAxios.post("/backend/getComponentByNameAndNo", {
        search: productSearchInput,
      });
      setSelectLoading(false);
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      // return arr;
      setAsyncOptions(arr);
    }
  };

  const getSkuBySearch = async () => {
    setGetDataLoading(true);
    const { data } = await imsAxios.get(`/products/bySku?sku=${newBom.sku}`);
    setGetDataLoading(false);
    if (data.code == 200) {
      setdataStore(data.data);
    } else {
      toast.error(data.message.msg);
    }
  };

  const addBom = async (e) => {
    e.preventDefault();
    let arrCom = [];
    let arrTax = [];

    bomComponent.map((aa) => arrCom.push(aa.compkey));
    bomComponent.map((aaa) => arrTax.push(aaa.qty));

    if (!newBom.bom) {
      toast.error("Please Enter Bom name");
    } else if (!newBom.sku) {
      toast.error("Please Enter SKU no");
    } else if (!newBom.selbom) {
      toast.error("Select Option in empty ");
    } else {
      setSubmitLoading(true);
      const { data } = await imsAxios.post("/bom/insert", {
        bom_subject: newBom.bom,
        sku: newBom.sku,
        bom_recipe_type: newBom.selbom,
        mapped_sfg: newBom.pcode,
        bom_components: {
          component_key: arrCom,
          qty: arrTax,
        },
      });
      setSubmitLoading(false);
      if (data.code == 200) {
        reset();
        setBomCOmponent([
          {
            id: v4(),
            compkey: "",
            qty: "",
          },
        ]);
        setdataStore("");
        toast.success("BOM Has Been Created Successfully");
      } else if (data.code == 500) {
        toast.error(data.message.msg);
      }
    }
  };

  const columns = [
    {
      renderHeader: () => (
        <CommonIcons action="addRow" onClick={addComponentRow} />
      ),
      width: 50,
      field: "add",

      // width: "5
      sortable: false,

      renderCell: ({ row }) =>
        bomComponent.indexOf(row) >= 1 && (
          <CommonIcons
            action="removeRow"
            onClick={() => removeComponentRow(row?.id)}
          />
        ),
      // sortable: false,
    },

    {
      headerName: "Component",
      field: "compkey",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <MyAsyncSelect
          onBlur={() => setAsyncOptions([])}
          loadOptions={getOption}
          selectLoading={selectLoading}
          value={bomComponent.compkey}
          optionsState={asyncOptions}
          onChange={(e) => compInputHandler("componentkey", row.id, e)}
          placeholder="Part/Name"
        />
      ),
    },
    {
      headerName: "Qty",
      field: "qty ",
      width: 250,
      sortable: false,
      renderCell: ({ row }) => (
        <Input
          placeholder="Qty"
          value={bomComponent.qty}
          onChange={(e) => compInputHandler("quantity", row.id, e.target.value)}
        />
      ),
    },
    // {
    //   headerName: "In Stock",
    //   field: "lqty",
    //   flex: 1,
    //   sortable: false,
    //   renderCell: ({ row }) => (
    //     <span>{row.u ? row.lQty + " " + row.u : "--"}</span>
    //   ),
    // },
    // {
    //   headerName: "Ord QTY",
    //   field: "qty",
    //   flex: 1,
    //   sortable: false,
    //   renderCell: ({ row }) => (
    //     <Input
    //       placeholder="Ordered Qty"
    //       value={bomComponent.qty}
    //       onChange={(e) => compInputHandler("quantity", row.id, e.target.value)}
    //     />
    //   ),
    // },
    // {
    //   headerName: "Remark",
    //   field: "remark",
    //   flex: 1,
    //   sortable: false,
    //   renderCell: ({ row }) => (
    //     <Input
    //       placeholder="Remark"
    //       value={bomComponent.remark}
    //       onChange={(e) => compInputHandler("remarks", row.id, e.target.value)}
    //     />
    //   ),
    // },
  ];

  const reset = () => {
    setNewBom({
      bom: "",
      sku: "",
      selbom: "N",
      pcode: "",
    });
    setdataStore("");
  };

  return (
    <div style={{ height: "90%" }}>
      <Row gutter={8} style={{ padding: "0px 10px", height: "100%" }}>
        <Col span={8}>
          <Card>
            <Form style={{ width: "100%" }} size="small" layout="vertical">
              <Row>
                <Col span={24}>
                  <Form.Item label="BOM Name">
                    <Input
                      size="default"
                      disabled={dataStore?.length > 0}
                      value={newBom.bom}
                      onChange={(e) =>
                        setNewBom((newBom) => {
                          return { ...newBom, bom: e.target.value };
                        })
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="SKU Number">
                    <Input
                      disabled={dataStore?.length > 0}
                      size="default"
                      value={newBom.sku}
                      onChange={(e) =>
                        setNewBom((newBom) => {
                          return { ...newBom, sku: e.target.value };
                        })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="FG Type">
                    <MySelect
                      options={opt}
                      value={newBom.selbom}
                      onChange={(e) =>
                        setNewBom((newBom) => {
                          return { ...newBom, selbom: e };
                        })
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="Product Name">
                    <Input
                      size="default"
                      disabled
                      value={dataStore?.length > 0 ? dataStore[0]?.p_name : ""}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {newBom.selbom == "Y" && (
                <Row>
                  <Col span={24}>
                    <Form.Item label="Part Code">
                      <Input
                        size="default"
                        // disabled={dataStore?.length > 0}
                        value={newBom.pcode}
                        onChange={(e) =>
                          setNewBom((newBom) => {
                            return { ...newBom, pcode: e.target.value };
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Form>
            <Row justify="end">
              <Col>
                <Space>
                  <Button onClick={reset}>Reset</Button>
                  <Button
                    loading={getDataLoading}
                    disabled={
                      newBom.bom?.length == 0 ||
                      newBom.sku?.length == 0 ||
                      dataStore?.length > 0
                      // newBom.bom?.length == 0
                    }
                    type="primary"
                    onClick={getSkuBySearch}
                  >
                    Get Data
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col
          style={{
            opacity: dataStore?.length >= 1 ? 1 : 0.5,
            pointerEvents: dataStore?.length >= 1 ? "all" : "none",
            height: "90%",
          }}
          className="remove-cell-border"
          span={16}
        >
          <MyDataTable data={bomComponent} columns={columns} hideHeaderMenu />
        </Col>
      </Row>
      <NavFooter
        resetFunction={() => {
          reset();
          setBomCOmponent([
            {
              id: v4(),
              compkey: "",
              qty: "",
            },
          ]);
        }}
        loading={submitLoading}
        submitFunction={addBom}
        nextLabel="Create BOM"
      />
    </div>
  );
};

export default CreateBom;

{
  /* <form onSubmit={addBom}>
  <div className="row">
    <div className="col-md-5">
      <div className="card  m-5 shadow">
        <div
          className="card-header "
          style={{ minHeight: "40px", backgroundColor: "#4D636F" }}
        ></div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <input
                  type="no"
                  className="form-control"
                  placeholder="BOM"
                  value={newBom.bom}
                  onChange={(e) =>
                    setNewBom((newBom) => {
                      return { ...newBom, bom: e.target.value };
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <input
                  type="nno"
                  className="form-control"
                  placeholder="SKU"
                  value={newBom.sku}
                  onChange={(e) =>
                    setNewBom((newBom) => {
                      return { ...newBom, sku: e.target.value };
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Select
                  options={opt}
                  placeholder="Is this semi FG bom?"
                  value={newBom.selbom}
                  onChange={(e) =>
                    setNewBom((newBom) => {
                      return { ...newBom, selbom: e };
                    })
                  }
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <input
                  type="no"
                  className="form-control "
                  placeholder="Product Name"
                  disabled
                  value={dataStore?.length > 0 ? dataStore[0]?.p_name : ""}
                />
              </div>
            </div>

            {newBom.selbom.value == "Y" && (
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    type="no"
                    placeholder="part code"
                    className="form-control"
                    value={newBom.pcode}
                    onChange={(e) =>
                      setNewBom((newBom) => {
                        return { ...newBom, pcode: e.target.value };
                      })
                    }
                  />
                </div>
              </div>
            )}
            {newBom.selbom.value === "N" && (
              <div className="col-md-12" style={{ display: "none" }}>
                <div className="form-group">
                  <input
                    type="no"
                    className="form-control"
                    placeholder="part code"
                    value={newBom.pcode}
                    onChange={(e) =>
                      setNewBom((newBom) => {
                        return { ...newBom, pcode: e.target.value };
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div className="col-md-12 text-right">
              <button className="btn btn-md btn-outline-secondary ">Reset</button>
              <button className="btn btn-md btn-secondary px-4  mr-1">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {dataStore && (
      <div className="col-md-7">
        <div className="card text-right m-5 shadow">
          <div
            className="card-header "
            style={{ minHeight: "40px", backgroundColor: "#4D636F" }}
          >
            <div className="row">
              <div className="d-flex justify-content-between" style={{ width: "45vw" }}>
                <div color="col-md-12" onClick={addComponentRow}>
                  <RiAddCircleLine size={25} color={"white"} />
                </div>
                <div color="col-md-12" onClick={addComponentRow} style={{ color: "white" }}>
                  Component
                </div>
                <div color="col-md-12" onClick={addComponentRow} style={{ color: "white" }}>
                  QTY | UOM
                </div>
              </div>
            </div>
          </div>
          <div className="card-body overflow-auto" style={{ height: "60vh" }}>
            <div>
              {bomComponent?.map((row, i) => (
                <div className="row p-2" key={row?.id}>
                  <div className="col-md-9 ">
                    <AsyncSelect
                      loadOptions={getOption}
                      onInputChange={(e) => setSearchInput1(e)}
                      value={bomComponent.compkey}
                      onChange={(e) => compInputHandler("componentkey", row.id, e)}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Qty"
                      value={bomComponent.qty}
                      onChange={(e) => compInputHandler("quantity", row.id, e.target.value)}
                    />
                  </div>
                  {i > 0 && (
                    <div className="col-md-1 mt-2">
                      <TbCircleMinus
                        size={20}
                        color="#3a4b53"
                        onClick={() => removeComponentRow(row?.id)}
                        className="cursorr"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</form>; */
}
