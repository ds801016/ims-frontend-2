import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Col, Input, Row, Switch, Typography } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";
import MySelect from "../../../Components/MySelect";
import InputMask from "react-input-mask";
import MyDataTable from "../../../Components/MyDataTable";
import MyAsyncSelect from "../../../Components/MyAsyncSelect";
import { MinusCircleTwoTone, PlusCircleTwoTone } from "@ant-design/icons";
import NavFooter from "../../../Components/NavFooter";
import { DeleteTwoTone } from "@ant-design/icons";

import BomComponentModal from "./ProductModel/BomComponentModal";
import { imsAxios } from "../../../axiosInterceptor";

const { TextArea } = Input;

const CreatePPR = () => {
  const unique_id = uuid();
  const small_id = unique_id.slice(0, 8);
  document.title = "Create PPR";
  const [dataModal, setDataModal] = useState(false);
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [bomList, setBomList] = useState([]);
  const [delteData, setdelteData] = useState([]);
  const [locationn, setLocationn] = useState([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [allDataPPR, setAllDataPPR] = useState({
    selType: "new",
    comment: "",
    project: "",
    projectDesc: "",

    pro: [],
    bom: [],
    qty: [],
    due: [],
    loc: [],
    cus: [],
    existQty: [],
    stk: [],
    uom: [],
  });

  // console.log(allDataPPR);

  const [addRowData, setAddRowData] = useState([
    {
      id: small_id,
      product: "",
      bomRecipe: "",
      quantity: "",
      dueDate: "",
      location: "",
      customer: "",
      existQuantity: "",
      stockInHand: "",
      uom: "",
      switchStatus: false,
      serverId: "",
      aD: [],
    },
  ]);

  const inputHandler = async (name, id, value) => {
    if (name === "product") {
      const { data } = await imsAxios.post("/ppr/fetchProductData", {
        search: value,
      });
      let arr = [];
      data.bom.map((a) => arr.push({ text: a.text, value: a.id }));
      setBomList(arr);

      // console.log(data.other.uom);
      const exist = data?.other.existingplanedQty;
      const exist1 = data?.other.stockInHand;
      const exist2 = data?.other.uom;

      setAddRowData((product) =>
        product.map((h) => {
          if (h.id == id) {
            {
              return {
                ...h,
                product: value,
                existQuantity: exist,
                stockInHand: exist1,
                uom: exist2,
              };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "bomRecipe") {
      setAddRowData((bomRecipe) =>
        bomRecipe.map((h) => {
          if (h.id == id) {
            {
              return { ...h, bomRecipe: value };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "quantity") {
      setAddRowData((quantity) =>
        quantity.map((h) => {
          if (h.id == id) {
            {
              return { ...h, quantity: value };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "customer") {
      setAddRowData((customer) =>
        customer.map((h) => {
          if (h.id == id) {
            {
              return { ...h, customer: value };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "location") {
      setAddRowData((location) =>
        location.map((h) => {
          if (h.id == id) {
            {
              return { ...h, location: value };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "dueDate") {
      setAddRowData((dueDate) =>
        dueDate.map((h) => {
          if (h.id == id) {
            {
              return { ...h, dueDate: value };
            }
          } else {
            return h;
          }
        })
      );
    }
  };

  const plusRow = () => {
    setAddRowData((addRowData) => [
      ...addRowData,
      {
        id: small_id,
        product: "",
        bomRecipe: "",
        quantity: "",
        due: "",
        location: "",
        customer: "",
        existQty: "",
        sihand: "",
        switchStatus: false,
        serverId: "",
        aD: [],
      },
    ]);
  };

  const minusRow = (id) => {
    setAddRowData((addRowData) => {
      return addRowData.filter((row) => row.id != id);
    });
  };

  const options = [
    { text: "New", value: "new" },
    { text: "Repair", value: "repair" },
    { text: "Testing", value: "testing" },
    { text: "Packing", value: "packing" },
  ];

  const getProduct = async (e) => {
    if (e?.length > 2) {
      setSelectLoading(true);
      const { data } = await imsAxios.post("/backend/fetchProduct", {
        searchTerm: e,
      });
      setSelectLoading(false);
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const getLocation = async () => {
    const { data } = await imsAxios.get("ppr/ppr_section_location");
    const locArr = [];
    data.data.map((a) =>
      locArr.push({ text: `(${a.name}) ${a.address}`, value: a.location_key })
    );
    setLocationn(locArr);
  };
  const createPPR = async () => {
    let comName = [];
    let bomName = [];
    let qtyName = [];
    let dateName = [];
    let locName = [];
    let cusName = [];
    let existName = [];
    let stkName = [];
    let serId = [];
    addRowData.map((a) => comName.push(a.product));
    addRowData.map((a) => bomName.push(a.bomRecipe));
    addRowData.map((a) => qtyName.push(a.quantity));
    addRowData.map((a) => dateName.push(a.dueDate));
    addRowData.map((a) => locName.push(a.location));
    addRowData.map((a) => cusName.push(a.customer));
    addRowData.map((a) => existName.push(a.existQuantity));
    addRowData.map((a) => stkName.push(a.stockInHand));
    addRowData.map((a) => serId.push(a.serverId));

    console.log(bomName);
    if (!allDataPPR.selType) {
      toast.error("Please Select Option");
    } else if (!allDataPPR.comment) {
      toast.error("Please add comment");
    } else {
      setSubmitLoading(true);
      const { data } = await imsAxios.post("/ppr/createPPR", {
        branch: "BRMSC012",
        requesttype: allDataPPR.selType,
        comment: allDataPPR.comment,
        project: allDataPPR.project,
        projectinfo: allDataPPR.projectDesc,
        product: comName,
        recipe: bomName,
        qty: qtyName,
        duedate: dateName,
        location: locName,
        customer: cusName,
        serverrefid: serId,
      });
      setSubmitLoading(false);
      // console.log(data);
      if (data.code == 200) {
        toast.success(data.message);
        setAllDataPPR({ selType: "", comment: "", project: "" });
        setAddRowData([
          {
            id: small_id,
            product: "",
            bomRecipe: "",
            quantity: "",
            dueDate: "",
            location: "",
            customer: "",
            existQuantity: "",
            stockInHand: "",
            serverId: "",
          },
        ]);
      } else if (data.code == 500) {
        toast.error(data.message?.msg?.toString()?.replaceAll("<br/>", ""));
      }
    }
  };
  // console.log(other);

  const resetFunction = () => {
    setAllDataPPR({ selType: "", comment: "", project: "" });
    setAddRowData([
      {
        id: small_id,
        product: "",
        bomRecipe: "",
        quantity: "",
        dueDate: "",
        location: "",
        customer: "",
        existQuantity: "",
        stockInHand: "",
        switchStatus: false,
      },
    ]);
  };

  const deteleFun = (i) => {
    let arr = addRowData;
    arr = arr.map((row) => {
      if (row.id == i) {
        return {
          ...row,
          aD: [],
          serverId: "",
        };
      } else {
        return row;
      }
    });
    setAddRowData(arr);
  };
  const columns = [
    {
      renderHeader: () => (
        <PlusCircleTwoTone style={{ fontSize: "20px" }} onClick={plusRow} />
      ),
      width: 60,
      field: "add",
      sortable: false,
      renderCell: ({ row }) =>
        addRowData.findIndex((r) => r.id == row.id) >= 1 && (
          <MinusCircleTwoTone
            onClick={() => minusRow(row?.id)}
            style={{ fontSize: "20px" }}
          />
        ),
    },
    {
      headerName: "PRODUCT/SKU",
      field: "product",
      width: 400,
      sortable: false,
      renderCell: ({ row }) => (
        <div style={{ width: "100%" }}>
          <MyAsyncSelect
            selectLoading={selectLoading}
            loadOptions={getProduct}
            size="default"
            optionsState={asyncOptions}
            value={row.product}
            onBlur={() => setAsyncOptions(null)}
            onChange={(e) => inputHandler("product", row.id, e)}
            // value={addRowData.product}
          />
        </div>
      ),
    },
    {
      headerName: "BOM",
      field: "bom",
      width: 250,
      sortable: false,
      renderCell: ({ row }) => (
        <MySelect
          options={bomList}
          value={row.bomRecipe}
          onChange={(e) => inputHandler("bomRecipe", row.id, e)}
        />
      ),
    },
    {
      headerName: "PLANNING QTY",
      field: "planningQty",
      width: 140,
      sortable: false,
      renderCell: ({ row }) => (
        <Input
          suffix={row?.uom}
          value={row?.quantity}
          onChange={(e) => inputHandler("quantity", row.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "DUE DATE",
      field: "deudate",
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <InputMask
          className="input-date"
          value={row.dueDate}
          onChange={(e) => inputHandler("dueDate", row.id, e.target.value)}
          mask="99-99-9999"
          placeholder="__-__-____"
          style={{ textAlign: "center" }}
          // defaultValue="01-09-2022"
        />
      ),
    },
    {
      headerName: "SECTION",
      field: "section",
      width: 300,
      sortable: false,
      renderCell: ({ row }) => (
        <MySelect
          options={locationn}
          value={addRowData.location}
          onChange={(e) => inputHandler("location", row.id, e)}
        />
      ),
    },
    {
      headerName: "CUSTOMER NAME",
      field: "customerName",
      // sortable: false,
      width: 180,
      // flex: 1,
      renderCell: ({ row }) => (
        <Input
          value={row.customer}
          onChange={(e) => inputHandler("customer", row.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "RQD",
      width: 100,
      renderCell: ({ row }) => (
        <div>
          <Switch
            checked={row.serverId}
            onChange={() => setDataModal({ ...row, showModal: true })}
          />
          <DeleteTwoTone
            // disabled
            style={{
              marginLeft: "10px",
              cursor: "pointer",
              fontSize: "15px",
              // pointerEvents: "none",
            }}
            onClick={() => deteleFun(row?.id)}
            size="large"
          />
        </div>
      ),
    },
    {
      headerName: "EXISTING QTY",
      width: 120,
      sortable: false,
      field: "existQuantity",
    },
    {
      headerName: "STOCK IN HAND",
      width: 150,
      sortable: false,
      field: "stockInHand",
    },
  ];

  useEffect(() => {
    getLocation();
  }, []);
  const { Text } = Typography;
  return (
    <div style={{ height: "90%" }}>
      <Row gutter={10} style={{ margin: "10px" }}>
        <Col span={6}>
          <Row gutter={10}>
            <Col span={24} style={{ padding: "5px" }}>
              <MySelect
                options={options}
                value={allDataPPR.selType}
                onChange={(e) =>
                  setAllDataPPR((allDataPPR) => {
                    return { ...allDataPPR, selType: e };
                  })
                }
                placeholder="Select a location"
              />
            </Col>
            <Col span={24} style={{ padding: "5px" }}>
              <TextArea
                value={allDataPPR.comment}
                onChange={(e) =>
                  setAllDataPPR((allDataPPR) => {
                    return { ...allDataPPR, comment: e.target.value };
                  })
                }
                placeholder="Remark(If any)"
                rows={4}
              />
            </Col>
            <Col span={24} style={{ padding: "5px" }}>
              <TextArea
                value={allDataPPR.project}
                onChange={(e) =>
                  setAllDataPPR((allDataPPR) => {
                    return { ...allDataPPR, project: e.target.value };
                  })
                }
                rows={1}
                placeholder="Project name/Id"
              />
            </Col>
            <Col span={24} style={{ padding: "5px" }}>
              <TextArea
                value={allDataPPR.projectDesc}
                onChange={(e) =>
                  setAllDataPPR((allDataPPR) => {
                    return { ...allDataPPR, projectDesc: e.target.value };
                  })
                }
                rows={1}
                placeholder="Project Description"
              />
            </Col>
          </Row>
        </Col>
        <Col span={18}>
          <div style={{ height: "75vh", marginTop: "0px" }}>
            <MyDataTable data={addRowData} columns={columns} />
          </div>
        </Col>
      </Row>
      {/* footer */}
      <NavFooter
        resetFunction={resetFunction}
        submitFunction={createPPR}
        nextLabel="Submit"
        loading={submitLoading}
      />

      <BomComponentModal
        setDataModal={setDataModal}
        dataModal={dataModal}
        setAddRowData={setAddRowData}
        addRowData={addRowData}
        setdelteData={setdelteData}
      />
    </div>
  );
};

export default CreatePPR;
