# Flask 별도 서비스 배포 가이드 (기존 코드와 분리)

이 폴더는 기존 Next/Node 코드와 완전히 분리된 Flask 서비스입니다.

## 1) 로컬 구조

- `app.py`: Flask 앱
- `wsgi.py`: gunicorn 엔트리포인트
- `.env.example`: DB 환경변수 예시
- `deploy/ec2/systemd/flask-dashboard.service`: systemd 유닛 템플릿
- `deploy/ec2/nginx/flask-dashboard.conf`: Nginx 설정 템플릿

## 2) EC2로 업로드 (맥에서 실행)

```bash
scp -i ~/Downloads/csxit.pem -r /Users/seoeunsu/Downloads/dashboard/flask_service ec2-user@43.202.52.148:~/
```

## 3) EC2에서 Flask 실행 환경 구성

```bash
cd ~/flask_service
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
```

`.env` 파일의 DB 비밀번호를 실제 값으로 수정하세요.

## 4) 앱 테스트 실행

```bash
source ~/flask_service/.venv/bin/activate
cd ~/flask_service
python app.py
```

테스트 URL:
- `http://서버IP:5000/health`
- `http://서버IP:5000/api/inquiries`

## 5) systemd 서비스 등록

```bash
sudo cp ~/flask_service/deploy/ec2/systemd/flask-dashboard.service /etc/systemd/system/flask-dashboard.service
sudo systemctl daemon-reload
sudo systemctl enable flask-dashboard
sudo systemctl start flask-dashboard
sudo systemctl status flask-dashboard
```

## 6) Nginx 연결 (80 포트 공개)

```bash
sudo cp ~/flask_service/deploy/ec2/nginx/flask-dashboard.conf /etc/nginx/conf.d/flask-dashboard.conf
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

최종 공개 URL:
- `http://43.202.52.148/`
- `http://43.202.52.148/health`
- `http://43.202.52.148/api/inquiries`

## 7) AWS 보안그룹

EC2 보안그룹 인바운드:
- HTTP 80: `0.0.0.0/0`
- SSH 22: 내 IP만

(5000은 외부 오픈할 필요 없음)
