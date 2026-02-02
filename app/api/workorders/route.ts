import { NextResponse } from "next/server"
import db from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // 작업지시서 목록 조회 (PDF 첨부 여부 포함)
    const orders = db
      .prepare(`
        SELECT 
          id,
          order_no,
          brand,
          style_no,
          style_name,
          season,
          total_qty,
          created_at,
          CASE WHEN pdf_data IS NOT NULL THEN 1 ELSE 0 END as has_pdf
        FROM work_orders 
        ORDER BY created_at DESC 
        LIMIT 100
      `)
      .all() as any[]

    // 각 오더의 상태 정보 + 첫 번째 캡처 이미지 추가
    const workOrders = orders.map((order) => {
      // 첫 번째 캡처 이미지 가져오기
      const firstImage = db
        .prepare("SELECT image_data FROM order_captures WHERE order_id = ? LIMIT 1")
        .get(order.id) as { image_data?: string } | undefined;

      return {
        id: order.id.toString(),
        orderNo: order.order_no,
        styleNo: order.style_no,
        styleName: order.style_name,
        brand: order.brand,
        totalQty: order.total_qty,
        createdAt: order.created_at,
        thumbnailImage: firstImage?.image_data || null,
        hasPdf: order.has_pdf === 1,
        // TODO: 실제 상태 관리 테이블 추가 필요 (현재는 기본값)
        materialOrderStatus: "pending" as "pending" | "in-progress" | "completed",
        productionStatus: "pending" as "pending" | "in-progress" | "completed",
        deliveryStatus: "pending" as "pending" | "in-progress" | "completed",
      };
    })

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
