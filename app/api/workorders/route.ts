import { NextResponse } from "next/server"
import { supabase } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // 작업지시서 목록 조회
    const { data: orders, error } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 각 오더의 첫 번째 캡처 이미지 가져오기
    const workOrdersWithImages = await Promise.all(
      (orders || []).map(async (order: any) => {
        // 첫 번째 캡처 이미지 가져오기
        const { data: captures } = await supabase
          .from('order_captures')
          .select('image_data')
          .eq('order_id', order.id)
          .limit(1);

        return {
          id: order.id.toString(),
          orderNo: order.order_no,
          styleNo: order.style_no,
          styleName: order.style_name,
          brand: order.brand,
          totalQty: order.total_qty,
          createdAt: order.created_at,
          thumbnailImage: captures && captures.length > 0 ? captures[0].image_data : null,
          hasPdf: order.pdf_data ? true : false,
          // TODO: 실제 상태 관리 테이블 추가 필요 (현재는 기본값)
          materialOrderStatus: "pending" as "pending" | "in-progress" | "completed",
          productionStatus: "pending" as "pending" | "in-progress" | "completed",
          deliveryStatus: "pending" as "pending" | "in-progress" | "completed",
        };
      })
    );

    return NextResponse.json({
      success: true,
      workOrders: workOrdersWithImages,
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
