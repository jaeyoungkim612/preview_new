import Database from "better-sqlite3"
import path from "path"

// DB 파일 경로 (프로젝트 루트에 저장)
const dbPath = path.join(process.cwd(), "workorders.db")

// DB 초기화
const db = new Database(dbPath)

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS work_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_sizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    size TEXT,
    qty INTEGER,
    FOREIGN KEY (order_id) REFERENCES work_orders(id) ON DELETE CASCADE
  );

  -- P-List 테이블 재생성 (컬럼 변경)
  DROP TABLE IF EXISTS p_list;
  
  CREATE TABLE p_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    material_name TEXT,
    code TEXT,
    supplier TEXT,
    size TEXT,
    qty TEXT,
    placement TEXT,
    FOREIGN KEY (order_id) REFERENCES work_orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS order_captures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    image_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES work_orders(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_order_no ON work_orders(order_no);
  CREATE INDEX IF NOT EXISTS idx_style_no ON work_orders(style_no);
  CREATE INDEX IF NOT EXISTS idx_capture_order_id ON order_captures(order_id);
`)

// 마이그레이션: pdf_data 컬럼이 없으면 추가
try {
  const tableInfo = db.prepare("PRAGMA table_info(work_orders)").all() as any[];
  const hasPdfData = tableInfo.some((col) => col.name === "pdf_data");
  
  if (!hasPdfData) {
    console.log("⚠️ pdf_data 컬럼이 없습니다. 마이그레이션 중...");
    db.exec("ALTER TABLE work_orders ADD COLUMN pdf_data TEXT");
    console.log("✅ pdf_data 컬럼 추가 완료");
  }
} catch (error) {
  console.error("마이그레이션 오류:", error);
}

console.log("✅ DB 초기화 완료:", dbPath)

export default db
