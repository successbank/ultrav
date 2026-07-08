---
name: ios-release-appstore
description: App Store 릴리스 실행. 아카이브·서명·TestFlight·단계적 출시(phased release)·App Privacy.
---

# iOS Release (App Store)

## 흐름
1. 아카이브 빌드 (`xcodebuild -scheme App archive`) + 자동/수동 서명(프로비저닝 프로파일)
2. App Store 정책 점검 (App Privacy 영양 라벨·entitlements·ATT·최소 OS) — `pre-ios-release.sh`
3. 업로드: App Store Connect API(또는 Transporter/`xcrun altool`) → TestFlight
4. 단계적 출시(phased release, 7일 자동 단계) 설정 후 심사 제출
5. 필요 시 사전 주문(pre-order)·외부 테스터(TestFlight) 구성

## 산출물
- 업로드 가능한 .ipa + 릴리스 노트
- phased release 계획, 중단/롤백(개발자 릴리스 일시중지) 기준
- 크래시(Xcode Organizer/Metrics) 임계 모니터링 연계
