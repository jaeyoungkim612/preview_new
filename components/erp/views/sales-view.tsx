"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  Truck,
  CheckCircle,
  AlertTriangle,
  X,
  ZoomIn,
  ZoomOut,
  Download,
  Camera,
  ArrowRight,
  ShoppingCart,
  Package,
  ClipboardList,
  Factory,
  ClipboardCheck,
  DollarSign,
  Send,
  BarChart3,
  Archive,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface SalesViewProps {
  subMenu?: string;
}

interface WorkOrderData {
  _debug?: {
    foundPage7?: boolean;
    usedFormat?: string;
    pListSource?: string;
  };
  brand?: string;
  styleNo?: string;
  styleName?: string;
  season?: string;
  dsManager?: string;
  mdManager?: string;
  totalQty?: number;
  fabricSpec?: string;
  fabricComposition?: string;
  inboundDate?: string;
  shipCountry?: string;
  productionCountry?: string;
  sizes?: Array<{ size: string; qty: number }>;
  pList?: Array<{
    materialName?: string;
    code?: string;
    supplier?: string;
    size?: string;
    qty?: string;
    placement?: string;
  }>;
  notes?: string;
}

interface SavedWorkOrder {
  id: string;
  orderNo: string;
  brand: string;
  styleNo: string;
  styleName: string;
  totalQty: number;
  createdAt: string;
  thumbnailImage?: string | null;
  hasPdf: boolean;
  materialOrderStatus: "pending" | "in-progress" | "completed";
  productionStatus: "pending" | "in-progress" | "completed";
  deliveryStatus: "pending" | "in-progress" | "completed";
}

const buyerOrderData = [
  { buyer: "MLB Korea", orders: 45, amount: 28500, onTime: 92 },
  { buyer: "HAZZYS", orders: 38, amount: 22300, onTime: 88 },
  { buyer: "K2 Korea", orders: 32, amount: 18700, onTime: 95 },
  { buyer: "Black Yak", orders: 28, amount: 15200, onTime: 85 },
];

const deliveryTrendData = [
  { month: "1월", onTime: 92, delayed: 8 },
  { month: "2월", onTime: 88, delayed: 12 },
  { month: "3월", onTime: 95, delayed: 5 },
  { month: "4월", onTime: 91, delayed: 9 },
  { month: "5월", onTime: 89, delayed: 11 },
  { month: "6월", onTime: 94, delayed: 6 },
];

// 더미 데이터는 제거 - 실제 OCR/AI 결과만 사용

export function SalesView({ subMenu = "sales-navigator" }: SalesViewProps) {
  const [activeTab, setActiveTab] = useState(subMenu || "sales-navigator");
  
  // subMenu prop 변경 시 activeTab 동기화
  useEffect(() => {
    setActiveTab(subMenu || "sales-navigator");
  }, [subMenu]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<WorkOrderData | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [workOrders, setWorkOrders] = useState<SavedWorkOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // PDF 캡쳐 기능
  const [isCaptureMode, setIsCaptureMode] = useState(false);
  const [captureStart, setCaptureStart] = useState<{ x: number; y: number } | null>(null);
  const [captureEnd, setCaptureEnd] = useState<{ x: number; y: number } | null>(null);
  const [capturePageNum, setCapturePageNum] = useState(1);
  const [captureTotalPages, setCaptureTotalPages] = useState(1);
  const [captureCanvas, setCaptureCanvas] = useState<HTMLCanvasElement | null>(null);
  const [savedCaptureImages, setSavedCaptureImages] = useState<string[]>([]); // 저장된 캡쳐 이미지들
  const pdfCanvasRef = React.useRef<HTMLCanvasElement>(null);

  // localStorage 자동 복원 제거 (편집 시에만 복원)
  // useEffect(() => {
  //   const savedData = localStorage.getItem("extractedWorkOrderData");
  //   if (savedData) {
  //     try {
  //       const parsed = JSON.parse(savedData);
  //       setExtractedData(parsed);
  //       console.log("✅ 저장된 작업지시서 데이터 복원");
  //     } catch (error) {
  //       console.error("저장된 데이터 복원 실패:", error);
  //     }
  //   }
  // }, []);

  // extractedData 변경 시 localStorage에 저장
  useEffect(() => {
    if (extractedData) {
      localStorage.setItem("extractedWorkOrderData", JSON.stringify(extractedData));
      console.log("💾 작업지시서 데이터 저장");
    }
  }, [extractedData]);

  // subMenu가 변경될 때마다 activeTab 동기화
  useEffect(() => {
    if (subMenu) {
      setActiveTab(subMenu);
    }
  }, [subMenu]);

  // 작업지시서 목록 불러오기
  useEffect(() => {
    if (activeTab === "workorder-list") {
      fetchWorkOrders();
    }
  }, [activeTab]);

  const fetchWorkOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch("/api/workorders");
      const data = await response.json();
      if (data.success) {
        setWorkOrders(data.workOrders);
      }
    } catch (error) {
      console.error("작업지시서 목록 불러오기 실패:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewDetail = async (orderNo: string) => {
    try {
      console.log("🔍 상세보기 시작:", orderNo);
      
      const response = await fetch(`/api/create-order?orderNo=${orderNo}`);
      const data = await response.json();
      
      console.log("📦 상세 데이터:", data);
      console.log("📋 P-List:", data.pList);
      console.log("📋 P-List 개수:", data.pList?.length);
      
      if (data && !data.error) {
        setSelectedOrder(data);
        setShowDetailModal(true);
      } else {
        alert("작업지시서 상세 정보를 불러오는데 실패했습니다: " + (data.error || "데이터 없음"));
      }
    } catch (error) {
      console.error("작업지시서 상세 불러오기 실패:", error);
      alert("작업지시서 상세 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleDeleteOrder = async (orderNo: string) => {
    if (!confirm(`오더 ${orderNo}를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/delete-order?orderNo=${orderNo}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        alert("✅ 오더가 삭제되었습니다.");
        fetchWorkOrders(); // 목록 새로고침
      } else {
        alert(`❌ 삭제 실패: ${data.error}`);
      }
    } catch (error) {
      console.error("오더 삭제 실패:", error);
      alert("오더 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEditOrder = async (orderNo: string) => {
    try {
      console.log("📝 편집 시작:", orderNo);
      
      // 작업지시서 상세 정보 불러오기
      const response = await fetch(`/api/create-order?orderNo=${orderNo}`);
      const data = await response.json();
      
      console.log("📦 받은 데이터:", data);
      console.log("📋 P-List 개수:", data.pList?.length);
      
      if (data && !data.error) {
        const editData: WorkOrderData = {
          brand: data.brand || "",
          styleNo: data.style_no || "",
          styleName: data.style_name || "",
          season: data.season || "",
          dsManager: data.ds_manager || "",
          mdManager: data.md_manager || "",
          totalQty: data.total_qty || 0,
          fabricSpec: data.fabric_spec || "",
          fabricComposition: data.fabric_composition || "",
          inboundDate: data.inbound_date || "",
          shipCountry: data.ship_country || "",
          productionCountry: data.production_country || "",
          sizes: data.sizes?.map((s: any) => ({ 
            size: s.size || "", 
            qty: Number(s.qty) || 0 
          })) || [],
          pList: data.pList?.map((p: any) => ({
            materialName: p.material_name || "",
            code: p.code || "",
            supplier: p.supplier || "",
            size: p.size || "",
            qty: p.qty || "",
            placement: p.placement || "",
          })) || [],
          notes: data.notes || "",
        };
        
        console.log("✅ 변환된 데이터:", editData);
        console.log("✅ P-List:", editData.pList);
        
        // PDF 데이터가 있으면 복원
        if (data.pdf_data) {
          console.log("📄 PDF 복원 시작...");
          try {
            // Base64 → Binary → Blob → File
            const binaryString = atob(data.pdf_data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const pdfFile = new File([blob], `${orderNo}.pdf`, { type: 'application/pdf' });
            
            setUploadedFile(pdfFile);
            setPdfPreviewUrl(URL.createObjectURL(blob));
            console.log("✅ PDF 복원 완료");
          } catch (error) {
            console.error("❌ PDF 복원 실패:", error);
          }
        }
        
        // 캡처 이미지들 복원
        if (data.captureImages && Array.isArray(data.captureImages)) {
          console.log("🖼️ 캡처 이미지 복원 시작...", data.captureImages.length, "개");
          setSavedCaptureImages(data.captureImages);
          console.log("✅ 캡처 이미지 복원 완료");
        }
        
        // 상태 업데이트
        setExtractedData(editData);
        
        // 작업지시서 등록 탭으로 이동
        setActiveTab("pdf-order");
        
        console.log("✅ 탭 이동 완료");
      } else {
        console.error("❌ 데이터 없음 또는 에러:", data.error);
        alert("작업지시서를 불러오는데 실패했습니다: " + (data.error || "데이터 없음"));
      }
    } catch (error) {
      console.error("❌ 작업지시서 불러오기 실패:", error);
      alert("작업지시서를 불러오는데 실패했습니다.");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setExtractedData(null);

      // PDF 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(file);
      setPdfPreviewUrl(previewUrl);

      try {
        // 1. PDF의 모든 페이지를 처리
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        setCaptureTotalPages(totalPages); // 캡쳐 기능을 위해 저장
        
        console.log(`━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`PDF 총 ${totalPages}페이지 처리 시작`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━`);
        
        // Step 1: 모든 페이지를 이미지로 변환 (빠름)
        console.log("Step 1: 모든 페이지를 이미지로 변환 중...");
        const canvases: { pageNum: number; canvas: HTMLCanvasElement }[] = [];
        let firstPageBlob: Blob | null = null;
        let page7Blob: Blob | null = null;
        
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          // 7페이지는 특별히 더 높은 해상도로 (BOM 표 정확도 향상)
          // 8배 스케일로 초고해상도 렌더링 - 표의 각 글자를 명확하게
          const scale = pageNum === 7 ? 8.0 : 4.0;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context!,
            viewport: viewport,
          }).promise;

          canvases.push({ pageNum, canvas });

          // 첫 페이지는 Blob으로 저장
          if (pageNum === 1) {
            firstPageBlob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((blob) => resolve(blob!), "image/png");
            });
          }
          
          // 7페이지도 Blob으로 저장 (BOM 테이블)
          if (pageNum === 7) {
            page7Blob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((blob) => resolve(blob!), "image/png");
            });
          }
        }
        console.log(`✅ ${totalPages}개 페이지 이미지 변환 완료`);
        
        // Step 2: 모든 페이지 OCR을 병렬 처리 (빠름!)
        console.log("Step 2: OCR 병렬 처리 시작...");
        const Tesseract = await import("tesseract.js");
        
        const ocrPromises = canvases.map(async ({ pageNum, canvas }) => {
          console.log(`[${pageNum}/${totalPages}] OCR 시작`);
          
          const { data: { text } } = await Tesseract.recognize(
            canvas,
            'eng+kor', // 영어 우선, 한국어 보조
            {
              logger: (m) => {
                if (m.status === 'recognizing text') {
                  const progress = Math.round(m.progress * 100);
                  console.log(`[${pageNum}/${totalPages}] OCR: ${progress}%`);
                }
              },
              // 표 인식을 위한 최적 설정
              tessedit_pageseg_mode: Tesseract.PSM.AUTO, // 자동 페이지 분할
              tessedit_char_whitelist: undefined, // 모든 문자 허용
            }
          );
          
          console.log(`✅ [${pageNum}/${totalPages}] OCR 완료 (${text.length}자)`);
          return { pageNum, text };
        });
        
        // 모든 OCR 작업이 완료될 때까지 대기
        const ocrResults = await Promise.all(ocrPromises);
        
        // 페이지 순서대로 정렬하여 텍스트 결합
        ocrResults.sort((a, b) => a.pageNum - b.pageNum);
        const combinedOcrText = ocrResults
          .map(({ pageNum, text }) => `\n\n━━━━━ 페이지 ${pageNum} ━━━━━\n${text}`)
          .join("");
        
        console.log("━━━━━━━━━━━━━━━━━━━━━━");
        console.log("✅ 전체 PDF 병렬 처리 완료!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━");
        console.log("총 OCR 텍스트 길이:", combinedOcrText.length);
        console.log("━━━━━━━━━━━━━━━━━━━━━━");
        
        // 7페이지 확인
        const page7Index = combinedOcrText.indexOf("━━━━━ 페이지 7 ━━━━━");
        if (page7Index !== -1) {
          console.log("✅ 페이지 7 발견! 위치:", page7Index);
          const page7Content = combinedOcrText.substring(page7Index, page7Index + 2000);
          console.log("페이지 7 내용 미리보기:");
          console.log(page7Content);
        } else {
          console.log("⚠️ 페이지 7을 찾을 수 없습니다!");
        }
        
        console.log("━━━━━━━━━━━━━━━━━━━━━━");
        console.log("전체 미리보기 (처음 1000자):");
        console.log(combinedOcrText.substring(0, 1000));
        console.log("━━━━━━━━━━━━━━━━━━━━━━");

        // 3. FormData로 첫 페이지 이미지 + 7페이지 이미지 + 전체 OCR 텍스트 전송
        const formData = new FormData();
        formData.append("image", firstPageBlob!, "workorder-page1.png");
        if (page7Blob) {
          formData.append("page7Image", page7Blob, "workorder-page7.png");
          console.log("✅ 7페이지 이미지 추가됨 (BOM 테이블)");
        }
        formData.append("ocrText", combinedOcrText); // 전체 페이지 OCR 텍스트

        const response = await fetch("/api/analyze-workorder", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success && result.data) {
          setExtractedData(result.data);
          
          // 디버그 정보 출력
          if (result.data._debug) {
            console.log("━━━━━━━━━━━━━━━━━━━━━━");
            console.log("🔍 AI 분석 결과:");
            console.log("━━━━━━━━━━━━━━━━━━━━━━");
            console.log("페이지 7 발견:", result.data._debug.foundPage7 ? "✅" : "❌");
            console.log("사용된 형식:", result.data._debug.usedFormat);
            console.log("P-List 출처:", result.data._debug.pListSource);
            console.log("P-List 항목 수:", result.data.pList?.length || 0);
            console.log("━━━━━━━━━━━━━━━━━━━━━━");
          }
        } else {
          console.error("AI 분석 실패:", result.error);
          alert("AI가 정보를 추출하지 못했습니다: " + result.error);
        }
      } catch (error) {
        console.error("처리 에러:", error);
        alert("파일 처리 중 오류가 발생했습니다: " + error);
      }
    }
  };

  const handleReset = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }
    setUploadedFile(null);
    setPdfPreviewUrl(null);
    setExtractedData(null);
    setZoom(100);
    setIsCaptureMode(false);
    setCaptureStart(null);
    setCaptureEnd(null);
    setCaptureCanvas(null);
    setCapturePageNum(1);
    setSavedCaptureImages([]);
    
    // localStorage에서도 삭제
    localStorage.removeItem("extractedWorkOrderData");
    console.log("🗑️ 작업지시서 데이터 삭제");
  };

  // PDF 캡쳐 기능: 페이지를 canvas로 렌더링
  const renderPageForCapture = async (pageNum: number) => {
    if (!uploadedFile) return;

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(pageNum);
      
      const scale = 3.0; // 캡쳐용 고해상도
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context!,
        viewport: viewport,
      }).promise;
      
      setCaptureCanvas(canvas);
      
      // ref에도 설정
      if (pdfCanvasRef.current) {
        pdfCanvasRef.current.width = canvas.width;
        pdfCanvasRef.current.height = canvas.height;
        const ctx = pdfCanvasRef.current.getContext("2d");
        if (ctx) {
          ctx.drawImage(canvas, 0, 0);
        }
      }
    } catch (error) {
      console.error("페이지 렌더링 실패:", error);
      alert("페이지를 불러오지 못했습니다.");
    }
  };

  // 캡쳐 모드 시작
  const handleStartCapture = async () => {
    if (!uploadedFile) return;
    setIsCaptureMode(true);
    setCapturePageNum(1);
    await renderPageForCapture(1);
  };

  // 캡쳐 페이지 변경
  const handleCapturePageChange = async (pageNum: number) => {
    if (pageNum < 1 || pageNum > captureTotalPages) return;
    setCapturePageNum(pageNum);
    await renderPageForCapture(pageNum);
  };

  // 영역 선택 시작
  const handleCaptureStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pdfCanvasRef.current) return;
    const rect = pdfCanvasRef.current.getBoundingClientRect();
    const scaleX = pdfCanvasRef.current.width / rect.width;
    const scaleY = pdfCanvasRef.current.height / rect.height;
    
    setCaptureStart({ 
      x: (e.clientX - rect.left) * scaleX, 
      y: (e.clientY - rect.top) * scaleY 
    });
    setCaptureEnd(null);
  };

  // 영역 선택 중
  const handleCaptureMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!captureStart || !pdfCanvasRef.current) return;
    const rect = pdfCanvasRef.current.getBoundingClientRect();
    const scaleX = pdfCanvasRef.current.width / rect.width;
    const scaleY = pdfCanvasRef.current.height / rect.height;
    
    setCaptureEnd({ 
      x: (e.clientX - rect.left) * scaleX, 
      y: (e.clientY - rect.top) * scaleY 
    });
  };

  // 영역 선택 완료 및 저장
  const handleCaptureEnd = () => {
    if (!captureStart || !captureEnd || !pdfCanvasRef.current) return;

    const canvas = pdfCanvasRef.current;
    const x = Math.min(captureStart.x, captureEnd.x);
    const y = Math.min(captureStart.y, captureEnd.y);
    const width = Math.abs(captureEnd.x - captureStart.x);
    const height = Math.abs(captureEnd.y - captureStart.y);

    // 선택 영역이 너무 작으면 무시
    if (width < 10 || height < 10) {
      setCaptureStart(null);
      setCaptureEnd(null);
      return;
    }

    // 캡처 영역을 새 캔버스에 그리기
    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;
    const ctx = newCanvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
      
      const captureDataUrl = newCanvas.toDataURL('image/png');
      
      // 캡쳐 이미지를 state에 저장 (나중에 오더 생성 시 함께 전송)
      setSavedCaptureImages(prev => [...prev, captureDataUrl]);
      
      // 다운로드 창 제거 - 자동 다운로드 비활성화
      console.log(`✅ 캡쳐 완료 (${savedCaptureImages.length + 1}개)`);
    }

    // 선택 영역 초기화
    setCaptureStart(null);
    setCaptureEnd(null);
  };

  const handleCreateOrder = async () => {
    if (!extractedData) return;

    setIsCreatingOrder(true);
    try {
      // PDF를 base64로 변환
      let pdfBase64 = null;
      if (uploadedFile) {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        
        // 큰 파일의 경우 청크 단위로 처리하여 stack overflow 방지
        const chunkSize = 8192;
        let binary = '';
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize);
          binary += String.fromCharCode(...chunk);
        }
        pdfBase64 = btoa(binary);
        console.log("📄 PDF 크기:", pdfBase64.length, "bytes");
      }

      // 캡쳐 이미지 + PDF도 함께 전송
      const orderData = {
        ...extractedData,
        captureImages: savedCaptureImages,
        pdfData: pdfBase64, // PDF 파일 추가
      };

      console.log("📦 전송할 오더 데이터:");
      console.log("  - P-List 개수:", orderData.pList?.length || 0);
      console.log("  - P-List 샘플:", orderData.pList?.[0]);
      console.log("  - 전체 데이터:", JSON.stringify(orderData).substring(0, 500));

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ 오더 생성 완료!\n오더번호: ${result.orderNo}\n캡쳐 이미지: ${savedCaptureImages.length}개`);
        
        // 🔥 모든 상태 초기화
        handleReset();
        
        console.log("🧹 모든 데이터 초기화 완료");
        
        // 작업지시서 현황 탭으로 이동
        setActiveTab("workorder-list");
        
        // 목록 새로고침
        fetchWorkOrders();
      } else {
        alert(`❌ 오더 생성 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("오더 생성 에러:", error);
      alert("오더 생성 중 오류가 발생했습니다.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="sales-navigator">영업 네비게이터</TabsTrigger>
          <TabsTrigger value="sales-dashboard">영업 대시보드</TabsTrigger>
          <TabsTrigger value="pdf-order">작업지시서 등록</TabsTrigger>
          <TabsTrigger value="workorder-list">작업지시서 현황</TabsTrigger>
        </TabsList>

        {/* ============ 전체 프로세스 네비게이터 ============ */}
        <TabsContent value="sales-navigator" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900/30 dark:to-blue-900/30 border-b-2 border-blue-300 dark:border-blue-700">
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                <Factory className="h-8 w-8 text-blue-600" />
                영업 프로세스
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                영업·구매·재고·공장관리 시스템이 오더 단위로 유기적으로 연동되어 업무 정보가 단계별로 자동스캔게 되어 있습니다. 각 시스템은 Stella ERP로 자동 연계되어, 매출·원가·재고·손익이 일괄관리 기준으로 관리됩니다.
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {/* 3개 영역을 가로로 배치 */}
              <div className="grid grid-cols-3 gap-8">
                
                {/* ========== 영업관리 영역 (강조) ========== */}
                <div className="space-y-4 relative">
                  {/* 강조 배경 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl -z-10 border-4 shadow-2xl" style={{borderColor: '#17AE6B'}}></div>
                  <div className="p-4">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold pb-2 inline-block px-6 border-b-4" style={{color: '#17AE6B', borderColor: '#17AE6B'}}>
                        영업관리
                      </h2>
                      <p className="text-xs mt-2 font-semibold" style={{color: '#17AE6B'}}>현재 페이지</p>
                    </div>
                  
                  {/* 고객사 발주 수신 */}
                  <div
                    onClick={() => {
                      setActiveTab('pdf-order');
                      window.history.pushState({}, '', '/?menu=sales&subMenu=pdf-order');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-28 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #17AE6B, #15995E)', borderColor: '#17AE6B'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <FileText className="h-10 w-10 mb-1 relative z-10" />
                      <h3 className="text-xl font-bold relative z-10">고객사 발주 수신</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-10 w-10 rotate-90" style={{color: '#17AE6B'}} />
                  </div>
                  
                  {/* 영업 오더 등록 */}
                  <div
                    onClick={() => {
                      setActiveTab('pdf-order');
                      window.history.pushState({}, '', '/?menu=sales&subMenu=pdf-order');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-28 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #17AE6B, #15995E)', borderColor: '#17AE6B'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <ClipboardCheck className="h-10 w-10 mb-1 relative z-10" />
                      <h3 className="text-xl font-bold relative z-10">영업 오더 등록</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-10 w-10 rotate-90" style={{color: '#17AE6B'}} />
                  </div>
                  
                  {/* 출하 */}
                  <div className="cursor-pointer group opacity-60">
                    <div className="h-28 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #25C47D, #17AE6B)', borderColor: '#25C47D'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <Truck className="h-10 w-10 mb-1 relative z-10" />
                      <h3 className="text-xl font-bold relative z-10">출하</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-10 w-10 rotate-90" style={{color: '#17AE6B'}} />
                  </div>
                  
                  {/* 대금청구 */}
                  <div className="cursor-pointer group opacity-60">
                    <div className="h-28 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden border" style={{background: 'linear-gradient(to bottom right, #25C47D, #17AE6B)', borderColor: '#25C47D'}}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <DollarSign className="h-10 w-10 mb-1 relative z-10" />
                      <h3 className="text-xl font-bold relative z-10">대금청구</h3>
                    </div>
                  </div>
                  </div>
                </div>

                {/* ========== 구매관리 영역 ========== */}
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold pb-2 inline-block px-6 border-b-4 text-slate-600 dark:text-slate-400 border-slate-500">
                      구매관리
                    </h2>
                  </div>
                  
                  {/* 구매 요청 */}
                  <div
                    onClick={() => {
                      window.history.pushState({}, '', '/?menu=purchase&subMenu=request');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <ShoppingCart className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">구매 요청</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-500 rotate-90" />
                  </div>
                  
                  {/* 구매처 발주 */}
                  <div
                    onClick={() => {
                      window.history.pushState({}, '', '/?menu=purchase&subMenu=order');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <Send className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">구매처 발주</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-500 rotate-90" />
                  </div>
                  
                  {/* 구매 입고 */}
                  <div
                    onClick={() => {
                      window.history.pushState({}, '', '/?menu=purchase&subMenu=order');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="h-24 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <Package className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">구매 입고</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-8 w-8 text-slate-500 rotate-90" />
                  </div>
                  
                  {/* 송장확인 */}
                  <div className="cursor-pointer group opacity-60">
                    <div className="h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white relative overflow-hidden border border-slate-400">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <FileText className="h-8 w-8 mb-1 relative z-10" />
                      <h3 className="text-lg font-bold relative z-10">송장확인</h3>
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

        {/* ============ 영업 대시보드 ============ */}
        <TabsContent value="sales-dashboard" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">진행중 오더</p>
                    <p className="text-xl font-bold text-foreground">143건</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">납기 준수율</p>
                    <p className="text-xl font-bold text-primary">91.2%</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">출하 대기</p>
                    <p className="text-xl font-bold text-foreground">28건</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">납기 임박</p>
                    <p className="text-xl font-bold text-destructive">8건</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">바이어별 오더 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={buyerOrderData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis dataKey="buyer" type="category" stroke="var(--muted-foreground)" fontSize={11} width={80} />
                      <Tooltip />
                      <Bar dataKey="orders" name="오더수" fill="#1AD079" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">납기 준수율 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deliveryTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[80, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="onTime" name="준수율(%)" stroke="#1AD079" strokeWidth={2} dot={{ fill: "#1AD079" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">출하 진행 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">바이어</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">오더수</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">금액(만원)</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">납기준수율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyerOrderData.map((item) => (
                      <tr key={item.buyer} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium text-foreground">{item.buyer}</td>
                        <td className="text-right py-3 px-4 text-foreground">{item.orders}건</td>
                        <td className="text-right py-3 px-4 text-foreground">₩{item.amount.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          <span className={`font-bold ${item.onTime >= 90 ? "text-primary" : "text-destructive"}`}>{item.onTime}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf-order" className="space-y-6 mt-6">
          {!uploadedFile && !extractedData ? (
          <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">작업지시서 업로드</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-foreground font-medium mb-2">PDF 파일을 업로드하세요</p>
                  <p className="text-sm text-muted-foreground mb-6">작업지시서(PDF)를 업로드하면 자동으로 정보를 추출합니다</p>
                  <label htmlFor="pdf-upload">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                      <span>
                  <Upload className="h-4 w-4 mr-2" />파일 선택
                      </span>
                </Button>
                  </label>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
              </div>
            </CardContent>
          </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* PDF 이미지 뷰어 - 좌측 2/3 (PDF가 있을 때만 표시) */}
              {uploadedFile && (
              <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground">
                        {uploadedFile.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground w-12 text-center">{zoom}%</span>
                        <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant={isCaptureMode ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => {
                            if (isCaptureMode) {
                              setIsCaptureMode(false);
                              setCaptureCanvas(null);
                              setCaptureStart(null);
                              setCaptureEnd(null);
                            } else {
                              handleStartCapture();
                            }
                          }}
                          disabled={!pdfPreviewUrl}
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          {isCaptureMode ? "취소" : "캡쳐"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleReset}>
                          <X className="h-4 w-4" />
                </Button>
              </div>
                      {isCaptureMode && (
                        <div className="bg-primary/10 px-3 py-2 rounded-md mt-2 space-y-2">
                          <div className="text-xs text-muted-foreground">
                            💡 드래그하여 영역을 선택하세요
              </div>
                <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCapturePageChange(Math.max(1, capturePageNum - 1))}
                              disabled={capturePageNum <= 1}
                            >
                              이전
                            </Button>
                            <span className="text-xs">
                              페이지 {capturePageNum} / {captureTotalPages}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCapturePageChange(Math.min(captureTotalPages, capturePageNum + 1))}
                              disabled={capturePageNum >= captureTotalPages}
                            >
                              다음
                  </Button>
                </div>
                        </div>
                      )}
              </div>
            </CardHeader>
                  <CardContent className="p-4">
                    <div className="border border-border rounded-lg overflow-auto max-h-[800px] bg-muted/20 relative flex items-center justify-center">
                      {pdfPreviewUrl ? (
                        isCaptureMode ? (
                          <div className="relative">
                            <canvas
                              ref={pdfCanvasRef}
                              className="cursor-crosshair max-w-full h-auto"
                              onMouseDown={handleCaptureStart}
                              onMouseMove={handleCaptureMove}
                              onMouseUp={handleCaptureEnd}
                            />
                            {captureStart && captureEnd && (
                              <div
                                className="absolute border-2 border-primary bg-primary/20 pointer-events-none"
                                style={{
                                  left: `${(Math.min(captureStart.x, captureEnd.x) / pdfCanvasRef.current.width) * 100}%`,
                                  top: `${(Math.min(captureStart.y, captureEnd.y) / pdfCanvasRef.current.height) * 100}%`,
                                  width: `${(Math.abs(captureEnd.x - captureStart.x) / pdfCanvasRef.current.width) * 100}%`,
                                  height: `${(Math.abs(captureEnd.y - captureStart.y) / pdfCanvasRef.current.height) * 100}%`,
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <iframe
                            src={pdfPreviewUrl}
                            className="w-full h-[800px]"
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                          />
                        )
                      ) : (
                        <div className="bg-white p-8 shadow-lg">
                          <p className="text-sm text-muted-foreground text-center py-20">
                            📄 PDF 미리보기<br/>
                            <span className="text-xs">(PDF를 업로드하세요)</span>
                          </p>
                        </div>
                      )}
              </div>
            </CardContent>
          </Card>
              </div>
              )}

              {/* 추출된 정보 폼 - 우측 1/3 (또는 전체) */}
              <div className={uploadedFile ? "lg:col-span-1" : "lg:col-span-3"}>
                <Card className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-foreground">추출된 정보</CardTitle>
                    {!extractedData && (
                      <Badge variant="secondary" className="w-fit">
                        <span className="animate-pulse">AI 분석 중...</span>
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {extractedData ? (
                      <>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">브랜드</Label>
                          <Input 
                            value={extractedData.brand || ""} 
                            onChange={(e) => setExtractedData({...extractedData, brand: e.target.value})}
                            className="bg-background"
                          />
            </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">스타일 번호</Label>
                          <Input 
                            value={extractedData.styleNo || ""} 
                            onChange={(e) => setExtractedData({...extractedData, styleNo: e.target.value})}
                            className="bg-background"
                          />
          </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">담당 DS</Label>
                            <Input 
                              value={extractedData.dsManager || ""} 
                              onChange={(e) => setExtractedData({...extractedData, dsManager: e.target.value})}
                              className="bg-background"
                            />
                    </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">담당 MD</Label>
                            <Input 
                              value={extractedData.mdManager || ""} 
                              onChange={(e) => setExtractedData({...extractedData, mdManager: e.target.value})}
                              className="bg-background"
                            />
                  </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">원단 스펙</Label>
                            <Input 
                              value={extractedData.fabricSpec || ""} 
                              onChange={(e) => setExtractedData({...extractedData, fabricSpec: e.target.value})}
                              className="bg-background"
                            />
                      </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">혼용율</Label>
                            <Input 
                              value={extractedData.fabricComposition || ""} 
                              onChange={(e) => setExtractedData({...extractedData, fabricComposition: e.target.value})}
                              className="bg-background"
                            />
                          </div>
                      </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">입고예정일</Label>
                            <Input 
                              value={extractedData.inboundDate || ""} 
                              onChange={(e) => setExtractedData({...extractedData, inboundDate: e.target.value})}
                              className="bg-background"
                            />
                      </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">총 수량</Label>
                            <Input 
                              value={extractedData.totalQty || ""} 
                              onChange={(e) => setExtractedData({...extractedData, totalQty: Number(e.target.value) || 0})}
                              type="number"
                              className="bg-background"
                            />
                    </div>
          </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">출하국가</Label>
                            <Input 
                              value={extractedData.shipCountry || ""} 
                              onChange={(e) => setExtractedData({...extractedData, shipCountry: e.target.value})}
                              className="bg-background"
                            />
                  </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">생산국가</Label>
                            <Input 
                              value={extractedData.productionCountry || ""} 
                              onChange={(e) => setExtractedData({...extractedData, productionCountry: e.target.value})}
                              className="bg-background"
                            />
                </div>
                  </div>
                        {extractedData.sizes && extractedData.sizes.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">사이즈별 수량 (편집 가능)</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {extractedData.sizes.map((item: any, idx: number) => (
                                <div key={idx} className="bg-background border border-border rounded p-2">
                                  <Input
                                    value={item.size}
                                    onChange={(e) => {
                                      const newSizes = [...extractedData.sizes!];
                                      newSizes[idx] = { ...newSizes[idx], size: e.target.value };
                                      setExtractedData({...extractedData, sizes: newSizes});
                                    }}
                                    className="text-xs text-center mb-1 h-7"
                                    placeholder="사이즈"
                                  />
                                  <Input
                                    type="number"
                                    value={item.qty}
                                    onChange={(e) => {
                                      const newSizes = [...extractedData.sizes!];
                                      newSizes[idx] = { ...newSizes[idx], qty: Number(e.target.value) || 0 };
                                      setExtractedData({...extractedData, sizes: newSizes});
                                    }}
                                    className="text-sm font-bold text-center h-8"
                                    placeholder="수량"
                                  />
                </div>
                              ))}
                  </div>
                </div>
                        )}
                        {extractedData.pList && extractedData.pList.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-muted-foreground">
                                BOM / P-List (자재 리스트) - {extractedData.pList.length}개 (편집 가능)
                              </Label>
                              {extractedData._debug && (
                                <div className="text-[10px] text-muted-foreground flex gap-2">
                                  <span className={extractedData._debug.foundPage7 ? "text-green-600" : "text-orange-600"}>
                                    {extractedData._debug.foundPage7 ? "✅ 페이지7" : "⚠️ 페이지7 없음"}
                                  </span>
                                  <span>• {extractedData._debug.usedFormat}</span>
                                </div>
                              )}
                            </div>
                            <div className="max-h-96 overflow-auto border border-border rounded-lg">
                              <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-muted">
                                  <tr className="border-b border-border text-xs">
                                    <th className="text-center p-2 bg-muted/80 w-12">No</th>
                                    <th className="text-left p-2 bg-muted/80">MATERIAL NAME</th>
                                    <th className="text-left p-2 bg-muted/80">CODE</th>
                                    <th className="text-left p-2 bg-muted/80">SUPPLIER</th>
                                    <th className="text-left p-2 bg-muted/80">SIZE</th>
                                    <th className="text-center p-2 bg-muted/80">QTY</th>
                                    <th className="text-left p-2 bg-muted/80">PLACEMENT</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {extractedData.pList.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                                      <td className="p-2 text-xs text-center font-semibold">{idx + 1}</td>
                                      <td className="p-2">
                                        <Input
                                          value={item.materialName || ""}
                                          onChange={(e) => {
                                            const newPList = [...extractedData.pList!];
                                            newPList[idx] = { ...newPList[idx], materialName: e.target.value };
                                            setExtractedData({...extractedData, pList: newPList});
                                          }}
                                          className="h-8 text-xs"
                                        />
                                      </td>
                                      <td className="p-2">
                                        <Input
                                          value={item.code || ""}
                                          onChange={(e) => {
                                            const newPList = [...extractedData.pList!];
                                            newPList[idx] = { ...newPList[idx], code: e.target.value };
                                            setExtractedData({...extractedData, pList: newPList});
                                          }}
                                          className="h-8 text-xs"
                                        />
                                      </td>
                                      <td className="p-2">
                                        <Input
                                          value={item.supplier || ""}
                                          onChange={(e) => {
                                            const newPList = [...extractedData.pList!];
                                            newPList[idx] = { ...newPList[idx], supplier: e.target.value };
                                            setExtractedData({...extractedData, pList: newPList});
                                          }}
                                          className="h-8 text-xs"
                                        />
                                      </td>
                                      <td className="p-2">
                                        <Input
                                          value={item.size || ""}
                                          onChange={(e) => {
                                            const newPList = [...extractedData.pList!];
                                            newPList[idx] = { ...newPList[idx], size: e.target.value };
                                            setExtractedData({...extractedData, pList: newPList});
                                          }}
                                          className="h-8 text-xs"
                                        />
                                      </td>
                                      <td className="p-2">
                                        <Input
                                          value={item.qty || ""}
                                          onChange={(e) => {
                                            const newPList = [...extractedData.pList!];
                                            newPList[idx] = { ...newPList[idx], qty: e.target.value };
                                            setExtractedData({...extractedData, pList: newPList});
                                          }}
                                          className="h-8 text-xs text-center"
                                        />
                                      </td>
                                      <td className="p-2">
                                        <Input
                                          value={item.placement || ""}
                                          onChange={(e) => {
                                            const newPList = [...extractedData.pList!];
                                            newPList[idx] = { ...newPList[idx], placement: e.target.value };
                                            setExtractedData({...extractedData, pList: newPList});
                                          }}
                                          className="h-8 text-xs"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                  </tbody>
                </table>
              </div>
                          </div>
                        )}
                        {savedCaptureImages.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              📸 캡쳐된 이미지 - {savedCaptureImages.length}개
                            </Label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-border rounded-lg p-2">
                              {savedCaptureImages.map((imgUrl, idx) => (
                                <div key={idx} className="relative group">
                                  <img 
                                    src={imgUrl} 
                                    alt={`캡쳐 ${idx + 1}`}
                                    className="w-full h-24 object-cover rounded border border-border"
                                  />
                                  <button
                                    onClick={() => setSavedCaptureImages(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">비고</Label>
                          <Input 
                            value={extractedData.notes || ""} 
                            onChange={(e) => setExtractedData({...extractedData, notes: e.target.value})}
                            className="bg-background"
                            placeholder="추가 메모를 입력하세요"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button 
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={handleCreateOrder}
                            disabled={isCreatingOrder}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {isCreatingOrder ? "생성 중..." : "오더 생성"}
                          </Button>
                          <Button variant="outline" onClick={handleReset}>
                            초기화
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">정보를 추출하는 중...</p>
                      </div>
                    )}
            </CardContent>
          </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="workorder-list" className="space-y-6 mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
                <span>등록된 작업지시서 목록</span>
                <Badge variant="outline">{workOrders.length}건</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : workOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">등록된 작업지시서가 없습니다.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="text-center p-3 font-medium w-24">이미지</th>
                        <th className="text-center p-3 font-medium w-20">PDF</th>
                        <th className="text-left p-3 font-medium">오더번호</th>
                        <th className="text-left p-3 font-medium">브랜드</th>
                        <th className="text-left p-3 font-medium">스타일번호</th>
                        <th className="text-left p-3 font-medium">스타일명</th>
                        <th className="text-center p-3 font-medium">총 수량</th>
                        <th className="text-center p-3 font-medium">원자재 발주</th>
                        <th className="text-center p-3 font-medium">공장 생산</th>
                        <th className="text-center p-3 font-medium">고객사 전달</th>
                        <th className="text-center p-3 font-medium">등록일</th>
                        <th className="text-center p-3 font-medium">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="p-3">
                            {order.thumbnailImage ? (
                              <img 
                                src={order.thumbnailImage} 
                                alt="썸네일"
                                className="w-20 h-20 object-cover rounded border border-border"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-muted rounded border border-border flex items-center justify-center">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {order.hasPdf ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                <FileText className="h-3 w-3 mr-1" />
                                첨부
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-muted-foreground">
                                없음
                              </Badge>
                            )}
                          </td>
                          <td className="p-3 font-mono text-xs">{order.orderNo}</td>
                          <td className="p-3">
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                              {order.brand}
                            </Badge>
                          </td>
                          <td className="p-3 font-medium">{order.styleNo}</td>
                          <td className="p-3">{order.styleName}</td>
                          <td className="p-3 text-center font-semibold">{order.totalQty.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <Badge className={
                              order.materialOrderStatus === "completed" ? "bg-green-100 text-green-800" :
                              order.materialOrderStatus === "in-progress" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-600"
                            }>
                              {order.materialOrderStatus === "completed" ? "완료" :
                               order.materialOrderStatus === "in-progress" ? "진행" : "대기"}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Badge className={
                              order.productionStatus === "completed" ? "bg-green-100 text-green-800" :
                              order.productionStatus === "in-progress" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-600"
                            }>
                              {order.productionStatus === "completed" ? "완료" :
                               order.productionStatus === "in-progress" ? "진행" : "대기"}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Badge className={
                              order.deliveryStatus === "completed" ? "bg-green-100 text-green-800" :
                              order.deliveryStatus === "in-progress" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-600"
                            }>
                              {order.deliveryStatus === "completed" ? "완료" :
                               order.deliveryStatus === "in-progress" ? "진행" : "대기"}
                            </Badge>
                          </td>
                          <td className="p-3 text-center text-muted-foreground text-xs">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex gap-1 justify-center">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetail(order.orderNo)}
                              >
                                상세
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditOrder(order.orderNo)}
                              >
                                편집
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteOrder(order.orderNo)}
                              >
                                삭제
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 상세보기 모달 */}
          {showDetailModal && selectedOrder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDetailModal(false)}>
              <div className="bg-card border border-border rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">작업지시서 상세 - {selectedOrder.order_no}</h2>
                  <Button variant="outline" size="sm" onClick={() => setShowDetailModal(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* 기본 정보 */}
                  <Card>
                    <CardHeader><CardTitle className="text-sm">기본 정보</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-3 gap-3 text-sm">
                      <div><span className="text-muted-foreground">브랜드:</span> {selectedOrder.brand}</div>
                      <div><span className="text-muted-foreground">스타일번호:</span> {selectedOrder.style_no}</div>
                      <div><span className="text-muted-foreground">스타일명:</span> {selectedOrder.style_name}</div>
                      <div><span className="text-muted-foreground">시즌:</span> {selectedOrder.season}</div>
                      <div><span className="text-muted-foreground">담당 DS:</span> {selectedOrder.ds_manager}</div>
                      <div><span className="text-muted-foreground">담당 MD:</span> {selectedOrder.md_manager}</div>
                      <div><span className="text-muted-foreground">총 수량:</span> {selectedOrder.total_qty?.toLocaleString()}</div>
                      <div><span className="text-muted-foreground">원단 스펙:</span> {selectedOrder.fabric_spec}</div>
                      <div><span className="text-muted-foreground">혼용율:</span> {selectedOrder.fabric_composition}</div>
                    </CardContent>
                  </Card>

                  {/* P-List */}
                  {selectedOrder.pList && selectedOrder.pList.length > 0 && (
                    <Card>
                      <CardHeader><CardTitle className="text-sm">BOM / P-List ({selectedOrder.pList.length}개)</CardTitle></CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-muted">
                              <tr>
                                <th className="p-2 text-left">No</th>
                                <th className="p-2 text-left">MATERIAL NAME</th>
                                <th className="p-2 text-left">CODE</th>
                                <th className="p-2 text-left">SUPPLIER</th>
                                <th className="p-2 text-left">SIZE</th>
                                <th className="p-2 text-center">QTY</th>
                                <th className="p-2 text-left">PLACEMENT</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOrder.pList.map((item: any, idx: number) => (
                                <tr key={idx} className="border-b">
                                  <td className="p-2">{idx + 1}</td>
                                  <td className="p-2">{item.material_name}</td>
                                  <td className="p-2">{item.code}</td>
                                  <td className="p-2">{item.supplier}</td>
                                  <td className="p-2">{item.size}</td>
                                  <td className="p-2 text-center">{item.qty}</td>
                                  <td className="p-2">{item.placement}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* 사이즈별 수량 */}
                  {selectedOrder.sizes && selectedOrder.sizes.length > 0 && (
                    <Card>
                      <CardHeader><CardTitle className="text-sm">사이즈별 수량</CardTitle></CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-5 gap-2">
                          {selectedOrder.sizes.map((s: any, idx: number) => (
                            <div key={idx} className="bg-muted p-2 rounded text-center text-sm">
                              <div className="text-muted-foreground text-xs">{s.size}</div>
                              <div className="font-bold">{s.qty}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}
