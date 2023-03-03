import React, { useState } from "react";
import { Button, Col, Divider, Input, Row, Select, Layout, Card } from "antd";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import { useEffect } from "react";
import { v4 } from "uuid";
import MyDataTable from "../../Components/MyDataTable";
import SingleDatePicker from "../../Components/SingleDatePicker";
import { toast } from "react-toastify";
import { imsAxios } from "../../axiosInterceptor";

const { TextArea } = Input;
function CreateJW() {
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const poOption = [{ label: "New", value: "N" }];
  const [tab, setTab] = useState(true);
  const VendorOption1 = [
    { label: "Local", value: "1" },
    { label: "Inter-State", value: "2" },
  ];
  const [datee, setDatee] = useState("");
  const VendorOption = [
    { label: "JWI", value: "j01" },
    // { label: "Vendor", value: "v01" },
  ];
  const [JWData, setJWData] = useState({
    PoType: "",
    VType: "",
    vName: "",
    bName: "",
    tAndC: "",
    quat: "",
    paymentTerm: "",
    billingLocation: "",
    address: "",
    gstNo: "",
    pan: "",
    dispatchAddress: "",
    dispatchAddress1: "",
    dispatchGst: "",
    dispatchPan: "",

    vendorData: "",
  });

  // console.log(JWData);

  const [addRow, setAddRow] = useState([
    {
      id: v4(),
      productName: "",
      ordQty: 0,
      rate: 0,
      value: 0,
      dueDate: "",
      hsnData: "",
      gstType: "1",
      gstRate: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      itemDesc: "",
      existUnit: "",
    },
  ]);


  const [asyncOptions, setAsyncOptions] = useState([]);
  const [branch, setBranch] = useState("");
  const [addAndGst, setAddAndGst] = useState({});
  // console.log(JWData.bNam);
  const [location, setLocation] = useState([]);
  const [shippingAddress, setShippingAddress] = useState([]);
  // console.log(addAndGst);
  // console.log("shippingAddress->", shippingAddress);

  const jwInputHandler = (name, value) => {
    setJWData((JWData) => {
      return {
        ...JWData,
        [name]: value,
      };
    });
  };

  const getOption = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/vendorList", {
        search: e,
      });
      // console.log(data);
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const getFetchBranch = async () => {
    const { data } = await imsAxios.post("/backend/vendorBranchList", {
      vendorcode: JWData.vName,
    });
    //  console.log(data);
    const arr = data.data.map((d) => {
      return { label: d.text, value: d.id };
    });

    setBranch(arr);
    // getFetchAddress();
  };

  const getFetchAddress = async () => {
    const { data } = await imsAxios.post("/backend/vendorAddress", {
      vendorcode: JWData.vName,
      branchcode: JWData.bName,
    });
    setAddAndGst(data.data);
    // setAddress(data.data);
    //  vendorInputHandler("vaddress", data?.data?.address);
    //  vendorInputHandler("vgst", data?.data?.gstid);
  };

  const getWereHouseList = async () => {
    const { data } = await imsAxios.post("/backend/billingAddressList");
    // console.log(data);
    let a = [];
    data.map((x) => a.push({ label: x.text, value: x.id }));
    // console.log(a);
    setLocation(a);
    // // console.log(a);
    // vendorInputHandler("werehousebilling", a);
  };

  const getWarehouseAddress = async () => {
    const { data } = await imsAxios.post("/backend/billingAddress", {
      billing_code: JWData.billingLocation,
    });
    // console.log(data.data);
    jwInputHandler("address", data.data.address);
    jwInputHandler("gstNo", data.data.gstin);
    jwInputHandler("pan", data.data.pan);
    // vendorInputHandler("werehouseaddress", data?.data?.address);
    // vendorInputHandler("werehousepan", data?.data?.pan);
    // vendorInputHandler("werehousegst", data?.data?.gstin);
  };

  const getShippingDataFetch = async () => {
    const { data } = await imsAxios.post("/backend/shipingAddressList");
    let a = [];
    data.map((aa) => a.push({ label: aa.text, value: aa.id }));
    setShippingAddress(a);
  };

  const getDispatchWarehouseAddress = async () => {
    //  console.log("first");
    const { data } = await imsAxios.post("backend/shippingAddress", {
      shipping_code: JWData.dispatchAddress,
    });
    // console.log(data.data);
    jwInputHandler("dispatchAddress1", data.data.address);
    jwInputHandler("dispatchGst", data.data.gstin);
    jwInputHandler("dispatchPan", data.data.pan);
  };

  const nextPage = () => {
    if (!JWData.PoType) {
      toast.error("Please Select PO Type");
    } else if (!JWData.VType) {
      toast.error("Please Select Vendor Type");
    } else if (!JWData.vName) {
      toast.error("Please Select Vendor Name");
    } else if (!JWData.bName) {
      toast.error("Please Select Branch");
    } else if (!JWData.billingLocation) {
      toast.error("Please Select Billing Address");
    } else if (!JWData.dispatchAddress) {
      toast.error("Please Select Dispatch Address");
    } else {
      setTab(!true);
    }
    //  else if (!allData.vname) {
    //   toast.error("Please Select Vendor Name");
    // } else if (!allData.vbranch) {
    //   toast.error("Please Select Vendor Branch");
    // } else if (!allData.vmode) {
    //   toast.error("Please Enter a Payment Mode");
    // } else if (!allData.vref) {
    //   toast.error("Please Enter a vendor reference");
    // } else if (!allData.orderno) {
    //   toast.error("Please Enter order no");
    // } else if (!allData.votherref) {
    //   toast.error("Please Enter a vendor other referance");
    // } else if (!allData.dispatchno) {
    //   toast.error("Please Enter a dispatch no");
    // } else if (!allData.dispatchthrough) {
    //   toast.error("Please Enter a dispatch througth");
    // } else if (!allData.destination) {
    //   toast.error("Please Enter a destination");
    // } else if (!allData.delivery) {
    //   toast.error("Please Enter a delivery");
    // } else if (!allData.vehicleno) {
    //   toast.error("Please Enter a vehicleno");
    // } else if (!allData.narration) {
    //   toast.error("Please Enter a narration");
    // } else if (!allData.werehousebilling) {
    //   toast.error("Please Enter a billing");
    // } else {
    //   setTab(!true);
    // }
  };

  const getComponent = async (e) => {
    if (e?.length > 2) {
      const { data } = await imsAxios.post("/backend/getProductByNameAndNo", {
        search: e,
      });
      // console.log(data);
      let arr = [];
      arr = data.map((d) => {
        return { text: d.text, value: d.id };
      });
      setAsyncOptions(arr);
    }
  };

  const back = () => {
    setTab(!false);
  };

  const inputHandler = async (name, id, value) => {
    // console.log(name, id, value);

    let arr = addRow;

    if (name == "productName") {
      const { data } = await imsAxios.post("/jobwork/fetchProductData4Table", {
        product: value,
      });
      const unit = data?.data.unit;
      const hsn = data?.data.hsn;
      const gst = data?.data.gstrate;

      setAddRow((comp) =>
        comp.map((h) => {
          if (h.id == id) {
            {
              return {
                ...h,
                productName: value,
                existUnit: unit,
                hsnData: hsn,
                gstRate: gst,
              };
            }
          } else {
            return h;
          }
        })
      );
    } else if (name == "ordQty") {
      setAddRow((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, ordQty: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "rate") {
      setAddRow((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, rate: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "hsnData") {
      setAddRow((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, hsnData: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "gstRate") {
      setAddRow((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, gstRate: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "gstType") {
      if (value == 1) {
        setAddRow((rows) =>
          rows.map((row) => {
            return {
              ...row,
              cgst: (row.value * row.gstRate) / 2 / 100,
              sgst: (row.value * row.gstRate) / 2 / 100,
              igst: "0",
            };
          })
        );
      } else if (value == 2) {
        setAddRow((rows) =>
          rows.map((row) => {
            return {
              ...row,
              igst: (row.value * row.gstRate) / 100,
              cgst: "0",
              sgst: "0",
            };
          })
        );
      }
      setAddRow((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, gstType: value };
            }
          } else {
            return aa;
          }
        })
      );
    } else if (name == "itemDesc") {
      setAddRow((a) =>
        a.map((aa) => {
          if (aa.id == id) {
            {
              return { ...aa, itemDesc: value };
            }
          } else {
            return aa;
          }
        })
      );
    }
    setAddRow((rows) =>
      rows.map((row) => {
        return { ...row, value: row.ordQty * row.rate };
      })
    );
    setAddRow((rows) =>
      rows.map((row) => {
        return { ...row, value: row.ordQty * row.rate };
      })
    );
  };

  const columns = [
    {
      headerName: "PRODUCT/NAME",
      width: 390,

      field: "product",
      renderCell: ({ row }) => (
        <MyAsyncSelect
          style={{ width: "100%" }}
          onBlur={() => setAsyncOptions([])}
          onInputChange={(e) => setSearchInput(e)}
          loadOptions={getComponent}
          value={addRow?.productName}
          optionsState={asyncOptions}
          onChange={(e) => inputHandler("productName", row.id, e)}
          // value={addRowData.product}
        />
      ),
    },
    {
      headerName: "ORD QTY",
      field: "ordQty",
      width: 130,

      renderCell: ({ row }) => (
        <Input
          suffix={row?.existUnit}
          value={row?.ordQty}
          placeholder="Qty"
          onChange={(e) => inputHandler("ordQty", row?.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "RATE",
      field: "rate",
      renderCell: ({ row }) => (
        <Input
          placeholder="Rate"
          value={row?.rate}
          onChange={(e) => inputHandler("rate", row.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "VALUE",
      field: "value",
      renderCell: ({ row }) => <Input disabled placeholder="Value" value={row.value} />,
    },
    {
      headerName: "DUE DATE",
      field: "dueDate",
      width: 150,
      renderCell: ({ row }) => <SingleDatePicker setDate={setDatee} size="default" />,
    },
    {
      headerName: "HSN CODE",
      field: "hsnData",
      width: 150,
      renderCell: ({ row }) => (
        <Input
          placeholder="hsnData"
          value={row.hsnData}
          onChange={(e) => inputHandler("hsnData", row.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "GST RATE",
      field: "gstRate",
      width: 100,
      renderCell: ({ row }) => (
        <Input
          style={{ width: "100%" }}
          value={row.gstRate}
          onChange={(e) => inputHandler("gstRate", row.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "GST TYPE",
      field: "gstType",
      width: 150,
      renderCell: ({ row }) => (
        <Select
          options={VendorOption1}
          style={{ width: "100%" }}
          onChange={(e) => inputHandler("gstType", row.id, e)}
        />
      ),
    },

    {
      headerName: "CGST",
      field: "cgst",
      width: 100,
      renderCell: ({ row }) => (
        <Input
          disabled
          style={{ width: "100%" }}
          value={row.cgst}
          onChange={(e) => inputHandler("cgst", row.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "SGST",
      field: "sgst",

      renderCell: ({ row }) => (
        <Input
          disabled
          style={{ width: "100%" }}
          value={row.sgst}
          onChange={(e) => inputHandler("sgst", row.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "IGST",
      field: "igst",

      renderCell: ({ row }) => (
        <Input
          disabled
          style={{ width: "100%" }}
          value={row.igst}
          onChange={(e) => inputHandler("igst", row.id, e.target.value)}
        />
      ),
    },
    {
      headerName: "ITEM DESCRIPTION",
      field: "itemDesc",
      width: 250,
      renderCell: ({ row }) => (
        <Input
          options={VendorOption1}
          style={{ width: "100%" }}
          onChange={(e) => inputHandler("itemDesc", row.id, e.target.value)}
        />
      ),
    },
  ];

  const createFun = async () => {
    setLoading(true);
    const a = addRow[0];
    const { data } = await imsAxios.post("/jobwork/createJobWorkReq", {
      billingaddrid: JWData?.billingLocation,
      billingaddr: JWData?.address,
      dispatch_id: JWData?.dispatchAddress,
      dispatch_address: JWData?.dispatchAddress1,
      termscondition: JWData?.paymentTerm,
      quotationdetail: JWData?.quat,
      paymentterms: JWData?.paymentTerm,
      vendor_name: JWData?.vName,
      vendor_type: JWData?.VType,
      vendor_branch: JWData?.bName,
      vendor_address: addAndGst?.address,
      product: a?.productName,
      qty: a?.ordQty,
      rate: a?.rate,
      duedate: datee,
      remark: a?.itemDesc,
      hsncode: a?.hsnData,
      gsttype: a?.gstType,
      gstrate: a?.gstRate,
      cgst: a?.cgst,
      sgst: a?.sgst,
    });

    if (data.code == 200) {
      toast.success(data.message);
      reset();
      setLoading(false);
    } else if (data.code == 500) {
      toast.error(data.message.msg);
      setLoading(false);
    }
  };

  const reset = () => {
    setJWData({
      PoType: "",
      VType: "",
      vName: "",
      bName: "",
      tAndC: "",
      quat: "",
      paymentTerm: "",
      billingLocation: "",
      address: "",
      gstNo: "",
      pan: "",
      dispatchAddress: "",
      dispatchAddress1: "",
      dispatchGst: "",
      dispatchPan: "",

      vendorData: "",
    });
    setAddRow([
      {
        id: v4(),
        productName: "",
        ordQty: 0,
        rate: 0,
        value: 0,
        dueDate: "",
        hsnData: "",
        gstType: "1",
        gstRate: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        itemDesc: "",
        existUnit: "",
      },
    ]);
    back();
  };

  let value = addRow?.map((row) => Number(row.value));
  let Cgst = addRow?.map((row) => Number(row.cgst) + Number(row.sgst));
  let Igst = addRow?.map((row) => Number(row.igst));
  let all = addRow?.map((row) => Number(row.cgst) + Number(row.sgst) + Number(row.igst));
  let grandTotal = addRow?.map(
    (row) => Number(row.value) + Number(row.cgst) + Number(row.sgst) + Number(row.igst)
  );

  // console.log(grandTotal);
  useEffect(() => {
    if (addRow) {
      // console.log(addRow[0]);
    }
  }, [addRow]);

  useEffect(() => {
    if (JWData.vName) {
      getFetchBranch();
    }
  }, [JWData.vName]);

  useEffect(() => {
    if (JWData.bName) {
      getFetchAddress();
    }
  }, [JWData.bName]);

  useEffect(() => {
    getWereHouseList();
  }, []);

  useEffect(() => {
    getShippingDataFetch();
  }, []);

  useEffect(() => {
    if (JWData.billingLocation) {
      getWarehouseAddress();
    }
  }, [JWData.billingLocation]);

  useEffect(() => {
    if (JWData.dispatchAddress) {
      getDispatchWarehouseAddress();
    }
  }, [JWData.dispatchAddress]);

  // console.log(addRow);
  useEffect(() => {
    // let arr = addRow;
    // console.log("first->", arr);
    // arr.map((a) => console.log(a));
  }, []);
  return (
    <div style={{ overflow: "auto", height: "90%" }}>
      {/* <InternalNav links={JobworkLinks} /> */}
      {tab ? (
        <>
          <Row gutter={10} style={{ margin: "10px" }}>
            <>
              <Col span={7}>
                <Row gutter={6}>
                  <Col span={24}>
                    <span>PO Type</span>
                  </Col>
                  <Col span={24}>
                    <span style={{ fontSize: "12px" }}>
                      Provide Jobwork PO type as in (New OR Supplementary)
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col span={17}>
                <Row>
                  <Col span={8}>
                    <span>PO Type</span>
                    <Select
                      placeholder="Please Select Option"
                      style={{ width: "100%" }}
                      options={poOption}
                      onChange={(e) =>
                        setJWData((JWData) => {
                          return { ...JWData, PoType: e };
                        })
                      }
                      value={JWData.PoType}
                    />
                  </Col>
                </Row>
              </Col>
            </>
            <Divider></Divider>
            <>
              <Col span={7}>
                <Row gutter={10}>
                  <Col span={24}>
                    <span>Vendor Details</span>
                  </Col>
                  <Col span={24}>
                    <span style={{ fontSize: "12px" }}>
                      Type Name or Code of the vendor
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col span={17}>
                <Row gutter={10}>
                  <Col span={8}>
                    <span>Vendor Type</span>
                    <Select
                      options={VendorOption}
                      placeholder="Vendor Select"
                      style={{ width: "100%" }}
                      value={JWData.VType}
                      onChange={(e) =>
                        setJWData((JWData) => {
                          return { ...JWData, VType: e };
                        })
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <span>Vendor Name</span>
                    <MyAsyncSelect
                      style={{ width: "100%" }}
                      onBlur={() => setAsyncOptions([])}
                      loadOptions={getOption}
                      value={JWData.vName}
                      optionsState={asyncOptions}
                      onChange={(e) =>
                        setJWData((JWData) => {
                          return { ...JWData, vName: e };
                        })
                      }
                      placeholder="Vendor Name"
                    />
                  </Col>
                  <Col span={8}>
                    <span>Branch Name</span>
                    <Select
                      style={{ width: "100%" }}
                      options={branch}
                      value={JWData?.bName}
                      onChange={(e) =>
                        setJWData((JWData) => {
                          return { ...JWData, bName: e };
                        })
                      }
                      placeholder="Vendor Name"
                    />
                  </Col>
                  <Col span={16}>
                    <span>Bill from address</span>
                    <TextArea
                      style={{ width: "100%" }}
                      value={addAndGst.address}
                      placeholder="Vendor Name"
                    />
                  </Col>
                  <Col span={8}>
                    <span>GSTIN / UIN</span>
                    <TextArea style={{ width: "100%" }} value={addAndGst.gstid} disabled />
                  </Col>
                </Row>
              </Col>
            </>

            <Divider></Divider>
            <>
              <Col span={7}>
                <Row gutter={6}>
                  <Col span={24}>
                    <span>PO Terms & Other</span>
                  </Col>
                  <Col span={24}>
                    <span style={{ fontSize: "12px" }}>
                      Provide JW PO terms and other information
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col span={17}>
                <Row gutter={10}>
                  <Col span={8}>
                    <span>Terms & Condition</span>
                    <Input
                      value={JWData.tAndC}
                      onChange={(e) =>
                        setJWData((JWData) => {
                          return { ...JWData, tAndC: e.target.value };
                        })
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <span>Quotation</span>
                    <Input
                      value={JWData.quat}
                      onChange={(e) =>
                        setJWData((JWData) => {
                          return { ...JWData, quat: e.target.value };
                        })
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <span>Payment Terms</span>
                    <Input
                      value={JWData.paymentTerm}
                      onChange={(e) =>
                        setJWData((JWData) => {
                          return { ...JWData, paymentTerm: e.target.value };
                        })
                      }
                    />
                  </Col>
                </Row>
              </Col>
            </>

            <Divider></Divider>
            <>
              <Col span={7}>
                <Row gutter={6}>
                  <Col span={24}>
                    <span>Invoicing Details</span>
                  </Col>
                  <Col span={24}>
                    <span style={{ fontSize: "12px" }}>
                      Provide the bill and ship information
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col span={17}>
                <Row gutter={10}>
                  <Col span={24}>
                    <span>Bill To -</span>
                  </Col>
                  <Col span={8} style={{ marginTop: "10px" }}>
                    <span>Billing ID</span>
                    <Select
                      options={location}
                      style={{ width: "100%" }}
                      value={JWData.billingLocation}
                      onChange={(e) => {
                        jwInputHandler("billingLocation", e);
                      }}
                    />
                  </Col>
                  <Col span={8} style={{ marginTop: "10px" }}>
                    <span>Address</span>
                    <TextArea
                      style={{ width: "100%" }}
                      value={JWData.address}
                      // dangerouslySetInnerHTML={{ __html: JWData?.address }}
                    />
                  </Col>
                  <Col span={8} style={{ marginTop: "10px" }}>
                    <span>Pan No.</span>
                    <TextArea disabled value={JWData.pan} style={{ width: "100%" }} />
                  </Col>
                  <Col span={8} style={{ marginTop: "10px" }}>
                    <span>GST No.</span>
                    <TextArea disabled value={JWData.gstNo} style={{ width: "100%" }} />
                  </Col>
                  <Divider></Divider>
                  <Col span={24}>
                    <span>Dispatch To -</span>
                  </Col>
                  <Col span={8} style={{ marginTop: "10px" }}>
                    <span>Dispatch ID</span>
                    <Select
                      style={{ width: "100%" }}
                      options={shippingAddress}
                      value={JWData.dispatchAddress}
                      onChange={(e) => jwInputHandler("dispatchAddress", e)}
                    />
                  </Col>
                  <Col span={8} style={{ marginTop: "10px" }}>
                    <span>Address</span>
                    <TextArea style={{ width: "100%" }} value={JWData.dispatchAddress1} />
                  </Col>
                  <Col span={8} style={{ marginTop: "10px" }}>
                    <span>Pan No.</span>
                    <TextArea
                      disabled
                      value={JWData.dispatchPan}
                      style={{ width: "100%" }}
                    />
                  </Col>
                  <Col span={8} style={{ marginTop: "10px" }}>
                    <span>GST No.</span>
                    <TextArea
                      disabled
                      value={JWData.dispatchGst}
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>
              </Col>
            </>

            <Divider></Divider>
            <div
              style={{
                width: "100%",
                position: "fixed",
                bottom: "0px",
                padding: "5px",
                display: "flex",
                boxShadow: "0px -2px 5px 0px #ccc",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
              className="nav-footer"
            >
              <Button type="primary" onClick={nextPage}>
                Next
              </Button>
            </div>
            {/* <NavFooter nextLabel="Next" /> */}
            {/* <Col span={24} style={{ border: "1px solid red", padding: "15px" }}>
              <div style={{ textAlign: "end" }}>
                <Button type="primary" onClick={nextPage}>
                  Next
                </Button>
              </div>
            </Col> */}
          </Row>
        </>
      ) : (
        <>
          <Row gutter={16} style={{ margin: "5px" }}>
            <Col span={6}>
              <Card
                title="Tax Detail"
                size="small"
                style={{
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",

                    // border: "1px solid red",
                  }}
                >
                  <span>Sub-Total value before Taxes:</span>
                  <span>₹{Number(addRow[0]?.value).toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    // border: "1px solid red",
                  }}
                >
                  <span>CGST:</span>
                  <span>₹{Number(addRow[0]?.cgst).toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>SGST:</span>
                  <span>₹{Number(addRow[0]?.sgst).toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>IGST:</span>
                  <span>₹{Number(addRow[0]?.igst).toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Total Taxes (CGST+SGST+IGST):</span>
                  <span>₹{Number(all).toFixed(2)}</span>
                </div>
                {/* <Divider /> */}
                <br />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: "bolder" }}>Net Amount:</span>
                  <span style={{ fontWeight: "bolder" }}>
                    ₹{Number(grandTotal).toFixed(2)}
                  </span>
                </div>
              </Card>
            </Col>
            <Col span={18}>
              <div style={{ height: "79%" }}>
                <div style={{ height: "75vh" }}>
                  <MyDataTable data={addRow} columns={columns} />
                </div>
              </div>
            </Col>
          </Row>
          <div
            style={{
              width: "100%",
              position: "fixed",
              bottom: "0px",
              padding: "5px",
              display: "flex",
              boxShadow: "0px -2px 5px 0px #ccc",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            className="nav-footer"
          >
            <Button
              style={{
                backgroundColor: "red",
                color: "white",
                marginRight: "5px",
              }}
              onClick={reset}
            >
              Reset
            </Button>
            <Button
              style={{
                backgroundColor: "#ff9f00",
                color: "white",
                marginRight: "5px",
              }}
              onClick={back}
            >
              Previous
            </Button>
            <Button type="primary" loading={loading} onClick={createFun}>
              Create JW
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default CreateJW;

{
  /* <Col span={24} style={{ padding: "15px" }}>
  <div style={{ textAlign: "end" }}>
    <Button
      style={{ backgroundColor: "red", color: "white", marginRight: "5px" }}
      onClick={back}
    >
      Reset
    </Button>
    <Button
      style={{ backgroundColor: "#ff9f00", color: "white", marginRight: "5px" }}
      onClick={back}
    >
      Previous
    </Button>
    <Button type="primary" onClick={back}>
      Create JW
    </Button>
  </div>
</Col> */
}
