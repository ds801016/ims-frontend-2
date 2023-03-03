const links = [
  // purchase order links
  [
    { routeName: "Create PO", routePath: "/create-po", key: 0 },
    { routeName: "Manage PO", routePath: "/manage-po", key: 1 },
    { routeName: "Completed PO", routePath: "/completed-po", key: 2 },
    { routeName: "Vendor Pricing", routePath: "/vendor-pricing", key: 3 },
  ],
  // accounts master links
  [
    { routeName: "Create Master", routePath: "/tally/create_master", key: 0 },
    { routeName: "Create Ledger", routePath: "/tally/ledger", key: 1 },
    {
      routeName: "Chart Of Accounts",
      routePath: "/tally/ChartOfAccounts",
      key: 2,
    },
  ],
  // add new or nature of tds links
  [{ routeName: "Add New TDS", routePath: "/tally/nature_of_tds", key: 0 }],
  // ledger report links
  [{ routeName: "Ledger Report", routePath: "/tally/ledger_report", key: 0 }],
  // VBT links
  [
    {
      routeName: "Purchase Register",
      routePath: "/tally/vendorbillposting/report",
      key: 0,
    },
    {
      routeName: "VBT1",
      routePath: "/tally/vendorbillposting/VB1",
      key: 1,
      placeholder: "Purchase - Goods",
    },
    {
      routeName: "VBT2",
      routePath: "/tally/vendorbillposting/VB2",
      key: 2,
      placeholder: "Services",
    },
    {
      routeName: "VBT3",
      routePath: "/tally/vendorbillposting/VB3",
      key: 3,
      placeholder: "Import",
    },
    {
      routeName: "VBT4",
      routePath: "/tally/vendorbillposting/VB4",
      key: 4,
      placeholder: "Fixed Assets",
    },
    {
      routeName: "VBT5",
      routePath: "/tally/vendorbillposting/VB5",
      key: 5,
      placeholder: "Expenses",
    },
    {
      routeName: "VBT6",
      placeholder: "JobWork",
      routePath: "/tally/vendorbillposting/VB6",
      key: 6,
    },
  ],
  // JV links
  [
    {
      routeName: "JV Register",
      routePath: "/tally/journal-posting/report",
      key: 0,
    },
    {
      routeName: "Journal Voucher",
      routePath: "/tally/journal-posting",
      key: 1,
    },
  ],
  // contra links
  [
    {
      routeName: "Contra Register",
      routePath: "/tally/contra/report",
      key: 0,
    },
    {
      routeName: "Contra 1",
      routePath: "/tally/contra/1",
      key: 1,
      placeholder: "BANK TO CASH",
    },
    {
      routeName: "Contra 2",
      routePath: "/tally/contra/2",
      key: 2,
      placeholder: "CASH TO BANK",
    },
    {
      routeName: "Contra 3",
      routePath: "/tally/contra/3",
      key: 3,
      placeholder: "CASH TO CASH",
    },
    {
      routeName: "Contra 4",
      routePath: "/tally/contra/4",
      key: 4,
      placeholder: "BANK TO BANK",
    },
  ],
  // bank payment voucher links
  [
    {
      routeName: "Bank Payment Register",
      routePath: "/tally/vouchers/bank_payment/report",
      key: 0,
    },
    {
      routeName: "Bank Payment",
      routePath: "/tally/vouchers/bank-payment",
      key: 1,
    },
  ],
  // bank receipts voucer links
  [
    {
      routeName: "Bank Receipts Register",
      routePath: "/tally/vouchers/bank_receipts/report",
      key: 0,
    },

    {
      routeName: "Bank Reciepts",
      routePath: "/tally/vouchers/bank-receipts",
      key: 1,
    },
  ],
  // cash payment voucher links
  [
    {
      routeName: "Cash Payment Register",
      routePath: "/tally/vouchers/cash_payment/report",
      key: 0,
    },
    {
      routeName: "Cash Payment",
      routePath: "/tally/vouchers/cash-payment",
      key: 1,
    },
  ],
  // cash receipts voucer links
  [
    {
      routeName: "Cash Receipts Register",
      routePath: "/tally/vouchers/cash_receipts/report",
      key: 0,
    },

    {
      routeName: "Cash Reciepts",
      routePath: "/tally/vouchers/cash-receipt",
      key: 1,
    },
  ],
  // SKU costing
  [
    {
      routeName: "SKU Costing",
      routePath: "/dashboard/sku_costing",
    },
  ],
  // UOM links
  [{ routeName: "Uom", routePath: "/uom" }],
  // components links
  [
    { routeName: "Materials", routePath: "/material" },
    { routeName: "Services", routePath: "/services" },
  ],
  // product links
  [
    { routeName: "Product", routePath: "/masters/products/fg" },
    { routeName: "SFG Product", routePath: "/masters/products/sfg" },
  ],
  // hsn map links
  [{ routeName: "HSN Map", routePath: "/hsn-map" }],
  // group links
  [{ routeName: "Groups", routePath: "/group" }],
  // billing address links
  [{ routeName: "Billing Address", routePath: "/billingAddress" }],
  // create and manage BOM links
  [
    { routeName: "Create Bill of Material", routePath: "/create-bom" },
    { routeName: "Manage FG BOM", routePath: "/view-bom" },
    { routeName: "Manage SFG BOM", routePath: "/manage-sfg-bom" },
  ],
  // vendor master links
  [
    { routeName: "Add Vendor", routePath: "/add-vendor" },
    { routeName: "Vendor", routePath: "/vendor" },
  ],
  // MR approved transactionlinks
  [
    { routeName: "Pending MR(Approval)", routePath: "/approved-transaction" },
    {
      routeName: "Material Requisition Request",
      routePath: "/material-requisition-request",
    },
  ],
  // Create MIN links
  [
    { routeName: "Material In", routePath: "/warehouse/material-in" },
    {
      routeName: "Material In from PO",
      routePath: "/warehouse/material-in-with-po",
    },
  ],
  // edit and reverse MIN links
  [
    { routeName: "Edit MIN", routePath: "/update-rm" },
    { routeName: "Reverse MIN", routePath: "/reverse-min" },
  ],
  // FG inward links
  [
    { routeName: "Pending FG (s)", routePath: "/PendingFG" },
    { routeName: "Completed FG (s)", routePath: "/completedFG" },
  ],
  // FG Out links
  [
    { routeName: "Create FG OUT", routePath: "/create-fgOut" },
    { routeName: "VIEW FG OUT", routePath: "/view-fgOut" },
  ],
  // RM to RM transfer links
  [
    { routeName: "Rm To Rm", routePath: "/rm-to-rm" },
    { routeName: "View Transaction", routePath: "/view-transaction" },
  ],
  // RM to REJ links
  [
    { routeName: "Rm To Rej", routePath: "/re-to-rej" },
    { routeName: "View Transaction", routePath: "/trans-rej" },
  ],
  // pending transfer links
  [{ routeName: "Pending Transfer", routePath: "/pending-transfer" }],
  // rejection links
  [{ routeName: "Create Rejection", routePath: "/rejection" }],
  // jobwork links
  [
    { routeName: "CREATE JW PO", routePath: "/create-jw" },
    { routeName: "PO ANALYSIS", routePath: "/po-analysis" },
    { routeName: "JW RM ISSUE", routePath: "/jw-rw-issue" },
    { routeName: "JW RM ISSUE CHALLAN", routePath: "/jw-issue-challan" },
    { routeName: "JW RM CHALLAN", routePath: "/jw-rw-challan" },
    { routeName: "JW SF INWARD", routePath: "/jw-sf-inward" },
    { routeName: "JW RM RETURN", routePath: "/jw-rm-return" },
    { routeName: "JW COMPLETED", routePath: "/jw-completed" },
  ],
  // Jowbwork update
  [{ routeName: "JW Update", routePath: "/jw-update" }],
  // jobwork vendor sfg min report
  [{ routeName: "Jobwork SFG MIN", routePath: "/jobwork/vendor/sfg/min" }],
  // DC Links
  [
    { routeName: "Create DC", routePath: "/create-dc", key: "0" },
    { routeName: "Manage DC", routePath: "/manage-dc", key: "1" },
  ],
  // gatepass links
  [
    { routeName: "Create GP", routePath: "/create-gp" },
    { routeName: "Manage GP", routePath: "/manage-gp" },
  ],
  // physical stock
  [
    { routeName: "Create Physical Stock", routePath: "/create-physical" },
    { routeName: "View Physical Stock", routePath: "/view-physical" },
  ],
  // MIN register
  [
    { routeName: "MIN Register", routePath: "/transaction-In" },
    { routeName: "RM Issue Register", routePath: "/transaction-Out" },
  ],
  // reports r1-r14 links
  [
    { routeName: "R1", routePath: "/r1", placeholder: "Bom Wise Report" },
    { routeName: "R2", routePath: "/r2", placeholder: "PO Report" },
    { routeName: "R3", routePath: "/r3", placeholder: "Manufacturing Report" },
    { routeName: "R4", routePath: "/r4", placeholder: "Finished Goods In" },
    {
      routeName: "R5",
      routePath: "/r5",
      placeholder: "Finsished Goods Stock ",
    },
    { routeName: "R6", routePath: "/r6", placeholder: "Date Wise RM Stock" },
    {
      routeName: "R7",
      routePath: "/r7",
      placeholder: "PPR Replenishment Report",
    },
    {
      routeName: "R8",
      routePath: "/r8",
      placeholder: "Detailed Production Report",
    },
    {
      routeName: "R9",
      routePath: "/r9",
      placeholder: "Location Wise BOM Report",
    },
    {
      routeName: "R10",
      routePath: "/r10",
      placeholder: "Location Wise Report",
    },
    {
      routeName: "R11",
      routePath: "/r11",
      placeholder: "Component CL Stock Report",
    },
    { routeName: "R12", routePath: "/r12", placeholder: "Required RM for FG" },
    { routeName: "R13", routePath: "/r13", placeholder: "Custom MIN Report" },
    { routeName: "R14", routePath: "/r14", placeholder: "RM Physical Report" },
    { routeName: "R15", routePath: "/r15", placeholder: "MIN Register" },
    { routeName: "R16", routePath: "/r16", placeholder: "RM Issue Register" },
    {
      routeName: "R17",
      routePath: "/r17",
      placeholder: "Vendor Wise JW Stock",
    },
    {
      routeName: "R18",
      routePath: "/r18",
      placeholder: "All Location Wise Stock Report",
    },
    {
      routeName: "R19",
      routePath: "/r19",
      placeholder: "MTD Report",
    },
    // { routeName: "R15", routePath: "/r15" },
  ],
  // MIN label links
  [
    {
      routeName: "View and Print MIN Label",
      routePath: "/warehouse/print-view-min",
    },
  ],
  // query reports
  [
    {
      routeName: "Q1",
      routePath: "/item-all-logs",
      placeholder: "Item Query (All)",
    },
    {
      routeName: "Q2",
      routePath: "/item-location-logs",
      placeholder: "Item Query (Loc Wise)",
    },
    { routeName: "Q3", routePath: "/sku-query", placeholder: "SKU Query" },
  ],
  // CPM Analysis
  [
    {
      routeName: "CPM",
      routePath: "/CPM/CPM-analysis",
      placeholder: "Client Project Management",
    },
  ],
  // Paytm Analysis
  [
    // { routeName: "Paytm QC Upload", routePath: "/paytm-qc/upload", key: 0 },
    // { routeName: "Paytm QC Update", routePath: "/paytm-qc/update", key: 1 },
    { routeName: "Paytm QC Report", routePath: "/paytm-qc/report", key: 2 },
  ],
  // PPR links
  [
    { routeName: "Create PPR", routePath: "/create-ppr" },
    { routeName: "Pending PPR", routePath: "/pending-ppr" },
    { routeName: "Completed PPR", routePath: "/completed-ppr" },
  ],
  // Material Requisition links
  [
    { routeName: "Material Requisition with BOM", routePath: "/reqWithBom" },
    {
      routeName: "Material Requisition without BOM",
      routePath: "/reqWithoutBom",
    },
  ],
  // SF To REJ links
  [
    { routeName: "SF to REJ", routePath: "/sf-to-rej" },
    { routeName: "View Transactions", routePath: "/transaction-sf-to-rej" },
  ],
  // SF To SF links
  [
    { routeName: "SF to SF", routePath: "/sf-to-sf" },
    { routeName: "View Transactions", routePath: "/transaction-sf-to-sf" },
  ],

  // Create QC ALl
  [
    { routeName: "Create Sample", routePath: "/sample-qc" },
    { routeName: "Pending Sample", routePath: "/pending-qc" },
    { routeName: "Completed Sample", routePath: "/completed-qc" },
    { routeName: "QC Report", routePath: "/report-qc" },
  ],
  [{ routeName: "JW Update Report", routePath: "/jw-update" }],
  [{ routeName: "Location", routePath: "/location" }],
  // reports Master
  [
    { routeName: "CPM", routePath: "/master/reports/CPM" },
    { routeName: "R19 MTD", routePath: "/master/reports/r19" },
  ],
  // clients
  [
    { routeName: "Add Client", routePath: "/tally/clients/add" },
    { routeName: "View Client", routePath: "/tally/clients/view" },
  ],
  // app reference setup
  [
    {
      routeName: "App Bill Setup",
      routePath: "/tally/vouchers/reference/setup",
    },
    {
      routeName: "App Payment Setup",
      routePath: "/tally/vouchers/reference/payment",
    },
    { routeName: "App Report", routePath: "/tally/vouchers/reference/report" },
  ],
  //  Finance Reports
  [
    {
      routeName: "Trial Balance Report",
      routePath: "/tally/reports/trial-balance-report",
    },
    {
      routeName: "Balance Sheet",
      routePath: "/tally/reports/balance-sheet",
    },
  ],
];
export default links;
