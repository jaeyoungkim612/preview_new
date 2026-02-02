import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

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
    const dateStr = `${year}${month}${day}` // 260128
    
    const countStmt = db.prepare(`
      SELECT COUNT(*) as count FROM work_orders 
      WHERE order_no LIKE ?
    `)
    const { count } = countStmt.get(`WO-${dateStr}-%`) as { count: number }
    const orderNo = `WO-${dateStr}-${String(count + 1).padStart(3, "0")}`

    // 트랜잭션 시작
    const insertOrder = db.transaction((orderData: any) => {
      // 1. 오더 기본 정보 삽입 (PDF 포함)
      const insertOrderStmt = db.prepare(`
        INSERT INTO work_orders (
          order_no, brand, style_no, style_name, season,
          ds_manager, md_manager, total_qty, fabric_spec, fabric_composition,
          inbound_date, ship_country, production_country, notes, pdf_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const result = insertOrderStmt.run(
        orderNo,
        orderData.brand || "",
        orderData.styleNo || "",
        orderData.styleName || "",
        orderData.season || "",
        orderData.dsManager || "",
        orderData.mdManager || "",
        orderData.totalQty || 0,
        orderData.fabricSpec || "",
        orderData.fabricComposition || "",
        orderData.inboundDate || "",
        orderData.shipCountry || "",
        orderData.productionCountry || "",
        orderData.notes || "",
        orderData.pdfData || null
      )

      const orderId = result.lastInsertRowid

      // 2. 사이즈 정보 삽입
      if (orderData.sizes && Array.isArray(orderData.sizes)) {
        const insertSizeStmt = db.prepare(`
          INSERT INTO order_sizes (order_id, size, qty)
          VALUES (?, ?, ?)
        `)

        for (const size of orderData.sizes) {
          insertSizeStmt.run(orderId, size.size, size.qty)
        }
      }

      // 3. P-List (자재 리스트) 삽입
      if (orderData.pList && Array.isArray(orderData.pList)) {
        console.log(`💾 P-List 저장 시작: ${orderData.pList.length}개 항목`);
        const insertPListStmt = db.prepare(`
          INSERT INTO p_list (
            order_id, material_name, code, supplier, size, qty, placement
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `)

        for (const item of orderData.pList) {
          console.log(`  - 항목 저장:`, {
            materialName: item.materialName,
            code: item.code,
            supplier: item.supplier,
            size: item.size,
            qty: item.qty,
            placement: item.placement
          });
          insertPListStmt.run(
            orderId,
            item.materialName || "",
            item.code || "",
            item.supplier || "",
            item.size || "",
            item.qty || "",
            item.placement || ""
          )
        }
        console.log(`✅ P-List ${orderData.pList.length}개 저장 완료`);
      } else {
        console.log("⚠️ P-List가 없거나 배열이 아님:", orderData.pList);
      }

      // 4. 캡쳐 이미지 삽입
      if (orderData.captureImages && Array.isArray(orderData.captureImages)) {
        const insertCaptureStmt = db.prepare(`
          INSERT INTO order_captures (order_id, image_data)
          VALUES (?, ?)
        `)

        for (const imageData of orderData.captureImages) {
          insertCaptureStmt.run(orderId, imageData)
        }
      }

      return orderId
    })

    const orderId = insertOrder(data)

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
      const order = db
        .prepare("SELECT * FROM work_orders WHERE order_no = ?")
        .get(orderNo)

      if (!order) {
        return NextResponse.json({ error: "오더를 찾을 수 없습니다" }, { status: 404 })
      }

      // 사이즈 정보
      const sizes = db
        .prepare("SELECT * FROM order_sizes WHERE order_id = ?")
        .all((order as any).id)

      // P-List
      const pList = db
        .prepare("SELECT * FROM p_list WHERE order_id = ?")
        .all((order as any).id)

      // 캡처 이미지들
      const captureImages = db
        .prepare("SELECT image_data FROM order_captures WHERE order_id = ? ORDER BY id")
        .all((order as any).id)

      return NextResponse.json({
        ...order,
        sizes,
        pList,
        captureImages: captureImages.map((img: any) => img.image_data),
      })
    } else {
      // 전체 오더 목록
      const orders = db
        .prepare("SELECT * FROM work_orders ORDER BY created_at DESC LIMIT 100")
        .all()

      return NextResponse.json(orders)
    }
  } catch (error: any) {
    console.error("❌ 오더 조회 실패:", error)
    return NextResponse.json(
      { error: error.message || "오더 조회 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
