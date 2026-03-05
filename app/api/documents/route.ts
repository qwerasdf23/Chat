import { NextResponse } from 'next/server';

// 문서 업로드/RAG 기능은 제거되었습니다. Open API 기반 일반 챗봇만 사용합니다.
export async function POST() {
  return NextResponse.json(
    { error: '문서 업로드 기능은 현재 비활성화되어 있습니다.' },
    { status: 410 }
  );
}
