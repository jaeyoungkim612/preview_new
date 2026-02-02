"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Download,
  Package,
  AlertTriangle,
  TrendingDown,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Layers,
  Box,
  ArrowLeftRight,
  Factory,
  Clock,
  FileText,
  History,
  CheckCircle,
  XCircle,
} from "lucide-react";

// 재고 현황 요약 데이터
const inventorySummary = {
  totalMaterialValue: 245000000,
  totalProductValue: 180000000,
  overdueItems: 12,
  shortageItems: 8,
  excessItems: 5,
};

// 자재 재고 데이터
const materialInventory = [
  { id: "M001", code: "FAB-001", name: "면 100% 원단", category: "원단", unit: "YD", qty: 8500, minQty: 5000, location: "원자재창고-A", lastIn: "2025-01-20", status: "정상" },
  { id: "M002", code: "FAB-002", name: "폴리에스터 원단", category: "원단", unit: "YD", qty: 2800, minQty: 3000, location: "원자재창고-A", lastIn: "2025-01-18", status: "부족" },
  { id: "M003", code: "FAB-003", name: "린넨 원단", category: "원단", unit: "YD", qty: 12000, minQty: 4000, location: "원자재창고-B", lastIn: "2025-01-22", status: "과잉" },
  { id: "M004", code: "ACC-001", name: "YKK 지퍼 20cm", category: "부자재", unit: "EA", qty: 15000, minQty: 5000, location: "부자재창고", lastIn: "2025-01-19", status: "정상" },
  { id: "M005", code: "ACC-002", name: "단추 4홀 15mm", category: "부자재", unit: "EA", qty: 8000, minQty: 10000, location: "부자재창고", lastIn: "2025-01-15", status: "부족" },
  { id: "M006", code: "LBL-001", name: "메인라벨", category: "부자재", unit: "EA", qty: 25000, minQty: 10000, location: "부자재창고", lastIn: "2025-01-21", status: "정상" },
];

// 제품 재고 데이터
const productInventory = [
  { id: "P001", style: "ST-A001", name: "린넨 셔츠", brand: "MLB", color: "WHITE", size: "M", qty: 450, availableQty: 420, reserved: 30, warehouse: "본사창고", status: "출하가능" },
  { id: "P002", style: "ST-A001", name: "린넨 셔츠", brand: "MLB", color: "WHITE", size: "L", qty: 120, availableQty: 100, reserved: 20, warehouse: "본사창고", status: "부족" },
  { id: "P003", style: "ST-A002", name: "면 티셔츠", brand: "black yak", color: "PINK", size: "M", qty: 680, availableQty: 680, reserved: 0, warehouse: "본사창고", status: "출하가능" },
  { id: "P004", style: "ST-B003", name: "울 코트", brand: "EIDER", color: "NAVY", size: "S", qty: 0, availableQty: 0, reserved: 0, warehouse: "본사창고", status: "품절" },
  { id: "P005", style: "ST-A003", name: "데님 팬츠", brand: "K2", color: "BLUE", size: "32", qty: 320, availableQty: 280, reserved: 40, warehouse: "외부창고", status: "출하가능" },
];

// 입출고 이력 데이터
const stockMovements = [
  { id: "MV001", date: "2025-01-23", type: "입고", code: "FAB-001", name: "면 100% 원단", qty: 2000, unit: "YD", from: "협력사A", to: "원자재창고-A", order: "PO-2025-0045", status: "완료" },
  { id: "MV002", date: "2025-01-23", type: "출고", code: "ST-A001", name: "린넨 셔츠", qty: 150, unit: "PCS", from: "본사창고", to: "바이어A", order: "SO-2025-0012", status: "완료" },
  { id: "MV003", date: "2025-01-22", type: "이동", code: "FAB-002", name: "폴리에스터 원단", qty: 500, unit: "YD", from: "원자재창고-A", to: "생산라인1", order: "WO-2025-0033", status: "완료" },
  { id: "MV004", date: "2025-01-22", type: "입고", code: "ACC-001", name: "YKK 지퍼 20cm", qty: 5000, unit: "EA", from: "협력사B", to: "부자재창고", order: "PO-2025-0044", status: "검수중" },
  { id: "MV005", date: "2025-01-21", type: "출고", code: "ST-A002", name: "면 티셔츠", qty: 200, unit: "PCS", from: "본사창고", to: "바이어B", order: "SO-2025-0011", status: "완료" },
];

// 생산 연계 재고 데이터
const productionLinkedInventory = [
  { id: "PL001", workOrder: "WO-2025-0033", style: "ST-A001", process: "재단", material: "린넨 원단", reqQty: 1500, issuedQty: 1500, usedQty: 1420, returnQty: 80, status: "진행중" },
  { id: "PL002", workOrder: "WO-2025-0032", style: "ST-A002", process: "봉제", material: "면 원단", reqQty: 2000, issuedQty: 2000, usedQty: 1950, returnQty: 50, status: "완료" },
  { id: "PL003", workOrder: "WO-2025-0034", style: "ST-B003", process: "검품", material: "울 원단", reqQty: 800, issuedQty: 800, usedQty: 780, returnQty: 20, status: "진행중" },
  { id: "PL004", workOrder: "WO-2025-0035", style: "ST-A003", process: "재단", material: "데님 원단", reqQty: 1200, issuedQty: 0, usedQty: 0, returnQty: 0, status: "대기" },
];

// 생산 실적 입고 데이터
const productionOutput = [
  { id: "PO001", date: "2025-01-23", workOrder: "WO-2025-0032", style: "ST-A002", name: "면 티셔츠", planQty: 500, goodQty: 485, defectQty: 15, defectRate: "3.0%", status: "입고완료" },
  { id: "PO002", date: "2025-01-22", workOrder: "WO-2025-0031", style: "ST-A001", name: "린넨 셔츠", planQty: 300, goodQty: 290, defectQty: 10, defectRate: "3.3%", status: "입고완료" },
  { id: "PO003", date: "2025-01-21", workOrder: "WO-2025-0030", style: "ST-B003", name: "울 코트", planQty: 200, goodQty: 195, defectQty: 5, defectRate: "2.5%", status: "입고완료" },
];

const statusColors: Record<string, string> = {
  정상: "bg-primary/10 text-primary",
  부족: "bg-destructive/10 text-destructive",
  과잉: "bg-amber-500/10 text-amber-600",
  품절: "bg-accent text-accent-foreground",
  출하가능: "bg-primary/10 text-primary",
  완료: "bg-primary/10 text-primary",
  진행중: "bg-blue-500/10 text-blue-600",
  대기: "bg-muted text-muted-foreground",
  검수중: "bg-amber-500/10 text-amber-600",
  입고완료: "bg-primary/10 text-primary",
};

export function InventoryView() {
  const [activeTab, setActiveTab] = useState("summary");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="summary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Layers className="h-4 w-4 mr-2" />
            재고 현황 요약
          </TabsTrigger>
          <TabsTrigger value="material" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Box className="h-4 w-4 mr-2" />
            자재 재고
          </TabsTrigger>
          <TabsTrigger value="product" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Package className="h-4 w-4 mr-2" />
            제품 재고
          </TabsTrigger>
          <TabsTrigger value="movement" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            입출고 관리
          </TabsTrigger>
          <TabsTrigger value="production" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Factory className="h-4 w-4 mr-2" />
            생산 연계
          </TabsTrigger>
        </TabsList>

        {/* 재고 현황 요약 */}
        <TabsContent value="summary" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Box className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">자재 재고금액</p>
                    <p className="text-xl font-bold text-foreground">₩{(inventorySummary.totalMaterialValue / 100000000).toFixed(2)}억</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">제품 재고금액</p>
                    <p className="text-xl font-bold text-foreground">₩{(inventorySummary.totalProductValue / 100000000).toFixed(2)}억</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">부족 재고</p>
                    <p className="text-xl font-bold text-destructive">{inventorySummary.shortageItems}건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">과잉 재고</p>
                    <p className="text-xl font-bold text-amber-600">{inventorySummary.excessItems}건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">체화 재고</p>
                    <p className="text-xl font-bold text-foreground">{inventorySummary.overdueItems}건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오더/스타일 기준 재고 잔량 */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-semibold">오더/스타일 기준 재고 잔량</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">오더번호</TableHead>
                      <TableHead className="font-semibold">스타일</TableHead>
                      <TableHead className="font-semibold">품명</TableHead>
                      <TableHead className="font-semibold">컬러</TableHead>
                      <TableHead className="font-semibold text-right">오더수량</TableHead>
                      <TableHead className="font-semibold text-right">생산완료</TableHead>
                      <TableHead className="font-semibold text-right">출하완료</TableHead>
                      <TableHead className="font-semibold text-right">재고잔량</TableHead>
                      <TableHead className="font-semibold">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell className="font-medium text-primary">ORD-2025-0012</TableCell>
                      <TableCell>ST-A001</TableCell>
                      <TableCell>린넨 셔츠</TableCell>
                      <TableCell>WHITE</TableCell>
                      <TableCell className="text-right">1,000</TableCell>
                      <TableCell className="text-right">950</TableCell>
                      <TableCell className="text-right">500</TableCell>
                      <TableCell className="text-right font-medium text-primary">450</TableCell>
                      <TableCell><Badge className={statusColors["출하가능"]}>출하가능</Badge></TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell className="font-medium text-primary">ORD-2025-0011</TableCell>
                      <TableCell>ST-A002</TableCell>
                      <TableCell>면 티셔츠</TableCell>
                      <TableCell>PINK</TableCell>
                      <TableCell className="text-right">800</TableCell>
                      <TableCell className="text-right">800</TableCell>
                      <TableCell className="text-right">120</TableCell>
                      <TableCell className="text-right font-medium text-primary">680</TableCell>
                      <TableCell><Badge className={statusColors["출하가능"]}>출하가능</Badge></TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell className="font-medium text-primary">ORD-2025-0010</TableCell>
                      <TableCell>ST-B003</TableCell>
                      <TableCell>울 코트</TableCell>
                      <TableCell>NAVY</TableCell>
                      <TableCell className="text-right">300</TableCell>
                      <TableCell className="text-right">200</TableCell>
                      <TableCell className="text-right">200</TableCell>
                      <TableCell className="text-right font-medium text-destructive">0</TableCell>
                      <TableCell><Badge className={statusColors["품절"]}>품절</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 과부족/체화 재고 알림 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  과부족 재고 알림
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {materialInventory.filter(m => m.status === "부족" || m.status === "과잉").map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.code} | 현재: {item.qty.toLocaleString()} {item.unit}</p>
                      </div>
                      <Badge className={statusColors[item.status]}>{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  체화 재고 (90일 이상)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">24FW 울 코트</p>
                      <p className="text-sm text-muted-foreground">ST-B001 | 보관일: 120일</p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">150 PCS</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">24SS 린넨 원단</p>
                      <p className="text-sm text-muted-foreground">FAB-024 | 보관일: 95일</p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">2,500 YD</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 자재 재고 관리 */}
        <TabsContent value="material" className="space-y-6 mt-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">자재 재고 관리</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    이력조회
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    재고조정
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="자재코드, 자재명 검색..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="분류" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="fabric">원단</SelectItem>
                    <SelectItem value="acc">부자재</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  필터
                </Button>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">자재코드</TableHead>
                      <TableHead className="font-semibold">자재명</TableHead>
                      <TableHead className="font-semibold">분류</TableHead>
                      <TableHead className="font-semibold">단위</TableHead>
                      <TableHead className="font-semibold text-right">현재고</TableHead>
                      <TableHead className="font-semibold text-right">안전재고</TableHead>
                      <TableHead className="font-semibold">위치</TableHead>
                      <TableHead className="font-semibold">최근입고</TableHead>
                      <TableHead className="font-semibold">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materialInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-primary">{item.code}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-right">{item.qty.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{item.minQty.toLocaleString()}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.lastIn}</TableCell>
                        <TableCell><Badge className={statusColors[item.status]}>{item.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 자재 입출고 이력 */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-semibold">자재 입출고/이동 이력</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">일자</TableHead>
                      <TableHead className="font-semibold">구분</TableHead>
                      <TableHead className="font-semibold">자재코드</TableHead>
                      <TableHead className="font-semibold">자재명</TableHead>
                      <TableHead className="font-semibold text-right">수량</TableHead>
                      <TableHead className="font-semibold">출발지</TableHead>
                      <TableHead className="font-semibold">도착지</TableHead>
                      <TableHead className="font-semibold">관련오더</TableHead>
                      <TableHead className="font-semibold">조정사유</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>2025-01-23</TableCell>
                      <TableCell><Badge className="bg-primary/10 text-primary">입고</Badge></TableCell>
                      <TableCell className="font-medium text-primary">FAB-001</TableCell>
                      <TableCell>면 100% 원단</TableCell>
                      <TableCell className="text-right">+2,000 YD</TableCell>
                      <TableCell>협력사A</TableCell>
                      <TableCell>원자재창고-A</TableCell>
                      <TableCell>PO-2025-0045</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>2025-01-22</TableCell>
                      <TableCell><Badge className="bg-blue-500/10 text-blue-600">이동</Badge></TableCell>
                      <TableCell className="font-medium text-primary">FAB-002</TableCell>
                      <TableCell>폴리에스터 원단</TableCell>
                      <TableCell className="text-right">-500 YD</TableCell>
                      <TableCell>원자재창고-A</TableCell>
                      <TableCell>생산라인1</TableCell>
                      <TableCell>WO-2025-0033</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>2025-01-20</TableCell>
                      <TableCell><Badge className="bg-amber-500/10 text-amber-600">조정</Badge></TableCell>
                      <TableCell className="font-medium text-primary">ACC-002</TableCell>
                      <TableCell>단추 4홀 15mm</TableCell>
                      <TableCell className="text-right">-200 EA</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>실사조정</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 제품 재고 관리 */}
        <TabsContent value="product" className="space-y-6 mt-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">제품 재고 현황</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    제품이동
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                    <ArrowUpFromLine className="h-4 w-4 mr-2" />
                    출하처리
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="스타일, 품명, 컬러 검색..." className="pl-9" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="브랜드" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="mlb">MLB</SelectItem>
                    <SelectItem value="blackyak">black yak</SelectItem>
                    <SelectItem value="eider">EIDER</SelectItem>
                    <SelectItem value="k2">K2</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="창고" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="main">본사창고</SelectItem>
                    <SelectItem value="ext">외부창고</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">스타일</TableHead>
                      <TableHead className="font-semibold">품명</TableHead>
                      <TableHead className="font-semibold">브랜드</TableHead>
                      <TableHead className="font-semibold">컬러</TableHead>
                      <TableHead className="font-semibold">사이즈</TableHead>
                      <TableHead className="font-semibold text-right">총재고</TableHead>
                      <TableHead className="font-semibold text-right">출하가능</TableHead>
                      <TableHead className="font-semibold text-right">예약수량</TableHead>
                      <TableHead className="font-semibold">창고</TableHead>
                      <TableHead className="font-semibold">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-primary">{item.style}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell className="text-right">{item.qty.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-primary font-medium">{item.availableQty.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{item.reserved.toLocaleString()}</TableCell>
                        <TableCell>{item.warehouse}</TableCell>
                        <TableCell><Badge className={statusColors[item.status]}>{item.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 출하 이력 */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-semibold">출하 이력</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">출하일</TableHead>
                      <TableHead className="font-semibold">출하번호</TableHead>
                      <TableHead className="font-semibold">오더번호</TableHead>
                      <TableHead className="font-semibold">스타일</TableHead>
                      <TableHead className="font-semibold">품명</TableHead>
                      <TableHead className="font-semibold text-right">출하수량</TableHead>
                      <TableHead className="font-semibold">배송처</TableHead>
                      <TableHead className="font-semibold">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>2025-01-23</TableCell>
                      <TableCell className="font-medium text-primary">SHP-2025-0088</TableCell>
                      <TableCell>ORD-2025-0012</TableCell>
                      <TableCell>ST-A001</TableCell>
                      <TableCell>린넨 셔츠</TableCell>
                      <TableCell className="text-right">150 PCS</TableCell>
                      <TableCell>바이어A</TableCell>
                      <TableCell><Badge className={statusColors["완료"]}>완료</Badge></TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>2025-01-22</TableCell>
                      <TableCell className="font-medium text-primary">SHP-2025-0087</TableCell>
                      <TableCell>ORD-2025-0011</TableCell>
                      <TableCell>ST-A002</TableCell>
                      <TableCell>면 티셔츠</TableCell>
                      <TableCell className="text-right">200 PCS</TableCell>
                      <TableCell>바이어B</TableCell>
                      <TableCell><Badge className={statusColors["완료"]}>완료</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 입출고 및 재고 이동 관리 */}
        <TabsContent value="movement" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ArrowDownToLine className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">금일 입고</p>
                    <p className="text-xl font-bold text-foreground">12건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <ArrowUpFromLine className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">금일 출고</p>
                    <p className="text-xl font-bold text-foreground">8건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <ArrowLeftRight className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">검수 대기</p>
                    <p className="text-xl font-bold text-amber-600">3건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">입출고/이동 현황</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ArrowDownToLine className="h-4 w-4 mr-2" />
                    입고등록
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowUpFromLine className="h-4 w-4 mr-2" />
                    출고등록
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    이동등록
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">일자</TableHead>
                      <TableHead className="font-semibold">구분</TableHead>
                      <TableHead className="font-semibold">품목코드</TableHead>
                      <TableHead className="font-semibold">품목명</TableHead>
                      <TableHead className="font-semibold text-right">수량</TableHead>
                      <TableHead className="font-semibold">출발지</TableHead>
                      <TableHead className="font-semibold">도착지</TableHead>
                      <TableHead className="font-semibold">관련오더</TableHead>
                      <TableHead className="font-semibold">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <Badge className={
                            item.type === "입고" ? "bg-primary/10 text-primary" :
                            item.type === "출고" ? "bg-blue-500/10 text-blue-600" :
                            "bg-amber-500/10 text-amber-600"
                          }>{item.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium text-primary">{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.qty.toLocaleString()} {item.unit}</TableCell>
                        <TableCell>{item.from}</TableCell>
                        <TableCell>{item.to}</TableCell>
                        <TableCell className="text-primary">{item.order}</TableCell>
                        <TableCell><Badge className={statusColors[item.status]}>{item.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 생산 연계 재고 조회 */}
        <TabsContent value="production" className="space-y-6 mt-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-700">생산 시스템은 구축 범위 제외이며, 조회 및 연계만 수행됩니다.</p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-semibold">생산 투입 자재 조회</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">작업지시</TableHead>
                      <TableHead className="font-semibold">스타일</TableHead>
                      <TableHead className="font-semibold">공정</TableHead>
                      <TableHead className="font-semibold">투입자재</TableHead>
                      <TableHead className="font-semibold text-right">소요량</TableHead>
                      <TableHead className="font-semibold text-right">불출량</TableHead>
                      <TableHead className="font-semibold text-right">사용량</TableHead>
                      <TableHead className="font-semibold text-right">반납량</TableHead>
                      <TableHead className="font-semibold">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productionLinkedInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-primary">{item.workOrder}</TableCell>
                        <TableCell>{item.style}</TableCell>
                        <TableCell>{item.process}</TableCell>
                        <TableCell>{item.material}</TableCell>
                        <TableCell className="text-right">{item.reqQty.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.issuedQty.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.usedQty.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.returnQty.toLocaleString()}</TableCell>
                        <TableCell><Badge className={statusColors[item.status]}>{item.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-semibold">생산 실적 입고 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">입고일</TableHead>
                      <TableHead className="font-semibold">작업지시</TableHead>
                      <TableHead className="font-semibold">스타일</TableHead>
                      <TableHead className="font-semibold">품명</TableHead>
                      <TableHead className="font-semibold text-right">계획수량</TableHead>
                      <TableHead className="font-semibold text-right">양품수량</TableHead>
                      <TableHead className="font-semibold text-right">불량수량</TableHead>
                      <TableHead className="font-semibold text-right">불량률</TableHead>
                      <TableHead className="font-semibold">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productionOutput.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="font-medium text-primary">{item.workOrder}</TableCell>
                        <TableCell>{item.style}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.planQty.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-primary font-medium">{item.goodQty.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-destructive">{item.defectQty.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.defectRate}</TableCell>
                        <TableCell><Badge className={statusColors[item.status]}>{item.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
