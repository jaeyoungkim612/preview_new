import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 30

// ERP 데이터 (실제로는 DB에서 가져옴)
const erpData = {
  brands: {
    "beanpole golf": {
      revenue2601: 5.2,
      cost2601: 3.38,
      gm2601: 35.0,
      orders: 24,
      styles: 19,
      cuttingRate: 92.5,
    },
    "beanpole mens": {
      revenue2601: 8.5,
      cost2601: 5.53,
      gm2601: 35.0,
      orders: 31,
      styles: 28,
      cuttingRate: 88.8,
    },
    "descente sports": {
      revenue2601: 6.8,
      cost2601: 4.42,
      gm2601: 35.0,
      orders: 15,
      styles: 15,
      cuttingRate: 85.2,
    },
    XEXYMIX: {
      revenue2601: 4.2,
      cost2601: 2.73,
      gm2601: 35.0,
      orders: 26,
      styles: 26,
      cuttingRate: 88.2,
    },
    rogatis: {
      revenue2601: 3.8,
      cost2601: 2.47,
      gm2601: 35.0,
      orders: 12,
      styles: 9,
      cuttingRate: 78.5,
    },
    galaxy: {
      revenue2601: 3.2,
      cost2601: 2.08,
      gm2601: 35.0,
      orders: 19,
      styles: 14,
      cuttingRate: 85.6,
    },
  },
  total: {
    cumulativeRevenue: 62.6,
    monthlyRevenue: 5.02,
    totalOrders: 156,
    avgGM: 35.2,
  },
  monthlyTrend: [
    { month: "25년 1월", revenue: 4.2, cost: 2.73 },
    { month: "25년 2월", revenue: 4.5, cost: 2.93 },
    { month: "25년 3월", revenue: 4.8, cost: 3.12 },
    { month: "25년 4월", revenue: 5.1, cost: 3.32 },
    { month: "25년 5월", revenue: 5.3, cost: 3.45 },
    { month: "25년 6월", revenue: 4.9, cost: 3.19 },
    { month: "25년 7월", revenue: 5.0, cost: 3.25 },
    { month: "25년 8월", revenue: 5.2, cost: 3.38 },
    { month: "25년 9월", revenue: 5.4, cost: 3.51 },
    { month: "25년 10월", revenue: 5.6, cost: 3.64 },
    { month: "25년 11월", revenue: 5.8, cost: 3.77 },
    { month: "25년 12월", revenue: 5.5, cost: 3.58 },
    { month: "26년 1월", revenue: 5.02, cost: 3.26 },
  ],
  factories: {
    "Vietnam ND": { revenue: 17.9, cost: 11.6, gm: 35.2, cuttingRate: 88.8 },
    "Vietnam TB": { revenue: 10.6, cost: 6.9, gm: 35.0, cuttingRate: 92.9 },
    "YEN THANH": { revenue: 8.0, cost: 5.2, gm: 35.0, cuttingRate: 80.4 },
    "CNF VINA": { revenue: 8.0, cost: 5.2, gm: 35.0, cuttingRate: 70.7 },
    "Cambodia 1": { revenue: 6.3, cost: 4.1, gm: 35.0, cuttingRate: 85.2 },
  },
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const systemPrompt = `당신은 거림트렌드 ERP 시스템의 AI 어시스턴트입니다. 의류 제조업 데이터를 분석하고 경영진에게 인사이트를 제공합니다.

현재 ERP 데이터:
- 누적 매출: ${erpData.total.cumulativeRevenue}억원
- 26년 1월 매출: ${erpData.total.monthlyRevenue}억원
- 진행중 오더: ${erpData.total.totalOrders}건
- 평균 GM: ${erpData.total.avgGM}%

브랜드별 26년 1월 실적:
${Object.entries(erpData.brands)
  .map(
    ([brand, data]) =>
      `- ${brand}: 매출 ${data.revenue2601}억, 원가 ${data.cost2601}억, GM ${data.gm2601}%, 오더 ${data.orders}건, 재단율 ${data.cuttingRate}%`
  )
  .join("\n")}

공장별 실적:
${Object.entries(erpData.factories)
  .map(
    ([factory, data]) =>
      `- ${factory}: 매출 ${data.revenue}억, 원가 ${data.cost}억, GM ${data.gm}%, 재단율 ${data.cuttingRate}%`
  )
  .join("\n")}

월별 매출 추이 (최근 13개월):
${erpData.monthlyTrend.map((m) => `- ${m.month}: 매출 ${m.revenue}억, 원가 ${m.cost}억`).join("\n")}

응답 시 주의사항:
1. 한국어로 친절하고 전문적으로 답변하세요
2. 숫자는 정확하게, 단위(억원, %, 건)를 명시하세요
3. 데이터 기반 인사이트와 제안을 제공하세요
4. 비교 분석 시 전월 대비, 브랜드 간 비교 등을 활용하세요
5. 필요시 개선 방안도 제시하세요`

  const result = streamText({
    model: "anthropic/claude-sonnet-4-20250514",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
