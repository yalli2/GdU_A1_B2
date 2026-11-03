# Gramática en Clase — GdU A1–B2

『Gramática de uso del español: Teoría y práctica, A1–B2』(L. Aragonés, R. Palencia, SM) 1~126과를 따라가는 국제학교 스페인어 수업용 인터랙티브 학습 사이트입니다.

- **메인 페이지** `index.html` — 126개 Unidad 카드, 검색·필터, 학습 진도/평균 정답률
- **각 Unidad** `UnidadN/index.html` — 한국어 문법 정리, 연습문제(선택형·입력형), 채점·점수·해설, 틀린 문제만 다시 풀기
- 입력형은 악센트 누락 시 0.5점, 대소문자·구두점·공백 무시, `á é í ó ú ñ ü ¿ ¡` 입력 버튼, 예문 클릭 시 스페인어 음성(TTS), 다크 모드, 진도는 브라우저에 저장

## 구조
```
index.html
assets/ (style.css, main.js, unit.js, units.js)
Unidad1/ … Unidad126/ (index.html)
```

## 배포
GitHub Pages: Settings → Pages → Branch `main` / root. → https://yalli2.github.io/GdU_A1_B2/

> 이론 요약과 연습문제는 교재의 문법 항목에 맞춰 새로 작성한 것이며 교재의 문제를 그대로 옮기지 않았습니다.

## 번역 기능 (Translation)
- 모든 페이지 오른쪽 위의 🌐 언어 선택에서 100여 개 언어를 고를 수 있습니다 (Google 번역 위젯 사용, 인터넷 연결 필요).
- 스페인어 예문·문제·보기·정답은 번역되지 않고 그대로 유지됩니다. 선택한 언어는 브라우저에 저장됩니다.
- 기계 번역이므로 문법 용어가 부정확할 수 있습니다. '한국어 (원문)'을 선택하면 원래대로 돌아옵니다.

## 풀이 기록 누적
- 채점할 때마다 날짜·시간, 점수가 브라우저(localStorage)에 계속 누적됩니다. 단원 페이지 하단 '내 풀이 기록', 메인 페이지 '내 학습 기록'(총 풀이 횟수·오늘 푼 횟수·학습한 날)에서 확인합니다.
- 메인 페이지에서 CSV로 내려받을 수 있습니다(이름 포함). 기록은 해당 기기·브라우저에만 저장됩니다.
