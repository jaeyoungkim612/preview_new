"use client";

import React from "react";
import { useState } from "react";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  LayoutDashboard,
  Factory,
  FileText,
  Settings,
  ChevronRight,
  ChevronDown,
  Calculator,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: { id: string; label: string }[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: "sales",
    label: "영업관리",
    icon: <TrendingUp className="h-5 w-5" />,
    children: [
      { id: "sales-navigator", label: "⭐ 영업 프로세스" },
      { id: "sales-dashboard", label: "영업 대시보드" },
      { id: "pdf-order", label: "작업지시서 등록" },
      { id: "workorder-list", label: "작업지시서 현황" },
    ],
  },
  {
    id: "purchase",
    label: "구매 시스템",
    icon: <ShoppingCart className="h-5 w-5" />,
    children: [
      { id: "purchase-navigator", label: "⭐ 구매 프로세스" },
      { id: "purchase-dashboard", label: "구매 대시보드" },
      { id: "material-master", label: "자재 기준정보" },
      { id: "material-requirement", label: "자재 소요 관리" },
      { id: "purchase-request", label: "구매 요청 관리" },
      { id: "purchase-order", label: "발주 관리" },
      { id: "shipment-logistics", label: "선적/물류 관리" },
      { id: "inbound-inspection", label: "입고/검수 관리" },
      { id: "inbound-difference", label: "입고 차이 관리" },
      { id: "purchase-settlement", label: "매입/정산 관리" },
      { id: "purchase-report", label: "구매 리포트" },
    ],
  },
  {
    id: "inventory",
    label: "재고관리",
    icon: <Package className="h-5 w-5" />,
    children: [
      { id: "inventory-dashboard", label: "재고 현황 요약" },
      { id: "material-stock", label: "자재 재고 관리" },
      { id: "product-stock", label: "제품 재고 관리" },
      { id: "inout-movement", label: "입출고/이동 관리" },
    ],
  },
  {
    id: "factory",
    label: "공장관리",
    icon: <Factory className="h-5 w-5" />,
    children: [
      { id: "cutting-report", label: "재단 리포트" },
      { id: "production-report", label: "생산 리포트" },
      { id: "inspection-report", label: "완성검사 리포트" },
      { id: "shipment-schedule", label: "선적 스케쥴" },
      { id: "cutting-input", label: "재단 정보 입력" },
      { id: "production-input", label: "생산 정보 입력" },
      { id: "inspection-input", label: "완성검사 입력" },
      { id: "shipment-input", label: "선적 스케쥴 입력" },
    ],
  },
  {
    id: "cost",
    label: "원가/손익",
    icon: <Calculator className="h-5 w-5" />,
    children: [
      { id: "style-profit", label: "Style별 손익 내역" },
      { id: "profit-closing", label: "손익 종결보고" },
      { id: "next-season-cost", label: "차기시즌 비용작성" },
      { id: "sample-cost", label: "샘플비용 관리" },
    ],
  },
  {
    id: "reports",
    label: "리포트",
    icon: <FileText className="h-5 w-5" />,
    children: [
      { id: "brand-profit", label: "브랜드별 손익(GM)" },
      { id: "season-report", label: "시즌별 실적" },
    ],
  },
  {
    id: "chatbot",
    label: "AI 어시스턴트",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    id: "settings",
    label: "설정",
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SidebarProps {
  activeMenu: string;
  onMenuSelect: (menuId: string) => void;
}

export function Sidebar({ activeMenu, onMenuSelect }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["sales", "purchase", "inventory", "production", "cost"]);

  const toggleExpand = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">巨</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">(주)거림트렌드</h1>
            <p className="text-xs text-sidebar-foreground/60">ERP System v2.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => {
                if (item.children) {
                  toggleExpand(item.id);
                } else {
                  onMenuSelect(item.id);
                }
              }}
              className={cn(
                "w-full flex items-center justify-between px-6 py-3 text-sm transition-colors",
                activeMenu === item.id || activeMenu.startsWith(`${item.id}-`) || item.children?.some(c => c.id === activeMenu)
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.children && (
                expandedMenus.includes(item.id) 
                  ? <ChevronDown className="h-4 w-4" />
                  : <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {item.children && expandedMenus.includes(item.id) && (
              <div className="bg-sidebar-accent/30">
                {item.children.map((child) => (
                  <button
                    type="button"
                    key={child.id}
                    onClick={() => onMenuSelect(child.id)}
                    className={cn(
                      "w-full text-left px-12 py-2.5 text-sm transition-colors",
                      activeMenu === child.id
                        ? "text-sidebar-primary bg-sidebar-accent"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sidebar-accent rounded-full flex items-center justify-center">
            <span className="text-sidebar-foreground text-sm font-medium">관</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">관리자</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">admin@georim.co.kr</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
