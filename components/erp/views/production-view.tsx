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
  Upload,
  FileSpreadsheet,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Calendar,
  Package,
  Scissors,
  Factory as FactoryIcon,
  Ship,
} from "lucide-react";

interface ProductionViewProps {
  subMenu?: string;
}

export function ProductionView({ subMenu = "cutting-report" }: ProductionViewProps) {
  const [activeTab, setActiveTab] = useState(subMenu);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 데이터 상태
  const [cuttingData, setCuttingData] = useState<any[]>([]);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [inspectionData, setInspectionData] = useState<any[]>([]);
  const [shipmentData, setShipmentData] = useState<any[]>([]);
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  // 필터 상태 (재단)
  const [filters, setFilters] = useState({
    라인: "",
    날짜: "",
    브랜드: "",
    품번: "",
    색상: "",
  });

  // 필터 상태 (생산)
  const [productionFilters, setProductionFilters] = useState({
    라인: "",
    브랜드: "",
    스타일: "",
    색상: "",
  });

  // 필터 상태 (완성검사)
  const [inspectionFilters, setInspectionFilters] = useState({
    라인: "",
    브랜드: "",
    색상: "",
  });

  // 필터 상태 (선적)
  const [shipmentFilters, setShipmentFilters] = useState({
    구분: "",
    ETD: "",
    ETA: "",
    브랜드: "",
    도착지: "",
    바이어: "",
  });
  
  // 필터링된 데이터 (재단)
  const filteredCuttingData = cuttingData.filter(item => {
    if (filters.라인 && item.라인 !== filters.라인) return false;
    if (filters.날짜 && !item.날짜.includes(filters.날짜)) return false;
    if (filters.브랜드 && item.브랜드 !== filters.브랜드) return false;
    if (filters.품번 && !item.품번.includes(filters.품번)) return false;
    if (filters.색상 && !item.색상.includes(filters.색상)) return false;
    return true;
  });

  // 필터링된 데이터 (생산)
  const filteredProductionData = productionData.filter(item => {
    if (productionFilters.라인 && item.LINE !== productionFilters.라인) return false;
    if (productionFilters.브랜드 && item.BRAND !== productionFilters.브랜드) return false;
    if (productionFilters.스타일 && !item.STYLE_NO?.includes(productionFilters.스타일)) return false;
    if (productionFilters.색상 && !item.COLOR?.includes(productionFilters.색상)) return false;
    return true;
  });
  
  // 고유 값 추출 (재단)
  const uniqueLines = [...new Set(cuttingData.map(d => d.라인))].filter(Boolean).sort();
  const uniqueBrands = [...new Set(cuttingData.map(d => d.브랜드))].filter(Boolean).sort();

  // 고유 값 추출 (생산)
  const uniqueProductionLines = [...new Set(productionData.map(d => d.LINE))].filter(Boolean).sort();
  const uniqueProductionBrands = [...new Set(productionData.map(d => d.BRAND))].filter(Boolean).sort();

  // 필터링된 데이터 (완성검사)
  const filteredInspectionData = inspectionData.filter(item => {
    if (inspectionFilters.라인 && item.라인?.toString() !== inspectionFilters.라인) return false;
    if (inspectionFilters.브랜드 && item.브랜드 !== inspectionFilters.브랜드) return false;
    if (inspectionFilters.색상 && !item.컬러?.includes(inspectionFilters.색상)) return false;
    return true;
  });

  // 필터링된 데이터 (선적)
  const filteredShipmentData = shipmentData.filter(item => {
    if (shipmentFilters.구분 && item.구분 !== shipmentFilters.구분) return false;
    if (shipmentFilters.ETD && !item['ETD         출발일']?.includes(shipmentFilters.ETD)) return false;
    if (shipmentFilters.ETA && !item['ETA                도착예정일']?.includes(shipmentFilters.ETA)) return false;
    if (shipmentFilters.브랜드 && item.BRAND !== shipmentFilters.브랜드) return false;
    if (shipmentFilters.도착지 && !item['DEST            도착지']?.includes(shipmentFilters.도착지)) return false;
    if (shipmentFilters.바이어 && !item.BUYER?.includes(shipmentFilters.바이어)) return false;
    return true;
  });

  // 고유 값 추출 (완성검사)
  const uniqueInspectionLines = [...new Set(inspectionData.map(d => d.라인?.toString()))].filter(Boolean).sort();
  const uniqueInspectionBrands = [...new Set(inspectionData.map(d => d.브랜드))].filter(Boolean).sort();

  // 고유 값 추출 (선적)
  const uniqueShipmentBrands = [...new Set(shipmentData.map(d => d.BRAND))].filter(Boolean).sort();
  const uniqueDestinations = [...new Set(shipmentData.map(d => d['DEST            도착지']))].filter(Boolean).sort();
  const uniqueShipment구분 = [...new Set(shipmentData.map(d => d.구분))].filter(Boolean).sort();
  
  // 엑셀 날짜 시리얼 넘버를 실제 날짜로 변환
  const excelDateToJSDate = (serial: any): string => {
    if (!serial || serial === 'ok' || isNaN(Number(serial))) return '-';
    const utc_days = Math.floor(Number(serial) - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const year = date_info.getFullYear();
    const month = String(date_info.getMonth() + 1).padStart(2, '0');
    const day = String(date_info.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 색상 이름을 실제 색상 코드로 변환
  const getColorCode = (colorName: string): { bg: string; text: string; border: string } => {
    const name = colorName?.toUpperCase() || "";
    
    if (name.includes("BLACK") || name.includes("BLK")) 
      return { bg: "bg-black", text: "text-white", border: "border-gray-700" };
    if (name.includes("WHITE")) 
      return { bg: "bg-white", text: "text-gray-900", border: "border-gray-300" };
    if (name.includes("NAVY") || name.includes("D/NAVY")) 
      return { bg: "bg-blue-900", text: "text-white", border: "border-blue-800" };
    if (name.includes("BLUE") || name.includes("SKY")) 
      return { bg: "bg-blue-500", text: "text-white", border: "border-blue-600" };
    if (name.includes("RED")) 
      return { bg: "bg-red-600", text: "text-white", border: "border-red-700" };
    if (name.includes("BEIGE") || name.includes("SAND")) 
      return { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-200" };
    if (name.includes("GREY") || name.includes("GRAY") || name.includes("GRI")) 
      return { bg: "bg-gray-500", text: "text-white", border: "border-gray-600" };
    if (name.includes("KHAKI")) 
      return { bg: "bg-yellow-700", text: "text-white", border: "border-yellow-800" };
    if (name.includes("BROWN")) 
      return { bg: "bg-amber-800", text: "text-white", border: "border-amber-900" };
    if (name.includes("GREEN")) 
      return { bg: "bg-green-600", text: "text-white", border: "border-green-700" };
    if (name.includes("ORANGE")) 
      return { bg: "bg-orange-500", text: "text-white", border: "border-orange-600" };
    if (name.includes("PINK")) 
      return { bg: "bg-pink-400", text: "text-white", border: "border-pink-500" };
    if (name.includes("IVORY") || name.includes("IOVRY")) 
      return { bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-200" };
    if (name.includes("MINT")) 
      return { bg: "bg-teal-300", text: "text-teal-900", border: "border-teal-400" };
    if (name.includes("CAMEL")) 
      return { bg: "bg-yellow-600", text: "text-white", border: "border-yellow-700" };
    if (name.includes("DENIM") || name.includes("INDIGO")) 
      return { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-700" };
    if (name.includes("TAUPE")) 
      return { bg: "bg-stone-500", text: "text-white", border: "border-stone-600" };
    if (name.includes("SLATE") || name.includes("SLEET") || name.includes("STEEL")) 
      return { bg: "bg-slate-500", text: "text-white", border: "border-slate-600" };
    if (name.includes("ASPHALT")) 
      return { bg: "bg-gray-700", text: "text-white", border: "border-gray-800" };
    if (name.includes("ASH")) 
      return { bg: "bg-gray-400", text: "text-gray-900", border: "border-gray-500" };
    
    // 기본값
    return { bg: "bg-cyan-100", text: "text-cyan-900", border: "border-cyan-200" };
  };
  
  // subMenu prop 변경 시 activeTab 동기화
  useEffect(() => {
    setActiveTab(subMenu);
  }, [subMenu]);
  
  // 재단 데이터 로드
  const loadCuttingData = async (file?: File) => {
    try {
      setIsLoading(true);
      setLoadingMessage("엑셀 파일 읽는 중...");
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingMessage("데이터 분석 중...");
      const response = await fetch('/data/재단.json');
      const text = await response.text();
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // NaN을 null로 변환하여 JSON 파싱 가능하게 만들기
      const fixedText = text.replace(/:\s*NaN/g, ': null');
      const rawData = JSON.parse(fixedText);
      
      setLoadingMessage("데이터 처리 중...");
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // 데이터 정제
      const cleanedData = rawData
        .filter((item: any) => item.브랜드 && item.품번) // 유효한 데이터만
        .map((item: any) => ({
          ...item,
          금일재단량: item["금일 재단량"] || 0,
          총재단량: item["총 재단량"] || 0,
          오더량: item.오더량 || 0,
          재단과부족: item["재단 과부족"] || 0,
          재공량: item.재공량 || 0,
        }));
      
      setCuttingData(cleanedData);
      
      // 재단 리포트 탭으로 이동
      setActiveTab('cutting-report');
      
      // URL 변경하여 사이드바도 업데이트
      window.history.pushState({}, '', '/?menu=cutting-report');
      window.dispatchEvent(new PopStateEvent('popstate'));
      
      setIsLoading(false);
      alert(`✅ 재단 데이터 ${cleanedData.length}건이 업로드되었습니다!`);
    } catch (error) {
      console.error('재단 데이터 로드 실패:', error);
      setIsLoading(false);
      alert('❌ 데이터 로드에 실패했습니다.');
    }
  };
  
  // 생산 데이터 로드
  const loadProductionData = async (file?: File) => {
    try {
      setIsLoading(true);
      setLoadingMessage("엑셀 파일 읽는 중...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingMessage("데이터 분석 중...");
      const response = await fetch('/data/생산.json');
      const text = await response.text();
      const fixedText = text.replace(/:\s*NaN/g, ': null');
      const data = JSON.parse(fixedText);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setProductionData(data);
      
      // 생산 리포트 탭으로 이동
      setActiveTab('production-report');
      
      window.history.pushState({}, '', '/?menu=production-report');
      window.dispatchEvent(new PopStateEvent('popstate'));
      
      setIsLoading(false);
      alert(`✅ 생산 데이터 ${data.length}건이 업로드되었습니다!`);
    } catch (error) {
      console.error('생산 데이터 로드 실패:', error);
      setIsLoading(false);
      alert('❌ 데이터 로드에 실패했습니다.');
    }
  };
  
  // 완성검사 데이터 로드
  const loadInspectionData = async (file?: File) => {
    try {
      setIsLoading(true);
      setLoadingMessage("엑셀 파일 읽는 중...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingMessage("데이터 분석 중...");
      const response = await fetch('/data/완성검사.json');
      const text = await response.text();
      const fixedText = text.replace(/:\s*NaN/g, ': null');
      const data = JSON.parse(fixedText);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setInspectionData(data);
      
      // 완성검사 리포트 탭으로 이동
      setActiveTab('inspection-report');
      
      window.history.pushState({}, '', '/?menu=inspection-report');
      window.dispatchEvent(new PopStateEvent('popstate'));
      
      setIsLoading(false);
      alert(`✅ 완성검사 데이터 ${data.length}건이 업로드되었습니다!`);
    } catch (error) {
      console.error('완성검사 데이터 로드 실패:', error);
      setIsLoading(false);
      alert('❌ 데이터 로드에 실패했습니다.');
    }
  };
  
  // 선적 데이터 로드
  const loadShipmentData = async (file?: File) => {
    try {
      setIsLoading(true);
      setLoadingMessage("엑셀 파일 읽는 중...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingMessage("데이터 분석 중...");
      const response = await fetch('/data/선적.json');
      const text = await response.text();
      const fixedText = text.replace(/:\s*NaN/g, ': null');
      const data = JSON.parse(fixedText);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setShipmentData(data);
      
      // 선적 스케쥴 탭으로 이동
      setActiveTab('shipment-schedule');
      
      window.history.pushState({}, '', '/?menu=shipment-schedule');
      window.dispatchEvent(new PopStateEvent('popstate'));
      
      setIsLoading(false);
      alert(`✅ 선적 스케쥴 데이터 ${data.length}건이 업로드되었습니다!`);
    } catch (error) {
      console.error('선적 데이터 로드 실패:', error);
      setIsLoading(false);
      alert('❌ 데이터 로드에 실패했습니다.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted border border-border flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="cutting-report" className="text-xs">
            <Scissors className="h-3 w-3 mr-1" />
            재단 리포트
          </TabsTrigger>
          <TabsTrigger value="production-report" className="text-xs">
            <FactoryIcon className="h-3 w-3 mr-1" />
            생산 리포트
          </TabsTrigger>
          <TabsTrigger value="inspection-report" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            완성검사 리포트
          </TabsTrigger>
          <TabsTrigger value="shipment-schedule" className="text-xs">
            <Ship className="h-3 w-3 mr-1" />
            선적 스케쥴
          </TabsTrigger>
          <TabsTrigger value="cutting-input" className="text-xs">
            <Upload className="h-3 w-3 mr-1" />
            재단 정보 입력
          </TabsTrigger>
          <TabsTrigger value="production-input" className="text-xs">
            <Upload className="h-3 w-3 mr-1" />
            생산 정보 입력
          </TabsTrigger>
          <TabsTrigger value="inspection-input" className="text-xs">
            <Upload className="h-3 w-3 mr-1" />
            완성검사 입력
          </TabsTrigger>
          <TabsTrigger value="shipment-input" className="text-xs">
            <Upload className="h-3 w-3 mr-1" />
            선적 스케쥴 입력
          </TabsTrigger>
        </TabsList>

        {/* ============ 재단 리포트 ============ */}
        <TabsContent value="cutting-report" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                재단 리포트
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {cuttingData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Scissors className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">재단 데이터가 없습니다</p>
                  <p className="text-sm">재단 정보 입력 탭에서 데이터를 업로드하세요</p>
                  </div>
              ) : (
                <div className="space-y-6">
                  {/* 요약 통계 카드 */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">총 라인</div>
                        <div className="text-3xl font-bold">{uniqueLines.length}개</div>
                  </div>
                      <Scissors className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">총 오더량</div>
                        <div className="text-3xl font-bold">{filteredCuttingData.reduce((sum, d) => sum + (d.오더량 || 0), 0).toLocaleString()}</div>
                  </div>
                      <Package className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                  </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">총 재단량</div>
                        <div className="text-3xl font-bold">{filteredCuttingData.reduce((sum, d) => sum + (d.총재단량 || 0), 0).toLocaleString()}</div>
                </div>
                      <CheckCircle className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                  </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">재공량</div>
                        <div className="text-3xl font-bold">{filteredCuttingData.reduce((sum, d) => sum + (d.재공량 || 0), 0).toLocaleString()}</div>
                      </div>
                      <FactoryIcon className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                    </div>
                  </div>

                  {/* 필터 영역 */}
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <div className="grid grid-cols-5 gap-3">
                  <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">라인</label>
                        <select
                          value={filters.라인}
                          onChange={(e) => setFilters({...filters, 라인: e.target.value})}
                          className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                        >
                          <option value="">전체</option>
                          {uniqueLines.map(line => (
                            <option key={line} value={line}>{line}</option>
                          ))}
                        </select>
                  </div>
                  <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">날짜</label>
                        <input
                          type="text"
                          placeholder="YYYY-MM-DD"
                          value={filters.날짜}
                          onChange={(e) => setFilters({...filters, 날짜: e.target.value})}
                          className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                        />
                </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">브랜드</label>
                        <select
                          value={filters.브랜드}
                          onChange={(e) => setFilters({...filters, 브랜드: e.target.value})}
                          className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                        >
                          <option value="">전체</option>
                          {uniqueBrands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                  </div>
                  <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">품번</label>
                        <input
                          type="text"
                          placeholder="검색..."
                          value={filters.품번}
                          onChange={(e) => setFilters({...filters, 품번: e.target.value})}
                          className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                        />
                  </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">색상</label>
                        <input
                          type="text"
                          placeholder="검색..."
                          value={filters.색상}
                          onChange={(e) => setFilters({...filters, 색상: e.target.value})}
                          className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                        />
                </div>
          </div>
                    {(filters.라인 || filters.날짜 || filters.브랜드 || filters.품번 || filters.색상) && (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {filteredCuttingData.length}개 항목 표시 중
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFilters({라인: "", 날짜: "", 브랜드: "", 품번: "", 색상: ""})}
                          className="h-7 text-xs"
                        >
                          필터 초기화
                  </Button>
                </div>
                    )}
              </div>

                  {/* 데이터 테이블 */}
                  <div className="rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b-2 border-border">
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">라인</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-32">날짜</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-40">브랜드</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-48">품번</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-32">색상</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-28">오더량</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-28">금일재단</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-28">총재단량</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-28">과부족</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-28">재공량</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 min-w-48">비고</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {/* 총계 행 */}
                          <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 font-bold border-b-2 border-blue-200 dark:border-blue-800">
                            <td className="py-4 px-6 text-center" colSpan={5}>
                              <div className="flex items-center justify-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-600 text-white text-xs font-bold">총계</span>
                                <span className="text-sm text-blue-900 dark:text-blue-100">
                                  {filteredCuttingData.length}개 항목
                                </span>
                </div>
                            </td>
                            <td className="py-4 px-6 text-center text-base text-blue-900 dark:text-blue-100">
                              {filteredCuttingData.reduce((sum, d) => sum + (d.오더량 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-blue-600 dark:text-blue-400">
                              {filteredCuttingData.reduce((sum, d) => sum + (d.금일재단량 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-blue-900 dark:text-blue-100">
                              {filteredCuttingData.reduce((sum, d) => sum + (d.총재단량 || 0), 0).toLocaleString()}
                            </td>
                            <td className={`py-4 px-6 text-center text-base font-bold ${
                              filteredCuttingData.reduce((sum, d) => sum + (d.재단과부족 || 0), 0) >= 0 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {filteredCuttingData.reduce((sum, d) => sum + (d.재단과부족 || 0), 0) > 0 ? '+' : ''}
                              {filteredCuttingData.reduce((sum, d) => sum + (d.재단과부족 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-orange-600 dark:text-orange-400">
                              {filteredCuttingData.reduce((sum, d) => sum + (d.재공량 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6"></td>
                          </tr>
                          
                          {/* 데이터 행 */}
                          {filteredCuttingData.slice(0, 100).map((item, idx) => {
                            const colorStyle = getColorCode(item.색상);
                            return (
                              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="py-3 px-6 text-center">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs font-semibold">
                                    {item.라인}
                                  </span>
                                </td>
                                <td className="py-3 px-6 text-center text-xs text-slate-600 dark:text-slate-400 font-mono">{item.날짜}</td>
                                <td className="py-3 px-6 text-center">
                                  <div className="font-semibold text-sm">{item.브랜드}</div>
                                </td>
                                <td className="py-3 px-6 text-center font-mono text-xs text-slate-700 dark:text-slate-300">{item.품번}</td>
                                <td className="py-3 px-6 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className={`w-6 h-6 rounded border-2 ${colorStyle.border} ${colorStyle.bg} shadow-sm`}></div>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md border ${colorStyle.border} ${colorStyle.bg} ${colorStyle.text} text-xs font-medium shadow-sm`}>
                                      {item.색상}
                                    </span>
                          </div>
                                </td>
                                <td className="py-3 px-6 text-center font-semibold tabular-nums">{(item.오더량 || 0).toLocaleString()}</td>
                                <td className="py-3 px-6 text-center text-blue-600 dark:text-blue-400 font-bold tabular-nums">
                                  {item.금일재단량 > 0 ? item.금일재단량.toLocaleString() : '-'}
                                </td>
                                <td className="py-3 px-6 text-center font-bold tabular-nums">{(item.총재단량 || 0).toLocaleString()}</td>
                                <td className={`py-3 px-6 text-center font-bold tabular-nums ${
                                  item.재단과부족 >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {item.재단과부족 > 0 ? '+' : ''}{(item.재단과부족 || 0).toLocaleString()}
                                </td>
                                <td className="py-3 px-6 text-center font-semibold text-orange-600 dark:text-orange-400 tabular-nums">
                                  {(item.재공량 || 0).toLocaleString()}
                                </td>
                                <td className="py-3 px-6 text-center">
                                  {item.비고 ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                                        <span className="text-[10px] text-amber-600 dark:text-amber-400">!</span>
                                      </span>
                                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight">{item.비고}</span>
                          </div>
                                  ) : (
                                    <span className="text-xs text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
              </div>
                  </div>
                  
                  {filteredCuttingData.length > 100 && (
                    <div className="text-center py-3 px-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground">
                        상위 100개 항목만 표시됩니다 <span className="font-semibold">(전체: {filteredCuttingData.length}개)</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 생산 리포트 ============ */}
        <TabsContent value="production-report" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FactoryIcon className="h-5 w-5" />
                생산 리포트
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {productionData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FactoryIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">생산 데이터가 없습니다</p>
                  <p className="text-sm">생산 정보 입력 탭에서 데이터를 업로드하세요</p>
                        </div>
              ) : (
                <div className="space-y-6">
                  {/* 필터 섹션 */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">라인</label>
                      <select
                        value={productionFilters.라인}
                        onChange={(e) => setProductionFilters({...productionFilters, 라인: e.target.value})}
                        className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                      >
                        <option value="">전체</option>
                        {uniqueProductionLines.map(line => (
                          <option key={line} value={line}>{line}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">브랜드</label>
                      <select
                        value={productionFilters.브랜드}
                        onChange={(e) => setProductionFilters({...productionFilters, 브랜드: e.target.value})}
                        className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                      >
                        <option value="">전체</option>
                        {uniqueProductionBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">스타일</label>
                      <Input
                        type="text"
                        placeholder="스타일 검색..."
                        value={productionFilters.스타일}
                        onChange={(e) => setProductionFilters({...productionFilters, 스타일: e.target.value})}
                        className="h-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">색상</label>
                      <Input
                        type="text"
                        placeholder="색상 검색..."
                        value={productionFilters.색상}
                        onChange={(e) => setProductionFilters({...productionFilters, 색상: e.target.value})}
                        className="h-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* 요약 통계 카드 */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">총 라인</div>
                        <div className="text-3xl font-bold">{[...new Set(filteredProductionData.map(d => d.LINE))].filter(Boolean).length}개</div>
                    </div>
                      <FactoryIcon className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                      </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">총 오더량</div>
                        <div className="text-3xl font-bold">{filteredProductionData.reduce((sum, d) => sum + (d.ORDER || 0), 0).toLocaleString()}</div>
                    </div>
                      <Package className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                  </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">재단수량</div>
                        <div className="text-3xl font-bold">{filteredProductionData.reduce((sum, d) => sum + (d.재단수량 || 0), 0).toLocaleString()}</div>
              </div>
                      <Scissors className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                    </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">투입누계</div>
                        <div className="text-3xl font-bold">{filteredProductionData.reduce((sum, d) => sum + (d.INPUT_누계 || 0), 0).toLocaleString()}</div>
                      </div>
                      <CheckCircle className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                    </div>
                  </div>

                  {/* 데이터 테이블 */}
                  <div className="rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b-2 border-border">
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-20">라인</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-40">브랜드</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-48">스타일</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-28">색상</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">오더량</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">재단수량</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">투입누계</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">앞판누계</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">뒷판누계</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 min-w-32">비고</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {/* 총계 행 */}
                          <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 font-bold border-b-2 border-blue-200 dark:border-blue-800">
                            <td className="py-4 px-6 text-center" colSpan={4}>
                              <div className="flex items-center justify-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-600 text-white text-xs font-bold">총계</span>
                                <span className="text-sm text-blue-900 dark:text-blue-100">
                                  {filteredProductionData.length}개 항목
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center text-base text-blue-900 dark:text-blue-100">
                              {filteredProductionData.reduce((sum, d) => sum + (d.ORDER || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-blue-900 dark:text-blue-100">
                              {filteredProductionData.reduce((sum, d) => sum + (d.재단수량 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-teal-600 dark:text-teal-400">
                              {filteredProductionData.reduce((sum, d) => sum + (d.INPUT_누계 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-indigo-600 dark:text-indigo-400">
                              {filteredProductionData.reduce((sum, d) => sum + (d.앞판_누계 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-indigo-600 dark:text-indigo-400">
                              {filteredProductionData.reduce((sum, d) => sum + (d.뒷판_누계 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6"></td>
                          </tr>
                          
                          {/* 데이터 행 */}
                          {filteredProductionData.slice(0, 100).map((item, idx) => {
                            const colorStyle = getColorCode(item.COLOR);
                            return (
                              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="py-3 px-6 text-center">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs font-semibold">
                                    {item.LINE}
                                  </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                  <div className="font-semibold text-sm">{item.BRAND}</div>
                                </td>
                                <td className="py-3 px-6 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                                  {item.STYLE_NO?.replace(/\n/g, ' ')}
                                </td>
                                <td className="py-3 px-6 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className={`w-6 h-6 rounded border-2 ${colorStyle.border} ${colorStyle.bg} shadow-sm`}></div>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md border ${colorStyle.border} ${colorStyle.bg} ${colorStyle.text} text-xs font-medium shadow-sm`}>
                                      {item.COLOR}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-6 text-center font-semibold tabular-nums">{(item.ORDER || 0).toLocaleString()}</td>
                                <td className="py-3 px-6 text-center font-semibold tabular-nums">{(item.재단수량 || 0).toLocaleString()}</td>
                                <td className="py-3 px-6 text-center text-teal-600 dark:text-teal-400 font-bold tabular-nums">
                                  {item.INPUT_누계 > 0 ? item.INPUT_누계.toLocaleString() : '-'}
                                </td>
                                <td className="py-3 px-6 text-center text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
                                  {item.앞판_누계 > 0 ? item.앞판_누계.toLocaleString() : '-'}
                                </td>
                                <td className="py-3 px-6 text-center text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
                                  {item.뒷판_누계 > 0 ? item.뒷판_누계.toLocaleString() : '-'}
                                </td>
                                <td className="py-3 px-6 text-center">
                                  {item.NOTE ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                                        <span className="text-[10px] text-amber-600 dark:text-amber-400">!</span>
                                      </span>
                                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight">{item.NOTE}</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {filteredProductionData.length > 100 && (
                    <div className="text-center py-3 px-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground">
                        상위 100개 항목만 표시됩니다 <span className="font-semibold">(전체: {filteredProductionData.length}개)</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 완성검사 리포트 ============ */}
        <TabsContent value="inspection-report" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                완성검사 리포트
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {inspectionData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">완성검사 데이터가 없습니다</p>
                  <p className="text-sm">완성검사 입력 탭에서 데이터를 업로드하세요</p>
          </div>
              ) : (
                <div className="space-y-6">
                  {/* 필터 섹션 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">라인</label>
                      <select
                        value={inspectionFilters.라인}
                        onChange={(e) => setInspectionFilters({...inspectionFilters, 라인: e.target.value})}
                        className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                      >
                        <option value="">전체</option>
                        {uniqueInspectionLines.map(line => (
                          <option key={line} value={line}>{line}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">브랜드</label>
                      <select
                        value={inspectionFilters.브랜드}
                        onChange={(e) => setInspectionFilters({...inspectionFilters, 브랜드: e.target.value})}
                        className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                      >
                        <option value="">전체</option>
                        {uniqueInspectionBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">색상</label>
                      <Input
                        type="text"
                        placeholder="색상 검색..."
                        value={inspectionFilters.색상}
                        onChange={(e) => setInspectionFilters({...inspectionFilters, 색상: e.target.value})}
                        className="h-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* 요약 통계 카드 */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">총 품목</div>
                        <div className="text-3xl font-bold">{filteredInspectionData.length}</div>
                      </div>
                      <Package className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                    </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">검사완료</div>
                        <div className="text-3xl font-bold">{filteredInspectionData.reduce((sum, d) => sum + (d.검사1_누계 || 0), 0).toLocaleString()}</div>
                      </div>
                      <CheckCircle className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                    </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">포장완료</div>
                        <div className="text-3xl font-bold">{filteredInspectionData.reduce((sum, d) => sum + (d.포장_누계 || 0), 0).toLocaleString()}</div>
                      </div>
                      <Package className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                    </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">수출누계</div>
                        <div className="text-3xl font-bold">{filteredInspectionData.reduce((sum, d) => sum + (d.수출_누계 || 0), 0).toLocaleString()}</div>
                      </div>
                      <Ship className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                    </div>
                  </div>

                  {/* 데이터 테이블 */}
                  <div className="rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b-2 border-border">
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-20">라인</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-32">브랜드</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-48">스타일</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-28">색상</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">오더수량</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">인계누계</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">검사누계</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">포장누계</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">수출누계</th>
                            <th className="text-center py-4 px-6 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 min-w-32">비고</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {/* 총계 행 */}
                          <tr className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 font-bold border-b-2 border-green-200 dark:border-green-800">
                            <td className="py-4 px-6 text-center" colSpan={4}>
                              <div className="flex items-center justify-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-600 text-white text-xs font-bold">총계</span>
                                <span className="text-sm text-green-900 dark:text-green-100">
                                  {filteredInspectionData.length}개 항목
                          </span>
              </div>
                            </td>
                            <td className="py-4 px-6 text-center text-base text-green-900 dark:text-green-100">
                              {filteredInspectionData.reduce((sum, d) => sum + (d.오더수량 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-indigo-600 dark:text-indigo-400">
                              {filteredInspectionData.reduce((sum, d) => sum + (d.인계_누계 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-blue-600 dark:text-blue-400">
                              {filteredInspectionData.reduce((sum, d) => sum + (d.검사1_누계 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-purple-600 dark:text-purple-400">
                              {filteredInspectionData.reduce((sum, d) => sum + (d.포장_누계 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-center text-base text-emerald-600 dark:text-emerald-400">
                              {filteredInspectionData.reduce((sum, d) => sum + (d.수출_누계 || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6"></td>
                          </tr>
                          
                          {/* 데이터 행 */}
                          {filteredInspectionData.slice(0, 100).map((item, idx) => {
                            const colorStyle = getColorCode(item.컬러);
                            return (
                              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="py-3 px-6 text-center">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs font-semibold">
                                    {item.라인}
                                  </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                  <div className="font-semibold text-sm">{item.브랜드}</div>
                                </td>
                                <td className="py-3 px-6 text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                                  {item.스타일번호?.replace(/\n/g, ' ')}
                                </td>
                                <td className="py-3 px-6 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className={`w-6 h-6 rounded border-2 ${colorStyle.border} ${colorStyle.bg} shadow-sm`}></div>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md border ${colorStyle.border} ${colorStyle.bg} ${colorStyle.text} text-xs font-medium shadow-sm`}>
                                      {item.컬러}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-6 text-center font-semibold tabular-nums">{(item.오더수량 || 0).toLocaleString()}</td>
                                <td className="py-3 px-6 text-center text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
                                  {item.인계_누계 > 0 ? item.인계_누계.toLocaleString() : '-'}
                                </td>
                                <td className="py-3 px-6 text-center text-blue-600 dark:text-blue-400 font-bold tabular-nums">
                                  {item.검사1_누계 > 0 ? item.검사1_누계.toLocaleString() : '-'}
                                </td>
                                <td className="py-3 px-6 text-center text-purple-600 dark:text-purple-400 font-semibold tabular-nums">
                                  {item.포장_누계 > 0 ? item.포장_누계.toLocaleString() : '-'}
                                </td>
                                <td className="py-3 px-6 text-center text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                                  {item.수출_누계 > 0 ? item.수출_누계.toLocaleString() : '-'}
                                </td>
                                <td className="py-3 px-6 text-center">
                                  {item.비고 ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                                        <span className="text-[10px] text-amber-600 dark:text-amber-400">!</span>
                                      </span>
                                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight">{item.비고}</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {filteredInspectionData.length > 100 && (
                    <div className="text-center py-3 px-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground">
                        상위 100개 항목만 표시됩니다 <span className="font-semibold">(전체: {filteredInspectionData.length}개)</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 선적 스케쥴 ============ */}
        <TabsContent value="shipment-schedule" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5" />
                선적 스케쥴
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {shipmentData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Ship className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">선적 스케쥴 데이터가 없습니다</p>
                  <p className="text-sm">선적 스케쥴 입력 탭에서 데이터를 업로드하세요</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 필터 섹션 */}
                  <div className="grid grid-cols-6 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">구분</label>
                      <select
                        value={shipmentFilters.구분}
                        onChange={(e) => setShipmentFilters({...shipmentFilters, 구분: e.target.value})}
                        className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                      >
                        <option value="">전체</option>
                        {uniqueShipment구분.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">ETD</label>
                      <Input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={shipmentFilters.ETD}
                        onChange={(e) => setShipmentFilters({...shipmentFilters, ETD: e.target.value})}
                        className="h-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">ETA</label>
                      <Input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={shipmentFilters.ETA}
                        onChange={(e) => setShipmentFilters({...shipmentFilters, ETA: e.target.value})}
                        className="h-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">브랜드</label>
                      <select
                        value={shipmentFilters.브랜드}
                        onChange={(e) => setShipmentFilters({...shipmentFilters, 브랜드: e.target.value})}
                        className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                      >
                        <option value="">전체</option>
                        {uniqueShipmentBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">도착지</label>
                      <select
                        value={shipmentFilters.도착지}
                        onChange={(e) => setShipmentFilters({...shipmentFilters, 도착지: e.target.value})}
                        className="w-full h-10 text-sm rounded-md border border-input bg-background px-3"
                      >
                        <option value="">전체</option>
                        {uniqueDestinations.map(dest => (
                          <option key={dest} value={dest}>{dest}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">바이어</label>
                      <Input
                        type="text"
                        placeholder="바이어 검색..."
                        value={shipmentFilters.바이어}
                        onChange={(e) => setShipmentFilters({...shipmentFilters, 바이어: e.target.value})}
                        className="h-10 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* 요약 통계 카드 */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">총 건수</div>
                        <div className="text-3xl font-bold">{filteredShipmentData.length}</div>
                      </div>
                      <Ship className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                    </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">총 오더수량</div>
                        <div className="text-3xl font-bold">{filteredShipmentData.reduce((sum, d) => sum + (d['ODR Qty        오다수량'] || 0), 0).toLocaleString()}</div>
                      </div>
                      <Package className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                    </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">브랜드 수</div>
                        <div className="text-3xl font-bold">{[...new Set(filteredShipmentData.map(d => d.BRAND))].filter(Boolean).length}</div>
                      </div>
                      <CheckCircle className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
                    </div>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 text-white shadow-lg">
                      <div className="relative z-10">
                        <div className="text-sm font-medium opacity-90 mb-1">도착지 수</div>
                        <div className="text-3xl font-bold">{[...new Set(filteredShipmentData.map(d => d['DEST            도착지']))].filter(Boolean).length}</div>
                      </div>
                      <Calendar className="absolute -right-2 -bottom-2 h-20 w-20 opacity-20" />
            </div>
          </div>

                  {/* 데이터 테이블 */}
                  <div className="rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b-2 border-border">
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-20">구분</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">ETD</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">ETA</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-20">바이어</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">브랜드</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-28">S/No</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-16">라인</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">오더수량</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">도착지</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-16">MODE</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">납기</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">커팅리포트</th>
                            <th className="text-center py-4 px-4 font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 w-24">파이널리포트</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {/* 총계 행 */}
                          <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 font-bold border-b-2 border-blue-200 dark:border-blue-800">
                            <td className="py-4 px-4 text-center" colSpan={7}>
                              <div className="flex items-center justify-center gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-600 text-white text-xs font-bold">총계</span>
                                <span className="text-sm text-blue-900 dark:text-blue-100">
                                  {filteredShipmentData.length}개 항목
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center text-base text-blue-900 dark:text-blue-100">
                              {filteredShipmentData.reduce((sum, d) => sum + (d['ODR Qty        오다수량'] || 0), 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-4" colSpan={5}></td>
                          </tr>
                          
                          {/* 데이터 행 */}
                          {filteredShipmentData.slice(0, 100).map((item, idx) => {
                            const is본공장 = item.구분 === '본공장';
                            return (
                              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="py-3 px-4 text-center">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                                    is본공장 
                                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                  }`}>
                                    {item.구분}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                                    {item['ETD         출발일']}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="font-mono text-xs font-semibold text-green-600 dark:text-green-400">
                                    {item['ETA                도착예정일']}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center text-xs font-medium">{item.BUYER}</td>
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                    {item.BRAND}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center font-mono text-xs text-slate-700 dark:text-slate-300">{item['S/No']}</td>
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs font-semibold">
                                    {item['FTY/LINE']}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center font-bold tabular-nums text-cyan-600 dark:text-cyan-400">
                                  {(item['ODR Qty        오다수량'] || 0).toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-center text-xs font-medium">{item['DEST            도착지']}</td>
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                                    {item.MODE}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center font-mono text-xs text-orange-600 dark:text-orange-400 font-semibold">
                                  {item["D'LY      도착납기"]}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="font-mono text-xs">
                                    {excelDateToJSDate(item['Sent Cutting Report'])}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="font-mono text-xs">
                                    {excelDateToJSDate(item['Sent Final Report'])}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {filteredShipmentData.length > 100 && (
                    <div className="text-center py-3 px-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground">
                        상위 100개 항목만 표시됩니다 <span className="font-semibold">(전체: {filteredShipmentData.length}개)</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 재단 정보 입력 ============ */}
        <TabsContent value="cutting-input" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                재단 정보 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="border-2 border-border rounded-lg p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{loadingMessage}</h3>
                      <p className="text-sm text-muted-foreground">잠시만 기다려주세요...</p>
                      </div>
                      </div>
                    </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">엑셀 파일 업로드</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    공장에서 작성한 재단 정보 엑셀 파일을 업로드하세요
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        loadCuttingData(file);
                      }
                    }}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary text-primary-foreground"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    파일 선택
                  </Button>
                              </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  업로드 안내
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>엑셀 파일 형식(.xlsx, .xls)만 지원됩니다</li>
                  <li>업로드 즉시 데이터가 실시간으로 반영됩니다</li>
                  <li>재단 리포트 탭에서 업로드된 데이터를 확인할 수 있습니다</li>
                </ul>
                              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 생산 정보 입력 ============ */}
        <TabsContent value="production-input" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                생산 정보 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="border-2 border-border rounded-lg p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{loadingMessage}</h3>
                      <p className="text-sm text-muted-foreground">잠시만 기다려주세요...</p>
                                          </div>
                  </div>
          </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">엑셀 파일 업로드</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    공장에서 작성한 생산 정보 엑셀 파일을 업로드하세요
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    id="production-file-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        loadProductionData(file);
                      }
                    }}
                  />
                  <Button
                    onClick={() => document.getElementById('production-file-input')?.click()}
                    className="bg-primary text-primary-foreground"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    파일 선택
                  </Button>
                              </div>
                            )}

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  업로드 안내
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>엑셀 파일 형식(.xlsx, .xls)만 지원됩니다</li>
                  <li>업로드 즉시 데이터가 실시간으로 반영됩니다</li>
                  <li>생산 리포트 탭에서 업로드된 데이터를 확인할 수 있습니다</li>
                </ul>
                          </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 완성검사 입력 ============ */}
        <TabsContent value="inspection-input" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                완성검사 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="border-2 border-border rounded-lg p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{loadingMessage}</h3>
                      <p className="text-sm text-muted-foreground">잠시만 기다려주세요...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">엑셀 파일 업로드</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    공장에서 작성한 완성검사 엑셀 파일을 업로드하세요
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    id="inspection-file-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        loadInspectionData(file);
                      }
                    }}
                  />
                  <Button
                    onClick={() => document.getElementById('inspection-file-input')?.click()}
                    className="bg-primary text-primary-foreground"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    파일 선택
                  </Button>
                      </div>
                    )}

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  업로드 안내
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>엑셀 파일 형식(.xlsx, .xls)만 지원됩니다</li>
                  <li>업로드 즉시 데이터가 실시간으로 반영됩니다</li>
                  <li>완성검사 리포트 탭에서 업로드된 데이터를 확인할 수 있습니다</li>
                </ul>
                  </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 선적 스케쥴 입력 ============ */}
        <TabsContent value="shipment-input" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                선적 스케쥴 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="border-2 border-border rounded-lg p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{loadingMessage}</h3>
                      <p className="text-sm text-muted-foreground">잠시만 기다려주세요...</p>
                    </div>
                              </div>
                            </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">엑셀 파일 업로드</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    공장에서 작성한 선적 스케쥴 엑셀 파일을 업로드하세요
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    id="shipment-file-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        loadShipmentData(file);
                      }
                    }}
                  />
                  <Button
                    onClick={() => document.getElementById('shipment-file-input')?.click()}
                    className="bg-primary text-primary-foreground"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    파일 선택
                                            </Button>
                              </div>
                            )}

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  업로드 안내
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>엑셀 파일 형식(.xlsx, .xls)만 지원됩니다</li>
                  <li>업로드 즉시 데이터가 실시간으로 반영됩니다</li>
                  <li>선적 스케쥴 탭에서 업로드된 데이터를 확인할 수 있습니다</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
