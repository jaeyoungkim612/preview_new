"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  User,
  Send,
  Sparkles,
  TrendingUp,
  Package,
  Factory,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// 데모용 시뮬레이션 응답
const demoResponses: Record<string, string> = {
  "26년 1월 매출 동향을 알려줘": `## 26년 1월 매출 동향 분석

**누적 매출: 62.6억원** (전년 동기 대비 +8.2%)

### 브랜드별 실적
| 브랜드 | 매출 | 전월 대비 | GM% |
|--------|------|-----------|-----|
| beanpole golf | 12.8억 | +15.2% | 38.5% |
| beanpole mens | 10.2억 | +8.7% | 35.2% |
| descente sports | 9.5억 | +12.3% | 36.8% |
| XEXYMIX | 8.3억 | +22.1% | 32.4% |

### 주요 인사이트
1. **XEXYMIX** 브랜드가 전월 대비 **22.1% 성장**으로 가장 높은 성장률 기록
2. **beanpole golf**가 매출 1위 유지, GM%도 38.5%로 수익성 우수
3. 전체 평균 GM%는 **35.2%**로 전월(34.8%) 대비 소폭 개선

### 리스크 요인
- 원자재 가격 상승으로 인한 원가 부담 증가 예상
- CNF VINA 공장 납기 지연 건 3건 모니터링 필요`,

  "beanpole golf 브랜드 실적 분석해줘": `## beanpole golf 브랜드 실적 분석

**26SS 시즌 기준 | 26년 1월**

### 핵심 지표
- **매출**: 12.8억원 (전월 대비 +15.2%)
- **원가**: 7.9억원
- **GM%**: 38.5% (목표 35% 대비 +3.5%p 초과 달성)
- **진행 오더**: 24건

### 스타일별 실적 TOP 5
| 스타일 | 매출 | GM% | 재단율 |
|--------|------|-----|--------|
| BKPTM5182 | 2.1억 | 42.3% | 95.2% |
| BKPTM5106 | 1.8억 | 39.8% | 92.8% |
| BKPTM5284 | 1.5억 | 38.2% | 94.1% |
| BKPTM5102 | 1.3억 | 37.5% | 91.5% |
| BKPTM5111 | 1.1억 | 36.9% | 93.2% |

### 공장별 생산 현황
- **Vietnam ND**: 8.5억 (66.4%), 재단율 92.5%
- **CNF VINA**: 2.8억 (21.9%), 재단율 88.2%
- **Cambodia 1**: 1.5억 (11.7%), 재단율 90.1%

### 분석 의견
beanpole golf는 전반적으로 **우수한 실적**을 기록 중입니다. 특히 BKPTM5182 스타일이 42.3%의 높은 GM%를 달성하며 효자 상품으로 자리매김했습니다. CNF VINA 공장의 재단율(88.2%)이 타 공장 대비 낮아 개선이 필요합니다.`,

  "공장별 재단율 현황은 어때?": `## 공장별 재단율 현황

**26SS 시즌 | 26년 1월 기준**

### 공장별 종합 현황
| 공장 | 매출 | 재단율 | 전월 대비 | 상태 |
|------|------|--------|-----------|------|
| Vietnam ND | 17.9억 | 88.8% | +2.1%p | 양호 |
| Vietnam TB | 10.6억 | 92.9% | +1.5%p | 우수 |
| YEN THANH | 8.0억 | 80.4% | -3.2%p | 주의 |
| CNF VINA | 8.0억 | 70.7% | -5.8%p | 경고 |
| Cambodia 1 | 6.3억 | 85.2% | +0.8%p | 양호 |

### 브랜드별 재단율 (상위 5개)
- **beanpole golf**: 92.5% (우수)
- **descente sports**: 91.2% (우수)
- **rogatis**: 89.8% (양호)
- **galaxy**: 85.6% (양호)
- **XEXYMIX**: 82.4% (보통)

### 주요 이슈
1. **CNF VINA** 공장 재단율 **70.7%**로 심각한 상황
   - 원인: 신규 라인 세팅 문제, 원단 불량 다발
   - 조치: 품질관리팀 파견 예정 (1/28)

2. **YEN THANH** 공장 재단율 하락 추세
   - 전월 대비 -3.2%p 감소
   - 원인 분석 중

### 개선 제안
- CNF VINA 공장 긴급 품질 점검 필요
- YEN THANH 공장 재단 공정 모니터링 강화 권고`,

  "GM 개선을 위한 제안을 해줘": `## GM(Gross Margin) 개선 제안

**현재 상황**: 평균 GM% 35.2% (목표 37%)

### 1. 원가 절감 방안

#### 원자재 구매
- **대량 구매 협상**: 주요 원단 3개 품목 연간 계약 시 **5~8% 절감** 가능
- **대체 Vendor 발굴**: 현재 단일 거래처 의존도 높은 부자재 5개 품목 검토

#### 생산 효율화
- **CNF VINA 재단율 개선**: 70.7% → 85% 달성 시 약 **1.2억원 절감**
- **불량률 감소**: 현재 평균 3.2% → 2% 목표

### 2. 매출 개선 방안

#### 고수익 스타일 확대
| 스타일 | 현재 GM% | 생산 확대 제안 |
|--------|----------|----------------|
| BKPTM5182 | 42.3% | +20% 증산 |
| BKPTM5106 | 39.8% | +15% 증산 |

#### 저수익 스타일 구조조정
- GM% 25% 미만 스타일 5개 → 단종 또는 원가 재검토

### 3. 실행 로드맵

**1월 (즉시)**
- CNF VINA 품질관리팀 파견
- 저수익 스타일 원가 분석

**2월**
- 원자재 연간 계약 협상 시작
- 대체 Vendor 샘플 테스트

**3월**
- 고수익 스타일 증산 반영
- 신규 Vendor 계약 체결

### 예상 효과
위 방안 실행 시 **GM% 2~3%p 개선** 예상 (35.2% → 37~38%)
연간 약 **8~12억원** 수익 개선 기대`,
};

const defaultResponse = `질문해 주신 내용을 분석해 드리겠습니다.

현재 거림트렌드 ERP 시스템에서 확인된 주요 지표입니다:

### 26년 1월 현황 요약
- **누적 매출**: 62.6억원
- **진행중 오더**: 156건
- **평균 GM%**: 35.2%
- **평균 재단율**: 85.4%

### 브랜드별 매출 순위
1. beanpole golf: 12.8억
2. beanpole mens: 10.2억
3. descente sports: 9.5억

더 구체적인 분석이 필요하시면 말씀해 주세요. 브랜드별, 공장별, 스타일별 상세 데이터를 제공해 드릴 수 있습니다.`;

export function ChatbotView() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateResponse = async (userMessage: string) => {
    setIsLoading(true);

    // 타이핑 효과를 위한 딜레이
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response =
      demoResponses[userMessage] ||
      (userMessage.includes("매출")
        ? demoResponses["26년 1월 매출 동향을 알려줘"]
        : userMessage.includes("beanpole") || userMessage.includes("빈폴")
          ? demoResponses["beanpole golf 브랜드 실적 분석해줘"]
          : userMessage.includes("재단") || userMessage.includes("공장")
            ? demoResponses["공장별 재단율 현황은 어때?"]
            : userMessage.includes("GM") || userMessage.includes("개선")
              ? demoResponses["GM 개선을 위한 제안을 해줘"]
              : defaultResponse);

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = input.trim();
    setInput("");

    await simulateResponse(messageText);
  };

  const handleSuggestedQuestion = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    await simulateResponse(text);
  };

  const suggestedQuestions = [
    {
      icon: TrendingUp,
      text: "26년 1월 매출 동향을 알려줘",
      color: "text-emerald-600",
    },
    {
      icon: Package,
      text: "beanpole golf 브랜드 실적 분석해줘",
      color: "text-blue-600",
    },
    {
      icon: Factory,
      text: "공장별 재단율 현황은 어때?",
      color: "text-orange-600",
    },
    {
      icon: Sparkles,
      text: "GM 개선을 위한 제안을 해줘",
      color: "text-purple-600",
    },
  ];

  // 마크다운 스타일 렌더링 (간단한 버전)
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      // 헤더
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-lg font-bold mt-4 mb-2 text-[#1AD079]">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="text-base font-semibold mt-3 mb-1">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h4 key={i} className="text-sm font-semibold mt-2 mb-1">
            {line.replace("#### ", "")}
          </h4>
        );
      }
      // 테이블 헤더
      if (line.startsWith("|") && line.includes("|")) {
        const cells = line
          .split("|")
          .filter((c) => c.trim())
          .map((c) => c.trim());
        const isHeader =
          i < lines.length - 1 && lines[i + 1]?.includes("---");
        const isSeparator = line.includes("---");
        if (isSeparator) return null;
        return (
          <div
            key={i}
            className={`grid gap-2 py-1 px-2 text-xs ${isHeader ? "font-semibold bg-muted/50 rounded" : ""}`}
            style={{
              gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))`,
            }}
          >
            {cells.map((cell, j) => (
              <span key={j} className={j === 0 ? "font-medium" : ""}>
                {cell}
              </span>
            ))}
          </div>
        );
      }
      // 리스트
      if (line.startsWith("- ")) {
        return (
          <p key={i} className="ml-4 text-sm">
            {"• "}
            {renderBoldText(line.replace("- ", ""))}
          </p>
        );
      }
      if (line.match(/^\d+\. /)) {
        return (
          <p key={i} className="ml-4 text-sm">
            {renderBoldText(line)}
          </p>
        );
      }
      // 일반 텍스트
      if (line.trim()) {
        return (
          <p key={i} className="text-sm">
            {renderBoldText(line)}
          </p>
        );
      }
      return <br key={i} />;
    });
  };

  // 볼드 텍스트 처리
  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <Card className="flex-1 flex flex-col border-0 shadow-none bg-background">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1AD079] to-[#15a863] flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                거림트렌드 AI 어시스턴트
              </h2>
              <p className="text-sm text-muted-foreground font-normal">
                ERP 데이터 기반 인사이트를 제공합니다
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto scrollbar-hide" ref={scrollRef} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1AD079] to-[#15a863] flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  무엇을 도와드릴까요?
                </h3>
                <p className="text-muted-foreground text-center mb-8 max-w-md">
                  매출 분석, 브랜드별 실적, 공장 현황 등
                  <br />
                  ERP 데이터에 대해 질문해 주세요
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedQuestion(q.text)}
                      disabled={isLoading}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-[#1AD079]/50 transition-all text-left group disabled:opacity-50"
                    >
                      <q.icon
                        className={`w-5 h-5 ${q.color} group-hover:scale-110 transition-transform`}
                      />
                      <span className="text-sm text-foreground">{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1AD079] to-[#15a863] flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-[#1AD079] text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.role === "user" ? (
                        <p className="text-sm">{message.content}</p>
                      ) : (
                        <div className="leading-relaxed">
                          {renderContent(message.content)}
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-background" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1AD079] to-[#15a863] flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="매출, 브랜드, 공장 현황 등에 대해 질문해 주세요..."
                disabled={isLoading}
                className="flex-1 h-12 rounded-xl border-border focus:border-[#1AD079] focus:ring-[#1AD079]"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-12 px-6 rounded-xl bg-[#1AD079] hover:bg-[#15a863] text-white"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-3">
              AI가 ERP 데이터를 분석하여 답변합니다. (Demo)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
