// src/app/api/feedback/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { feedbackType, content } = data;

    if (!feedbackType || !content) {
      return NextResponse.json(
        { message: "누락된 필드가 있습니다." },
        { status: 400 }
      );
    }

    // 제공해주신 정확한 정보로 값을 교체했습니다.
    // ★★★ 중요: URL의 끝을 'viewform'에서 'formResponse'로 변경해야 합니다. ★★★
    const googleFormUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSf6snRaKE5sDhbVCTC44GICPC7O4RydQ_lLQ6SbN98rmeCHaw/formResponse";
    const typeEntry = "entry.957908194";
    const contentEntry = "entry.456957366";

    // URLSearchParams를 사용하여 form-urlencoded 형식으로 데이터를 구성합니다.
    const params = new URLSearchParams();
    params.append(typeEntry, feedbackType);
    params.append(contentEntry, content);

    // Google Forms에 POST 요청을 보냅니다.
    const response = await fetch(googleFormUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    // Google Forms는 성공 시 200 OK 응답을 반환합니다.
    // 응답 상태를 직접 확인하여 성공 여부를 정확하게 판단합니다.
    if (response.ok) {
      return NextResponse.json(
        { message: "피드백이 성공적으로 제출되었습니다." },
        { status: 200 }
      );
    } else {
      // 응답이 OK가 아닐 경우, 응답 본문을 포함하여 서버 로그에 남깁니다.
      const errorBody = await response.text();
      console.error(
        "Google Forms 제출 실패:",
        response.status,
        response.statusText,
        errorBody
      );
      // 클라이언트에게 실패를 명확히 알립니다.
      return NextResponse.json(
        {
          message: `Google Forms 제출에 실패했습니다. (상태: ${response.status})`,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    // 네트워크 오류 등 fetch 자체가 실패한 경우
    console.error("피드백 제출 API 오류:", error);
    return NextResponse.json(
      { message: "피드백 제출 중 서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
