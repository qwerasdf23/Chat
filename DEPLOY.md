# 포트폴리오용 배포 (다른 사람도 볼 수 있는 주소)

## 방법 1: Vercel (추천 – 무료, 주소 고정)

1. **GitHub에 코드 올리기**
   - https://github.com 에서 새 저장소 만들기
   - 프로젝트 폴더에서:
   ```powershell
   git init
   git add .
   git commit -m "chatbot"
   git branch -M main
   git remote add origin https://github.com/내아이디/저장소이름.git
   git push -u origin main
   ```

2. **Vercel 배포**
   - https://vercel.com 접속 → **Sign Up** (GitHub로 로그인)
   - **Add New** → **Project** → 방금 올린 저장소 선택
   - **Environment Variables**에 추가:
     - Name: `GEMINI_API_KEY`
     - Value: (Google AI Studio에서 복사한 API 키)
   - **Deploy** 클릭

3. **완료**
   - `https://프로젝트이름.vercel.app` 같은 주소가 생김 → 이 주소를 포트폴리오에 넣으면 됨.

---

## 방법 2: ngrok (당장만 링크 공유할 때)

- PC에서 `npm run dev` 실행한 상태에서만 접속 가능.

1. https://ngrok.com 에서 가입 후 ngrok 설치
2. 터미널에서:
   ```powershell
   ngrok http 3000
   ```
3. 나오는 주소(예: `https://abc123.ngrok.io`)를 다른 사람에게 공유
   - PC를 끄거나 `npm run dev`를 종료하면 링크는 동작하지 않음.

---

## 참고

- **API 키**: Vercel에서는 코드에 키를 넣지 말고, 반드시 **Environment Variables**에만 넣기.
- **한도**: Gemini 무료 한도는 배포된 사이트에서 쓰는 것도 포함되므로, 트래픽이 많으면 한도 초과될 수 있음.
