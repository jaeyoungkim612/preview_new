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
  Plus,
  Plane,
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  MapPin,
  Edit,
  Eye,
} from "lucide-react";

// 핸드캐리 데이터 (이미지 기반)
const handcarryItems = [
  { id: 1, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "MLB", styleNo: "3AWPB0963", content: "PP SAMPLE PKG", cartonNo: "-", qty: 1, unit: "-", unitType: "PACK", weight: "2.38 kg", manager: "오선화", extWork: "", extCompany: "", delivery: "CNF", part: "8part" },
  { id: 2, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "MLB", styleNo: "3AWPV0254RE", content: "TOP SAMPLE (APPROVED)", cartonNo: "-", qty: 9, unit: "-", unitType: "PACK", weight: "", manager: "박재연", extWork: "", extCompany: "", delivery: "CNF", part: "8part" },
  { id: 3, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "MLB", styleNo: "3FWPB8256", content: "PRICE TAG", cartonNo: "-", qty: 7, unit: "-", unitType: "PACK", weight: "3.56 kg", manager: "박재연", extWork: "", extCompany: "", delivery: "CNF", part: "8part" },
  { id: 4, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "MLLB", styleNo: "3FWPB8256", content: "TOP SAMPLE (APPROVED)", cartonNo: "-", qty: 9, unit: "-", unitType: "PACK", weight: "", manager: "박재연", extWork: "", extCompany: "", delivery: "CNF", part: "8part" },
  { id: 5, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "MLB", styleNo: "3FWPV0261", content: "PP SAMPLE (APPROVED) + 1ST MACHING CHART", cartonNo: "-", qty: 9, unit: "-", unitType: "PACK", weight: "2.18 kg", manager: "박재연", extWork: "", extCompany: "", delivery: "CNF", part: "8part" },
  { id: 6, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "beanpole golf", styleNo: "BJ6326L13", content: "26SS DEVELOP SAMPLE PACKAGE (SBJ6B21017)", cartonNo: "-", qty: 3, unit: "1", unitType: "set", weight: "1.50 kg", manager: "장수연", extWork: "", extCompany: "HA", delivery: "", part: "1part" },
  { id: 7, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "CALLAWAYGOLF KOREA", styleNo: "CMPT26M502", content: "QC SAMPLE KNIT", cartonNo: "-", qty: 1, unit: "택배", unitType: "PACK", weight: "", manager: "윤미경", extWork: "외부픽업", extCompany: "왕진/영산택배", delivery: "", part: "" },
  { id: 8, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "SHIFT.G", styleNo: "GC6121CW2", content: "DEFECT FABRIC", cartonNo: "-", qty: 2, unit: "1", unitType: "yd", weight: "", manager: "서승환", extWork: "", extCompany: "", delivery: "CNF", part: "5part" },
  { id: 9, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "JUUN. J", styleNo: "JC6221P23", content: "VENDER CHECK LIST(+JC5321P53)", cartonNo: "-", qty: 2, unit: "2", unitType: "ea", weight: "0.56 kg", manager: "김수경", extWork: "", extCompany: "", delivery: "CNF", part: "5part" },
  { id: 10, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "J.LINDEBERG", styleNo: "M Jakob Basic Golf Pants MPT01", content: "BUTTON DEFECT REPLACEMENT(BK-117,WH-28)", cartonNo: "-", qty: 6, unit: "1", unitType: "PACK", weight: "0.10 kg", manager: "윤미경", extWork: "", extCompany: "", delivery: "CNF", part: "5part" },
  { id: 11, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341127", origin: "TB", season: "26SS", brand: "black yak", styleNo: "1HPBY-MIM067", content: "FRONT ZIPPER", cartonNo: "-", qty: 1, unit: "1", unitType: "BOX", weight: "2.02 kg", manager: "신지수", extWork: "", extCompany: "", delivery: "CNF", part: "6part" },
  { id: 12, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341127", origin: "TB", season: "26SS", brand: "MLB", styleNo: "3ASMB1463", content: "1ST PP SAMPLE (REJECTED)+CMMT", cartonNo: "-", qty: 5, unit: "-", unitType: "PACK", weight: "0.72 kg", manager: "박재연", extWork: "", extCompany: "", delivery: "CNF", part: "" },
  { id: 13, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341127", origin: "TB", season: "26SS", brand: "MLB", styleNo: "3FSKB1163", content: "1ST MACHING CHART", cartonNo: "-", qty: 5, unit: "-", unitType: "PACK", weight: "", manager: "박재연", extWork: "", extCompany: "", delivery: "CNF", part: "" },
  { id: 14, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341127", origin: "TB", season: "26SS", brand: "MLB", styleNo: "3FWPB0161", content: "1ST MACHING CHART", cartonNo: "-", qty: 5, unit: "-", unitType: "PACK", weight: "", manager: "박재연", extWork: "", extCompany: "", delivery: "CNF", part: "" },
  { id: 15, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341127", origin: "TB", season: "26SS", brand: "MILLET(밀레)", styleNo: "MXVUP080", content: "QC PKG", cartonNo: "-", qty: 2, unit: "-", unitType: "PACK", weight: "", manager: "김회정", extWork: "", extCompany: "", delivery: "CNF", part: "6part" },
  { id: 16, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341127", origin: "TB", season: "26SS", brand: "MILLET(밀레)", styleNo: "MXVUP082", content: "PP PKG", cartonNo: "-", qty: 1, unit: "1", unitType: "PACK", weight: "3.60 kg", manager: "김회정", extWork: "", extCompany: "", delivery: "CNF", part: "6part" },
  { id: 17, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341127", origin: "TB", season: "26SS", brand: "MILLET(밀레)", styleNo: "MXVUP083", content: "PP PKG", cartonNo: "-", qty: 2, unit: "-", unitType: "PACK", weight: "", manager: "김회정", extWork: "", extCompany: "", delivery: "CNF", part: "" },
  { id: 18, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341127", origin: "TB", season: "26SS", brand: "MILLET(밀레)", styleNo: "MXVUP580", content: "QC PKG", cartonNo: "-", qty: 2, unit: "-", unitType: "PACK", weight: "", manager: "김회정", extWork: "", extCompany: "", delivery: "CNF", part: "6part" },
  { id: 19, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341127", origin: "TB", season: "26SS", brand: "National Geographic-OUTER", styleNo: "N261MPT010", content: "MARKETING SAMPLE PACKAGE", cartonNo: "-", qty: 1, unit: "-", unitType: "PACK", weight: "", manager: "김수민", extWork: "", extCompany: "", delivery: "CNF", part: "12part" },
  { id: 20, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341128", origin: "ND", season: "26SS", brand: "louis castel", styleNo: "7MOPT439", content: "SNAP FOR PP", cartonNo: "-", qty: 1, unit: "1", unitType: "PACK", weight: "", manager: "이채영", extWork: "", extCompany: "", delivery: "TREND", part: "2part" },
  { id: 21, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341128", origin: "ND", season: "26SS", brand: "TITLEIST", styleNo: "TNPMP2610", content: "SECRET LABEL", cartonNo: "-", qty: 4, unit: "1,051", unitType: "ea", weight: "", manager: "김해연", extWork: "", extCompany: "", delivery: "TREND", part: "5part" },
  { id: 22, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341128", origin: "ND", season: "26SS", brand: "TITLEIST", styleNo: "TNTMP1601", content: "SECRET LABEL", cartonNo: "-", qty: 4, unit: "549", unitType: "ea", weight: "0.38 kg", manager: "김해연", extWork: "", extCompany: "", delivery: "TREND", part: "5part" },
  { id: 23, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341128", origin: "ND", season: "26SS", brand: "HAZZYS", styleNo: "WHPA5B401", content: "QC PACKAGE", cartonNo: "-", qty: 2, unit: "1", unitType: "PACK", weight: "1.46 kg", manager: "정진병", extWork: "", extCompany: "", delivery: "TREND", part: "11part" },
  { id: 24, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341129", origin: "YEN THANH", season: "26SS", brand: "MLB", styleNo: "3FWPV0154RE", content: "잉킹 샘플 리턴", cartonNo: "-", qty: 4, unit: "-", unitType: "ea", weight: "0.54 kg", manager: "오선화", extWork: "", extCompany: "", delivery: "CNF", part: "8part" },
  { id: 25, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341129", origin: "YEN THANH", season: "26SS", brand: "EIDER", styleNo: "DWM26382", content: "LOT CARD RETURN", cartonNo: "-", qty: 1, unit: "1", unitType: "ea", weight: "0.08 kg", manager: "김현우", extWork: "", extCompany: "", delivery: "CNF", part: "10part" },
  { id: 26, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341129", origin: "YEN THANH", season: "26SS", brand: "K2", styleNo: "KMM26347", content: "품평샘플 김예희 개발 와이드 팬츠", cartonNo: "-", qty: 3, unit: "1", unitType: "PACK", weight: "0.78 kg", manager: "박은영", extWork: "", extCompany: "", delivery: "CNF", part: "" },
  { id: 27, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341129", origin: "YEN THANH", season: "26SS", brand: "K2", styleNo: "KWM26374", content: "2ND QC PACKAGE", cartonNo: "-", qty: 2, unit: "1", unitType: "PACK", weight: "0.72 kg", manager: "박은영", extWork: "", extCompany: "", delivery: "CNF", part: "7part" },
  { id: 28, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341129", origin: "YEN THANH", season: "26SS", brand: "black yak", styleNo: "MEN DAILY BERMUDA SHORTS", content: "FINAL MACHING CHART", cartonNo: "-", qty: 5, unit: "1", unitType: "ea", weight: "0.12 kg", manager: "신지수", extWork: "", extCompany: "", delivery: "CNF", part: "6part" },
  { id: 29, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341130", origin: "ND", season: "26SS", brand: "black yak", styleNo: "CLIMBING MEN STONEMASTER PANTS", content: "POINT LABEL", cartonNo: "-", qty: 5, unit: "1", unitType: "PACK", weight: "0.18 kg", manager: "신지수", extWork: "", extCompany: "", delivery: "CNF", part: "" },
  { id: 30, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341131", origin: "CNF VINA", season: "26SS", brand: "MLB", styleNo: "3FSKB0263", content: "SUNGRIP", cartonNo: "-", qty: 1, unit: "외부", unitType: "1,000 set", weight: "", manager: "진재성", extWork: "외부픽업", extCompany: "해성", delivery: "CNF", part: "8part" },
  { id: 31, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341131", origin: "CNF VINA", season: "26SS", brand: "louis castel", styleNo: "7MOPT301", content: "MAIN LABEL", cartonNo: "-", qty: 1, unit: "-", unitType: "-", weight: "2.84 kg", manager: "조윤채", extWork: "", extCompany: "", delivery: "TREND", part: "3part" },
  { id: 32, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341131", origin: "CNF VINA", season: "26SS", brand: "CUSTOMMELLOW", styleNo: "CWPAM26321-01", content: "QC SAMPLE PACKAGE", cartonNo: "-", qty: 2, unit: "-", unitType: "-", weight: "1.48 kg", manager: "이상아", extWork: "", extCompany: "", delivery: "TREND", part: "" },
  { id: 33, company: "FUSION", type: "OUT", date: "25/10/18", blNo: "FUS62341131", origin: "CNF VINA", season: "26SS", brand: "MALBON GOLF", styleNo: "M6222PSK51", content: "2QC SAMPLE PACKGE", cartonNo: "-", qty: 4, unit: "-", unitType: "PACK", weight: "1.40 kg", manager: "김진아", extWork: "", extCompany: "", delivery: "", part: "" },
];

// 요약 통계
const summary = {
  totalShipments: handcarryItems.length,
  todayShipments: 33,
  pendingShipments: 5,
  completedShipments: 28,
  totalWeight: "52.8 kg",
  totalItems: handcarryItems.reduce((sum, item) => sum + item.qty, 0),
};

// 브랜드별 통계
const brandStats = [
  { brand: "MLB", count: 12, weight: "15.2 kg" },
  { brand: "MILLET", count: 4, weight: "3.6 kg" },
  { brand: "black yak", count: 4, weight: "2.8 kg" },
  { brand: "TITLEIST", count: 2, weight: "0.38 kg" },
  { brand: "K2", count: 2, weight: "1.5 kg" },
  { brand: "EIDER", count: 1, weight: "0.08 kg" },
];

const statusColors: Record<string, string> = {
  "완료": "bg-primary/10 text-primary",
  "진행중": "bg-blue-500/10 text-blue-600",
  "대기": "bg-amber-500/10 text-amber-600",
  "OUT": "bg-blue-500/10 text-blue-600",
  "IN": "bg-primary/10 text-primary",
};

export function HandcarryView() {
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedOrigin, setSelectedOrigin] = useState("all");

  const filteredItems = handcarryItems.filter((item) => {
    const matchesSearch = 
      item.blNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.styleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === "all" || item.brand === selectedBrand;
    const matchesOrigin = selectedOrigin === "all" || item.origin === selectedOrigin;
    return matchesSearch && matchesBrand && matchesOrigin;
  });

  const uniqueBrands = [...new Set(handcarryItems.map(item => item.brand))];
  const uniqueOrigins = [...new Set(handcarryItems.map(item => item.origin))];

  return (
    <div className="p-6 space-y-6">
      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Package className="h-4 w-4 mr-2" />
            핸드캐리 목록
          </TabsTrigger>
          <TabsTrigger value="summary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-4 w-4 mr-2" />
            통계 현황
          </TabsTrigger>
        </TabsList>

        {/* 핸드캐리 목록 */}
        <TabsContent value="list" className="space-y-6 mt-6">
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">총 건수</p>
                    <p className="text-xl font-bold text-foreground">{summary.totalShipments}건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Plane className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">금일 출고</p>
                    <p className="text-xl font-bold text-blue-600">{summary.todayShipments}건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">완료</p>
                    <p className="text-xl font-bold text-primary">{summary.completedShipments}건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">대기</p>
                    <p className="text-xl font-bold text-amber-600">{summary.pendingShipments}건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">총 중량</p>
                    <p className="text-xl font-bold text-foreground">{summary.totalWeight}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 목록 테이블 */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">핸드캐리 출고 현황</CardTitle>
                <div className="flex items-center gap-2">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    핸드캐리 등록
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    엑셀 다운로드
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* 필터 */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="BL NO, 스타일, 브랜드, 내용 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="브랜드" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 브랜드</SelectItem>
                    {uniqueBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="발신지" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {uniqueOrigins.map(origin => (
                      <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  상세필터
                </Button>
              </div>

              {/* 테이블 */}
              <div className="border border-border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold whitespace-nowrap">업체</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">구분</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">발송일</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">BL NO.</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">발신</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">시즌</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">브랜드</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">STYLE NO</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">내용</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap text-right">수량</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">단위</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">중량</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">담당자</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">외부작업</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">배송</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.slice(0, 20).map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{item.company}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[item.type]}>{item.type}</Badge>
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="font-medium text-primary">{item.blNo}</TableCell>
                        <TableCell>{item.origin}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.season}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.brand}</TableCell>
                        <TableCell className="text-primary">{item.styleNo}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={item.content}>{item.content}</TableCell>
                        <TableCell className="text-right font-medium">{item.qty}</TableCell>
                        <TableCell>{item.unitType}</TableCell>
                        <TableCell className="text-primary font-medium">{item.weight || "-"}</TableCell>
                        <TableCell>{item.manager}</TableCell>
                        <TableCell>{item.extWork || "-"}</TableCell>
                        <TableCell>{item.delivery || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* 페이지네이션 정보 */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  총 {filteredItems.length}건 중 1-{Math.min(20, filteredItems.length)}건 표시
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>이전</Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">다음</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 통계 현황 */}
        <TabsContent value="summary" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 브랜드별 통계 */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base font-semibold">브랜드별 핸드캐리 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {brandStats.map((stat) => (
                    <div key={stat.brand} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{stat.brand}</p>
                          <p className="text-sm text-muted-foreground">{stat.count}건</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-primary">{stat.weight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 발신지별 통계 */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base font-semibold">발신지별 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { origin: "ND", count: 15, description: "ND 공장" },
                    { origin: "TB", count: 9, description: "TB 공장" },
                    { origin: "YEN THANH", count: 5, description: "YEN THANH 공장" },
                    { origin: "CNF VINA", count: 4, description: "CNF VINA 공장" },
                  ].map((stat) => (
                    <div key={stat.origin} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{stat.origin}</p>
                          <p className="text-sm text-muted-foreground">{stat.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{stat.count}건</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 담당자별 통계 */}
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">담당자별 처리 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { name: "박재연", count: 8 },
                    { name: "김회정", count: 4 },
                    { name: "신지수", count: 3 },
                    { name: "윤미경", count: 2 },
                    { name: "오선화", count: 2 },
                    { name: "김해연", count: 2 },
                    { name: "박은영", count: 2 },
                    { name: "기타", count: 10 },
                  ].map((stat) => (
                    <div key={stat.name} className="p-3 bg-muted/30 rounded-lg text-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-medium text-foreground">{stat.name}</p>
                      <p className="text-sm text-muted-foreground">{stat.count}건</p>
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
