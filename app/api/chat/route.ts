import { GoogleGenAI } from '@google/genai';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// .env.local을 못 읽을 때 쓰는 폴백 (배포 시에는 반드시 GEMINI_API_KEY 환경 변수만 사용하세요)
const FALLBACK_GEMINI_API_KEY = 'AIzaSyDVafOTwDwUSACDagnmRSQmuOL4_RToCrI';

function getEnvLocalPaths(): string[] {
  const base = __dirname;
  return [
    join(base, '..', '..', '..', '..', '.env.local'),
    join(base, '..', '..', '..', '.env.local'),
  ];
}

function readKeyFromFile(filePath: string): string | null {
  try {
    if (!existsSync(filePath)) return null;
    let content = readFileSync(filePath, 'utf8');
    content = content.replace(/^\uFEFF/, '');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed.startsWith('GEMINI_API_KEY=')) {
        const value = trimmed.slice('GEMINI_API_KEY='.length).trim().replace(/^["']|["']$/g, '');
        if (value.length > 10) return value;
        break;
      }
    }
  } catch {
    // 무시
  }
  return null;
}

function getGeminiApiKey(): string {
  let key = process.env.GEMINI_API_KEY?.trim();
  if (key) return key;

  for (const envPath of getEnvLocalPaths()) {
    key = readKeyFromFile(envPath);
    if (key) return key;
  }

  let dir = process.cwd();
  for (let i = 0; i < 10; i++) {
    key = readKeyFromFile(join(dir, '.env.local')) ?? readKeyFromFile(join(dir, '.env'));
    if (key) return key;
    const parent = join(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }

  if (FALLBACK_GEMINI_API_KEY) return FALLBACK_GEMINI_API_KEY;

  throw new Error(
    'GEMINI_API_KEY를 찾을 수 없습니다. .env.local에 키를 넣고 서버를 다시 실행해 주세요.'
  );
}

function getGemini() {
  return new GoogleGenAI({ apiKey: getGeminiApiKey() });
}

export const maxDuration = 30;

const SYSTEM_PROMPT = `당신은 친절하고 친근한 AI 어시스턴트입니다.
답변할 때 **충청도 사투리**를 살짝 섞어서 말해 주세요. (예: ~유, ~인걸, ~거든요, ~하유, ~데유, 그렇거든요, 어쩌다 이랬나, 좋긴 하네유 등)
너무 과하지 않게, 따뜻하고 친근한 느낌으로 사투리만 살짝 넣어 주세요. 내용은 정확하게 전달하고, 마크다운(불릿, 번호, 강조 등)도 적당히 써 주세요.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages 배열이 필요합니다.' }), { status: 400 });
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const raw = response.text;
    const answer =
      raw != null && String(raw).trim() !== ''
        ? String(raw)
        : '죄송합니다. 이번에는 답변을 생성하지 못했습니다. 다시 시도해 주세요.';

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: answer })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    console.error('Chat API error:', err);
    let message = '챗 API 오류가 발생했습니다.';
    if (err instanceof Error) message = err.message;
    if (typeof err === 'object' && err !== null && 'status' in err && err.status === 429) {
      message = '오늘 사용 한도를 모두 사용했습니다. 내일 다시 시도하거나, Google AI Studio에서 사용량을 확인해 주세요.';
    }
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
