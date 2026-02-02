import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 이미지 업로드 헬퍼 함수
export async function uploadImageToStorage(base64Data: string, fileName: string): Promise<string | null> {
  try {
    // base64를 Buffer로 변환 (Node.js 환경)
    const base64Match = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!base64Match) {
      throw new Error('Invalid base64 format');
    }

    const [, imageType, base64Content] = base64Match;
    const buffer = Buffer.from(base64Content, 'base64');

    // Supabase Storage에 업로드
    const filePath = `${Date.now()}_${fileName}`;
    const { data, error } = await supabase.storage
      .from('workorder-images')
      .upload(filePath, buffer, {
        contentType: `image/${imageType}`,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return null;
    }

    // Public URL 가져오기
    const { data: urlData } = supabase.storage
      .from('workorder-images')
      .getPublicUrl(filePath);

    console.log('✅ 이미지 업로드 성공:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    return null;
  }
}

// PDF 업로드 헬퍼 함수
export async function uploadPdfToStorage(base64Data: string, fileName: string): Promise<string | null> {
  try {
    // base64를 Buffer로 변환 (Node.js 환경)
    const base64Match = base64Data.match(/^data:application\/pdf;base64,(.+)$/);
    if (!base64Match) {
      throw new Error('Invalid PDF base64 format');
    }

    const base64Content = base64Match[1];
    const buffer = Buffer.from(base64Content, 'base64');

    // Supabase Storage에 업로드
    const filePath = `${Date.now()}_${fileName}`;
    const { data, error } = await supabase.storage
      .from('workorder-images')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('PDF upload error:', error);
      return null;
    }

    // Public URL 가져오기
    const { data: urlData } = supabase.storage
      .from('workorder-images')
      .getPublicUrl(filePath);

    console.log('✅ PDF 업로드 성공:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('PDF upload error:', error);
    return null;
  }
}

// 테이블 초기화 함수
export async function initDB() {
  try {
    // work_orders 테이블 생성
    const { error: workOrdersError } = await supabase.rpc('create_work_orders_table', {});
    
    console.log('✅ Supabase DB 초기화 완료');
  } catch (error) {
    console.error('❌ DB 초기화 오류:', error);
  }
}

// DB 헬퍼 함수들
export const db = {
  // 작업지시서 생성
  async createWorkOrder(data: any) {
    const { data: result, error } = await supabase
      .from('work_orders')
      .insert([{
        order_no: data.orderNo,
        brand: data.brand,
        style_no: data.styleNo,
        style_name: data.styleName,
        season: data.season,
        ds_manager: data.dsManager,
        md_manager: data.mdManager,
        total_qty: data.totalQty,
        fabric_spec: data.fabricSpec,
        fabric_composition: data.fabricComposition,
        inbound_date: data.inboundDate,
        ship_country: data.shipCountry,
        production_country: data.productionCountry,
        notes: data.notes,
        pdf_data: data.pdfData
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // 사이즈 추가
  async addOrderSizes(orderId: number, sizes: Array<{ size: string; qty: number }>) {
    const sizesData = sizes.map(size => ({
      order_id: orderId,
      size: size.size,
      qty: size.qty
    }));

    const { error } = await supabase
      .from('order_sizes')
      .insert(sizesData);

    if (error) throw error;
  },

  // P-List 추가
  async addPList(orderId: number, items: Array<any>) {
    const pListData = items.map(item => ({
      order_id: orderId,
      material_name: item.materialName,
      code: item.code,
      supplier: item.supplier,
      size: item.size,
      qty: item.qty,
      placement: item.placement
    }));

    const { error } = await supabase
      .from('p_list')
      .insert(pListData);

    if (error) throw error;
  },

  // 모든 작업지시서 조회
  async getAllWorkOrders() {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // 작업지시서 상세 조회
  async getWorkOrderById(id: number) {
    const { data: order, error: orderError } = await supabase
      .from('work_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) throw orderError;
    if (!order) return null;

    const { data: sizes, error: sizesError } = await supabase
      .from('order_sizes')
      .select('size, qty')
      .eq('order_id', id);

    if (sizesError) throw sizesError;

    const { data: pList, error: pListError } = await supabase
      .from('p_list')
      .select('*')
      .eq('order_id', id);

    if (pListError) throw pListError;

    return {
      ...order,
      sizes: sizes || [],
      pList: pList || []
    };
  },

  // 작업지시서 번호로 조회
  async getWorkOrderByOrderNo(orderNo: string) {
    const { data: order, error: orderError } = await supabase
      .from('work_orders')
      .select('*')
      .eq('order_no', orderNo)
      .single();

    if (orderError) throw orderError;
    if (!order) return null;

    const { data: sizes, error: sizesError } = await supabase
      .from('order_sizes')
      .select('*')
      .eq('order_id', order.id);

    if (sizesError) throw sizesError;

    const { data: pList, error: pListError } = await supabase
      .from('p_list')
      .select('*')
      .eq('order_id', order.id);

    if (pListError) throw pListError;

    const { data: captures, error: capturesError } = await supabase
      .from('order_captures')
      .select('image_data')
      .eq('order_id', order.id)
      .order('id');

    if (capturesError) throw capturesError;

    return {
      ...order,
      sizes: sizes || [],
      pList: pList || [],
      captureImages: captures?.map(c => c.image_data) || []
    };
  },

  // 오더 번호로 개수 조회
  async countOrdersByPattern(pattern: string) {
    const { count, error } = await supabase
      .from('work_orders')
      .select('*', { count: 'exact', head: true })
      .like('order_no', pattern);

    if (error) throw error;
    return count || 0;
  },

  // 작업지시서 삭제
  async deleteWorkOrder(id: number) {
    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export default db;
