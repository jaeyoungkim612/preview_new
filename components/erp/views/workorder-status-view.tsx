"use client";

import { SalesView } from "./sales-view";

// 작업지시서 현황 전용 뷰 (SalesView의 workorder-list 탭을 표시)
export function WorkOrderStatusView() {
  return <SalesView subMenu="workorder-list" />;
}
