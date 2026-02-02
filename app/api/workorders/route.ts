import { NextResponse } from "next/server"
import { db, initDB } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // DB 초기화 (테이블이 없으면 생성)
    await initDB();

    // 작업지시서 목록 조회
    const orders = await db.getAllWorkOrders();

    // 각 오더의 정보 포맷팅
    const workOrders = orders.map((order: any) => ({
      id: order.id.toString(),
      orderNo: order.order_no,
      styleNo: order.style_no,
      styleName: order.style_name,
      brand: order.brand,
      totalQty: order.total_qty,
      createdAt: order.created_at,
      thumbnailImage: null, // TODO: 캡처 이미지 지원
      hasPdf: order.pdf_data ? true : false,
      // TODO: 실제 상태 관리 테이블 추가 필요 (현재는 기본값)
      materialOrderStatus: "pending" as "pending" | "in-progress" | "completed",
      productionStatus: "pending" as "pending" | "in-progress" | "completed",
      deliveryStatus: "pending" as "pending" | "in-progress" | "completed",
    }));

    return NextResponse.json({
      success: true,
      workOrders,
    })
  } catch (error: any) {
    console.error("❌ 작업지시서 조회 실패:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "작업지시서 조회 중 오류가 발생했습니다" 
      },
      { status: 500 }
    )
  }
}
