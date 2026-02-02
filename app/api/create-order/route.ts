import { NextRequest, NextResponse } from "next/server"
import { db, initDB } from "@/lib/db"
import { sql } from '@vercel/postgres'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // DB 초기화
    await initDB();

    const data = await request.json()

    console.log("📥 받은 오더 데이터:");
    console.log("  - P-List 개수:", data.pList?.length || 0);
    console.log("  - P-List 샘플:", data.pList?.[0]);

    // 오더 번호 생성 (WO-YYMMDD-XXX 형식)
    const now = new Date()
    const year = String(now.getFullYear()).slice(2) // 26 (2026)
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dateStr = `${year}${month}${day}` // 260128
    
    const countResult = await sql`
      SELECT COUNT(*) as count FROM work_orders 
      WHERE order_no LIKE ${'WO-' + dateStr + '-%'}
    `;
    const count = parseInt(countResult.rows[0].count);
    const orderNo = `WO-${dateStr}-${String(count + 1).padStart(3, "0")}`;

    // 1. 오더 기본 정보 삽입
    const orderResult = await db.createWorkOrder({
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
      pdfData: data.pdfData || null
    });

    const orderId = orderResult.id;

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

    // 4. 캡쳐 이미지 삽입 (TODO: 캡처 기능 추가 시 구현)
    // if (data.captureImages && Array.isArray(data.captureImages)) {
    //   for (const imageData of data.captureImages) {
    //     await sql`INSERT INTO order_captures (order_id, image_data) VALUES (${orderId}, ${imageData})`;
    //   }
    // }

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
    await initDB();

    const { searchParams } = new URL(request.url)
    const orderNo = searchParams.get("orderNo")

    if (orderNo) {
      // 특정 오더 조회
      const orderResult = await sql`SELECT * FROM work_orders WHERE order_no = ${orderNo}`;
      
      if (orderResult.rows.length === 0) {
        return NextResponse.json({ error: "오더를 찾을 수 없습니다" }, { status: 404 })
      }

      const order = orderResult.rows[0];

      // 사이즈 정보
      const sizesResult = await sql`SELECT * FROM order_sizes WHERE order_id = ${order.id}`;
      const sizes = sizesResult.rows;

      // P-List
      const pListResult = await sql`SELECT * FROM p_list WHERE order_id = ${order.id}`;
      const pList = pListResult.rows;

      // 캡처 이미지들
      const captureResult = await sql`SELECT image_data FROM order_captures WHERE order_id = ${order.id} ORDER BY id`;
      const captureImages = captureResult.rows.map((img: any) => img.image_data);

      return NextResponse.json({
        ...order,
        sizes,
        pList,
        captureImages,
      })
    } else {
      // 전체 오더 목록
      const ordersResult = await sql`SELECT * FROM work_orders ORDER BY created_at DESC LIMIT 100`;
      return NextResponse.json(ordersResult.rows);
    }
  } catch (error: any) {
    console.error("❌ 오더 조회 실패:", error)
    return NextResponse.json(
      { error: error.message || "오더 조회 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
