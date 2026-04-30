# Gemini 기능 AWS 반영 가이드

이 문서는 `gemini` 브랜치에 추가된 Gemini CS 답변 초안/답변 저장 기능을 EC2/RDS 운영 환경에 반영하는 절차입니다.

## 1. 코드 반영

EC2에서 현재 서비스가 올라간 프로젝트 디렉터리로 이동한 뒤 브랜치를 가져옵니다.

```bash
git fetch origin
git checkout gemini
git pull origin gemini
```

## 2. 백엔드 의존성 설치와 빌드

Gemini SDK는 Node.js 20 이상을 권장합니다. 먼저 서버의 Node 버전을 확인합니다.

```bash
node -v
```

```bash
cd backend
npm install
npm run build
```

## 3. RDS 테이블 추가

운영 MySQL/RDS에서 아래 SQL 파일을 실행합니다.

```bash
backend/sql/add_inquiry_replies.sql
```

추가되는 테이블은 `inquiry_replies`입니다. 담당자가 전송한 CS 답변을 문의 ID별로 저장합니다.

## 4. 환경변수 추가

백엔드 `.env` 또는 PM2/systemd 환경변수에 Gemini API 키를 추가합니다.

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_MODEL`은 선택값입니다. 생략하면 `gemini-2.5-flash`를 사용합니다.

주의: `GEMINI_API_KEY`, DB 비밀번호 같은 secret은 GitHub에 커밋하지 마세요.

## 5. 백엔드 재시작

PM2를 쓰는 경우 예시:

```bash
pm2 restart support-backend
pm2 logs support-backend
```

systemd를 쓰는 경우 예시:

```bash
sudo systemctl restart support-backend
sudo systemctl status support-backend
```

서비스 이름은 현재 EC2에서 사용 중인 이름에 맞춰 실행하세요.

## 6. 배포 후 확인

```bash
curl http://<EC2_PUBLIC_IP>/health
```

Gemini 초안 생성 확인:

```bash
curl -X POST http://<EC2_PUBLIC_IP>/api/inquiries/1/ai-draft
```

답변 저장 확인:

```bash
curl -X POST http://<EC2_PUBLIC_IP>/api/inquiries/1/replies \
  -H "Content-Type: application/json" \
  -d '{"body":"안녕하세요, 테스트 답변입니다."}'
```

저장된 답변 조회:

```bash
curl http://<EC2_PUBLIC_IP>/api/inquiries/1/replies
```

마지막으로 브라우저에서 아래 화면을 열어 확인합니다.

```text
http://<EC2_PUBLIC_IP>/tickets/1
```

기대 동작:

- 기존 AI 초안이 있으면 바로 표시됩니다.
- AI 초안이 없으면 티켓 진입 시 Gemini 초안이 생성됩니다.
- `다시 생성` 버튼을 누르면 Gemini가 새 초안을 만듭니다.
- `답변 전송` 버튼을 누르면 답변이 DB에 저장되고, 새로고침 후에도 담당자 말풍선으로 표시됩니다.
