import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import https from "https"

export const maxDuration = 60

// SSL 검증 우회 (개발 환경에서만 사용)
const agent = new https.Agent({
  rejectUnauthorized: false,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  httpAgent: agent,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File
    const page7File = formData.get("page7Image") as File | null
    const ocrText = formData.get("ocrText") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "이미지가 없습니다" }, { status: 400 })
    }

    // 첫 페이지 이미지를 base64로 변환
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const imageBase64 = buffer.toString("base64")
    
    // 7페이지 이미지도 변환 (있는 경우)
    let page7ImageBase64: string | null = null
    if (page7File) {
      const page7Bytes = await page7File.arrayBuffer()
      const page7Buffer = Buffer.from(page7Bytes)
      page7ImageBase64 = page7Buffer.toString("base64")
      console.log("✅ 7페이지 이미지 수신됨 (BOM 테이블)")
    }

    console.log("OCR 텍스트 길이:", ocrText?.length || 0)
    console.log("OCR 텍스트 미리보기:", ocrText?.substring(0, 300))
    
    // 7페이지 OCR 텍스트 추출
    let page7OcrText = ""
    if (ocrText) {
      const page7Index = ocrText.indexOf("━━━━━ 페이지 7 ━━━━━")
      if (page7Index !== -1) {
        const page8Index = ocrText.indexOf("━━━━━ 페이지 8 ━━━━━")
        page7OcrText = ocrText.substring(
          page7Index, 
          page8Index !== -1 ? page8Index : ocrText.length
        )
        console.log("✅ 7페이지 OCR 텍스트 추출 완료:", page7OcrText.length, "자")
      }
    }

    // OpenAI Vision API로 이미지 분석
    const response = await openai.chat.completions.create({
      model: "gpt-4.1", // GPT-4.1 사용
      messages: [
        {
          role: "system",
          content: `You are a table reading expert. Extract data from work order documents.

🚨 CRITICAL RULE FOR BOM TABLE (Page 7):
Every row has EXACTLY 6 columns in this EXACT order. Read LEFT to RIGHT:

[Col 1] materialName - material type
[Col 2] code - product code (may be empty)
[Col 3] supplier - supplier name
[Col 4] size - size specification
[Col 5] qty - ALWAYS A NUMBER, often has "EA" suffix (like "5500", "5,500EA")
[Col 6] placement - usage location (BODY, TAG, MAIN SEWING, etc)

🔥 SPECIAL QTY RULE:
If you see a number with "EA" (like "5500EA", "5,500 EA") ANYWHERE in the row, that number MUST go in qty field!
Example: If you see "5500EA" in col 4, move it to col 5 (qty) and leave col 4 (size) empty.

⚠️ NEVER skip a column! If empty, use "". The order is FIXED.

Return ONLY valid JSON (no markdown):
{
  "brand": "string",
  "styleNo": "string",
  "styleName": "string",
  "season": "string",
  "dsManager": "string",
  "mdManager": "string",
  "totalQty": number,
  "colors": "string",
  "sizes": [{"size": "string", "qty": number}],
  "fabricSpec": "string",
  "fabricComposition": "string",
  "inboundDate": "string",
  "shipCountry": "string",
  "productionCountry": "string",
  "pList": [
    {
      "materialName": "col1",
      "code": "col2",
      "supplier": "col3",
      "size": "col4",
      "qty": "col5-NUMBER (extract number from 5500EA format)",
      "placement": "col6"
    }
  ]
}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract data from these images.

Image 1 = Page 1 (basic info)
Image 2 = Page 7 (BOM table)

${page7OcrText ? `Page 7 OCR (if image unclear):
${page7OcrText.substring(0, 2000)}
` : ''}

FOR BOM TABLE (Image 2):
1. Find the table with 6 main columns (ignore narrow columns on right)
2. Read each row LEFT-TO-RIGHT strictly
3. Column 5 (qty) = number, often with "EA" (extract number only: "5500EA" → "5500")
4. If you see "###EA" in any column, that's the qty - move it to col 5
5. Extract ALL 15-20 rows

Example row:
FABRIC SOLID | SSTS-... | VIETNAM | N/A | 5500EA | BODY
→ {materialName:"FABRIC SOLID", code:"SSTS-...", supplier:"VIETNAM", size:"N/A", qty:"5500", placement:"BODY"}

Example with EA in wrong column:
FABRIC SOLID | SSTS-... | VIETNAM | 5500EA | "" | BODY
→ {materialName:"FABRIC SOLID", code:"SSTS-...", supplier:"VIETNAM", size:"", qty:"5500", placement:"BODY"}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${imageBase64}`,
                detail: "high",
              },
            },
            ...(page7ImageBase64 ? [
              {
                type: "image_url" as const,
                image_url: {
                  url: `data:image/png;base64,${page7ImageBase64}`,
                  detail: "high" as const,
                },
              },
            ] : []),
          ],
        },
      ],
      max_tokens: 8000,
      temperature: 0.05, // Very low for precise extraction
    })

    const result = response.choices[0]?.message?.content

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "AI 응답이 없습니다",
        },
        { status: 500 }
      )
    }

    console.log("AI 응답:", result)

    // JSON 파싱
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("JSON 형식을 찾을 수 없습니다")
      }

      const data = JSON.parse(jsonMatch[0])
      return NextResponse.json({ success: true, data })
    } catch (parseError) {
      console.error("JSON 파싱 실패:", parseError)
      console.log("원본 AI 응답:", result)
      return NextResponse.json(
        {
          success: false,
          error: "JSON 파싱 실패",
          rawResponse: result,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("분석 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "작업지시서 분석 중 오류가 발생했습니다",
      },
      { status: 500 }
    )
  }
}
