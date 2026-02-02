"use client";

import React from "react"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Factory,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Legend,
  ComposedChart,
  Line,
} from "recharts";

// 브랜드별 월별 실적 데이터 (25년 실적 + 26년 1월 현재)
const brandMonthlyData: Record<string, { month: string; revenue: number; cost: number; gm: number; orders: number }[]> = {
  "전체": [
    { month: "25.01", revenue: 4850, cost: 3150, gm: 35.1, orders: 142 },
    { month: "25.02", revenue: 4320, cost: 2850, gm: 34.0, orders: 128 },
    { month: "25.03", revenue: 5680, cost: 3720, gm: 34.5, orders: 156 },
    { month: "25.04", revenue: 5120, cost: 3380, gm: 34.0, orders: 148 },
    { month: "25.05", revenue: 5450, cost: 3540, gm: 35.0, orders: 152 },
    { month: "25.06", revenue: 4980, cost: 3280, gm: 34.1, orders: 138 },
    { month: "25.07", revenue: 5320, cost: 3420, gm: 35.7, orders: 145 },
    { month: "25.08", revenue: 4650, cost: 3050, gm: 34.4, orders: 132 },
    { month: "25.09", revenue: 5180, cost: 3350, gm: 35.3, orders: 148 },
    { month: "25.10", revenue: 5420, cost: 3520, gm: 35.1, orders: 155 },
    { month: "25.11", revenue: 5680, cost: 3680, gm: 35.2, orders: 162 },
    { month: "25.12", revenue: 5950, cost: 3850, gm: 35.3, orders: 168 },
    { month: "26.01", revenue: 5020, cost: 3280, gm: 34.7, orders: 156 },
  ],
  "beanpole golf": [
    { month: "25.01", revenue: 820, cost: 533, gm: 35.0, orders: 18 },
    { month: "25.02", revenue: 780, cost: 514, gm: 34.1, orders: 16 },
    { month: "25.03", revenue: 920, cost: 598, gm: 35.0, orders: 20 },
    { month: "25.04", revenue: 850, cost: 553, gm: 35.0, orders: 19 },
    { month: "25.05", revenue: 880, cost: 572, gm: 35.0, orders: 19 },
    { month: "25.06", revenue: 760, cost: 494, gm: 35.0, orders: 17 },
    { month: "25.07", revenue: 890, cost: 579, gm: 35.0, orders: 19 },
    { month: "25.08", revenue: 720, cost: 468, gm: 35.0, orders: 15 },
    { month: "25.09", revenue: 850, cost: 553, gm: 35.0, orders: 18 },
    { month: "25.10", revenue: 920, cost: 598, gm: 35.0, orders: 20 },
    { month: "25.11", revenue: 960, cost: 624, gm: 35.0, orders: 21 },
    { month: "25.12", revenue: 1020, cost: 663, gm: 35.0, orders: 22 },
    { month: "26.01", revenue: 880, cost: 572, gm: 35.0, orders: 19 },
  ],
  "beanpole mens": [
    { month: "25.01", revenue: 1420, cost: 923, gm: 35.0, orders: 28 },
    { month: "25.02", revenue: 1280, cost: 832, gm: 35.0, orders: 25 },
    { month: "25.03", revenue: 1680, cost: 1092, gm: 35.0, orders: 32 },
    { month: "25.04", revenue: 1520, cost: 988, gm: 35.0, orders: 30 },
    { month: "25.05", revenue: 1580, cost: 1027, gm: 35.0, orders: 31 },
    { month: "25.06", revenue: 1420, cost: 923, gm: 35.0, orders: 28 },
    { month: "25.07", revenue: 1560, cost: 1014, gm: 35.0, orders: 30 },
    { month: "25.08", revenue: 1320, cost: 858, gm: 35.0, orders: 26 },
    { month: "25.09", revenue: 1480, cost: 962, gm: 35.0, orders: 29 },
    { month: "25.10", revenue: 1620, cost: 1053, gm: 35.0, orders: 32 },
    { month: "25.11", revenue: 1720, cost: 1118, gm: 35.0, orders: 34 },
    { month: "25.12", revenue: 1820, cost: 1183, gm: 35.0, orders: 36 },
    { month: "26.01", revenue: 1580, cost: 1027, gm: 35.0, orders: 31 },
  ],
  "descente sports": [
    { month: "25.01", revenue: 680, cost: 442, gm: 35.0, orders: 12 },
    { month: "25.02", revenue: 620, cost: 403, gm: 35.0, orders: 11 },
    { month: "25.03", revenue: 780, cost: 507, gm: 35.0, orders: 14 },
    { month: "25.04", revenue: 720, cost: 468, gm: 35.0, orders: 13 },
    { month: "25.05", revenue: 750, cost: 488, gm: 35.0, orders: 13 },
    { month: "25.06", revenue: 680, cost: 442, gm: 35.0, orders: 12 },
    { month: "25.07", revenue: 740, cost: 481, gm: 35.0, orders: 13 },
    { month: "25.08", revenue: 640, cost: 416, gm: 35.0, orders: 11 },
    { month: "25.09", revenue: 710, cost: 462, gm: 35.0, orders: 12 },
    { month: "25.10", revenue: 760, cost: 494, gm: 35.0, orders: 13 },
    { month: "25.11", revenue: 820, cost: 533, gm: 35.0, orders: 15 },
    { month: "25.12", revenue: 880, cost: 572, gm: 35.0, orders: 16 },
    { month: "26.01", revenue: 750, cost: 488, gm: 35.0, orders: 13 },
  ],
  "XEXYMIX": [
    { month: "25.01", revenue: 1280, cost: 832, gm: 35.0, orders: 32 },
    { month: "25.02", revenue: 1120, cost: 728, gm: 35.0, orders: 28 },
    { month: "25.03", revenue: 1480, cost: 962, gm: 35.0, orders: 36 },
    { month: "25.04", revenue: 1320, cost: 858, gm: 35.0, orders: 33 },
    { month: "25.05", revenue: 1420, cost: 923, gm: 35.0, orders: 35 },
    { month: "25.06", revenue: 1280, cost: 832, gm: 35.0, orders: 32 },
    { month: "25.07", revenue: 1380, cost: 897, gm: 35.0, orders: 34 },
    { month: "25.08", revenue: 1180, cost: 767, gm: 35.0, orders: 30 },
    { month: "25.09", revenue: 1340, cost: 871, gm: 35.0, orders: 33 },
    { month: "25.10", revenue: 1420, cost: 923, gm: 35.0, orders: 35 },
    { month: "25.11", revenue: 1520, cost: 988, gm: 35.0, orders: 38 },
    { month: "25.12", revenue: 1620, cost: 1053, gm: 35.0, orders: 40 },
    { month: "26.01", revenue: 1380, cost: 897, gm: 35.0, orders: 34 },
  ],
  "rogatis": [
    { month: "25.01", revenue: 420, cost: 273, gm: 35.0, orders: 10 },
    { month: "25.02", revenue: 380, cost: 247, gm: 35.0, orders: 9 },
    { month: "25.03", revenue: 480, cost: 312, gm: 35.0, orders: 11 },
    { month: "25.04", revenue: 440, cost: 286, gm: 35.0, orders: 10 },
    { month: "25.05", revenue: 460, cost: 299, gm: 35.0, orders: 11 },
    { month: "25.06", revenue: 420, cost: 273, gm: 35.0, orders: 10 },
    { month: "25.07", revenue: 450, cost: 293, gm: 35.0, orders: 10 },
    { month: "25.08", revenue: 390, cost: 254, gm: 35.0, orders: 9 },
    { month: "25.09", revenue: 430, cost: 280, gm: 35.0, orders: 10 },
    { month: "25.10", revenue: 470, cost: 306, gm: 35.0, orders: 11 },
    { month: "25.11", revenue: 510, cost: 332, gm: 35.0, orders: 12 },
    { month: "25.12", revenue: 540, cost: 351, gm: 35.0, orders: 13 },
    { month: "26.01", revenue: 460, cost: 299, gm: 35.0, orders: 11 },
  ],
  "galaxy": [
    { month: "25.01", revenue: 580, cost: 377, gm: 35.0, orders: 14 },
    { month: "25.02", revenue: 520, cost: 338, gm: 35.0, orders: 12 },
    { month: "25.03", revenue: 680, cost: 442, gm: 35.0, orders: 16 },
    { month: "25.04", revenue: 620, cost: 403, gm: 35.0, orders: 15 },
    { month: "25.05", revenue: 660, cost: 429, gm: 35.0, orders: 16 },
    { month: "25.06", revenue: 580, cost: 377, gm: 35.0, orders: 14 },
    { month: "25.07", revenue: 640, cost: 416, gm: 35.0, orders: 15 },
    { month: "25.08", revenue: 540, cost: 351, gm: 35.0, orders: 13 },
    { month: "25.09", revenue: 610, cost: 397, gm: 35.0, orders: 15 },
    { month: "25.10", revenue: 660, cost: 429, gm: 35.0, orders: 16 },
    { month: "25.11", revenue: 720, cost: 468, gm: 35.0, orders: 17 },
    { month: "25.12", revenue: 760, cost: 494, gm: 35.0, orders: 18 },
    { month: "26.01", revenue: 640, cost: 416, gm: 35.0, orders: 15 },
  ],
};

// 브랜드별 손익 데이터
const brandProfitData = [
  { brand: "beanpole golf", orders: 24, styles: 15, revenue: 1084700000, cost: 705055000, gm: 35.0, prevGm: 34.2 },
  { brand: "beanpole mens", orders: 31, styles: 28, revenue: 1920000000, cost: 1248000000, gm: 35.0, prevGm: 33.8 },
  { brand: "descente sports", orders: 15, styles: 8, revenue: 893000000, cost: 580450000, gm: 35.0, prevGm: 34.5 },
  { brand: "XEXYMIX", orders: 26, styles: 26, revenue: 1674000000, cost: 1088100000, gm: 35.0, prevGm: 35.2 },
  { brand: "rogatis", orders: 12, styles: 9, revenue: 585000000, cost: 380250000, gm: 35.0, prevGm: 34.0 },
  { brand: "galaxy", orders: 19, styles: 14, revenue: 823000000, cost: 534950000, gm: 35.0, prevGm: 33.9 },
];

// 브랜드별 스타일 손익 데이터
const brandStyleData: Record<string, { styleNo: string; revenue: number; cost: number; gm: number; planQty: number; cutQty: number; inQty: number; cutRate: number }[]> = {
  "beanpole golf": [
    { styleNo: "BGPTM2101", revenue: 285000000, cost: 185250000, gm: 35.0, planQty: 1500, cutQty: 1200, inQty: 980, cutRate: 80.0 },
    { styleNo: "BGPTM2102", revenue: 242000000, cost: 157300000, gm: 35.0, planQty: 1200, cutQty: 1100, inQty: 850, cutRate: 91.7 },
    { styleNo: "BGPTM2103", revenue: 198000000, cost: 128700000, gm: 35.0, planQty: 800, cutQty: 750, inQty: 620, cutRate: 93.8 },
    { styleNo: "BGPTM2104", revenue: 215000000, cost: 139750000, gm: 35.0, planQty: 950, cutQty: 900, inQty: 720, cutRate: 94.7 },
  ],
  "beanpole mens": [
    { styleNo: "BKMTM5106", revenue: 320000000, cost: 208000000, gm: 35.0, planQty: 1209, cutQty: 1209, inQty: 484, cutRate: 100.0 },
    { styleNo: "BKMTM5107", revenue: 285000000, cost: 185250000, gm: 35.0, planQty: 1300, cutQty: 1100, inQty: 650, cutRate: 84.6 },
    { styleNo: "BKPTM5182", revenue: 178000000, cost: 115700000, gm: 35.0, planQty: 650, cutQty: 0, inQty: 0, cutRate: 0.0 },
    { styleNo: "BKPTM5284", revenue: 245000000, cost: 159250000, gm: 35.0, planQty: 892, cutQty: 620, inQty: 0, cutRate: 69.5 },
    { styleNo: "BKMTM5111", revenue: 356000000, cost: 231400000, gm: 35.0, planQty: 1450, cutQty: 1380, inQty: 920, cutRate: 95.2 },
  ],
  "descente sports": [
    { styleNo: "DSPTM3001", revenue: 485000000, cost: 315250000, gm: 35.0, planQty: 2100, cutQty: 1800, inQty: 1500, cutRate: 85.7 },
    { styleNo: "DSPTM3002", revenue: 408000000, cost: 265200000, gm: 35.0, planQty: 1800, cutQty: 1600, inQty: 1200, cutRate: 88.9 },
  ],
  "XEXYMIX": [
    { styleNo: "XXPTM4001", revenue: 625000000, cost: 406250000, gm: 35.0, planQty: 3500, cutQty: 3200, inQty: 2800, cutRate: 91.4 },
    { styleNo: "XXPTM4002", revenue: 498000000, cost: 323700000, gm: 35.0, planQty: 2800, cutQty: 2500, inQty: 2100, cutRate: 89.3 },
    { styleNo: "XXPTM4003", revenue: 385000000, cost: 250250000, gm: 35.0, planQty: 2200, cutQty: 2000, inQty: 1650, cutRate: 90.9 },
  ],
  "rogatis": [
    { styleNo: "RGPTM5001", revenue: 298000000, cost: 193700000, gm: 35.0, planQty: 980, cutQty: 920, inQty: 780, cutRate: 93.9 },
    { styleNo: "RGPTM5002", revenue: 215000000, cost: 139750000, gm: 35.0, planQty: 750, cutQty: 680, inQty: 550, cutRate: 90.7 },
  ],
  "galaxy": [
    { styleNo: "GLPTM6001", revenue: 365000000, cost: 237250000, gm: 35.0, planQty: 1650, cutQty: 1500, inQty: 1250, cutRate: 90.9 },
    { styleNo: "GLPTM6002", revenue: 268000000, cost: 174200000, gm: 35.0, planQty: 1200, cutQty: 1100, inQty: 920, cutRate: 91.7 },
    { styleNo: "GLPTM6003", revenue: 190000000, cost: 123500000, gm: 35.0, planQty: 980, cutQty: 880, inQty: 720, cutRate: 89.8 },
  ],
};

// 공장별 브랜드별 스타일별 손익 현황 (3단계)
const factoryBrandStyleData: Record<string, Record<string, { styleNo: string; revenue: number; cost: number; gm: number; planQty: number; cutQty: number; cutRate: number }[]>> = {
  "Vietnam ND": {
    "beanpole mens": [
      { styleNo: "BKMTM5106", revenue: 320000000, cost: 208000000, gm: 35.0, planQty: 1209, cutQty: 1150, cutRate: 95.1 },
      { styleNo: "BKMTM5107", revenue: 285000000, cost: 185250000, gm: 35.0, planQty: 1300, cutQty: 1180, cutRate: 90.8 },
      { styleNo: "BKMTM5111", revenue: 245000000, cost: 159250000, gm: 35.0, planQty: 892, cutQty: 825, cutRate: 92.5 },
    ],
    "XEXYMIX": [
      { styleNo: "XXPTM4001", revenue: 380000000, cost: 247000000, gm: 35.0, planQty: 2100, cutQty: 1890, cutRate: 90.0 },
      { styleNo: "XXPTM4002", revenue: 240000000, cost: 156000000, gm: 35.0, planQty: 1350, cutQty: 1150, cutRate: 85.2 },
    ],
    "galaxy": [
      { styleNo: "GLPTM6001", revenue: 200000000, cost: 130000000, gm: 35.0, planQty: 920, cutQty: 800, cutRate: 87.0 },
      { styleNo: "GLPTM6002", revenue: 120000000, cost: 78000000, gm: 35.0, planQty: 580, cutQty: 480, cutRate: 82.8 },
    ],
  },
  "Vietnam TB": {
    "beanpole golf": [
      { styleNo: "BGPTM2101", revenue: 285000000, cost: 185250000, gm: 35.0, planQty: 1500, cutQty: 1420, cutRate: 94.7 },
      { styleNo: "BGPTM2102", revenue: 180000000, cost: 117000000, gm: 35.0, planQty: 920, cutQty: 865, cutRate: 94.0 },
      { styleNo: "BGPTM2103", revenue: 115000000, cost: 74750000, gm: 35.0, planQty: 580, cutQty: 545, cutRate: 94.0 },
    ],
    "descente sports": [
      { styleNo: "DSPTM3001", revenue: 280000000, cost: 182000000, gm: 35.0, planQty: 1250, cutQty: 1150, cutRate: 92.0 },
      { styleNo: "DSPTM3002", revenue: 200000000, cost: 130000000, gm: 35.0, planQty: 950, cutQty: 850, cutRate: 89.5 },
    ],
  },
  "YEN THANH": {
    "beanpole mens": [
      { styleNo: "BKPTM5182", revenue: 178000000, cost: 115700000, gm: 35.0, planQty: 650, cutQty: 520, cutRate: 80.0 },
      { styleNo: "BKPTM5284", revenue: 242000000, cost: 157300000, gm: 35.0, planQty: 892, cutQty: 680, cutRate: 76.2 },
    ],
    "rogatis": [
      { styleNo: "RGPTM5001", revenue: 198000000, cost: 128700000, gm: 35.0, planQty: 650, cutQty: 540, cutRate: 83.1 },
      { styleNo: "RGPTM5002", revenue: 182000000, cost: 118300000, gm: 35.0, planQty: 580, cutQty: 470, cutRate: 81.0 },
    ],
  },
  "CNF VINA": {
    "XEXYMIX": [
      { styleNo: "XXPTM4003", revenue: 320000000, cost: 208000000, gm: 35.0, planQty: 1800, cutQty: 1320, cutRate: 73.3 },
      { styleNo: "XXPTM4004", revenue: 200000000, cost: 130000000, gm: 35.0, planQty: 1150, cutQty: 820, cutRate: 71.3 },
    ],
    "beanpole golf": [
      { styleNo: "BGPTM2104", revenue: 180000000, cost: 117000000, gm: 35.0, planQty: 850, cutQty: 580, cutRate: 68.2 },
      { styleNo: "BGPTM2105", revenue: 100000000, cost: 65000000, gm: 35.0, planQty: 480, cutQty: 330, cutRate: 68.8 },
    ],
  },
  "Cambodia 1": {
    "galaxy": [
      { styleNo: "GLPTM6003", revenue: 190000000, cost: 123500000, gm: 35.0, planQty: 980, cutQty: 850, cutRate: 86.7 },
      { styleNo: "GLPTM6004", revenue: 160000000, cost: 104000000, gm: 35.0, planQty: 820, cutQty: 700, cutRate: 85.4 },
    ],
    "descente sports": [
      { styleNo: "DSPTM3003", revenue: 150000000, cost: 97500000, gm: 35.0, planQty: 720, cutQty: 610, cutRate: 84.7 },
      { styleNo: "DSPTM3004", revenue: 130000000, cost: 84500000, gm: 35.0, planQty: 650, cutQty: 540, cutRate: 83.1 },
    ],
  },
};

// 공장별 브랜드별 손익 현황
const factoryBrandProfitData = [
  { 
    factory: "Vietnam ND", 
    brands: [
      { brand: "beanpole mens", revenue: 850000000, cost: 552500000, gm: 35.0, cutRate: 92.5 },
      { brand: "XEXYMIX", revenue: 620000000, cost: 403000000, gm: 35.0, cutRate: 88.2 },
      { brand: "galaxy", revenue: 320000000, cost: 208000000, gm: 35.0, cutRate: 85.6 },
    ],
    totalRevenue: 1790000000,
    totalCost: 1163500000,
    totalGm: 35.0,
    avgCutRate: 88.8
  },
  { 
    factory: "Vietnam TB", 
    brands: [
      { brand: "beanpole golf", revenue: 580000000, cost: 377000000, gm: 35.0, cutRate: 94.2 },
      { brand: "descente sports", revenue: 480000000, cost: 312000000, gm: 35.0, cutRate: 91.5 },
    ],
    totalRevenue: 1060000000,
    totalCost: 689000000,
    totalGm: 35.0,
    avgCutRate: 92.9
  },
  { 
    factory: "YEN THANH", 
    brands: [
      { brand: "beanpole mens", revenue: 420000000, cost: 273000000, gm: 35.0, cutRate: 78.5 },
      { brand: "rogatis", revenue: 380000000, cost: 247000000, gm: 35.0, cutRate: 82.3 },
    ],
    totalRevenue: 800000000,
    totalCost: 520000000,
    totalGm: 35.0,
    avgCutRate: 80.4
  },
  { 
    factory: "CNF VINA", 
    brands: [
      { brand: "XEXYMIX", revenue: 520000000, cost: 338000000, gm: 35.0, cutRate: 72.8 },
      { brand: "beanpole golf", revenue: 280000000, cost: 182000000, gm: 35.0, cutRate: 68.5 },
    ],
    totalRevenue: 800000000,
    totalCost: 520000000,
    totalGm: 35.0,
    avgCutRate: 70.7
  },
  { 
    factory: "Cambodia 1", 
    brands: [
      { brand: "galaxy", revenue: 350000000, cost: 227500000, gm: 35.0, cutRate: 86.2 },
      { brand: "descente sports", revenue: 280000000, cost: 182000000, gm: 35.0, cutRate: 84.1 },
    ],
    totalRevenue: 630000000,
    totalCost: 409500000,
    totalGm: 35.0,
    avgCutRate: 85.2
  },
];

const brands = ["전체", "beanpole golf", "beanpole mens", "descente sports", "XEXYMIX", "rogatis", "galaxy"];

export function DashboardView() {
  const [selectedBrand, setSelectedBrand] = useState("전체");
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const [expandedFactory, setExpandedFactory] = useState<string | null>(null);
  const [expandedFactoryBrand, setExpandedFactoryBrand] = useState<string | null>(null);
  
  // 전체 데이터
  const totalData = brandMonthlyData["전체"];
  const totalCumulativeRevenue = totalData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCurrentMonth = totalData[totalData.length - 1];
  const totalPrevMonth = totalData[totalData.length - 2];
  
  // 선택된 브랜드의 데이터
  const currentBrandData = brandMonthlyData[selectedBrand] || brandMonthlyData["전체"];
  const cumulativeRevenue = currentBrandData.reduce((sum, item) => sum + item.revenue, 0);
  const currentMonthData = currentBrandData[currentBrandData.length - 1];
  const prevMonthData = currentBrandData[currentBrandData.length - 2];
  const currentMonthRevenue = currentMonthData.revenue;
  const prevMonthRevenue = prevMonthData.revenue;
  const revenueChange = ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue * 100).toFixed(1);
  
  // 현재 진행중인 오더
  const activeOrders = currentMonthData.orders;
  const prevOrders = prevMonthData.orders;
  const orderChange = activeOrders - prevOrders;
  
  // 평균 GM
  const avgGM = currentMonthData.gm;
  const prevGM = prevMonthData.gm;
  const gmChange = (avgGM - prevGM).toFixed(1);

  // 금액 포맷
  const formatKRW = (value: number) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    }
    return value.toLocaleString();
  };

  const toggleBrandExpand = (brand: string) => {
    if (expandedBrand === brand) {
      setExpandedBrand(null);
    } else {
      setExpandedBrand(brand);
    }
  };

  const toggleFactoryExpand = (factory: string) => {
    if (expandedFactory === factory) {
      setExpandedFactory(null);
      setExpandedFactoryBrand(null);
    } else {
      setExpandedFactory(factory);
      setExpandedFactoryBrand(null);
    }
  };

  const toggleFactoryBrandExpand = (factoryBrand: string) => {
    if (expandedFactoryBrand === factoryBrand) {
      setExpandedFactoryBrand(null);
    } else {
      setExpandedFactoryBrand(factoryBrand);
    }
  };

  // 차트 데이터
  const isAllSelected = selectedBrand === "전체";
  const chartData = totalData.map((item, index) => {
    const brandData = !isAllSelected ? brandMonthlyData[selectedBrand][index] : null;
    return {
      month: item.month,
      전체매출: item.revenue / 10,
      전체원가: item.cost / 10,
      전체GM: item.gm,
      ...(brandData && {
        브랜드매출: brandData.revenue / 10,
        브랜드원가: brandData.cost / 10,
        브랜드GM: brandData.gm,
      }),
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* 상단 브랜드 선택 */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-foreground">브랜드 선택:</span>
            {brands.map((brand) => (
              <Button
                key={brand}
                variant={selectedBrand === brand ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBrand(brand)}
                className={selectedBrand === brand ? "bg-primary text-primary-foreground" : ""}
              >
                {brand}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI 카드 - 3개 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="w-full">
              <p className="text-xl font-bold text-foreground">누적 매출</p>
              <p className="text-sm text-muted-foreground">2026년 1월 기준</p>
              <p className="text-4xl font-bold text-foreground mt-3">
                {(totalCumulativeRevenue / 100).toFixed(0)}<span className="text-xl font-normal">억</span>
              </p>
              {selectedBrand !== "전체" && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">{selectedBrand}</p>
                  <p className="text-2xl font-bold text-primary">
                    {(cumulativeRevenue / 100).toFixed(0)}<span className="text-base font-normal">억</span>
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-muted-foreground">당월</span>
                <span className="text-base font-semibold text-foreground">{(currentMonthRevenue / 10).toFixed(1)}억</span>
                <div className={`flex items-center gap-0.5 ml-2 ${Number(revenueChange) >= 0 ? "text-primary" : "text-destructive"}`}>
                  {Number(revenueChange) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">{revenueChange}% vs 전월</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="w-full">
              <p className="text-xl font-bold text-foreground">진행중 오더</p>
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <p className="text-4xl font-bold text-foreground mt-3">
                {totalCurrentMonth.orders}<span className="text-xl font-normal">건</span>
              </p>
              {selectedBrand !== "전체" && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">{selectedBrand}</p>
                  <p className="text-2xl font-bold text-primary">
                    {activeOrders}<span className="text-base font-normal">건</span>
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2 mt-3">
                <div className={`flex items-center gap-0.5 ${orderChange >= 0 ? "text-primary" : "text-destructive"}`}>
                  {orderChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">{orderChange >= 0 ? "+" : ""}{orderChange}건 vs 전월</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="w-full">
              <p className="text-xl font-bold text-foreground">평균 GM</p>
              <p className="text-sm text-muted-foreground">Gross Margin</p>
              <p className="text-4xl font-bold text-foreground mt-3">
                {totalCurrentMonth.gm}<span className="text-xl font-normal">%</span>
              </p>
              {selectedBrand !== "전체" && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">{selectedBrand}</p>
                  <p className="text-2xl font-bold text-primary">
                    {avgGM}<span className="text-base font-normal">%</span>
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2 mt-3">
                <div className={`flex items-center gap-0.5 ${Number(gmChange) >= 0 ? "text-primary" : "text-destructive"}`}>
                  {Number(gmChange) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">{Number(gmChange) >= 0 ? "+" : ""}{gmChange}%p vs 전월</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 월별 매출/원가/GM 추이 차트 */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-foreground">
            월별 매출/원가/GM 추이
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            25년 1월 ~ 26년 1월 {selectedBrand !== "전체" && `| ${selectedBrand} vs 전체`}
          </p>
          {/* 범례 */}
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${isAllSelected ? "bg-[#1AD079]" : "bg-[#1AD079]/40"}`} />
              <span className="text-muted-foreground">전체 매출</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${isAllSelected ? "bg-[#333333]" : "bg-[#333333]/40"}`} />
              <span className="text-muted-foreground">전체 원가</span>
            </div>
            {!isAllSelected && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#1AD079]" />
                  <span className="text-muted-foreground">{selectedBrand} 매출</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#333333]" />
                  <span className="text-muted-foreground">{selectedBrand} 원가</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <div className={`w-4 h-1 rounded ${isAllSelected ? "bg-[#FF9500]" : "bg-[#FF9500]/40"}`} />
              <span className="text-muted-foreground">전체 GM%</span>
            </div>
            {!isAllSelected && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 rounded bg-[#FF9500]" />
                <span className="text-muted-foreground">{selectedBrand} GM%</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} barGap={0} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}억`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} domain={[0, 50]} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name.includes("GM")) return [`${value}%`, name];
                    return [`${value.toFixed(1)}억`, name];
                  }}
                />
                {/* 전체 막대 - 진하게 or 연하게 */}
                <Bar
                  yAxisId="left"
                  dataKey="전체매출"
                  fill={isAllSelected ? "#1AD079" : "rgba(26, 208, 121, 0.4)"}
                  name="전체 매출"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="전체원가"
                  fill={isAllSelected ? "#333333" : "rgba(51, 51, 51, 0.4)"}
                  name="전체 원가"
                  radius={[2, 2, 0, 0]}
                />
                {/* 브랜드 막대 - 선택 시에만 */}
                {!isAllSelected && (
                  <>
                    <Bar
                      yAxisId="left"
                      dataKey="브랜드매출"
                      fill="#1AD079"
                      name={`${selectedBrand} 매출`}
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="브랜드원가"
                      fill="#333333"
                      name={`${selectedBrand} 원가`}
                      radius={[2, 2, 0, 0]}
                    />
                  </>
                )}
                {/* 전체 GM 라인 */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="전체GM"
                  stroke={isAllSelected ? "#FF9500" : "rgba(255, 149, 0, 0.4)"}
                  strokeWidth={2}
                  dot={false}
                  name="전체 GM%"
                />
                {/* 브랜드 GM 라인 */}
                {!isAllSelected && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="브랜드GM"
                    stroke="#FF9500"
                    strokeWidth={2}
                    dot={false}
                    name={`${selectedBrand} GM%`}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 브랜드별 손익 현황 (GM) - 클릭하면 스타일 펼침 */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-foreground">브랜드별 손익 현황 (GM)</CardTitle>
          <p className="text-sm text-muted-foreground">26SS 시즌 - 브랜드 클릭 시 스타일별 상세 내역</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">브랜드</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">오더</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">스타일</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">매출</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">원가</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">GM%</th>
                </tr>
              </thead>
              <tbody>
                {brandProfitData.map((item) => (
                  <React.Fragment key={item.brand}>
                    <tr 
                      className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => toggleBrandExpand(item.brand)}
                    >
                      <td className="py-3 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {expandedBrand === item.brand ? (
                            <ChevronDown className="h-4 w-4 text-primary" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          {item.brand}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-foreground">{item.orders}건</td>
                      <td className="text-right py-3 px-4 text-foreground">{item.styles}개</td>
                      <td className="text-right py-3 px-4 text-foreground">{formatKRW(item.revenue)}</td>
                      <td className="text-right py-3 px-4 text-foreground">{formatKRW(item.cost)}</td>
                      <td className="text-right py-3 px-4">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                          {item.gm}%
                        </Badge>
                      </td>
                    </tr>
                    {/* 스타일별 상세 (펼침) */}
                    {expandedBrand === item.brand && brandStyleData[item.brand] && (
                      <tr>
                        <td colSpan={6} className="p-0">
                          <div className="bg-muted/30 p-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">스타일</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">매출</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">원가</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">GM%</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">기획량</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">재단량</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">재단율</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">입고량</th>
                                </tr>
                              </thead>
                              <tbody>
                                {brandStyleData[item.brand].map((style) => (
                                  <tr key={style.styleNo} className="border-b border-border/50">
                                    <td className="py-2 px-3 font-medium text-foreground">{style.styleNo}</td>
                                    <td className="text-right py-2 px-3 text-foreground">{formatKRW(style.revenue)}</td>
                                    <td className="text-right py-2 px-3 text-foreground">{formatKRW(style.cost)}</td>
                                    <td className="text-right py-2 px-3">
                                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary text-xs">
                                        {style.gm}%
                                      </Badge>
                                    </td>
                                    <td className="text-right py-2 px-3 text-foreground">{style.planQty.toLocaleString()}</td>
                                    <td className="text-right py-2 px-3 text-foreground">{style.cutQty.toLocaleString()}</td>
                                    <td className="text-right py-2 px-3">
                                      <span className={`font-medium ${style.cutRate >= 90 ? "text-primary" : style.cutRate >= 70 ? "text-amber-600" : "text-destructive"}`}>
                                        {style.cutRate}%
                                      </span>
                                    </td>
                                    <td className="text-right py-2 px-3 text-foreground">{style.inQty.toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 공장별 / 브랜드별 손익 현황 - 3단계 펼침 (공장 → 브랜드 → 스타일) */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-foreground">공장별 / 브랜드별 손익 현황</CardTitle>
          <p className="text-sm text-muted-foreground">26SS 시즌 - 공장 클릭 시 브랜드별, 브랜드 클릭 시 스타일별 상세 내역</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">공장</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">매출</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">원가</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">GM%</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">평균 재단율</th>
                </tr>
              </thead>
              <tbody>
                {factoryBrandProfitData.map((factory) => (
                  <React.Fragment key={factory.factory}>
                    <tr 
                      className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => toggleFactoryExpand(factory.factory)}
                    >
                      <td className="py-3 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {expandedFactory === factory.factory ? (
                            <ChevronDown className="h-4 w-4 text-primary" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Factory className="h-4 w-4 text-muted-foreground" />
                          {factory.factory}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-foreground">{formatKRW(factory.totalRevenue)}</td>
                      <td className="text-right py-3 px-4 text-foreground">{formatKRW(factory.totalCost)}</td>
                      <td className="text-right py-3 px-4">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                          {factory.totalGm}%
                        </Badge>
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className={`font-medium ${factory.avgCutRate >= 90 ? "text-primary" : factory.avgCutRate >= 70 ? "text-amber-600" : "text-destructive"}`}>
                          {factory.avgCutRate}%
                        </span>
                      </td>
                    </tr>
                    {/* 브랜드별 상세 (2단계) */}
                    {expandedFactory === factory.factory && (
                      <tr>
                        <td colSpan={5} className="p-0">
                          <div className="bg-muted/30 p-4">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">브랜드</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">매출</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">원가</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">GM%</th>
                                  <th className="text-right py-2 px-3 font-semibold text-muted-foreground">재단율</th>
                                </tr>
                              </thead>
                              <tbody>
                                {factory.brands.map((brand) => {
                                  const factoryBrandKey = `${factory.factory}-${brand.brand}`;
                                  return (
                                    <React.Fragment key={brand.brand}>
                                      <tr 
                                        className="border-b border-border/50 hover:bg-muted/50 cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFactoryBrandExpand(factoryBrandKey);
                                        }}
                                      >
                                        <td className="py-2 px-3 font-medium text-foreground">
                                          <div className="flex items-center gap-2">
                                            {expandedFactoryBrand === factoryBrandKey ? (
                                              <ChevronDown className="h-4 w-4 text-primary" />
                                            ) : (
                                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            {brand.brand}
                                          </div>
                                        </td>
                                        <td className="text-right py-2 px-3 text-foreground">{formatKRW(brand.revenue)}</td>
                                        <td className="text-right py-2 px-3 text-foreground">{formatKRW(brand.cost)}</td>
                                        <td className="text-right py-2 px-3">
                                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary text-xs">
                                            {brand.gm}%
                                          </Badge>
                                        </td>
                                        <td className="text-right py-2 px-3">
                                          <span className={`font-medium ${brand.cutRate >= 90 ? "text-primary" : brand.cutRate >= 70 ? "text-amber-600" : "text-destructive"}`}>
                                            {brand.cutRate}%
                                          </span>
                                        </td>
                                      </tr>
                                      {/* 스타일별 상세 (3단계) */}
                                      {expandedFactoryBrand === factoryBrandKey && factoryBrandStyleData[factory.factory]?.[brand.brand] && (
                                        <tr>
                                          <td colSpan={5} className="p-0">
                                            <div className="bg-muted/50 p-3 ml-6">
                                              <table className="w-full text-sm">
                                                <thead>
                                                  <tr className="border-b border-border">
                                                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground text-xs">스타일</th>
                                                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">매출</th>
                                                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">원가</th>
                                                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">GM%</th>
                                                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">기획량</th>
                                                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">재단량</th>
                                                    <th className="text-right py-2 px-2 font-semibold text-muted-foreground text-xs">재단율</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {factoryBrandStyleData[factory.factory][brand.brand].map((style) => (
                                                    <tr key={style.styleNo} className="border-b border-border/30">
                                                      <td className="py-1.5 px-2 font-medium text-foreground text-xs">{style.styleNo}</td>
                                                      <td className="text-right py-1.5 px-2 text-foreground text-xs">{formatKRW(style.revenue)}</td>
                                                      <td className="text-right py-1.5 px-2 text-foreground text-xs">{formatKRW(style.cost)}</td>
                                                      <td className="text-right py-1.5 px-2">
                                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary text-[10px] px-1.5 py-0">
                                                          {style.gm}%
                                                        </Badge>
                                                      </td>
                                                      <td className="text-right py-1.5 px-2 text-foreground text-xs">{style.planQty.toLocaleString()}</td>
                                                      <td className="text-right py-1.5 px-2 text-foreground text-xs">{style.cutQty.toLocaleString()}</td>
                                                      <td className="text-right py-1.5 px-2">
                                                        <span className={`font-medium text-xs ${style.cutRate >= 90 ? "text-primary" : style.cutRate >= 70 ? "text-amber-600" : "text-destructive"}`}>
                                                          {style.cutRate}%
                                                        </span>
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
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
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
