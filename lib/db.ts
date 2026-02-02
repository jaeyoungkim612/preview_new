import { sql } from '@vercel/postgres';

// 테이블 초기화 함수
export async function initDB() {
  try {
    // work_orders 테이블 생성
    await sql`
      CREATE TABLE IF NOT EXISTS work_orders (
        id SERIAL PRIMARY KEY,
        order_no TEXT UNIQUE,
        brand TEXT,
        style_no TEXT,
        style_name TEXT,
        season TEXT,
        ds_manager TEXT,
        md_manager TEXT,
        total_qty INTEGER,
        fabric_spec TEXT,
        fabric_composition TEXT,
        inbound_date TEXT,
        ship_country TEXT,
        production_country TEXT,
        notes TEXT,
        pdf_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // order_sizes 테이블 생성
    await sql`
      CREATE TABLE IF NOT EXISTS order_sizes (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES work_orders(id) ON DELETE CASCADE,
        size TEXT,
        qty INTEGER
      )
    `;

    // p_list 테이블 생성
    await sql`
      CREATE TABLE IF NOT EXISTS p_list (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES work_orders(id) ON DELETE CASCADE,
        material_name TEXT,
        code TEXT,
        supplier TEXT,
        size TEXT,
        qty TEXT,
        placement TEXT
      )
    `;

    // order_captures 테이블 생성
    await sql`
      CREATE TABLE IF NOT EXISTS order_captures (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES work_orders(id) ON DELETE CASCADE,
        image_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 인덱스 생성
    await sql`CREATE INDEX IF NOT EXISTS idx_order_no ON work_orders(order_no)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_style_no ON work_orders(style_no)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_capture_order_id ON order_captures(order_id)`;

    console.log('✅ Postgres DB 초기화 완료');
  } catch (error) {
    console.error('❌ DB 초기화 오류:', error);
  }
}

// DB 헬퍼 함수들
export const db = {
  // 작업지시서 생성
  async createWorkOrder(data: any) {
    const result = await sql`
      INSERT INTO work_orders (
        order_no, brand, style_no, style_name, season,
        ds_manager, md_manager, total_qty, fabric_spec, fabric_composition,
        inbound_date, ship_country, production_country, notes, pdf_data
      ) VALUES (
        ${data.orderNo}, ${data.brand}, ${data.styleNo}, ${data.styleName}, ${data.season},
        ${data.dsManager}, ${data.mdManager}, ${data.totalQty}, ${data.fabricSpec}, ${data.fabricComposition},
        ${data.inboundDate}, ${data.shipCountry}, ${data.productionCountry}, ${data.notes}, ${data.pdfData}
      )
      RETURNING id
    `;
    return result.rows[0];
  },

  // 사이즈 추가
  async addOrderSizes(orderId: number, sizes: Array<{ size: string; qty: number }>) {
    for (const size of sizes) {
      await sql`
        INSERT INTO order_sizes (order_id, size, qty)
        VALUES (${orderId}, ${size.size}, ${size.qty})
      `;
    }
  },

  // P-List 추가
  async addPList(orderId: number, items: Array<any>) {
    for (const item of items) {
      await sql`
        INSERT INTO p_list (order_id, material_name, code, supplier, size, qty, placement)
        VALUES (${orderId}, ${item.materialName}, ${item.code}, ${item.supplier}, ${item.size}, ${item.qty}, ${item.placement})
      `;
    }
  },

  // 모든 작업지시서 조회
  async getAllWorkOrders() {
    const result = await sql`
      SELECT * FROM work_orders
      ORDER BY created_at DESC
    `;
    return result.rows;
  },

  // 작업지시서 상세 조회
  async getWorkOrderById(id: number) {
    const orderResult = await sql`
      SELECT * FROM work_orders WHERE id = ${id}
    `;
    
    if (orderResult.rows.length === 0) return null;

    const order = orderResult.rows[0];

    const sizesResult = await sql`
      SELECT size, qty FROM order_sizes WHERE order_id = ${id}
    `;

    const pListResult = await sql`
      SELECT * FROM p_list WHERE order_id = ${id}
    `;

    return {
      ...order,
      sizes: sizesResult.rows,
      pList: pListResult.rows
    };
  },

  // 작업지시서 삭제
  async deleteWorkOrder(id: number) {
    await sql`DELETE FROM work_orders WHERE id = ${id}`;
  }
};

export default db;
