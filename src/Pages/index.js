export { default as Login } from "./Login/Login";
export { default as ProductDetail } from "../Pages/Store/ProductDetail";
export { default as MaterialTransaction } from "./Store/MaterialTransaction/MaterialTransaction";
export { default as Uom } from "./Master/Uom";
export { default as Product } from "./Master/Products/Product";
export { default as Group } from "./Master/Group";
export { default as Location } from "./Master/Location";
export { default as BillingAddress } from "./Master/BillingAddress";
export { default as CreateBom } from "./Master/Bom/CreateBom";
export { default as ViewBom } from "./Master/Bom/ViewBom";
export { default as ManageSfgBom } from "./Master/Bom/ManageSfgBom";
export { default as HsnMap } from "./Master/HSNMap/HsnMap";
export { default as DocNumbering } from "./Master/DocNumbering";
export { default as Vendor } from "./Master/Vendor/Vendor";
export { default as CPMMaster } from "./Master/reports/CPM/CPMMaster";
export { default as R19Master } from "./Master/reports/R19/R19Master";

export { default as AddVendor } from "./Master/Vendor/AddVendor";

export { default as RmtoRm } from "./Store/MaterialTransfer/RmtoRm";
export { default as ViewTransaction } from "./Store/MaterialTransfer/ViewTransaction";
export { default as PendingTransfer } from "./Store/MaterialTransfer/PendingTransfer";
export { default as ReToRej } from "./Store/MaterialTransfer/RM-REJ/ReToRej";
export { default as TransactionRej } from "./Store/MaterialTransfer/RM-REJ/TransactionRej";
export { default as CreateDC } from "./Store/RGP_DC/CreateDC/CreateDC";
export { default as ManageDC } from "./Store/RGP_DC/ManageDC";
export { default as CreateGP } from "./Store/Gatepass/CreateGP";
export { default as ManageGatePass } from "./Store/Gatepass/ManageGatePass";
export { default as CreateFGOut } from "./Store/FG OUT/CreateFGOut";
export { default as ViewFGOut } from "./Store/FG OUT/ViewFGOut";
export { default as ViewMin } from "./Store/MINLabel/ViewMIN.jsx";

export { default as MaterialInWithoutPO } from "./Store/MaterialIn/MaterialInWithoutPO/MaterialInWithoutPO";
export { default as MaterialInWithPO } from "./Store/MaterialIn/MaterialInWithPO/MaterialInWithPO";

export { default as Rejection } from "./Store/Rejection/Rejection";

export { default as Material } from "../Pages/Master/Components/Material";
export { default as Services } from "../Pages/Master/Components/Services";
export { default as TransactionIn } from "./Store/Transaction/TransactionIn";
export { default as TransactionOut } from "./Store/Transaction/TransactionOut";
export { default as CompletedFG } from "./Store/FoodGoods/CompletedFG";
export { default as PendingFG } from "./Store/FoodGoods/PendingFG";
export { default as CreatePhysical } from "./Store/PhysicalStock/CreatePhysical";
export { default as ViewPhysical } from "./Store/PhysicalStock/ViewPhysical";

// Reports
export { default as ItemAllLogs } from "./Reports/ItemAllLogs";
export { default as ItemLocationLog } from "./Reports/ItemLocationLog";
export { default as R1 } from "./Reports/R/R1";

// QCA
export { default as SampleQC } from "./Production/Qca/SampleQC";
export { default as PendingQC } from "./Production/Qca/PendingQC";
export { default as CompletedQC } from "./Production/Qca/CompletedQC";
export { default as ReportQC } from "./Production/Qca/ReportQC";

// SF to rej
export { default as MaterialTransfer } from "./Production/Location Movement/MaterialTransfer";
export { default as TransactionSF } from "./Production/Location Movement/TransactionSF";
export { default as MaterialTransferReport } from "./Production/Location Movement/MaterialTransferReport";
export { default as TransactionSfToRej } from "./Production/Location Movement/TransactionSfToRej";

// Production Requisition ->  Material Requisition
export { default as ReqWithBom } from "./Production/Material Requisition/ReqWithBom";
export { default as ReqWithoutBom } from "./Production/Material Requisition/ReqWithoutBom";
export { default as CreatePPR } from "./Production/Production & Planning/CreatePPR";
export { default as PendingPPR } from "./Production/Production & Planning/PendingPPR/PendingPPR";
// export { default as CompletedPPR } from "./Production/Production & Planning/CompletedPPR";
// Purchase Order
export { default as CompletedPo } from "./PurchaseOrder/CompletedPO/CompletedPo";
export { default as ManagePO } from "./PurchaseOrder/ManagePO/ManagePo";
export { default as EditPO } from "./PurchaseOrder/ManagePO/EditPO/EditPO";
export { default as CreatePo } from "./PurchaseOrder/CreatePO/CreatePo";
export { default as VendorPricingUpload } from "./PurchaseOrder/VendorPricingUpload";

export { default as SKUCosting } from "./Dashboard/SKUCosting/SKUCosting";

export { default as SkuQuery } from "./Query/Sku Query/SkuQuery";

export { default as Messenger } from "./Messenger/Messenger";

export { default as Profile } from "./Profile/Profile";

export { default as Page404 } from "./Page404";

// cpm analysis
export { default as CPMAnalysis } from "./CPM/CPMAnalysis/CPMAnalysis";

// Jobwork
export { default as CreateJW } from "./Jobwork/CreateJW";
export { default as POAnalysis } from "./Jobwork/POAnalysis";
export { default as JwIssue } from "./Jobwork/JwIssue";
export { default as JwRmChallan } from "./Jobwork/JWRMChallan/JwRwChallan";
export { default as JwsfInward } from "./Jobwork/JwsfInward";
export { default as JwPendingRequest } from "./Jobwork/JwPendingRequest";
export { default as JwrmReturn } from "./Jobwork/JwrmReturn";
export { default as JwCompleted } from "./Jobwork/JwCompleted";
export { default as UpdateJW } from "./Jobwork/UpdateJW";
export { default as SFGMIN } from "./Jobwork/VendorSFGMIN/SFGMIN";

// update RM MATLS
export { default as UpdateRM } from "./Store/UpdateRM";
export { default as ReverseMin } from "./Store/ReverseMin";

// paytm qc
export { default as PaytmQCUpload } from "./PaytmQC/PaytmQCUpload";
export { default as PaytmQCUpdate } from "./PaytmQC/PaytmQCUpdate";
export { default as PaytmQCReport } from "./PaytmQC/PaytmQCReport";

// material requisition request and mr approval
export { default as ApprovedTransaction } from "./Store/ApprovedTransaction/ApprovedTransaction";
export { default as MaterialRequisitionRequest } from "./Store/ApprovedTransaction/MaterialRequisitionRequest";
