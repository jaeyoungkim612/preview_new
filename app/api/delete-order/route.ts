import { NextRequest, NextResponse } from "next/server"
import { db, initDB } from "@/lib/db"
import { sql } from '@vercel/postgres'

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
  try {
    await initDB();

    const { searchParams } = new URL(request.url)
    const orderNo = searchParams.get("orderNo")

    if (!orderNo) {
      return NextResponse.json(
        { success: false, error: "오더번호가 필요합니다" },
        { status: 400 }
      )
    }

    // 오더 조회
    const orderResult = await sql`SELECT id FROM work_orders WHERE order_no = ${orderNo}`;

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "오더를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    const orderId = orderResult.rows[0].id;

    // 오더 삭제 (CASCADE로 관련 데이터도 함께 삭제)
    await db.deleteWorkOrder(orderId);

    console.log("✅ 오더 삭제 완료:", orderNo)

    return NextResponse.json({
      success: true,
      message: "오더가 삭제되었습니다",
    })
  } catch (error: any) {
    console.error("❌ 오더 삭제 실패:", error)
    return NextResponse.json(
      { success: false, error: error.message || "오더 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
