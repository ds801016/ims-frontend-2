import React from "react";
import {
  Services,
  Material,
  ApprovedTransaction,
  Login,
  MaterialTransaction,
  TransactionIn,
  TransactionOut,
  CompletedFG,
  PendingFG,
  CreateFGOut,
  ViewFGOut,
  Rejection,
  ItemAllLogs,
  ItemLocationLog,
  R1,
  ReqWithBom,
  ReqWithoutBom,
  CreatePPR,
  PendingPPR,
  CreatePo,
  ManagePO,
  CompletedPo,
  Uom,
  Product,
  Group,
  Location,
  BillingAddress,
  CreateBom,
  ViewBom,
  HsnMap,
  Vendor,
  AddVendor,
  ManageSfgBom,
  RmtoRm,
  PendingTransfer,
  ViewTransaction,
  ReToRej,
  TransactionRej,
  CreateDC,
  ManageDC,
  VendorPricingUpload,
  CreateGP,
  ManageGatePass,
  SKUCosting,
  SampleQC,
  PendingQC,
  CompletedQC,
  ReportQC,
  MaterialTransfer,
  MaterialTransferReport,
  ViewMin,
  CreatePhysical,
  ViewPhysical,
  SkuQuery,
  MaterialInWithoutPO,
  MaterialInWithPO,
  Messenger,
  Profile,
  Page404,
  CPMAnalysis,
  CreateJW,
  POAnalysis,
  JwRmChallan,
  JwIssue,
  JwsfInward,
  JwrmReturn,
  JwCompleted,
  UpdateRM,
  ReverseMin,
  PaytmQCUpload,
  PaytmQCUpdate,
  PaytmQCReport,
  MaterialRequisitionRequest,
  UpdateJW,
  CPMMaster,
  SFGMIN,
  R19Master,
  JwPendingRequest,
} from "../Pages";

import {
  CreateMaster,
  Ledger,
  ChartOfAccounts,
  NatureOfTDS,
  LedgerReport,
  VBTReport,
  VBT1,
  VBT2,
  VBT3,
  VBT4,
  VBT5,
  JournalPosting,
  JVReport,
  BankReceipts,
  BankPayments,
  VoucherReport,
  Contra1,
  Contra2,
  Contra3,
  Contra4,
  ContraReport,
  VBT6,
  CashPaymentResister,
  CashPayment,
  CashReceiptReport,
  CashReceipt,
  AddClient,
  ViewClients,
  AppPaymentSetup,
  AppReport,
  Reference,
  TrialBalReport,
  BalanceSheet,
} from "../FinancePages";

import R11 from "../Pages/Reports/R/R11";
import R12 from "../Pages/Reports/R/R12";
import R2 from "../Pages/Reports/R/R2";
import R3 from "../Pages/Reports/R/R3";
import R4 from "../Pages/Reports/R/R4";
import R5 from "../Pages/Reports/R/R5";
import R6 from "../Pages/Reports/R/R6";
import R7 from "../Pages/Reports/R/R7";
import R8 from "../Pages/Reports/R/R8";
import R9 from "../Pages/Reports/R/R9";
import R10 from "../Pages/Reports/R/R10";
import R13 from "../Pages/Reports/R/R13";
import R14 from "../Pages/Reports/R/R14";
import R15 from "../Pages/Reports/R/R15";
import R16 from "../Pages/Reports/R/R16";
import R17 from "../Pages/Reports/R/R17";
import R18 from "../Pages/Reports/R/R18";
import R19 from "../Pages/Reports/R/R19";
import CompletedPPR from "../Pages/Production/Production & Planning/CompletedPPR";

const Routes = [
  {
    path: "/login",
    main: () => <Login />,
  },
  {
    path: "/material",
    main: () => <Material />,
  },
  {
    path: "/services",
    main: () => <Services />,
  },
  {
    path: "/uom",
    main: () => <Uom />,
  },
  {
    path: "/masters/products/fg",
    main: () => <Product />,
  },
  {
    path: "/masters/products/sfg",
    main: () => <Product />,
  },
  {
    path: "/group",
    main: () => <Group />,
  },
  {
    path: "/location",
    main: () => <Location />,
  },
  {
    path: "/billingAddress",
    main: () => <BillingAddress />,
  },
  {
    path: "/vendor",
    main: () => <Vendor />,
  },
  {
    path: "/add-vendor",
    main: () => <AddVendor />,
  },
  // {
  //   path: "/branch-edit/:id",
  //
  //   main: () => <BranchEdit />,
  // },
  {
    path: "/hsn-map",
    main: () => <HsnMap />,
  },
  // {
  //   path: "/doc_numbering",
  //   main: () => <DocNumbering />,
  // },
  {
    path: "/create-bom",
    main: () => <CreateBom />,
  },

  {
    path: "/manage-sfg-bom",
    main: () => <ManageSfgBom />,
  },
  {
    path: "/view-bom",
    main: () => <ViewBom />,
  },

  {
    path: "/approved-transaction",
    main: () => <ApprovedTransaction />,
  },
  {
    path: "/material-transaction",
    main: () => <MaterialTransaction />,
  },
  {
    path: "/transaction-In",
    main: () => <TransactionIn />,
  },
  {
    path: "/transaction-Out",
    main: () => <TransactionOut />,
  },
  {
    path: "/completedFG",
    main: () => <CompletedFG />,
  },
  {
    path: "/pendingFG",
    main: () => <PendingFG />,
  },
  {
    path: "/create-fgOut",
    main: () => <CreateFGOut />,
  },
  {
    path: "/view-fgOut",
    main: () => <ViewFGOut />,
  },

  {
    path: "/rm-to-rm",
    exact: true,
    main: () => <RmtoRm />,
  },
  {
    path: "/view-transaction",
    exact: true,
    main: () => <ViewTransaction />,
  },
  {
    path: "/re-to-rej",
    exact: true,
    main: () => <ReToRej />,
  },
  {
    path: "/trans-rej",
    exact: true,
    main: () => <TransactionRej />,
  },
  {
    path: "/pending-transfer",
    exact: true,
    main: () => <PendingTransfer />,
  },
  {
    path: "/rejection",
    exact: true,
    main: () => <Rejection />,
  },
  {
    path: "/create-dc",
    exact: true,
    main: () => <CreateDC />,
  },
  {
    path: "/manage-dc",
    exact: true,
    main: () => <ManageDC />,
  },
  {
    path: "/create-gp",
    exact: true,
    main: () => <CreateGP />,
  },
  {
    path: "/manage-gp",
    exact: true,
    main: () => <ManageGatePass />,
  },
  {
    path: "/sku-query",
    exact: true,
    main: () => <SkuQuery />,
  },
  // QCA
  {
    path: "/sample-qc",
    exact: true,
    main: () => <SampleQC />,
  },
  {
    path: "/pending-qc",
    exact: true,
    main: () => <PendingQC />,
  },
  {
    path: "/completed-qc",
    exact: true,
    main: () => <CompletedQC />,
  },
  {
    path: "/report-qc",
    exact: true,
    main: () => <ReportQC />,
  },
  {
    path: "/create-physical",
    exact: true,
    main: () => <CreatePhysical />,
  },
  {
    path: "/view-physical",
    exact: true,
    main: () => <ViewPhysical />,
  },
  // sf to sf
  {
    path: "/sf-to-sf",
    exact: true,
    main: () => <MaterialTransfer type="sftosf" title="SF to SF" />,
  },
  {
    path: "/sf-to-rej",
    exact: true,
    main: () => <MaterialTransfer type="sftorej" title="SF to REJ" />,
  },
  {
    path: "/transaction-sf-to-sf",
    exact: true,
    main: () => <MaterialTransferReport type="sftosf" />,
  },

  {
    path: "/transaction-sf-to-rej",
    exact: true,
    main: () => <MaterialTransferReport type="sftorej" />,
  },

  // Reports
  {
    path: "/item-all-logs",
    main: () => <ItemAllLogs />,
  },
  {
    path: "/item-location-logs",
    main: () => <ItemLocationLog />,
  },
  {
    path: "/r1",
    main: () => <R1 />,
  },
  {
    path: "/r2",
    main: () => <R2 />,
  },
  {
    path: "/r3",
    main: () => <R3 />,
  },
  {
    path: "/r4",
    main: () => <R4 />,
  },
  {
    path: "/r5",
    main: () => <R5 />,
  },
  {
    path: "/r6",
    main: () => <R6 />,
  },
  {
    path: "/r7",
    main: () => <R7 />,
  },
  {
    path: "/r8",
    main: () => <R8 />,
  },
  {
    path: "/r9",
    main: () => <R9 />,
  },
  {
    path: "/r10",
    main: () => <R10 />,
  },

  {
    path: "/r11",
    main: () => <R11 />,
  },
  {
    path: "/r12",
    main: () => <R12 />,
  },
  {
    path: "/r13",
    main: () => <R13 />,
  },
  {
    path: "/r14",
    main: () => <R14 />,
  },
  {
    path: "/r15",
    main: () => <R15 />,
  },
  {
    path: "/r16",
    main: () => <R16 />,
  },
  {
    path: "/r17",
    main: () => <R17 />,
  },
  {
    path: "/r18",
    main: () => <R18 />,
  },
  {
    path: "/r19",
    main: () => <R19 />,
  },
  {
    path: "/reqWithBom",
    main: () => <ReqWithBom />,
  },
  {
    path: "/reqWithoutBom",
    main: () => <ReqWithoutBom />,
  },
  {
    path: "/create-ppr",
    main: () => <CreatePPR />,
  },
  {
    path: "/pending-ppr",
    main: () => <PendingPPR />,
  },
  {
    path: "/completed-ppr",
    main: () => <CompletedPPR />,
  },
  // Purchase Order
  {
    path: "/create-po",
    main: () => <CreatePo />,
  },

  {
    path: "/manage-po",
    main: () => <ManagePO />,
  },
  {
    path: "/completed-po",
    main: () => <CompletedPo />,
  },
  {
    path: "/vendor-pricing",
    main: () => <VendorPricingUpload />,
  },
  {
    path: "/dashboard/sku_costing",
    main: () => <SKUCosting />,
  },
  {
    path: "/warehouse/print-view-min",
    main: () => <ViewMin />,
  },
  {
    path: "/warehouse/material-in",
    main: () => <MaterialInWithoutPO />,
  },
  {
    path: "/warehouse/material-in-with-po",
    main: () => <MaterialInWithPO />,
  },
  {
    path: "/master/reports/CPM",
    main: () => <CPMMaster />,
  },
  {
    path: "/master/reports/r19",
    main: () => <R19Master />,
  },
  {
    path: "/messenger",
    main: () => <Messenger />,
  },
  {
    path: "/myProfile",
    main: () => <Profile />,
  },
  // CPM
  {
    path: "/CPM/CPM-analysis",
    main: () => <CPMAnalysis />,
  },

  // Jobwork
  {
    path: "/create-jw",
    main: () => <CreateJW />,
  },
  {
    path: "/po-analysis",
    main: () => <POAnalysis />,
  },
  {
    path: "/jw-rw-issue",
    main: () => <JwIssue />,
  },
  {
    path: "/jw-rw-challan",
    main: () => <JwRmChallan />,
  },
  {
    path: "/jw-sf-inward",
    main: () => <JwsfInward />,
  },
  {
    path: "/jw-rm-return",
    main: () => <JwrmReturn />,
  },
  {
    path: "/jw-completed",
    main: () => <JwCompleted />,
  },
  {
    path: "/jw-update",
    main: () => <UpdateJW />,
  },
  {
    path: "/jw-issue-challan",
    main: () => <JwPendingRequest />,
  },
  {
    path: "/update-rm",
    main: () => <UpdateRM />,
  },
  {
    path: "/reverse-min",
    main: () => <ReverseMin />,
  },
  {
    path: "/paytm-qc/upload",
    main: () => <PaytmQCUpload />,
  },
  // {
  //   path: "/paytm-qc/update",
  //   main: () => <PaytmQCUpdate />,
  // },
  {
    path: "/paytm-qc/report",
    main: () => <PaytmQCReport />,
  },
  {
    path: "/material-requisition-request",
    main: () => <MaterialRequisitionRequest />,
  },
  // Vendor Jobwork modules
  {
    path: "/jobwork/vendor/sfg/min",
    main: () => <SFGMIN />,
  },
  // finance start here
  {
    path: "/tally/create_master",
    main: () => <CreateMaster />,
  },
  {
    path: "/tally/ledger",
    main: () => <Ledger />,
  },
  {
    path: "/tally/ChartOfAccounts",
    main: () => <ChartOfAccounts />,
  },
  {
    path: "/tally/nature_of_tds",
    main: () => <NatureOfTDS />,
  },
  {
    path: "/tally/ledger_report",
    main: () => <LedgerReport />,
  },
  {
    path: "/tally/ledger_report/:code",
    main: () => <LedgerReport />,
  },
  {
    path: "/tally/vendorbillposting/VB1",
    main: () => <VBT1 />,
  },
  {
    path: "/tally/vendorbillposting/VB2",
    main: () => <VBT2 />,
  },
  {
    path: "/tally/vendorbillposting/VB3",
    main: () => <VBT3 />,
  },
  {
    path: "/tally/vendorbillposting/VB4",
    main: () => <VBT4 />,
  },
  {
    path: "/tally/vendorbillposting/VB5",
    main: () => <VBT5 />,
  },
  {
    path: "/tally/vendorbillposting/VB6",
    main: () => <VBT6 />,
  },
  {
    path: "/tally/vendorbillposting/report",
    main: () => <VBTReport />,
  },
  {
    path: "/tally/journal-posting",
    main: () => <JournalPosting />,
  },
  {
    path: "/tally/journal-posting/report",
    main: () => <JVReport />,
  },
  {
    path: "/tally/vouchers/bank-payment",
    main: () => <BankPayments />,
  },
  {
    path: "/tally/vouchers/bank-receipts",
    main: () => <BankReceipts />,
  },
  {
    path: "/tally/vouchers/bank_payment/report",
    main: () => <VoucherReport />,
  },
  {
    path: "/tally/vouchers/bank_receipts/report",
    main: () => <VoucherReport />,
  },
  {
    path: "/tally/contra/1",
    main: () => <Contra1 />,
  },
  {
    path: "/tally/contra/2",
    main: () => <Contra2 />,
  },
  {
    path: "/tally/contra/3",
    main: () => <Contra3 />,
  },
  {
    path: "/tally/contra/4",
    main: () => <Contra4 />,
  },
  {
    path: "/tally/contra/report",
    main: () => <ContraReport />,
  },
  {
    path: "/tally/vouchers/cash_payment/report",
    main: () => <CashPaymentResister />,
  },
  {
    path: "/tally/vouchers/cash-payment",
    main: () => <CashPayment />,
  },
  {
    path: "/tally/vouchers/cash_receipts/report",
    main: () => <CashReceiptReport />,
  },
  {
    path: "/tally/vouchers/cash-receipt",
    main: () => <CashReceipt />,
  },
  {
    path: "/tally/clients/add",
    main: () => <AddClient />,
  },
  {
    path: "/tally/clients/view",
    main: () => <ViewClients />,
  },
  {
    path: "/tally/vouchers/reference/setup",
    main: () => <Reference />,
  },
  {
    path: "/tally/vouchers/reference/payment",
    main: () => <AppPaymentSetup />,
  },
  {
    path: "/tally/vouchers/reference/report",
    main: () => <AppReport />,
  },
  {
    path: "/tally/reports/trial-balance-report",
    main: () => <TrialBalReport />,
  },
  {
    path: "/tally/reports/balance-sheet",
    main: () => <BalanceSheet />,
  },

  // should always be at the end
  {
    path: "*",
    main: () => <Page404 />,
  },
];

export default Routes;
