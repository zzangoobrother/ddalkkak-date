# JIRA 티켓 작업 시작

JIRA 티켓 작업을 시작합니다. 새로운 브랜치를 생성하고 전환합니다.

## 작업 순서

1. 사용자에게 다음 정보를 물어봅니다:
   - JIRA 티켓 번호 (예: DD-123)
   - 티켓 유형 (feature/bugfix/hotfix)
   - 간단한 설명 (영어, kebab-case)

2. main 브랜치에서 최신 코드를 가져옵니다:
   ```bash
   git checkout main
   git pull origin main
   ```

3. 새 브랜치를 생성하고 전환합니다:
   ```bash
   git checkout -b [티켓유형]/[티켓번호]-[설명]
   ```
   예: `git checkout -b feature/DD-123-add-region-map`

4. 브랜치 생성 완료를 확인하고 사용자에게 알립니다:
   ```bash
   git branch --show-current
   ```

5. 사용자에게 작업을 시작할 수 있다고 안내합니다.

## 예시

사용자 입력:
- 티켓 번호: DD-123
- 티켓 유형: feature
- 설명: add-region-map

실행 결과:
```bash
git checkout main
git pull origin main
git checkout -b feature/DD-123-add-region-map
```
