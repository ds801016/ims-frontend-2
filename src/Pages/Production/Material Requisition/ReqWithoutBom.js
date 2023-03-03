import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import { Card, Col, Form, Input, Row, Typography } from "antd";
import MySelect from "../../../Components/MySelect";
import TextArea from "antd/lib/input/TextArea";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import MyDataTable from "../../../Components/MyDataTable";
import NavFooter from "../../../Components/NavFooter";
import Loading from "../../../Components/Loading";
import { CommonIcons } from "../../../Components/TableActions.jsx/TableActions";
import { imsAxios } from "../../../axiosInterceptor";

const ReqWithoutBom = () => {
  document.title = "REQ Without BOM";

  const [formLoading, setFormLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [locationVal, setLocationVal] = useState([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [detail, setDetail] = useState("");

  const [allData, setAllData] = useState({
    locValue: "",
    comment: "",

    componentName: [],
    leftQty: [],
    u: [],
    quantity: [],
    remarks: [],
  });
  // console.log(allData);

  const [bomComponent, setBomCOmponent] = useState([
    {
      id: v4(),
      comp: "",
      lQty: "",
      u: "",
      qty: "",
      remark: "",
    },
  ]);

  const compInputHandler = async (name, id, value) => {
    // console.log(name, id, value);
    if (name == "componentName") {
      setTableLoading(true);
      const { data } = await imsAxios.post("/production/fetchProductDetails", {
        component: value,
      });
      setTableLoading(false);

      const data1 = data?.data[0];
      // console.log(data1?.leftQTY);
      setBomCOmponent((componentName) =>
        componentName.map((h) => {
          if (h.id == id) {
            {
              return {
                ...h,
                comp: value,
                lQty: data1?.leftQTY,
                u: data1?.unit,
              };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "quantity") {
      setBomCOmponent((quantity) =>
        quantity.map((h) => {
          if (h.id == id) {
            {
              return { ...h, qty: value };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "remarks") {
      setBomCOmponent((remarks) =>
        remarks.map((h) => {
          if (h.id == id) {
            {
              return { ...h, remark: value };
            }
          } else {
            return h;
          }
        })
      );
    }
    setBomCOmponent((componentName) => {
      // console.log(componentName);
      if (componentName.id == id) {
        return {
          ...componentName,
          [name]: value,
        };
      } else {
        return componentName;
      }
    });
  };

  const addComponentRow = () => {
    setBomCOmponent((bomComponent) => [
      ...bomComponent,
      {
        id: v4(),
        comp: "",
        qty: "",
        remark: "",
      },
    ]);
  };

  const removeComponentRow = (id) => {
    setBomCOmponent((bomComponent) => {
      return bomComponent.filter((row) => row.id != id);
    });
  };

  const getFetchLocation = async () => {
    setSelectLoading(true);
    const { data } = await imsAxios.post(
      "/production/fetchLocationForWitoutBom"
    );
    setSelectLoading(false);
    const arr = [];
    data.data.map((a) => arr.push({ text: a.text, value: a.id }));
    setLocationVal(arr);
  };

  const getLocationDetail = async () => {
    setFormLoading(true);
    const { data } = await imsAxios.post("/production/fetchLocationDetail", {
      location_key: allData.locValue,
    });
    setFormLoading(false);
    setDetail(data.data);
  };

  const getOption = async (productSearchInput) => {
    setSelectLoading(true);
    if (productSearchInput?.length > 2) {
      const { data } = await imsAxios.post("/backend/getComponentByNameAndNo", {
        search: productSearchInput,
      });
      setSelectLoading(false);
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const SendRequst = async (e) => {
    e.preventDefault();

    let arrCom = [];
    let arrQty = [];
    let arrRemark = [];
    let problem = false;
    bomComponent.map((aa) => arrCom.push(aa.comp));
    bomComponent.map((aa) => arrQty.push(aa.qty));
    bomComponent.map((aa) => arrRemark.push(aa.remark));
    bomComponent.map((row) => {
      if (!row.comp || row.comp == "") {
        problem = true;
      } else if (!row.qty || row.qty == "") {
        problem = true;
      }
    });
    // console.log(allData.comment);

    if (!allData.locValue) {
      toast.error("Please Select Location");
    } else {
      if (problem) {
        return toast.error(
          "Please Enter all the values for all the components"
        );
      }
      setSubmitLoading(true);
      const { data } = await imsAxios.post("/production/createWithoutBom", {
        companybranch: "BRMSC012",
        comment: allData.comment,
        location: allData.locValue,
        component: arrCom,
        remark: arrRemark,
        qty: arrQty,
      });

      setSubmitLoading(false);
      if (data.code == 200) {
        ResetFun();
        toast.success(data.message);
      } else if (data.code == 500) {
        toast.error(data.message.msg);
      }
    }
  };

  const ResetFun = () => {
    // console.log("first");
    setAllData({
      locValue: "",
      comment: "",
    });
    setDetail("");
    setBomCOmponent([
      {
        id: v4(),
        comp: "",
        lQty: "",
        u: "",
        qty: "",
        remark: "",
      },
    ]);
  };
  const columns = [
    {
      renderHeader: () => (
        <CommonIcons action="addRow" onClick={addComponentRow} />
      ),

      width: 50,
      type: "actions",

      sortable: false,
      renderCell: ({ row }) =>
        bomComponent.findIndex((r) => r.id == row.id) >= 1 && (
          <CommonIcons
            onClick={() => removeComponentRow(row?.id)}
            action="removeRow"
          />
        ),
      // sortable: false,
    },
    {
      headerName: "Component",
      field: "component",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <MyAsyncSelect
          onBlur={() => setAsyncOptions([])}
          optionsState={asyncOptions}
          selectLoading={selectLoading}
          loadOptions={getOption}
          value={bomComponent.comp}
          onChange={(e) => compInputHandler("componentName", row.id, e)}
        />
      ),
    },
    // {
    //   headerName: "In Stock",
    //   field: "lqty",
    //   flex: 1,
    //   sortable: false,
    //   renderCell: ({ row }) => <span>{row.u ? row.lQty + " " + row.u : "--"}</span>,
    // },
    {
      headerName: "Order QTY",
      field: "qty",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Input
          suffix={row.u ? row.lQty + " " + row.u : "--"}
          placeholder="Ordered Qty"
          value={bomComponent.qty}
          onChange={(e) => compInputHandler("quantity", row.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "Remark",
      field: "remark",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Input
          placeholder="Remark"
          value={bomComponent.remark}
          onChange={(e) => compInputHandler("remarks", row.id, e.target.value)}
        />
      ),
    },
  ];
  useEffect(() => {
    getFetchLocation();
  }, []);

  useEffect(() => {
    if (allData.locValue) {
      getLocationDetail();
    }
  }, [allData.locValue]);
  const { Text } = Typography;
  return (
    <>
      <Row gutter={8} style={{ height: "90%", padding: 10 }}>
        <Col span={6}>
          <Card size="small">
            <Form size="small" layout="vertical">
              {formLoading && <Loading />}
              <Row>
                <Col span={24}>
                  <Form.Item label="Select Location">
                    <MySelect
                      selectLoading={selectLoading}
                      options={locationVal}
                      value={allData.locValue}
                      onChange={(e) =>
                        setAllData((allData) => {
                          return { ...allData, locValue: e };
                        })
                      }
                      placeholder="Select a location"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ marginBottom: 10, marginTop: 10 }}>
                <Col span={24}>
                  <TextArea
                    style={{ resize: "none" }}
                    rows={4}
                    disabled
                    value={detail}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <TextArea
                    style={{ resize: "none" }}
                    rows={4}
                    placeholder="Any Remarks (Optional)"
                    value={allData?.comment}
                    onChange={(e) =>
                      setAllData((allData) => {
                        return { ...allData, comment: e.target.value };
                      })
                    }
                  />
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col span={18}>
          <div
            className="remove-table-footer remove-cell-border"
            style={{ height: "90%", width: "100%" }}
          >
            <MyDataTable
              loading={tableLoading}
              hideHeaderMenu
              columns={columns}
              data={bomComponent}
            />
          </div>
        </Col>
      </Row>
      <NavFooter
        resetFunction={ResetFun}
        submitFunction={SendRequst}
        nextLabel="Send Request"
        loading={submitLoading}
      />
    </>
  );
};

export default ReqWithoutBom;
{
  /* <div
              className="col-md-12 p-2"
              style={{ backgroundColor: "#EEEEEE" }}
            >
              <div className="btn-group float-right" role="group">
                <button
                  type="button"
                  className="btn btn-danger mr-2"
                  onClick={ResetFun}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-success px-4"
                  onClick={SendRequst}
                >
                  Send Request
                </button>
              </div>
            </div>     */
}
