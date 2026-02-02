import { NextRequest, NextResponse } from "next/server"
import { db, supabase, uploadImageToStorage, uploadPdfToStorage } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("📥 받은 오더 데이터:");
    console.log("  - P-List 개수:", data.pList?.length || 0);
    console.log("  - P-List 샘플:", data.pList?.[0]);

    // 오더 번호 생성 (WO-YYMMDD-XXX 형식)
    const now = new Date()
    const year = String(now.getFullYear()).slice(2) // 26 (2026)
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dateStr = `${year}${month}${day}` // 260202
    
    const count = await db.countOrdersByPattern(`WO-${dateStr}-%`);
    const orderNo = `WO-${dateStr}-${String(count + 1).padStart(3, "0")}`;

    // PDF가 있으면 Storage에 업로드
    let pdfUrl = null;
    if (data.pdfData) {
      console.log("📄 PDF 업로드 시작...");
      pdfUrl = await uploadPdfToStorage(data.pdfData, `${orderNo}.pdf`);
      if (pdfUrl) {
        console.log("✅ PDF 업로드 완료:", pdfUrl);
      }
    }

    // 1. 오더 기본 정보 삽입
    const order = await db.createWorkOrder({
      orderNo,
      brand: data.brand || "",
      styleNo: data.styleNo || "",
      styleName: data.styleName || "",
      season: data.season || "",
      dsManager: data.dsManager || "",
      mdManager: data.mdManager || "",
      totalQty: data.totalQty || 0,
      fabricSpec: data.fabricSpec || "",
      fabricComposition: data.fabricComposition || "",
      inboundDate: data.inboundDate || "",
      shipCountry: data.shipCountry || "",
      productionCountry: data.productionCountry || "",
      notes: data.notes || "",
      pdfData: pdfUrl || null // Storage URL 저장
    });

    const orderId = order.id;

    // 2. 사이즈 정보 삽입
    if (data.sizes && Array.isArray(data.sizes)) {
      await db.addOrderSizes(orderId, data.sizes);
    }

    // 3. P-List (자재 리스트) 삽입
    if (data.pList && Array.isArray(data.pList)) {
      console.log(`💾 P-List 저장 시작: ${data.pList.length}개 항목`);
      await db.addPList(orderId, data.pList);
      console.log(`✅ P-List ${data.pList.length}개 저장 완료`);
    } else {
      console.log("⚠️ P-List가 없거나 배열이 아님:", data.pList);
    }

    // 4. 캡쳐 이미지 업로드 및 URL 저장
    if (data.captureImages && Array.isArray(data.captureImages)) {
      console.log(`📸 캡처 이미지 업로드 시작: ${data.captureImages.length}개`);
      
      const uploadPromises = data.captureImages.map(async (imageData: string, index: number) => {
        const fileName = `order_${orderNo}_capture_${index + 1}.png`;
        const imageUrl = await uploadImageToStorage(imageData, fileName);
        
        if (imageUrl) {
          return {
            order_id: orderId,
            image_data: imageUrl // Storage URL 저장
          };
        }
        return null;
      });

      const capturesData = (await Promise.all(uploadPromises)).filter(Boolean);
      
      if (capturesData.length > 0) {
        const { error: capturesError } = await supabase
          .from('order_captures')
          .insert(capturesData);
        
        if (capturesError) {
          console.warn("⚠️ 캡처 이미지 저장 실패:", capturesError);
        } else {
          console.log(`✅ 캡처 이미지 ${capturesData.length}개 업로드 완료`);
        }
      }
    }

    console.log("✅ 오더 생성 완료:", orderNo, "ID:", orderId)

    return NextResponse.json({
      success: true,
      orderNo,
      orderId,
    })
  } catch (error: any) {
    console.error("❌ 오더 생성 실패:", error)
    return NextResponse.json(
      { error: error.message || "오더 생성 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}

// 오더 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNo = searchParams.get("orderNo")

    if (orderNo) {
      // 특정 오더 조회
      const order = await db.getWorkOrderByOrderNo(orderNo);
      
      if (!order) {
        return NextResponse.json({ error: "오더를 찾을 수 없습니다" }, { status: 404 })
      }

      return NextResponse.json(order);
    } else {
      // 전체 오더 목록
      const orders = await db.getAllWorkOrders();
      return NextResponse.json(orders);
    }
  } catch (error: any) {
    console.error("❌ 오더 조회 실패:", error)
    return NextResponse.json(
      { error: error.message || "오더 조회 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
