import { GoogleGenAI } from "@google/genai";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_TIMEOUT_MS = 20_000;

export class GeminiConfigError extends Error {}
export class GeminiGenerationError extends Error {}

export interface DraftPromptInput {
  ticketId: string;
  customerMessage: string;
  customerName: string;
  productName: string;
  orderNumber: string;
  category: string;
  channel: string;
  storeName: string;
  responseStyle: string;
  storePolicy: string;
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new GeminiConfigError("GEMINI_API_KEY is not configured.");
  }

  return new GoogleGenAI({ apiKey });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = DEFAULT_TIMEOUT_MS) {
  let timeout: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new GeminiGenerationError("Gemini draft generation timed out."));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeout);
  });
}

function buildDraftSystemPrompt(input: DraftPromptInput) {
  return `당신은 ${input.storeName}의 고객 상담 AI 보조 시스템입니다.

역할:
- 고객 문의의 의도를 파악합니다.
- 스토어 정책을 벗어나지 않는 한국어 답변 초안을 작성합니다.
- 친절하고 자연스럽고 실무적인 어조를 유지합니다.
- 필요한 경우 사과, 현재 진행 상태, 다음 안내를 포함합니다.
- 확인되지 않은 사실은 지어내지 않습니다.
- 고객에게 보내는 최종 답변 초안만 작성합니다.

응대 톤:
${input.responseStyle}

스토어 정책:
${input.storePolicy}

출력 규칙:
- 마크다운 제목이나 코드블록 없이 답변 본문만 작성합니다.
- 한국어로만 작성합니다.
- 지나치게 장황하지 않게 3~6문장 정도로 작성합니다.
- 실제로 확인되지 않은 일정, 재고, 환불 완료 사실은 단정하지 않습니다.
- 주문번호, 상품명, 문의 상황을 가능한 범위에서 자연스럽게 반영합니다.`;
}

function buildDraftUserPrompt(input: DraftPromptInput) {
  return `티켓 정보:
- 티켓 ID: ${input.ticketId}
- 고객명: ${input.customerName}
- 채널: ${input.channel}
- 문의 카테고리: ${input.category}
- 상품명: ${input.productName}
- 주문번호: ${input.orderNumber}

고객 문의 원문:
${input.customerMessage}

위 정보를 바탕으로, 시스템 프롬프트에 명시된 스토어 정책과 응대 규칙을 엄격히 준수하여 고객에게 발송할 최종 답변 초안을 작성해 주세요.`;
}

export async function generateDraftWithGemini(input: DraftPromptInput) {
  const ai = getGeminiClient();
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model,
        contents: buildDraftUserPrompt(input),
        config: {
          systemInstruction: buildDraftSystemPrompt(input),
          temperature: 0.4,
        },
      })
    );

    const draft = response.text?.trim();

    if (!draft) {
      throw new GeminiGenerationError("Gemini returned an empty draft.");
    }

    return draft;
  } catch (error) {
    if (error instanceof GeminiConfigError || error instanceof GeminiGenerationError) {
      throw error;
    }

    throw new GeminiGenerationError("Gemini draft generation failed.");
  }
}
