# 작업지시서 AI 분석 설정 가이드

## 1. 필요한 패키지 설치

```bash
npm install --legacy-peer-deps
```

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
# .env.local
OPENAI_API_KEY=your-openai-api-key-here
```

## 3. 개발 서버 실행

```bash
npm run dev
```

## 4. 사용 방법

1. 브라우저에서 `http://localhost:3000` 접속
2. 사이드바에서 **영업관리 > 작업지시서 등록** 클릭
3. PDF 파일 업로드
4. AI가 자동으로 작업지시서 정보를 추출합니다

## 작동 방식

### API 엔드포인트: `/api/analyze-workorder`

1. **PDF 업로드**: 프론트엔드에서 PDF 파일을 FormData로 전송
2. **AI 분석**: OpenAI GPT-4 Vision API로 PDF 이미지 분석
3. **정보 추출**: AI가 다음 정보를 자동으로 추출:
   - 브랜드명
   - 스타일 번호
   - 담당자 (DS/MD)
   - 원단 정보
   - 총 수량
   - 입고예정일
   - 생산/출하 국가
   - 사이즈별 수량
   - 비고

4. **결과 표시**: 추출된 정보를 폼에 자동으로 채움

## 추출된 데이터 구조

```typescript
{
  brand: string;           // 브랜드명 (예: "TOPTEN")
  styleNo: string;         // 스타일 번호 (예: "MSF4PP2505")
  dsManager: string;       // DS 담당자
  mdManager: string;       // MD 담당자
  totalQty: number;        // 총 수량
  fabric: string;          // 원단 정보
  inboundDate: string;     // 입고예정일 (YYYY-MM-DD)
  shipCountry: string;     // 출하국가
  productionCountry: string; // 생산국가
  sizes: Array<{           // 사이즈별 수량
    size: string;
    qty: number;
  }>;
  notes: string;           // 비고
}
```

## 트러블슈팅

### 1. AI 분석이 실패하는 경우
- `.env.local` 파일에 `OPENAI_API_KEY`가 올바르게 설정되었는지 확인
- OpenAI API 키의 크레딧이 남아있는지 확인
- 실패 시 자동으로 더미 데이터가 표시됩니다

### 2. PDF 업로드가 안 되는 경우
- 파일 형식이 PDF인지 확인 (.pdf)
- 파일 크기가 너무 크지 않은지 확인 (10MB 이하 권장)

### 3. 개발 서버 실행 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

## 향후 개선 사항

- [ ] PWC GenAI Service API 통합 (Claude Sonnet 4)
- [ ] PDF 페이지 멀티뷰 (여러 페이지 분석)
- [ ] 추출 정보 수정 기능
- [ ] 오더 생성 자동화
- [ ] 작업지시서 템플릿 학습
