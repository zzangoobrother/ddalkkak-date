# JIRA PR 생성

현재 작업 브랜치의 변경사항을 커밋하고 PR을 생성합니다.

## 작업 순서

1. 현재 브랜치 이름을 확인합니다:
   ```bash
   git branch --show-current
   ```

2. 브랜치 이름에서 JIRA 티켓 번호를 추출합니다 (예: feature/DD-123-add-region-map → DD-123)

3. Git 상태를 확인합니다:
   ```bash
   git status
   ```

4. 변경사항이 있으면 사용자에게 커밋 메시지를 물어봅니다:
   - 기본값: 브랜치 이름에서 추출한 설명 사용
   - 형식: `[티켓번호] 동사 + 명사 형태의 설명`

5. 변경사항을 스테이징하고 커밋합니다:
   ```bash
   git add .
   git commit -m "[티켓번호] 커밋 메시지"
   ```

6. 원격 저장소에 푸시합니다:
   ```bash
   git push origin [브랜치명]
   ```

7. GitHub CLI로 PR을 생성합니다:
   ```bash
   gh pr create --title "[티켓번호] PR 제목" \
     --body "## 변경사항
   - 변경사항 요약

   ## JIRA 티켓
   [티켓 링크]

   ## 테스트 결과
   - [ ] 테스트 진행 예정" \
     --assignee @me
   ```

8. PR URL을 사용자에게 알립니다.

9. 다음 단계 안내:
   - `/jira-test` 명령어로 테스트 수행
   - 테스트 통과 후 `/jira-complete`로 머지

## 주의사항

- 커밋하기 전에 변경사항을 확인하고 사용자에게 확인받습니다.
- PR 본문에는 테스트 체크리스트를 포함합니다.
