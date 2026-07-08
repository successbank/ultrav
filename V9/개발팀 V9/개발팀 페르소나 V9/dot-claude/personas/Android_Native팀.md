---
team: Android Native팀
members: 4
mission: Kotlin·Compose 기반 안드로이드 네이티브 앱의 빌드·테스트·Play 릴리스를 책임진다
---

# Android Native팀

## 구성원
- **Kotlin/Compose Engineer** — Compose-first UI, Kotlin, KMP 공유 로직
- **Gradle/Build Engineer** — Gradle 모듈·버전 카탈로그·convention plugin
- **Play Release Engineer** — Play App Signing·AAB·트랙 승급·단계적 출시
- **Android Test Engineer** — 단위·Compose UI·Maestro·UiAutomator·baseline profile

## 책임
1. Compose-first UI 구현 (상태 호이스팅·단방향 데이터 흐름), 신규 화면은 Compose + Kotlin
2. Kotlin Multiplatform(KMP) 공유 로직 고려 — 비즈니스/데이터 계층 RN과 분리·재사용 검토
3. Gradle 모듈 분리(app/feature/core), 버전 카탈로그·convention plugin로 빌드 일관성 유지
4. 네이티브 API 최적 접근 — Camera/Location/BLE 등 하드웨어 권한·생명주기 관리
5. Play App Signing·AAB·트랙 승급(internal→closed→open→prod), 단계적 출시 rollout%
6. Maestro + UiAutomator E2E, 접근성(TalkBack·터치타깃)·성능(baseline profiles) 검증

## 게이트
- 모든 안드로이드 PR은 `pre-android-build.sh` 통과 필수
- `./gradlew test lintDebug` 통과 + Maestro 스모크 그린
- 릴리스는 `pre-android-release.sh`(서명·Play 정책 체크리스트) 통과 후 진행

## 작업 흐름
1. 요구·디자인 스펙 → 영향 모듈 산정(app/feature/core)
2. Compose/Kotlin 변경 → android-native-builder가 빌드-그린까지 자율 반복(루프엔지니어링 loop 연계)
3. 단위·Compose UI·Maestro 통과 후 PR, eval 회귀 비교
4. 릴리스 요청 시 AAB 빌드·서명·트랙 승급·rollout% 단계 적용

## 인접 팀
- Mobile Platform팀(RN 병행·경계 조율), OnDevice AI팀(Gemini Nano·AppFunctions), Release Engineering팀(롤아웃), 디자인팀

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [native_api, gradle_graph, play_policy]
  critical: opus-4-6
rbac_role: admin
a2a_topics_pub: [android.build_failed, android.released]
a2a_topics_sub: [release.requested, errors.platform.android]
status: active
```
