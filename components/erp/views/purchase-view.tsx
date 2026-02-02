"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Download,
  Mail,
  Upload,
  FileText,
  ImageIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Building2,
  Package,
  Truck,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw,
  Filter,
  Printer,
  Ship,
  Check,
  X,
  Calendar,
  BarChart3,
  Factory,
  ClipboardCheck,
  DollarSign,
  ShoppingCart,
  Archive,
  ArrowRight,
} from "lucide-react";

interface PurchaseViewProps {
  subMenu?: string;
}

// ============ 구매 현황 데이터 ============
const purchaseSummary = {
  totalOrders: 156,
  orderAmount: "45.2억",
  deliveryRate: 94.2,
  riskOrders: 8,
};

const orderProgressData = [
  { buyer: "BOSS", style: "BKMTM5106", status: "입고완료", progress: 100, deliveryDate: "2026-01-15", amount: "3.2억" },
  { buyer: "HAZZYS GOLF", style: "WPPA5A214", status: "선적중", progress: 75, deliveryDate: "2026-01-20", amount: "2.8억" },
  { buyer: "beanpole mens", style: "MMPT26M101", status: "생산중", progress: 45, deliveryDate: "2026-01-25", amount: "4.1억" },
  { buyer: "XEXYMIX", style: "XMP26001", status: "발주완료", progress: 20, deliveryDate: "2026-02-01", amount: "1.9억" },
];

const deliveryRiskData = [
  { style: "BKMTM5182", buyer: "BOSS", material: "G FABRIC L/GREY", expectedDate: "2026-01-10", delayDays: 5, reason: "원단 생산 지연" },
  { style: "WPPA5A214", buyer: "HAZZYS GOLF", material: "POCKETING TRICOT", expectedDate: "2026-01-12", delayDays: 3, reason: "선적 일정 변경" },
  { style: "MMPT26M101", buyer: "beanpole mens", material: "FRONT ZIPPER", expectedDate: "2026-01-08", delayDays: 7, reason: "품질 이슈" },
];

// ============ 자재 기준정보 데이터 ============
const materialMasterData = [
  { code: "FAB001", name: "G FABRIC", category: "원단", spec: "LIVE (P/PU=84/16)", unit: "YD", moq: 300, leadTime: 14, supplier: "피코" },
  { code: "FAB002", name: "POCKETING", category: "원단", spec: "TRICOT 58\"", unit: "YD", moq: 100, leadTime: 7, supplier: "지로티엘" },
  { code: "ACC001", name: "FRONT ZIPPER", category: "부자재", spec: "EYPC-256 17.5CM", unit: "EA", moq: 500, leadTime: 10, supplier: "비오아이엔씨" },
  { code: "ACC002", name: "MAGNET SNAP", category: "부자재", spec: "MAGNET C+D", unit: "SET", moq: 1000, leadTime: 7, supplier: "MDW" },
  { code: "LAB001", name: "CARE LABEL", category: "라벨", spec: "WASHING INSTRUCTION", unit: "EA", moq: 5000, leadTime: 5, supplier: "한국라벨" },
];

const supplierData = [
  { id: "V001", name: "피코", type: "원단", contact: "김철수", email: "cskim@pico.com", phone: "02-1234-5678", rating: "A", status: "활성" },
  { id: "V002", name: "지로티엘", type: "원단", contact: "이영희", email: "yhlee@jirotiel.com", phone: "02-2345-6789", rating: "A", status: "활성" },
  { id: "V003", name: "비오아이엔씨", type: "부자재", contact: "박민수", email: "mspark@bioainc.kr", phone: "02-3456-7890", rating: "B", status: "활성" },
  { id: "V004", name: "MDW", type: "부자재", contact: "최지훈", email: "jhchoi@mdw.co.kr", phone: "031-456-7890", rating: "A", status: "활성" },
  { id: "V005", name: "한국라벨", type: "라벨", contact: "정수진", email: "sjjung@krlabel.com", phone: "02-5678-9012", rating: "B", status: "비활성" },
];

// ============ 자재 소요 관리 데이터 ============
const materialRequirementData = [
  { 
    orderId: "ORD-2026-001",
    styleNo: "BKMTM5106",
    buyer: "BOSS",
    season: "26SS",
    materials: [
      { code: "겉감", name: "G FABRIC A/MILK", required: 484, allocated: 484, shortage: 0, status: "충족" },
      { code: "겉감", name: "G FABRIC CAMEL", required: 488, allocated: 478, shortage: 10, status: "부족" },
      { code: "주머니감", name: "POCKETING A/MILK", required: 103, allocated: 103, shortage: 0, status: "충족" },
      { code: "지퍼", name: "FRONT ZIPPER A/MILK", required: 296, allocated: 296, shortage: 0, status: "충족" },
    ]
  },
  { 
    orderId: "ORD-2026-002",
    styleNo: "WPPA5A214",
    buyer: "HAZZYS GOLF",
    season: "26SS",
    materials: [
      { code: "겉감", name: "WOVEN FABRIC WHITE", required: 353, allocated: 353, shortage: 0, status: "충족" },
      { code: "겉감", name: "WOVEN FABRIC CAMEL", required: 355, allocated: 300, shortage: 55, status: "부족" },
      { code: "심지", name: "N/WOVEN WAIST", required: 34, allocated: 34, shortage: 0, status: "충족" },
    ]
  },
];

// ============ 구매 요청 관리 데이터 ============
const purchaseRequestData = [
  { id: "PR-2026-001", date: "2025-12-20", styleNo: "BKMTM5106", material: "G FABRIC CAMEL", qty: 10, unit: "YD", requester: "김구매", status: "승인대기", urgency: "긴급" },
  { id: "PR-2026-002", date: "2025-12-21", styleNo: "WPPA5A214", material: "WOVEN FABRIC CAMEL", qty: 55, unit: "YD", requester: "이구매", status: "승인완료", urgency: "일반" },
  { id: "PR-2026-003", date: "2025-12-22", styleNo: "MMPT26M101", material: "STRETCH BAND", qty: 100, unit: "YD", requester: "박구매", status: "발주진행", urgency: "일반" },
];

// ============ 발주 관리 데이터 ============
const purchaseOrderData = [
  { id: "PO-2026-001", date: "2025-12-22", supplier: "피코", styleNo: "BKMTM5106", items: 4, amount: "3,156.52", currency: "USD", status: "발송완료", sentDate: "2025-12-22" },
  { id: "PO-2026-002", date: "2025-12-22", supplier: "지로티엘", styleNo: "BKMTM5106", items: 4, amount: "145.25", currency: "USD", status: "발송대기", sentDate: null },
  { id: "PO-2026-003", date: "2025-12-21", supplier: "비오아이엔씨", styleNo: "BKMTM5106", items: 4, amount: "1,291.20", currency: "USD", status: "회신완료", sentDate: "2025-12-21" },
  { id: "PO-2026-004", date: "2025-12-23", supplier: "MDW", styleNo: "WPPA5A214", items: 2, amount: "892.00", currency: "USD", status: "발송완료", sentDate: "2025-12-23" },
];

// ============ 선적/물류 관리 데이터 ============
const shipmentData = [
  { poId: "PO-2026-001", supplier: "피코", blNo: "BL123456", shipDate: "2025-12-25", eta: "2026-01-05", status: "선적완료", vessel: "EVER GIVEN", port: "BUSAN" },
  { poId: "PO-2026-003", supplier: "비오아이엔씨", blNo: "BL789012", shipDate: "2025-12-20", eta: "2025-12-22", status: "입고완료", vessel: "KOREA EXPRESS", port: "INCHEON" },
  { poId: "PO-2026-004", supplier: "MDW", blNo: null, shipDate: null, eta: "2026-01-08", status: "선적예정", vessel: null, port: null },
];

// ============ 입고/검수 관리 데이터 ============
const inboundData = [
  { id: "IN-2026-001", date: "2025-12-22", poId: "PO-2026-003", supplier: "비오아이엔씨", material: "FRONT ZIPPER A/MILK", orderQty: 296, receivedQty: 296, defectQty: 0, status: "검수완료", inspector: "김검수" },
  { id: "IN-2026-002", date: "2025-12-23", poId: "PO-2026-001", supplier: "피코", material: "G FABRIC A/MILK", orderQty: 484, receivedQty: 480, defectQty: 2, status: "검수중", inspector: "박검수" },
];

// ============ 입고 차이 관리 데이터 ============
const inboundDifferenceData = [
  { inboundId: "IN-2026-002", material: "G FABRIC A/MILK", orderQty: 484, receivedQty: 480, difference: -4, reason: "운송중 파손", action: "추가발주", actionStatus: "진행중" },
  { inboundId: "IN-2026-003", material: "POCKETING CAMEL", orderQty: 104, receivedQty: 110, difference: 6, reason: "공급사 오발송", action: "반품처리", actionStatus: "완료" },
];

// ============ 매입/정산 관리 데이터 ============
const purchaseSettlementData = [
  { poId: "PO-2026-001", supplier: "피코", invoiceNo: "INV-2025-1234", invoiceDate: "2025-12-28", amount: "3,156.52", currency: "USD", krwAmount: "4,419,128", paymentDue: "2026-01-28", status: "미정산" },
  { poId: "PO-2026-003", supplier: "비오아이엔씨", invoiceNo: "INV-2025-5678", invoiceDate: "2025-12-23", amount: "1,291.20", currency: "USD", krwAmount: "1,807,680", paymentDue: "2026-01-23", status: "정산완료" },
];

export function PurchaseView({ subMenu = "purchase-navigator" }: PurchaseViewProps) {
  const [activeTab, setActiveTab] = useState(subMenu);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [materialMasterTab, setMaterialMasterTab] = useState("material");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 구매 요청 관리 상태
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [selectedPListItems, setSelectedPListItems] = useState<Set<string>>(new Set());
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [deliveryDates, setDeliveryDates] = useState<{ [key: string]: string }>({});
  
  // 발주 관리 상태
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  
  // subMenu prop 변경 시 activeTab 동기화
  useEffect(() => {
    setActiveTab(subMenu);
  }, [subMenu]);
  
  // 작업지시서 목록 불러오기
  const fetchWorkOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch("/api/workorders");
      const data = await response.json();
      if (data.success) {
        // 각 오더의 상세 정보 (P-List 포함) 불러오기
        const ordersWithDetails = await Promise.all(
          data.workOrders.map(async (order: any) => {
            const detailRes = await fetch(`/api/create-order?orderNo=${order.orderNo}`);
            const detailData = await detailRes.json();
            return {
              ...order,
              ...detailData,
              pList: detailData.pList || []
            };
          })
        );
        setWorkOrders(ordersWithDetails);
      }
    } catch (error) {
      console.error("작업지시서 불러오기 실패:", error);
    } finally {
      setLoadingOrders(false);
    }
  };
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (activeTab === "purchase-request") {
      fetchWorkOrders();
    }
  }, [activeTab]);
  
  // P-List 아이템 선택/해제
  const togglePListItem = (itemId: string) => {
    const newSet = new Set(selectedPListItems);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    setSelectedPListItems(newSet);
  };
  
  // 자재명 기반 거래처 자동 매핑
  const getSupplierForMaterial = (materialName: string): string => {
    const name = materialName?.toLowerCase() || "";
    
    // 원단류
    if (name.includes("fabric") || name.includes("원단")) {
      return "V001"; // 피코
    }
    // 지퍼류
    if (name.includes("zip") || name.includes("zipper") || name.includes("지퍼")) {
      return "V003"; // 비오아이엔씨
    }
    // 단추/버튼류
    if (name.includes("button") || name.includes("단추") || name.includes("snap")) {
      return "V004"; // MDW
    }
    // 라벨류
    if (name.includes("label") || name.includes("라벨") || name.includes("tag")) {
      return "V005"; // 한국라벨
    }
    // 실/Thread
    if (name.includes("thread") || name.includes("실") || name.includes("treade")) {
      return "V002"; // 지로티엘
    }
    // 기타 부자재
    if (name.includes("안감") || name.includes("lining") || name.includes("심지")) {
      return "V002"; // 지로티엘
    }
    
    // 기본값
    return "V001";
  };
  
  // PO 생성 함수
  const handleCreatePO = () => {
    if (selectedPListItems.size === 0) return;
    
    // 선택된 항목들 수집 및 거래처별 그룹화
    const selectedItems: any[] = [];
    workOrders.forEach(order => {
      order.pList?.forEach((item: any, idx: number) => {
        const itemId = `${order.orderNo}-${idx}`;
        if (selectedPListItems.has(itemId)) {
          // 현재 선택된 거래처 가져오기 (실제로는 DOM에서 가져와야 하지만 간단히 자동매핑 사용)
          const supplierId = getSupplierForMaterial(item.material_name);
          selectedItems.push({
            orderNo: order.orderNo,
            styleNo: order.style_no || order.styleNo,
            brand: order.brand,
            supplierId,
            supplierName: supplierData.find(s => s.id === supplierId)?.name || "미정",
            materialName: item.material_name,
            code: item.code,
            size: item.size,
            qty: item.qty || order.total_qty || order.totalQty,
            placement: item.placement,
            deliveryDate: deliveryDates[itemId] || ""
          });
        }
      });
    });
    
    // 거래처별로 그룹화
    const groupedBySupplier: { [key: string]: any[] } = {};
    selectedItems.forEach(item => {
      const key = `${item.orderNo}-${item.supplierId}`;
      if (!groupedBySupplier[key]) {
        groupedBySupplier[key] = [];
      }
      groupedBySupplier[key].push(item);
    });
    
    // PO 생성
    const newPOs = Object.entries(groupedBySupplier).map(([key, items], index) => {
      const firstItem = items[0];
      const poNumber = `PO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(purchaseOrders.length + index + 1).padStart(3, '0')}`;
      
      // 가장 빠른 납기일을 PO 납기일로 설정
      const earliestDeliveryDate = items
        .map(item => item.deliveryDate)
        .filter(date => date)
        .sort()[0] || "";
      
      return {
        poNumber,
        orderNo: firstItem.orderNo,
        styleNo: firstItem.styleNo,
        brand: firstItem.brand,
        supplierId: firstItem.supplierId,
        supplierName: firstItem.supplierName,
        items,
        itemCount: items.length,
        status: "발송대기",
        deliveryDate: earliestDeliveryDate,
        createdAt: new Date().toISOString(),
      };
    });
    
    setPurchaseOrders([...newPOs, ...purchaseOrders]);
    setSelectedPListItems(new Set());
    setDeliveryDates({});
    
    alert(`✅ ${newPOs.length}개의 PO가 생성되었습니다!`);
    setActiveTab("purchase-order");
  };
  
  // 이메일 발송 처리
  const handleSendEmail = (poNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setPurchaseOrders(prev => 
      prev.map(po => 
        po.poNumber === poNumber 
          ? { ...po, status: "발주완료", sentAt: new Date().toISOString() }
          : po
      )
    );
    
    alert(`📧 PO ${poNumber}가 이메일로 발송되었습니다!`);
  };
  
  // 인쇄 처리
  const handlePrint = (poNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`🖨️ PO ${poNumber} 인쇄 기능 (구현 예정)`);
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted border border-border flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="purchase-navigator" className="text-xs">전체 프로세스</TabsTrigger>
          <TabsTrigger value="purchase-dashboard" className="text-xs">구매 대시보드</TabsTrigger>
          <TabsTrigger value="material-master" className="text-xs">자재 기준정보</TabsTrigger>
          <TabsTrigger value="material-requirement" className="text-xs">자재 소요 관리</TabsTrigger>
          <TabsTrigger value="purchase-request" className="text-xs">구매 요청 관리</TabsTrigger>
          <TabsTrigger value="purchase-order" className="text-xs">발주 관리</TabsTrigger>
          <TabsTrigger value="shipment-logistics" className="text-xs">선적/물류 관리</TabsTrigger>
          <TabsTrigger value="inbound-inspection" className="text-xs">입고/검수 관리</TabsTrigger>
          <TabsTrigger value="inbound-difference" className="text-xs">입고 차이 관리</TabsTrigger>
          <TabsTrigger value="purchase-settlement" className="text-xs">매입/정산 관리</TabsTrigger>
          <TabsTrigger value="purchase-report" className="text-xs">구매 리포트</TabsTrigger>
        </TabsList>

        {/* ============ 전체 프로세스 네비게이터 ============ */}
        <TabsContent value="purchase-navigator" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900/30 dark:to-blue-900/30 border-b-2 border-blue-300 dark:border-blue-700">
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <Factory className="h-8 w-8 text-blue-600" />
                구매 프로세스
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                영업·구매·재고·공장관리 시스템이 오더 단위로 유기적으로 연동되어 업무 정보가 단계별로 자동스캔게 되어 있습니다. 각 시스템은 Stella ERP로 자동 연계되어, 매출·원가·재고·손익이 일괄관리 기준으로 관리됩니다.
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {/* 3개 영역을 가로로 배치 */}
              <div className="grid grid-cols-3 gap-8">
                
                {/* ========== 영업관리 영역 ========== */}
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold pb-2 inline-block px-6 border-b-4 text-slate-600 dark:text-slate-400 border-slate-500">
                      영업관리
                    </h2>
                  </div>
                  
                  {/* 고객사 발주 수신 */}
                  <div
                    onClick={() => {
                      window.history.pushState({}, '', '/?menu=sales&subMenu=pdf-order');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <FileText className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">고객사 발주 수신</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-500 rotate-90" />
                  </div>
                  
                  {/* 영업 오더 등록 */}
                  <div
                    onClick={() => {
                      window.history.pushState({}, '', '/?menu=sales&subMenu=pdf-order');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <ClipboardCheck className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">영업 오더 등록</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-500 rotate-90" />
                  </div>
                  
                  {/* 출하 */}
                  <div className="cursor-pointer group opacity-60">
                    <div className="h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-400">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <Truck className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">출하</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-500 rotate-90" />
                  </div>
                  
                  {/* 대금청구 */}
                  <div className="cursor-pointer group opacity-60">
                    <div className="h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-400">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <DollarSign className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">대금청구</h3>
                    </div>
                  </div>
                </div>

                {/* ========== 구매관리 영역 (강조) ========== */}
                <div className="space-y-4 relative">
                  {/* 강조 배경 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl -z-10 border-4 shadow-2xl" style={{borderColor: '#17AE6B'}}></div>
                  <div className="p-4">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold pb-2 inline-block px-6 border-b-4" style={{color: '#17AE6B', borderColor: '#17AE6B'}}>
                        구매관리
                      </h2>
                      <p className="text-xs mt-2 font-semibold" style={{color: '#17AE6B'}}>현재 페이지</p>
                    </div>
                  
                  {/* 구매 요청 */}
                  <div
                    onClick={() => {
                      setActiveTab('purchase-request');
                      window.history.pushState({}, '', '/?menu=purchase&subMenu=request');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-28 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #17AE6B, #15995E)', borderColor: '#17AE6B'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <ShoppingCart className="h-10 w-10 mb-1 relative z-10" />
                      <h3 className="text-xl font-bold relative z-10">구매 요청</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-10 w-10 rotate-90" style={{color: '#17AE6B'}} />
                  </div>
                  
                  {/* 구매처 발주 */}
                  <div
                    onClick={() => {
                      setActiveTab('purchase-order');
                      window.history.pushState({}, '', '/?menu=purchase&subMenu=order');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-28 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #17AE6B, #15995E)', borderColor: '#17AE6B'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <Send className="h-10 w-10 mb-1 relative z-10" />
                      <h3 className="text-xl font-bold relative z-10">구매처 발주</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-10 w-10 rotate-90" style={{color: '#17AE6B'}} />
                  </div>
                  
                  {/* 구매 입고 */}
                  <div
                    onClick={() => {
                      setActiveTab('inbound-inspection');
                      window.history.pushState({}, '', '/?menu=purchase&subMenu=inbound');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-28 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #17AE6B, #15995E)', borderColor: '#17AE6B'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <Package className="h-10 w-10 mb-1 relative z-10" />
                      <h3 className="text-xl font-bold relative z-10">구매 입고</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-10 w-10 rotate-90" style={{color: '#17AE6B'}} />
                  </div>
                  
                  {/* 송장확인 */}
                  <div className="cursor-pointer group opacity-60">
                    <div className="h-28 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #25C47D, #17AE6B)', borderColor: '#25C47D'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <FileText className="h-10 w-10 mb-1 relative z-10" />
                      <h3 className="text-xl font-bold relative z-10">송장확인</h3>
                    </div>
                  </div>
                  </div>
                </div>

                {/* ========== 생산관리(해외공장) 영역 ========== */}
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold pb-2 inline-block px-4 border-b-4 text-slate-600 dark:text-slate-400 border-slate-500">
                      생산관리<span className="text-sm ml-1">[해외공장]</span>
                    </h2>
                  </div>
                  
                  {/* 사급 자재 입고 */}
                  <div
                    onClick={() => {
                      window.history.pushState({}, '', '/?menu=production&subMenu=cutting-report');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <Truck className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">사급 자재 입고</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-500 rotate-90" />
                  </div>
                  
                  {/* 생산 지시 */}
                  <div
                    onClick={() => {
                      window.history.pushState({}, '', '/?menu=production&subMenu=production-report');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <ClipboardList className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">생산 지시</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-500 rotate-90" />
                  </div>
                  
                  {/* 생산실적 업로드 */}
                  <div
                    onClick={() => {
                      window.history.pushState({}, '', '/?menu=production&subMenu=inspection-report');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <Upload className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">생산실적 업로드</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-500 rotate-90" />
                  </div>
                  
                  {/* 생산 진행 현황 리포트 */}
                  <div
                    onClick={() => {
                      window.history.pushState({}, '', '/?menu=production&subMenu=shipment-schedule');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-white relative overflow-hidden border-2 border-slate-400">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <BarChart3 className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-base font-bold relative z-10">생산 진행</h3>
                      <p className="text-xs relative z-10">현황 리포트</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 재고관리 영역 */}
              <div className="mt-12 pt-8 border-t-4" style={{borderColor: '#2E3440'}}>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold pb-2 inline-block px-6 border-b-4" style={{color: '#2E3440', borderColor: '#2E3440'}}>
                    재고관리
                  </h2>
                </div>
                
                <div className="flex justify-center items-center gap-8">
                  {/* 입고 */}
                  <div className="cursor-pointer group opacity-60">
                    <div className="w-48 h-24 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #2E3440, #1E2430)', borderColor: '#2E3440'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                      <Package className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">입고</h3>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-8 w-8" style={{color: '#2E3440'}} />
                  
                  {/* 재고 관리 (자재 이동) */}
                  <div className="cursor-pointer group opacity-60">
                    <div className="w-48 h-24 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #2E3440, #1E2430)', borderColor: '#2E3440'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                      <Archive className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">재고 관리</h3>
                      <p className="text-xs relative z-10">(자재 이동)</p>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-8 w-8" style={{color: '#2E3440'}} />
                  
                  {/* 출고 */}
                  <div className="cursor-pointer group opacity-60">
                    <div className="w-48 h-24 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #2E3440, #1E2430)', borderColor: '#2E3440'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                      <TrendingUp className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">출고</h3>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 구매 현황 (대시보드) ============ */}
        <TabsContent value="purchase-dashboard" className="space-y-6 mt-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">총 발주건수</p>
                    <p className="text-2xl font-bold text-foreground">{purchaseSummary.totalOrders}건</p>
                  </div>
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">발주금액 (누적)</p>
                    <p className="text-2xl font-bold text-foreground">{purchaseSummary.orderAmount}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">납기 준수율</p>
                    <p className="text-2xl font-bold text-primary">{purchaseSummary.deliveryRate}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">납기 리스크</p>
                    <p className="text-2xl font-bold text-destructive">{purchaseSummary.riskOrders}건</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 오더별 진행 현황 */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">오더별 진행 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderProgressData.map((order, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{order.buyer}</Badge>
                          <span className="font-mono text-sm text-foreground">{order.style}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            order.status === "입고완료" ? "bg-primary text-primary-foreground" :
                            order.status === "선적중" ? "bg-blue-500 text-white" :
                            order.status === "생산중" ? "bg-amber-500 text-white" :
                            "bg-muted text-muted-foreground"
                          }>{order.status}</Badge>
                          <span className="text-sm text-muted-foreground">{order.amount}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-right">{order.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 납기 리스크 */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  납기 리스크
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deliveryRiskData.map((risk, idx) => (
                    <div key={idx} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-foreground">{risk.style}</span>
                          <Badge variant="outline" className="text-xs">{risk.buyer}</Badge>
                        </div>
                        <Badge variant="destructive" className="text-xs">+{risk.delayDays}일 지연</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{risk.material}</p>
                      <p className="text-xs text-destructive mt-1">{risk.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ 자재 기준정보 ============ */}
        <TabsContent value="material-master" className="space-y-6 mt-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant={materialMasterTab === "material" ? "default" : "outline"} 
              size="sm"
              onClick={() => setMaterialMasterTab("material")}
              className={materialMasterTab === "material" ? "bg-primary text-primary-foreground" : ""}
            >
              자재 마스터/분류
            </Button>
            <Button 
              variant={materialMasterTab === "supplier" ? "default" : "outline"} 
              size="sm"
              onClick={() => setMaterialMasterTab("supplier")}
              className={materialMasterTab === "supplier" ? "bg-primary text-primary-foreground" : ""}
            >
              구매처 관리
            </Button>
          </div>

          {materialMasterTab === "material" && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="자재명, 코드 검색" className="pl-9 w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="분류" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="fabric">원단</SelectItem>
                      <SelectItem value="accessory">부자재</SelectItem>
                      <SelectItem value="label">라벨</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />자재 등록
                </Button>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">코드</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">자재명</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">분류</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">규격</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">단위</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">MOQ</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">L/T(일)</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">주거래처</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materialMasterData.map((item) => (
                          <tr key={item.code} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4 font-mono text-xs text-foreground">{item.code}</td>
                            <td className="py-3 px-4 font-medium text-foreground">{item.name}</td>
                            <td className="py-3 px-4"><Badge variant="outline">{item.category}</Badge></td>
                            <td className="py-3 px-4 text-muted-foreground text-xs">{item.spec}</td>
                            <td className="text-center py-3 px-4 text-foreground">{item.unit}</td>
                            <td className="text-right py-3 px-4 text-foreground">{item.moq.toLocaleString()}</td>
                            <td className="text-right py-3 px-4 text-foreground">{item.leadTime}</td>
                            <td className="py-3 px-4 text-foreground">{item.supplier}</td>
                            <td className="text-center py-3 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {materialMasterTab === "supplier" && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="구매처명, 담당자 검색" className="pl-9 w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="유형" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="fabric">원단</SelectItem>
                      <SelectItem value="accessory">부자재</SelectItem>
                      <SelectItem value="label">라벨</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />구매처 등록
                </Button>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">코드</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">구매처명</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">유형</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">담당자</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">이메일</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">연락처</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">등급</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">상태</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplierData.map((vendor) => (
                          <tr key={vendor.id} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-3 px-4 font-mono text-xs text-foreground">{vendor.id}</td>
                            <td className="py-3 px-4 font-medium text-foreground">{vendor.name}</td>
                            <td className="py-3 px-4"><Badge variant="outline">{vendor.type}</Badge></td>
                            <td className="py-3 px-4 text-foreground">{vendor.contact}</td>
                            <td className="py-3 px-4 text-muted-foreground text-xs">{vendor.email}</td>
                            <td className="py-3 px-4 text-muted-foreground">{vendor.phone}</td>
                            <td className="text-center py-3 px-4">
                              <Badge className={vendor.rating === "A" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                                {vendor.rating}
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-4">
                              <Badge variant={vendor.status === "활성" ? "default" : "secondary"}
                                className={vendor.status === "활성" ? "bg-primary text-primary-foreground" : ""}>
                                {vendor.status}
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm"><Mail className="h-4 w-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* ============ 자재 소요 관리 ============ */}
        <TabsContent value="material-requirement" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Select defaultValue="26SS">
                <SelectTrigger className="w-28"><SelectValue placeholder="시즌" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="26SS">26SS</SelectItem>
                  <SelectItem value="25FW">25FW</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Style No, Buyer 검색" className="pl-9 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="shortage">부족</SelectItem>
                  <SelectItem value="ok">충족</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />소요량 내보내기
            </Button>
          </div>

          <div className="space-y-4">
            {materialRequirementData.map((order) => (
              <Card key={order.orderId} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedOrder === order.orderId ? 
                        <ChevronDown className="h-5 w-5 text-muted-foreground" /> : 
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      }
                      <span className="font-mono font-bold text-foreground">{order.styleNo}</span>
                      <Badge variant="outline">{order.season}</Badge>
                      <Badge className="bg-primary/10 text-primary border-0">{order.buyer}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.materials.some(m => m.shortage > 0) && (
                        <Badge variant="destructive" className="text-xs">부족 자재 있음</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expandedOrder === order.orderId && (
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">자재구분</th>
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">자재명</th>
                          <th className="text-right py-2 px-3 font-medium text-muted-foreground">소요량</th>
                          <th className="text-right py-2 px-3 font-medium text-muted-foreground">할당량</th>
                          <th className="text-right py-2 px-3 font-medium text-muted-foreground">부족량</th>
                          <th className="text-center py-2 px-3 font-medium text-muted-foreground">상태</th>
                          <th className="text-center py-2 px-3 font-medium text-muted-foreground">조치</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.materials.map((mat, idx) => (
                          <tr key={idx} className="border-b border-border/50">
                            <td className="py-2 px-3 text-foreground">{mat.code}</td>
                            <td className="py-2 px-3 text-foreground">{mat.name}</td>
                            <td className="text-right py-2 px-3 text-foreground">{mat.required.toLocaleString()}</td>
                            <td className="text-right py-2 px-3 text-foreground">{mat.allocated.toLocaleString()}</td>
                            <td className="text-right py-2 px-3">
                              <span className={mat.shortage > 0 ? "text-destructive font-medium" : "text-muted-foreground"}>
                                {mat.shortage > 0 ? `-${mat.shortage}` : "-"}
                              </span>
                            </td>
                            <td className="text-center py-2 px-3">
                              <Badge className={mat.status === "충족" ? "bg-primary text-primary-foreground" : "bg-destructive text-white"}>
                                {mat.status}
                              </Badge>
                            </td>
                            <td className="text-center py-2 px-3">
                              {mat.shortage > 0 && (
                                <Button variant="outline" size="sm" className="text-xs h-7 bg-transparent">
                                  구매요청
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ============ 구매 요청 관리 ============ */}
        <TabsContent value="purchase-request" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="요청번호, Style 검색" className="pl-9 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">승인대기</SelectItem>
                  <SelectItem value="approved">승인완료</SelectItem>
                  <SelectItem value="ordered">발주진행</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />구매 요청
            </Button>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">요청번호</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">요청일</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Style No</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">자재명</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">수량</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">요청자</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">긴급</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">상태</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseRequestData.map((req) => (
                      <tr key={req.id} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-xs text-foreground">{req.id}</td>
                        <td className="py-3 px-4 text-foreground">{req.date}</td>
                        <td className="py-3 px-4 font-medium text-foreground">{req.styleNo}</td>
                        <td className="py-3 px-4 text-foreground">{req.material}</td>
                        <td className="text-right py-3 px-4 text-foreground">{req.qty} {req.unit}</td>
                        <td className="py-3 px-4 text-foreground">{req.requester}</td>
                        <td className="text-center py-3 px-4">
                          {req.urgency === "긴급" && <Badge variant="destructive">긴급</Badge>}
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge className={
                            req.status === "승인완료" ? "bg-primary text-primary-foreground" :
                            req.status === "발주진행" ? "bg-blue-500 text-white" :
                            "bg-amber-500/10 text-amber-600 border-0"
                          }>{req.status}</Badge>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            {req.status === "승인대기" && (
                              <>
                                <Button variant="ghost" size="sm" className="text-primary"><Check className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" className="text-destructive"><X className="h-4 w-4" /></Button>
                              </>
                            )}
                            {req.status === "승인완료" && (
                              <Button variant="outline" size="sm" className="text-xs h-7 bg-transparent">발주전환</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 구매 요청 관리 ============ */}
        <TabsContent value="purchase-request" className="space-y-4 mt-6">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={fetchWorkOrders}>
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground"
              disabled={selectedPListItems.size === 0}
              onClick={handleCreatePO}
            >
              <FileText className="h-4 w-4 mr-2" />
              원자재 발주하기 ({selectedPListItems.size})
            </Button>
              </div>

          {loadingOrders ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">작업지시서 불러오는 중...</p>
                </div>
              </CardContent>
            </Card>
          ) : workOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">등록된 작업지시서가 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm w-12"></th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">이미지</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">오더번호</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">브랜드</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">스타일번호</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">스타일명</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">총 수량</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">P-List</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workOrders.map((order) => {
                        const isExpanded = expandedOrder === order.orderNo;
                        const pListCount = order.pList?.length || 0;
                        
                        return (
                          <React.Fragment key={order.orderNo}>
                            <tr 
                              className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                              onClick={() => setExpandedOrder(isExpanded ? null : order.orderNo)}
                            >
                              <td className="py-3 px-4">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {order.thumbnailImage ? (
                                  <img 
                                    src={order.thumbnailImage} 
                                    alt="작업지시서" 
                                    className="w-12 h-12 object-cover rounded border border-border"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-muted rounded border border-border flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {order.orderNo}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 font-medium text-foreground">{order.brand}</td>
                              <td className="py-3 px-4 text-foreground">{order.style_no || order.styleNo}</td>
                              <td className="py-3 px-4 text-foreground">{order.style_name || order.styleName}</td>
                              <td className="py-3 px-4 text-center">
                                <span className="font-semibold text-primary">
                                  {(order.total_qty || order.totalQty || 0).toLocaleString()}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Badge variant="secondary" className="text-xs">
                                  {pListCount}개
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {order.hasPdf ? (
                                  <Badge variant="default" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                                    <Check className="h-3 w-3 mr-1" />
                                    첨부됨
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">
                                    <X className="h-3 w-3 mr-1" />
                                    없음
                                  </Badge>
                                )}
                              </td>
                            </tr>
                            
                            {/* P-List 펼침 영역 */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={9} className="p-0 bg-muted/20">
                                  <div className="p-4">
                                    {order.pList && order.pList.length > 0 ? (
                                      <div className="bg-card rounded-lg border border-border overflow-hidden">
                                        <div className="bg-muted/50 px-4 py-2 border-b border-border">
                                          <h3 className="text-sm font-semibold text-foreground">
                                            P-List 자재 목록 ({order.pList.length}개)
                                          </h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                          <table className="w-full text-sm">
                                            <thead>
                                              <tr className="border-b border-border bg-muted/30">
                                                <th className="text-center py-2 px-3 w-10">
                                                  <input 
                                                    type="checkbox"
                                                    className="rounded"
                                                    checked={order.pList.every((item: any, idx: number) => 
                                                      selectedPListItems.has(`${order.orderNo}-${idx}`)
                                                    )}
                                                    onChange={(e) => {
                                                      e.stopPropagation();
                                                      const newSet = new Set(selectedPListItems);
                                                      order.pList.forEach((item: any, idx: number) => {
                                                        const itemId = `${order.orderNo}-${idx}`;
                                                        if (e.target.checked) {
                                                          newSet.add(itemId);
                                                        } else {
                                                          newSet.delete(itemId);
                                                        }
                                                      });
                                                      setSelectedPListItems(newSet);
                                                    }}
                                                  />
                                                </th>
                                                <th className="text-left py-2 px-3 font-medium text-muted-foreground">No</th>
                                                <th className="text-left py-2 px-3 font-medium text-muted-foreground">자재명</th>
                                                <th className="text-left py-2 px-3 font-medium text-muted-foreground">코드</th>
                                                <th className="text-left py-2 px-3 font-medium text-muted-foreground">거래처</th>
                                                <th className="text-left py-2 px-3 font-medium text-muted-foreground">규격</th>
                                                <th className="text-center py-2 px-3 font-medium text-muted-foreground">수량</th>
                                                <th className="text-left py-2 px-3 font-medium text-muted-foreground">용도</th>
                                                <th className="text-center py-2 px-3 font-medium text-muted-foreground">납기일</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {order.pList.map((item: any, idx: number) => {
                                                const itemId = `${order.orderNo}-${idx}`;
                                                const isSelected = selectedPListItems.has(itemId);
                                                
                                                return (
                                                  <tr 
                                                    key={idx} 
                                                    className={`border-b border-border/50 hover:bg-muted/20 ${isSelected ? 'bg-primary/5' : ''}`}
                                                  >
                                                    <td className="text-center py-2 px-3">
                                                      <input 
                                                        type="checkbox"
                                                        className="rounded"
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                          e.stopPropagation();
                                                          togglePListItem(itemId);
                                                        }}
                                                      />
                                                    </td>
                                                    <td className="py-2 px-3 text-center text-muted-foreground">{idx + 1}</td>
                                                    <td className="py-2 px-3 font-medium text-foreground">{item.material_name}</td>
                                                    <td className="py-2 px-3 text-foreground">{item.code || '-'}</td>
                                                    <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                                                      <Select defaultValue={getSupplierForMaterial(item.material_name)}>
                                                        <SelectTrigger className="h-8 text-xs">
                                                          <SelectValue />
                </SelectTrigger>
                <SelectContent>
                                                          {supplierData.map((supplier) => (
                                                            <SelectItem key={supplier.id} value={supplier.id}>
                                                              {supplier.name}
                                                            </SelectItem>
                                                          ))}
                </SelectContent>
              </Select>
                                                    </td>
                                                    <td className="py-2 px-3 text-foreground">{item.size || '-'}</td>
                                                    <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                                                      <Input 
                                                        type="text"
                                                        defaultValue={item.qty || order.total_qty || order.totalQty || '5500'}
                                                        className="h-8 text-xs text-center w-24"
                                                      />
                                                    </td>
                                                    <td className="py-2 px-3 text-foreground">{item.placement || '-'}</td>
                                                    <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                                                      <Input 
                                                        type="date"
                                                        value={deliveryDates[itemId] || ''}
                                                        onChange={(e) => {
                                                          const newDate = e.target.value;
                                                          
                                                          // 현재 아이템이 선택되어 있는지 확인
                                                          if (selectedPListItems.has(itemId)) {
                                                            // 선택된 모든 아이템의 납기일을 동일하게 변경
                                                            const updates: { [key: string]: string } = {};
                                                            selectedPListItems.forEach(id => {
                                                              updates[id] = newDate;
                                                            });
                                                            setDeliveryDates(prev => ({
                                                              ...prev,
                                                              ...updates
                                                            }));
                                                          } else {
                                                            // 선택되지 않은 경우 개별 변경
                                                            setDeliveryDates(prev => ({
                                                              ...prev,
                                                              [itemId]: newDate
                                                            }));
                                                          }
                                                        }}
                                                        className="h-8 text-xs w-32"
                                                        placeholder={isSelected ? "일괄 변경" : "날짜 선택"}
                                                      />
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </table>
            </div>
            </div>
                                    ) : (
                                      <div className="text-center py-8 text-muted-foreground text-sm">
                                        P-List 정보가 없습니다.
          </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ============ 발주 관리 ============ */}
        <TabsContent value="purchase-order" className="space-y-4 mt-6">
          {purchaseOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">생성된 PO가 없습니다.</p>
                <p className="text-sm text-muted-foreground mt-2">구매 요청 관리에서 원자재를 선택하여 발주하세요.</p>
              </CardContent>
            </Card>
          ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                  <table className="w-full">
                  <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm w-12"></th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">PO번호</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">오더번호</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">브랜드</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">스타일번호</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">거래처</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">품목수</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">납기일</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">상태</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">생성일</th>
                        <th className="text-center py-3 px-4 font-medium text-muted-foreground text-sm">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                      {purchaseOrders.map((po) => {
                        const isExpanded = expandedOrder === po.poNumber;
                        
                        return (
                          <React.Fragment key={po.poNumber}>
                            <tr 
                              className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                              onClick={() => setExpandedOrder(isExpanded ? null : po.poNumber)}
                            >
                              <td className="py-3 px-4">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {po.poNumber}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="secondary" className="font-mono text-xs">
                                  {po.orderNo}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 font-medium text-foreground">{po.brand}</td>
                        <td className="py-3 px-4 text-foreground">{po.styleNo}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-foreground">{po.supplierName}</span>
                                </div>
                        </td>
                              <td className="py-3 px-4 text-center">
                                <Badge variant="secondary" className="text-xs">
                                  {po.itemCount}개
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <Input 
                                  type="date"
                                  value={po.deliveryDate || ''}
                                  onChange={(e) => {
                                    setPurchaseOrders(prev => 
                                      prev.map(p => 
                                        p.poNumber === po.poNumber 
                                          ? { ...p, deliveryDate: e.target.value }
                                          : p
                                      )
                                    );
                                  }}
                                  className="h-8 text-xs w-32 mx-auto"
                                />
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Badge 
                                  variant={po.status === "발주완료" ? "default" : "secondary"}
                                  className={po.status === "발주완료" ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
                                >
                                  {po.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                                {new Date(po.createdAt).toLocaleDateString('ko-KR')}
                              </td>
                              <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => handlePrint(po.poNumber, e)}
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                            {po.status === "발송대기" && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-primary"
                                      onClick={(e) => handleSendEmail(po.poNumber, e)}
                                    >
                                      <Mail className="h-4 w-4" />
                                    </Button>
                            )}
                          </div>
                              </td>
                            </tr>
                            
                            {/* 품목 상세 펼침 */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={11} className="p-0 bg-muted/20">
                                  <div className="p-4">
                                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                                      <div className="bg-muted/50 px-4 py-2 border-b border-border">
                                        <h3 className="text-sm font-semibold text-foreground">
                                          발주 품목 상세 ({po.itemCount}개)
                                        </h3>
                                      </div>
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                          <thead>
                                            <tr className="border-b border-border bg-muted/30">
                                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">No</th>
                                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">자재명</th>
                                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">코드</th>
                                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">규격</th>
                                              <th className="text-center py-2 px-3 font-medium text-muted-foreground">수량</th>
                                              <th className="text-left py-2 px-3 font-medium text-muted-foreground">용도</th>
                                              <th className="text-center py-2 px-3 font-medium text-muted-foreground">납기일</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {po.items.map((item: any, idx: number) => (
                                              <tr key={idx} className="border-b border-border/50 hover:bg-muted/20">
                                                <td className="py-2 px-3 text-center text-muted-foreground">{idx + 1}</td>
                                                <td className="py-2 px-3 font-medium text-foreground">{item.materialName}</td>
                                                <td className="py-2 px-3 text-foreground">{item.code || '-'}</td>
                                                <td className="py-2 px-3 text-foreground">{item.size || '-'}</td>
                                                <td className="py-2 px-3 text-center font-semibold text-primary">
                                                  {typeof item.qty === 'number' ? item.qty.toLocaleString() : item.qty}
                                                </td>
                                                <td className="py-2 px-3 text-foreground">{item.placement || '-'}</td>
                                                <td className="py-2 px-3 text-center text-sm text-muted-foreground">
                                                  {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString('ko-KR') : '-'}
                        </td>
                      </tr>
                    ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          )}
        </TabsContent>

        {/* ============ 선적/물류 관리 ============ */}
        <TabsContent value="shipment-logistics" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="B/L No, 구매처 검색" className="pl-9 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="scheduled">선적예정</SelectItem>
                  <SelectItem value="shipped">선적완료</SelectItem>
                  <SelectItem value="arrived">입고완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">발주번호</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">구매처</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">B/L No</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">선적일</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">ETA</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">선박</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">항구</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">상태</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipmentData.map((ship, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-xs text-foreground">{ship.poId}</td>
                        <td className="py-3 px-4 font-medium text-foreground">{ship.supplier}</td>
                        <td className="py-3 px-4 font-mono text-xs text-foreground">{ship.blNo || "-"}</td>
                        <td className="py-3 px-4 text-foreground">{ship.shipDate || "-"}</td>
                        <td className="py-3 px-4 text-foreground">{ship.eta}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{ship.vessel || "-"}</td>
                        <td className="py-3 px-4 text-foreground">{ship.port || "-"}</td>
                        <td className="text-center py-3 px-4">
                          <Badge className={
                            ship.status === "입고완료" ? "bg-primary text-primary-foreground" :
                            ship.status === "선적완료" ? "bg-blue-500 text-white" :
                            "bg-amber-500/10 text-amber-600 border-0"
                          }>{ship.status}</Badge>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 입고/검수 관리 ============ */}
        <TabsContent value="inbound-inspection" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="입고번호, 자재 검색" className="pl-9 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="inspecting">검수중</SelectItem>
                  <SelectItem value="completed">검수완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />입고 등록
            </Button>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">입고번호</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">입고일</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">발주번호</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">구매처</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">자재명</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">발주량</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">입고량</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">불량</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">상태</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">검수자</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inboundData.map((inbound) => (
                      <tr key={inbound.id} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-xs text-foreground">{inbound.id}</td>
                        <td className="py-3 px-4 text-foreground">{inbound.date}</td>
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{inbound.poId}</td>
                        <td className="py-3 px-4 text-foreground">{inbound.supplier}</td>
                        <td className="py-3 px-4 font-medium text-foreground">{inbound.material}</td>
                        <td className="text-right py-3 px-4 text-foreground">{inbound.orderQty.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 text-foreground">{inbound.receivedQty.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          <span className={inbound.defectQty > 0 ? "text-destructive" : "text-muted-foreground"}>
                            {inbound.defectQty}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge className={inbound.status === "검수완료" ? "bg-primary text-primary-foreground" : "bg-amber-500/10 text-amber-600 border-0"}>
                            {inbound.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-foreground">{inbound.inspector}</td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 입고 차이 관리 ============ */}
        <TabsContent value="inbound-difference" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="입고번호, 자재 검색" className="pl-9 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="차이유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="shortage">부족</SelectItem>
                  <SelectItem value="excess">초과</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">입고번호</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">자재명</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">발주량</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">입고량</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">차이</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">원인</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">조치</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">조치상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inboundDifferenceData.map((diff, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-xs text-foreground">{diff.inboundId}</td>
                        <td className="py-3 px-4 font-medium text-foreground">{diff.material}</td>
                        <td className="text-right py-3 px-4 text-foreground">{diff.orderQty.toLocaleString()}</td>
                        <td className="text-right py-3 px-4 text-foreground">{diff.receivedQty.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          <span className={diff.difference < 0 ? "text-destructive font-medium" : "text-blue-500 font-medium"}>
                            {diff.difference > 0 ? `+${diff.difference}` : diff.difference}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{diff.reason}</td>
                        <td className="py-3 px-4 text-foreground">{diff.action}</td>
                        <td className="text-center py-3 px-4">
                          <Badge className={diff.actionStatus === "완료" ? "bg-primary text-primary-foreground" : "bg-amber-500/10 text-amber-600 border-0"}>
                            {diff.actionStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 매입/정산 관리 ============ */}
        <TabsContent value="purchase-settlement" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="발주번호, 구매처 검색" className="pl-9 w-64" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="정산상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="unsettled">미정산</SelectItem>
                  <SelectItem value="settled">정산완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />정산 내역 다운
            </Button>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">발주번호</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">구매처</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Invoice No</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Invoice일</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">금액(USD)</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">금액(KRW)</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">결제예정일</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">상태</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseSettlementData.map((settle, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-xs text-foreground">{settle.poId}</td>
                        <td className="py-3 px-4 font-medium text-foreground">{settle.supplier}</td>
                        <td className="py-3 px-4 font-mono text-xs text-foreground">{settle.invoiceNo}</td>
                        <td className="py-3 px-4 text-foreground">{settle.invoiceDate}</td>
                        <td className="text-right py-3 px-4 text-foreground">${settle.amount}</td>
                        <td className="text-right py-3 px-4 text-foreground">{Number(settle.krwAmount).toLocaleString()}원</td>
                        <td className="py-3 px-4 text-foreground">{settle.paymentDue}</td>
                        <td className="text-center py-3 px-4">
                          <Badge className={settle.status === "정산완료" ? "bg-primary text-primary-foreground" : "bg-amber-500/10 text-amber-600 border-0"}>
                            {settle.status}
                          </Badge>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                            {settle.status === "미정산" && (
                              <Button variant="outline" size="sm" className="text-xs h-7 bg-transparent">정산처리</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 구매 리포트 ============ */}
        <TabsContent value="purchase-report" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  자재/협력사 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-foreground">총 등록 자재수</span>
                    <span className="text-lg font-bold text-foreground">156개</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-foreground">활성 구매처</span>
                    <span className="text-lg font-bold text-foreground">42개</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-foreground">이번 달 발주건</span>
                    <span className="text-lg font-bold text-primary">24건</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-foreground">이번 달 발주금액</span>
                    <span className="text-lg font-bold text-foreground">8.5억</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">구매처별 발주 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["피코", "지로티엘", "비오아이엔씨", "MDW"].map((supplier, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-sm text-foreground w-24">{supplier}</span>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${[65, 45, 30, 20][idx]}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-16 text-right">{[65, 45, 30, 20][idx]}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
