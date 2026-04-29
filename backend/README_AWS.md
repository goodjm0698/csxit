# AWS RDS + AWS Backend 배포 가이드 (MySQL 기준)

이 문서는 `backend` 폴더의 Express API를 AWS에 올리고, RDS MySQL과 연결하는 전체 절차입니다.

## 1) 로컬에서 백엔드 실행 확인

```bash
cd backend
npm install
cp .env.example .env
# .env에 RDS 정보 넣기 전에는 로컬 DB를 쓰거나, health check만 참고
npm run dev
```

기본 주소: `http://localhost:8080/health`

## 2) AWS 콘솔에서 해야 할 서비스

이번 구성에서 주로 클릭할 AWS 콘솔은 아래 4개입니다.

1. IAM (관리자 사용자/권한)
2. RDS (MySQL DB 생성)
3. EC2 (백엔드 서버 생성)
4. VPC/Security Group (접속 허용 규칙)

## 3) IAM 사용자 생성 (이미 있으면 건너뛰기)

1. AWS 콘솔 로그인
2. 상단 검색창에 `IAM` 입력 -> IAM 진입
3. 왼쪽 `Users` -> `Create user`
4. 사용자명 입력 (예: `deploy-admin`)
5. 권한은 학습/개발 단계라면 `AdministratorAccess` 부여
6. 생성 후 Access key는 안전하게 저장

## 4) RDS MySQL 생성

1. 상단 검색창에 `RDS` -> RDS 진입
2. 왼쪽 `Databases` -> `Create database`
3. `Standard create` 선택
4. Engine: `MySQL`
5. Version: 기본 최신 안정 버전
6. Templates: `Free tier` (개발용) 또는 `Dev/Test`
7. DB instance identifier: 예) `support-db`
8. Master username/password 설정 (반드시 기록)
9. Instance class: 프리티어/저사양 선택
10. Storage: 기본값 사용 가능
11. Connectivity:
    - VPC: 기본 VPC
    - Public access: `No` 권장
12. VPC security group:
    - 새 SG 생성 또는 기존 SG 선택
13. `Create database`
14. 생성 완료 후 DB 상세에서 `Endpoint` 복사

## 5) RDS 보안그룹 인바운드 규칙 추가

핵심: EC2 인스턴스에서만 3306 포트로 RDS 접근 허용.

1. EC2 콘솔 -> 왼쪽 `Security Groups`
2. RDS에 연결된 보안그룹 선택
3. `Inbound rules` -> `Edit inbound rules`
4. 규칙 추가:
  - Type: `MYSQL/Aurora`
  - Port: `3306`
   - Source: `EC2 백엔드 보안그룹` (IP CIDR보다 SG 참조 권장)
5. 저장

## 6) EC2 서버 생성 (백엔드 실행용)

1. 상단 검색창 `EC2` -> EC2 진입
2. `Instances` -> `Launch instances`
3. Name: `support-backend`
4. AMI: `Amazon Linux 2023` 또는 `Ubuntu`
5. Instance type: `t3.micro` (개발용)
6. Key pair 생성/선택 (SSH 접속용)
7. Network settings:
   - SG 생성: 이름 `backend-sg`
   - Inbound: `HTTP 80` (0.0.0.0/0), `SSH 22` (내 IP만)
8. `Launch instance`

## 7) EC2에 백엔드 배포

아래는 EC2 접속 후 실행할 명령입니다.

### 7-1. Node.js 설치

Amazon Linux 2023 예시:

```bash
sudo dnf update -y
sudo dnf install -y nodejs git
node -v
npm -v
```

### 7-2. 코드 업로드

방법 A) GitHub 사용

```bash
git clone <your-repo-url>
cd dashboard/backend
npm install
npm run build
```

방법 B) 로컬에서 SCP 업로드 후 압축 해제

### 7-3. 환경변수 설정

`backend/.env` 파일 생성:

```env
PORT=8080
NODE_ENV=production
DB_HOST=<RDS_ENDPOINT>
DB_PORT=3306
DB_NAME=supportdb
DB_USER=<MASTER_USERNAME>
DB_PASSWORD=<MASTER_PASSWORD>
```

### 7-4. DB 테이블 초기화

RDS Query Editor에서 `backend/sql/init.sql` 실행 후, 아래 시드 명령으로 기본 데이터(김민수/장현우 등 8건) 입력:

```bash
npm run seed:mysql
```

이미 기존 DB를 사용 중이면 `backend/sql/add_store_settings.sql`만 실행해도 온보딩 저장 테이블이 추가됩니다.

### 7-5. 프로세스 매니저(PM2)로 실행

```bash
sudo npm i -g pm2
cd ~/dashboard/backend
pm2 start dist/server.js --name support-backend
pm2 startup
pm2 save
pm2 logs support-backend
```

## 8) EC2 리버스 프록시(Nginx) 설정 (선택이지만 권장)

1. Nginx 설치
2. 80 포트로 받은 요청을 8080으로 프록시
3. 프론트에서 `http://<EC2_PUBLIC_IP>/api/...` 호출 가능

간단 설정 예시:

```nginx
server {
  listen 80;
  server_name _;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

## 9) 동작 확인

브라우저/터미널에서:

```bash
curl http://<EC2_PUBLIC_IP>/health
```

정상 응답:

```json
{"status":"ok"}
```

## 10) 프론트엔드 연동 포인트

프론트에서 API base URL을 환경변수로 관리하세요.

예시:

- 개발: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`
- 배포: `NEXT_PUBLIC_API_BASE_URL=http://<EC2_PUBLIC_IP>`

## API 요약

- `GET /health`
- `GET /api/inquiries`
- `GET /api/inquiries/metrics`
- `GET /api/inquiries/:id`
- `GET /api/store-settings`
- `POST /api/store-settings`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/tickets?status=open&priority=high`
- `POST /api/tickets`
- `PATCH /api/tickets/:id/status`

### 샘플 요청

```bash
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Kim","email":"kim@example.com"}'
```

```bash
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"customerId":1,"title":"결제 오류","description":"카드 결제가 실패합니다","priority":"high"}'
```
