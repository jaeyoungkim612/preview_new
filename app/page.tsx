"use client";

import { useState } from "react";
import { Sidebar } from "@/components/erp/sidebar";
import { Header } from "@/components/erp/header";
import { DashboardView } from "@/components/erp/views/dashboard-view";
import { PurchaseView } from "@/components/erp/views/purchase-view";
import { SalesView } from "@/components/erp/views/sales-view";
import { InventoryView } from "@/components/erp/views/inventory-view";
import { ProductionView } from "@/components/erp/views/production-view";
import { ChatbotView } from "@/components/erp/views/chatbot-view";

const menuTitles: Record<string, { title: string; breadcrumb: string[] }> = {
  dashboard: { title: "대시보드", breadcrumb: ["홈"] },
  // 구매 시스템
  "purchase-navigator": { title: "구매 프로세스", breadcrumb: ["구매 시스템", "구매 프로세스"] },
  "purchase-dashboard": { title: "구매 대시보드", breadcrumb: ["구매 시스템", "구매 대시보드"] },
  "material-master": { title: "자재 기준정보", breadcrumb: ["구매 시스템", "자재 기준정보"] },
  "material-requirement": { title: "자재 소요 관리", breadcrumb: ["구매 시스템", "자재 소요 관리"] },
  "purchase-request": { title: "구매 요청 관리", breadcrumb: ["구매 시스템", "구매 요청 관리"] },
  "purchase-order": { title: "발주 관리", breadcrumb: ["구매 시스템", "발주 관리"] },
  "shipment-logistics": { title: "선적/물류 관리", breadcrumb: ["구매 시스템", "선적/물류 관리"] },
  "inbound-inspection": { title: "입고/검수 관리", breadcrumb: ["구매 시스템", "입고/검수 관리"] },
  "inbound-difference": { title: "입고 차이 관리", breadcrumb: ["구매 시스템", "입고 차이 관리"] },
  "purchase-settlement": { title: "매입/정산 관리", breadcrumb: ["구매 시스템", "매입/정산 관리"] },
  "purchase-report": { title: "구매 리포트", breadcrumb: ["구매 시스템", "구매 리포트"] },
  // 영업관리
  "sales-navigator": { title: "영업 프로세스", breadcrumb: ["영업관리", "영업 프로세스"] },
  "sales-dashboard": { title: "영업 대시보드", breadcrumb: ["영업관리", "영업 대시보드"] },
  "pdf-order": { title: "작업지시서 등록", breadcrumb: ["영업관리", "작업지시서 등록"] },
  "workorder-list": { title: "작업지시서 현황", breadcrumb: ["영업관리", "작업지시서 현황"] },
  // 재고관리
  "inventory-dashboard": { title: "재고 현황 요약", breadcrumb: ["재고관리", "재고 현황 요약"] },
  "material-stock": { title: "자재 재고 관리", breadcrumb: ["재고관리", "자재 재고 관리"] },
  "product-stock": { title: "제품 재고 관리", breadcrumb: ["재고관리", "제품 재고 관리"] },
  "inout-movement": { title: "입출고/이동 관리", breadcrumb: ["재고관리", "입출고/이동 관리"] },
  // 공장관리
  "cutting-report": { title: "재단 리포트", breadcrumb: ["공장관리", "재단 리포트"] },
  "production-report": { title: "생산 리포트", breadcrumb: ["공장관리", "생산 리포트"] },
  "inspection-report": { title: "완성검사 리포트", breadcrumb: ["공장관리", "완성검사 리포트"] },
  "shipment-schedule": { title: "선적 스케쥴", breadcrumb: ["공장관리", "선적 스케쥴"] },
  "cutting-input": { title: "재단 정보 입력", breadcrumb: ["공장관리", "재단 정보 입력"] },
  "production-input": { title: "생산 정보 입력", breadcrumb: ["공장관리", "생산 정보 입력"] },
  "inspection-input": { title: "완성검사 입력", breadcrumb: ["공장관리", "완성검사 입력"] },
  "shipment-input": { title: "선적 스케쥴 입력", breadcrumb: ["공장관리", "선적 스케쥴 입력"] },
  // 원가/손익
  "style-profit": { title: "Style별 손익 내역", breadcrumb: ["원가/손익", "Style별 손익 내역"] },
  "profit-closing": { title: "손익 종결보고", breadcrumb: ["원가/손익", "손익 종결보고"] },
  "next-season-cost": { title: "차기시즌 비용작성", breadcrumb: ["원가/손익", "차기시즌 비용작성"] },
  "sample-cost": { title: "샘플비용 관리", breadcrumb: ["원가/손익", "샘플비용 관리"] },
  // 리포트
  "brand-profit": { title: "브랜드별 손익(GM)", breadcrumb: ["리포트", "브랜드별 손익(GM)"] },
  "season-report": { title: "시즌별 실적", breadcrumb: ["리포트", "시즌별 실적"] },
  // AI 어시스턴트
  chatbot: { title: "AI 어시스턴트", breadcrumb: ["AI", "어시스턴트"] },
  // 설정
  settings: { title: "설정", breadcrumb: ["시스템", "설정"] },
};

export default function ERPPage() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const currentMenu = menuTitles[activeMenu] || { title: "대시보드", breadcrumb: ["홈"] };

  const renderView = () => {
    // 구매 시스템 메뉴
    if (
      activeMenu === "purchase-navigator" ||
      activeMenu === "purchase-dashboard" ||
      activeMenu === "material-master" ||
      activeMenu === "material-requirement" ||
      activeMenu === "purchase-request" ||
      activeMenu === "purchase-order" ||
      activeMenu === "shipment-logistics" ||
      activeMenu === "inbound-inspection" ||
      activeMenu === "inbound-difference" ||
      activeMenu === "purchase-settlement" ||
      activeMenu === "purchase-closing" ||
      activeMenu === "purchase-report"
    ) {
      return <PurchaseView subMenu={activeMenu} />;
    }
    // 영업관리 메뉴
    if (
      activeMenu === "sales-navigator" ||
      activeMenu === "sales-dashboard" ||
      activeMenu === "pdf-order" ||
      activeMenu === "workorder-list"
    ) {
      return <SalesView subMenu={activeMenu} />;
    }
    // 재고관리 메뉴
    if (
      activeMenu === "inventory-dashboard" ||
      activeMenu === "material-stock" ||
      activeMenu === "product-stock" ||
      activeMenu === "inout-movement"
    ) {
      return <InventoryView />;
    }
    // 공장관리 메뉴
    if (
      activeMenu === "cutting-report" ||
      activeMenu === "production-report" ||
      activeMenu === "inspection-report" ||
      activeMenu === "shipment-schedule" ||
      activeMenu === "cutting-input" ||
      activeMenu === "production-input" ||
      activeMenu === "inspection-input" ||
      activeMenu === "shipment-input"
    ) {
      return <ProductionView subMenu={activeMenu} />;
    }
    // 원가/손익 메뉴
    if (
      activeMenu === "style-profit" ||
      activeMenu === "profit-closing" ||
      activeMenu === "next-season-cost" ||
      activeMenu === "sample-cost"
    ) {
      return <DashboardView />;
    }
    // 리포트 메뉴
    if (activeMenu === "brand-profit" || activeMenu === "season-report") {
      return <DashboardView />;
    }
    // AI 어시스턴트
    if (activeMenu === "chatbot") {
      return <ChatbotView />;
    }
    // 기본은 대시보드
    return <DashboardView />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeMenu={activeMenu} onMenuSelect={setActiveMenu} />
      <div className="ml-64">
        <Header title={currentMenu.title} breadcrumb={currentMenu.breadcrumb} />
        <main className="min-h-[calc(100vh-4rem)]">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
