import React, { useState, useEffect, useRef } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Rout from "./Routes/Routes";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./axiosInterceptor";
// import { link } from "./axiosInterceptor";
import "buffer";
import {
  logout,
  setNotifications,
  setFavourites,
  setTestPages,
} from "./Features/loginSlice.js/loginSlice";
import UserMenu from "./Components/UserMenu";
import Logo from "./Components/Logo";
import socket from "./Components/socket.js";
import Notifications from "./Components/Notifications";
import axios from "axios";
import MessageModal from "./Components/MessageModal/MessageModal";
// antd imports
import Layout, { Content, Header } from "antd/lib/layout/layout";
import { Badge, Row, Select, Space, Switch } from "antd";
// icons import
import {
  MessageOutlined,
  BellFilled,
  StarFilled,
  StarOutlined,
  MenuOutlined,
  UserOutlined,
  LoadingOutlined,
  CalculatorFilled,
  UserSwitchOutlined,
  UsergroupAddOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";
import { BsFillHddStackFill } from "react-icons/bs";
import { ImCart } from "react-icons/im";
import { MdAccountBox, MdDashboard, MdQueryStats } from "react-icons/md";
import {
  IoBookSharp,
  IoFileTrayStacked,
  IoJournalSharp,
} from "react-icons/io5";
import { RiBillFill } from "react-icons/ri";
import { BiMoney, BiTransfer } from "react-icons/bi";
import { FaWarehouse } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { SiPaytm } from "react-icons/si";
import InternalNav from "./Components/InternalNav";
import links from "./Pages/internalLinks";
import { imsAxios } from "./axiosInterceptor";

const App = () => {
  const { user, notifications, currentLinks } = useSelector(
    (state) => state.login
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSideBar, setShowSideBar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessageDrawer, setShowMessageDrawer] = useState(false);
  const [showMessageNotifications, setShowMessageNotifications] =
    useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [favLoading, setFavLoading] = useState(false);
  const { pathname } = useLocation();
  const [internalLinks, setInternalLinks] = useState([]);
  const [testToggleLoading, setTestToggleLoading] = useState(false);
  const [testPage, setTestPage] = useState(false);
  const notificationsRef = useRef();
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const items = [
    getItem(
      "Favorites",
      "G",
      user?.favPages?.length > 0 ? <StarFilled /> : <StarOutlined />,
      user?.favPages.map((fav, index) =>
        getItem(<Link to={fav.url}>{fav.page_name}</Link>, `A${index + 1}`)
      )
    ),
    getItem("Finance", "D", <BiMoney />, [
      getItem("COA", "D1", <MdAccountBox />, [
        getItem(
          <Link to="/tally/ChartOfAccounts">Account</Link>,
          "D11"
          // <MinusOutlined />
        ),
        getItem(
          <Link to="/tally/ledger_report">Ledger Report</Link>,
          "D12"
          // <AiOutlineMinus />
        ),
      ]),
      getItem("TDS", "D2", <IoBookSharp />, [
        getItem(
          <Link to="/tally/nature_of_tds">TDS Config</Link>,
          "D21"
          // <AiOutlineMinus />
        ),
      ]),
      getItem("Vendor Bills", "D3", <RiBillFill />, [
        getItem(
          <Link to="/tally/vendorbillposting/VB1">Vendor Bill Posting</Link>,
          "D31"
          // <AiOutlineMinus />
        ),
      ]),
      getItem("Accounting Voucher", "D4", <IoJournalSharp />, [
        getItem(
          <Link to="/tally/journal-posting">Journal</Link>,
          "D41"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/tally/contra/1">Contra Transactions</Link>,
          "D42"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/tally/vouchers/bank-payment">Bank Payments</Link>,
          "D43"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/tally/vouchers/bank-receipts">Bank Receipts</Link>,
          "D44"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/tally/vouchers/cash-payment">Cash Payments</Link>,
          "D45"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/tally/vouchers/cash-receipt">Cash Receipts</Link>,
          "D46"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/tally/vouchers/reference/setup">App Reference Setup</Link>,
          "D47"
          // <AiOutlineMinus />
        ),
      ]),
      getItem("Clients", "clients", <UsergroupAddOutlined />, [
        getItem(
          <Link to="/tally/clients/add">Add</Link>,
          "clients/add"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/tally/clients/view">View</Link>,
          "clients/view"
          // <AiOutlineMinus />
        ),
      ]),
      getItem("Report", "report", <AlignRightOutlined />, [
        getItem(
          <Link to="/tally/reports/trial-balance-report">
            Trial Balance Report
          </Link>,
          "reports/trial-balance"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/tally/reports/balance-sheet">Balance Sheet</Link>,
          "reports/balance-sheet"
          // <AiOutlineMinus />
        ),
      ]),
    ]),
    getItem("Dashboard", "A", <MdDashboard />, [
      getItem(
        <Link to="/dashboard/sku_costing">SKU Costing</Link>,
        "2"
        // <AiOutlineMinus />
      ),
    ]),
    getItem("Material Management", "B", <BiTransfer />, [
      getItem("Master", "B1", <BsFillHddStackFill />, [
        getItem(
          <Link to="/uom">UOM</Link>,
          "B11"
          // <AiOutlineMinus />
        ),
        getItem("Component", "B12", <MdDashboard />, [
          getItem(
            <Link to="/material">Material</Link>,
            "B121"
            //   // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/services">Services</Link>,
            "B122"
            // <AiOutlineMinus />
          ),
        ]),
        getItem(
          <Link to="/masters/products/fg">Products</Link>,
          "B13"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/hsn-map">HSN Map</Link>,
          "B14"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/location">Location</Link>,
          "B114"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/group">Groups</Link>,
          "B15"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/billingAddress">Billing Address</Link>,
          "B16"
          // <AiOutlineMinus />
        ),
        // getItem(
        //   <Link to="/doc_numbering">Doc(s) Number</Link>,
        //   "B17"
        //   // <AiOutlineMinus />
        // ),
        getItem("Bill Of Material", "B18", <MdDashboard />, [
          getItem(
            <Link to="/create-bom">Create BOM</Link>,
            "B181"
            // <MdDashboard />
          ),
        ]),
        getItem("Vendor / Supplier", "B19", <MdDashboard />, [
          getItem(
            <Link to="/vendor">Add / Rectify</Link>,
            "B191"
            // <MdDashboard />
          ),
        ]),
        getItem(
          <Link to="/master/reports/CPM">Reports</Link>,
          "B20"
          // <MdDashboard />
        ),
      ]),
      getItem("Procurement", "B2", <ImCart />, [
        getItem(
          <Link to="/create-po">Create PO</Link>,
          "B21"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/manage-po">Manage PO</Link>,
          "B22"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/completed-po">Completed PO</Link>,
          "B23"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/vendor-pricing">Vendor Pricing</Link>,
          "B24"
          // <AiOutlineMinus />
        ),
      ]),
      getItem("Warehouse", "B3", <FaWarehouse />, [
        getItem(
          <Link to="/approved-transaction">MR Approval</Link>,
          "B31"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/warehouse/material-in">RM MATLS IN</Link>,
          "B32"
          // <AiOutlineMinus />
        ),
        getItem("MIN Edit/Reverse", "warehouse/minedit", <MdDashboard />, [
          getItem(
            <Link to="/update-rm">Edit MIN</Link>,
            "warehouse/minedit/edit"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/reverse-min">Reverse MIN</Link>,
            "warehouse/minedit/reverse"
            // <AiOutlineMinus />
          ),
        ]),

        getItem("FG (s) Inwarding", "B43", <MdDashboard />, [
          getItem(
            <Link to="/PendingFG">Pending FG (s)</Link>,
            "B431"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/completedFG">Completed FG (s)</Link>,
            "B432"
            // <AiOutlineMinus />
          ),
        ]),
        getItem("FG(s) Out", "B35", <MdDashboard />, [
          getItem(
            <Link to="/create-fgOut">Create FG Out</Link>,
            "B351"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/view-fgOut">View FG Out</Link>,
            "B352"
            // <AiOutlineMinus />
          ),
        ]),
        getItem("Material Transfer", "B36", <MdDashboard />, [
          getItem(
            <Link to="/rm-to-rm">RM To RM</Link>,
            "B361"
            // <MdDashboard />
          ),
          getItem(
            <Link to="/re-to-rej">RM To REJ</Link>,
            "B362"
            // <MdDashboard />
          ),
          getItem(
            <Link to="/pending-transfer">Pending Transfer(s)</Link>,
            "B363"
            // <MdDashboard />
          ),
        ]),
        getItem(
          <Link to="/rejection">Rejection Out</Link>,
          "B37"
          // <AiOutlineMinus />
        ),
        getItem("Jobwork", "B6", <MdQueryStats />, [
          getItem(
            <Link to="/create-jw">Jobwork & Analysis</Link>,

            "B61"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/jw-update">Jobwork Update</Link>,

            "B63"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/jobwork/vendor/sfg/min">Vendor SFG MIN</Link>,

            "B62"
            // <AiOutlineMinus />
          ),
        ]),
        getItem(
          <Link to="/create-dc">RGP - DC</Link>,
          "B38"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/create-gp">Gatepass (RGP / NRGP)</Link>,
          "B39"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/create-physical">Physical Stock (Store)</Link>,
          "B40"
          // <AiOutlineMinus />
        ),
      ]),
      getItem("Reports", "B4", <TbReportAnalytics />, [
        getItem("Inventory Reports", "B41", <MdDashboard />, [
          getItem(
            <Link to="/transaction-In">MIN Register</Link>,
            "B411"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/transaction-Out">MIN Issue Register</Link>,
            "B412"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/r1">Reports R1 - R19</Link>,
            "B413"
            // <AiOutlineMinus />
          ),
        ]),
        getItem(
          <Link to="/warehouse/print-view-min">Print and View MIN Label</Link>,
          "B42"
          // <AiOutlineMinus />
        ),
      ]),
      getItem("Query", "B5", <MdQueryStats />, [
        getItem(
          <Link to="/item-all-logs">Q1 - Q3</Link>,
          "C51"
          // <AiOutlineMinus />
        ),
        // getItem(
        //   <Link to="/sku-query">SKU Query</Link>,
        //   "B52"
        //   // <AiOutlineMinus />
        // ),
      ]),
    ]),

    getItem("Production", "C", <IoFileTrayStacked />, [
      getItem("PPC", "C1", <MdDashboard />, [
        getItem("Material Requisition", "C11", <MdDashboard />, [
          getItem(
            <Link to="/reqWithBom">Req With BOM</Link>,
            "C111"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/reqWithoutBom">Req Without BOM</Link>,
            "C112"
            // <AiOutlineMinus />
          ),
        ]),
        getItem("Production and Plan (s)", "C12", <MdDashboard />, [
          getItem(
            <Link to="/create-ppr">Create PPR</Link>,
            "C121"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/pending-ppr">Pending PPR</Link>,
            "C122"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/completed-ppr">Completed PPR</Link>,
            "C123"
            // <AiOutlineMinus />
          ),
        ]),

        getItem("Location Movement", "C14", <MdDashboard />, [
          getItem(
            <Link to="/sf-to-sf">SF To SF</Link>,
            "C141"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/sf-to-rej">SF To REJ</Link>,
            "C142"
            // <AiOutlineMinus />
          ),
        ]),
      ]),
      getItem("QCA", "C2", <MdDashboard />, [
        getItem(
          <Link to="/sample-qc">Create Sample</Link>,
          "C131"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/pending-qc">Pending Sample</Link>,
          "C132"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/completed-qc">Completed Sample</Link>,
          "C133"
          // <AiOutlineMinus />
        ),
        getItem(
          <Link to="/report-qc">QC Report</Link>,
          "C134"
          // <AiOutlineMinus />
        ),
      ]),
      getItem("Query", "C3", <MdQueryStats />, [
        getItem(
          <Link to="/item-all-logs">Q1 - Q3</Link>,
          "C31"
          // <AiOutlineMinus />
        ),
        // getItem(
        //   <Link to="/sku-query">SKU Query</Link>,
        //   "C32"
        //   // <AiOutlineMinus />
        // ),
      ]),
      getItem("Reports", "C4", <TbReportAnalytics />, [
        getItem("Inventory Reports", "C41", <MdDashboard />, [
          getItem(
            <Link to="/transaction-In">MIN Register</Link>,
            "C411"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/transaction-Out">MIN Issue Register</Link>,
            "C412"
            // <AiOutlineMinus />
          ),
          getItem(
            <Link to="/r1">Reports R1 - R19</Link>,
            "C413"
            // <AiOutlineMinus />
          ),
        ]),
      ]),
    ]),
    getItem("CPM", "E", <CalculatorFilled />, [
      getItem(<Link to="/CPM/CPM-analysis">CPM Analysis</Link>, "E1"),
    ]),
    getItem("Paytm QC", "F", <SiPaytm />, [
      // getItem(
      //   <Link to="/paytm-qc/upload">Paytm QC Upload updated to check</Link>,
      //   "F1"
      // ),
      // getItem(<Link to="paytm-qc/update">Paytm QC Update</Link>, "F2"),
      getItem(<Link to="/paytm-qc/report">Paytm QC Report</Link>, "F3"),
    ]),
  ];
  const items1 = [
    getItem(<Link to="/myprofile">Profile</Link>, "B", <UserOutlined />),
    // getItem(<Link to="/messenger">Messenger</Link>, "C", <MessageOutlined />),
  ];

  const logoutHandler = () => {
    dispatch(logout());
  };
  const deleteNotification = (id) => {
    let arr = notifications;
    arr = arr.filter((not) => not.ID != id);
    dispatch(setNotifications(arr));
  };
  const handleFavPages = async (status) => {
    let favs = user.favPages;

    if (!status) {
      setFavLoading(true);
      const { data } = await imsAxios.post("/backend/favouritePages", {
        pageUrl: pathname,
        source: "react",
      });
      setFavLoading(false);
      if (data.code == 200) {
        favs = JSON.parse(data.data);
      } else {
        toast.error(data.message.msg);
      }
    } else {
      let page_id = favs.filter((f) => f.url == pathname)[0].page_id;
      setFavLoading(true);
      const { data } = await imsAxios.post("/backend/removeFavouritePages", {
        page_id,
      });
      setFavLoading(false);
      if (data.code == 200) {
        let fav = JSON.parse(data.data);
        favs = fav;
      } else {
        toast.error(data.message.msg);
      }
    }
    dispatch(setFavourites(favs));
  };

  const handleChangePageStatus = (value) => {
    let status = value ? "TEST" : "LIVE";
    // console.log(value);
    socket(user?.token).emit("setPageStatus", {
      page: pathname,
      status: status,
    });
    setTestToggleLoading(true);
    setTestPage(value);
  };
  // notifications recieve handlers
  useEffect(() => {
    if (Notification.permission == "default") {
      Notification.requestPermission();
    }
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        setShowSideBar(false);
      }
    });
    // if (!user) {
    //   navigate("/login");
    // }
    // if (user) {
    //   if (pathname == "/") navigate("/r1");
    // }
    // if (user) {
    //   socket(user?.token).emit("fetch_notifications", { source: "react" });
    // }
  }, []);
  useEffect(() => {
    // if (!user) {
    //   navigate("/login");
    // }
    if (user) {
      if (user.token) {
        socket(user.token).emit("fetch_notifications", { source: "react" });
      }
      // getting new notification
      socket(user?.token).on("socket_receive_notification", (data) => {
        console.log("new notifications file recieved");
        console.log(data);
        if (data.type == "message") {
          let arr = notificationsRef.current.filter(
            (not) => not.conversationId != data.conversationId
          );
          arr = [data, ...arr];
          if (arr) {
            dispatch(setNotifications(arr));
          }
          setNewNotification(data);
        } else if (data[0].msg_type == "file") {
          data = data[0];
          let arr = notificationsRef.current;
          arr = arr.map((not) => {
            if (not.notificationId == data.notificationId) {
              return {
                ...data,
                type: data.msg_type,
                title: data.request_txt_label,
                details: data.req_date,
                file: JSON.parse(data.other_data).fileUrl,
              };
            } else {
              return not;
            }
          });
          if (arr) {
            dispatch(setNotifications(arr));
          }
          setNewNotification(data);
        }
      });
      // getting all notifications
      socket(user?.token).on("all-notifications", (data) => {
        let arr = data.data;
        console.log("allnotifications", arr);
        arr = arr.map((row) => {
          return {
            ...row,
            type: row.msg_type,
            title: row.request_txt_label,
            details: row.req_date,
            file: JSON.parse(row.other_data).fileUrl,
          };
        });
        dispatch(setNotifications(arr));
      });
      // event for starting detail
      socket(user.token).on("download_start_detail", (data) => {
        console.log("start details arrived");
        if (data.title && data.details) {
          let arr = notificationsRef.current;
          arr = [data, ...arr];
          dispatch(setNotifications(arr));
        }
      });
      // getting percentages
      socket(user.token).on("getting-loading-percentage", (data) => {
        let arr = notificationsRef.current;
        console.log("percentage", data);
        if (arr.filter((row) => row.notificationId == data.notificationId)[0]) {
          arr = arr.map((row) => {
            if (row.notificationId == data.notificationId) {
              let obj = row;
              obj = {
                ...row,
                total: data.total,
              };
              return obj;
            } else {
              return row;
            }
          });
        } else {
          arr = [data, ...arr];
        }
        dispatch(setNotifications(arr));
      });
      socket(user.token).on("getPageStatus", (data) => {
        setTestToggleLoading(false);
        let pages;
        if (user.testPages) {
          pages = user.testPages;
        } else {
          pages = [];
        }

        let arr = [];
        for (const property in data) {
          let obj = { url: property, status: data[property] };
          if (property.includes("/")) {
            if (data[property] == "TEST") {
              console.log("open");
              let obj = { url: property, status: data[property] };
              arr = [obj, ...arr];
            }
            if (data[property] == "LIVE" && property.includes("/")) {
              pages = pages.filter((page) => page.url == property);
            }
          }
        }
        console.log("recieved status", arr);
        dispatch(setTestPages(arr));
        pages.map((page) => {
          if (page.url == pathname) {
            setTestPage(true);
          } else {
            setTestPage(false);
          }
        });
      });
    }
  }, [user]);
  useEffect(() => {
    setShowSideBar(false);
    setShowMessageNotifications(false);
    setShowNotifications(false);
  }, [navigate]);
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);
  useEffect(() => {
    if (newNotification?.type) {
      console.log("new notification arrived");
      if (Notification.permission == "default") {
        Notification.requestPermission(function (permission) {
          if (permission === "default") {
            let notification = new Notification(newNotification.title, {
              body: newNotification.message,
            });
            notification.onclick = () => {
              notification.close();
              window.parent.focus();
            };
          }
        });
      } else {
        let notification = new Notification(newNotification?.title, {
          body: newNotification?.message,
        });
        notification.onclick = () => {
          notification.close();
          window.parent.focus();
        };
      }
    }
  }, [newNotification]);
  useEffect(() => {
    if (showMessageNotifications) {
      {
        setShowNotifications(false);
      }
    }
  }, [showMessageNotifications]);
  useEffect(() => {
    if (showNotifications) {
      {
        setShowMessageNotifications(false);
      }
    }
  }, [showNotifications]);
  useEffect(() => {
    if (user?.testPages) {
      console.log(pathname);
      let match = user.testPages.filter((page) => page.url == pathname)[0];
      if (match) {
        setTestPage(true);
      } else {
        setTestPage(false);
      }
    }
  }, [navigate, user]);
  useEffect(() => {
    setInternalLinks(currentLinks);
  }, [currentLinks]);

  const options = [{ label: "A-21 [BRMSC012]", value: "BRMSC012" }];
  return (
    <div style={{ height: "100vh" }}>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        limit={1}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      <Layout
        style={{
          width: "100%",
          top: 0,
        }}
      >
        {/* header start */}

        <Layout style={{ height: "100%" }}>
          <Header
            style={{
              zIndex: 4,
              height: 45,
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Row style={{ width: "100%" }} justify="space-between">
              <Space size="large">
                <MenuOutlined
                  onClick={() => {
                    setShowSideBar((open) => !open);
                  }}
                  style={{
                    color: "white",
                    marginLeft: 12,
                    fontSize: window.innerWidth > 1600 && "1rem",
                  }}
                />

                <Space
                  style={{
                    color: "white",
                    fontSize: "1rem",
                  }}
                >
                  <Logo />
                  IMS
                </Space>
                <div className="location-select">
                  <Select
                    style={{ width: 200, color: "white" }}
                    options={options}
                    bordered={false}
                    value="BRMSC012"
                  />
                </div>
              </Space>
              <Space
                size="large"
                style={{
                  position: "relative",
                }}
              >
                {/* {user.type && user.type.toLowerCase() == "developer" && (
                  <Switch
                    loading={testToggleLoading}
                    checked={testPage}
                    onChange={(value) => handleChangePageStatus(value)}
                    checkedChildren="Test"
                    unCheckedChildren="Live"
                  />
                )}

                {favLoading ? (
                  <LoadingOutlined
                    style={{
                      fontSize: 18,
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                ) : user.favPages.filter((fav) => fav.url == pathname)[0] ? (
                  <StarFilled
                    onClick={() => handleFavPages(true)}
                    style={{
                      fontSize: 18,
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <StarOutlined
                    onClick={() => handleFavPages(false)}
                    style={{
                      fontSize: 18,
                      color: "white",
                      cursor: "pointer",
                    }}
                  />
                )} */}

                <div>
                  <Badge
                    size="small"
                    style={{
                      background: notifications.filter(
                        (not) => not?.loading || not?.status == "pending"
                      )[0]
                        ? "#EAAE0F"
                        : "green",
                    }}
                    count={
                      notifications.filter((not) => not?.type != "message")
                        ?.length
                    }
                  >
                    <BellFilled
                      onClick={() => setShowNotifications((n) => !n)}
                      style={{
                        fontSize: 18,
                        color: "white",
                        // marginRight: 8,
                      }}
                    />
                  </Badge>
                  {showNotifications && (
                    <Notifications
                      source={"notifications"}
                      showNotifications={showNotifications}
                      notifications={notifications.filter(
                        (not) => not?.type != "message"
                      )}
                      deleteNotification={deleteNotification}
                    />
                  )}
                </div>
                <div>
                  <Badge
                    size="small"
                    count={
                      notifications.filter((not) => not?.type == "message")
                        .length
                    }
                  >
                    <MessageOutlined
                      onClick={() => setShowMessageDrawer(true)}
                      style={{
                        fontSize: 18,
                        cursor: "pointer",
                        color: "white",
                      }}
                    />
                  </Badge>
                </div>
                {/* <UserMenu user={user} logoutHandler={logoutHandler} /> */}
              </Space>
            </Row>
          </Header>
        </Layout>

        {/* header ends */}
        {/* sidebar starts */}
        <Layout style={{ height: "100%" }}>
          <Sidebar
            items={items}
            items1={items1}
            className="site-layout-background"
            key={1}
            setShowSideBar={setShowSideBar}
            showSideBar={showSideBar}
          />

          {/* sidebar ends */}
          <Layout
            onClick={() => {
              setShowNotifications(false);
              setShowMessageNotifications(false);
            }}
            style={{ height: "100%" }}
          >
            <Content style={{ height: "100%" }}>
              <InternalNav links={internalLinks} />

              <div
                style={{
                  height: "calc(100vh - 50px)",
                  width: "100%",
                  opacity: testPage ? 0.5 : 1,
                  pointerEvents:
                    testPage && user.type != "developer" ? "none" : "all",

                  overflowX: "hidden",
                }}
              >
                <MessageModal
                  showMessageDrawer={showMessageDrawer}
                  setShowMessageDrawer={setShowMessageDrawer}
                />
                <Routes>
                  {Rout.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={<route.main />}
                    />
                  ))}
                </Routes>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
