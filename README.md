# 자바스크립트 모듈

## 체크박스 관리 클래스 - checkbox.js

HTML 체크박스를 제어할 수 있는 클래스입니다.  
전체 선택, 개별 선택, 선택된 항목 수 표시, 상단 메뉴 연동 등  
체크박스 관련 UI 동작을 관리할 수 있습니다.

---

### 주요 기능

- 전체 선택/해제 기능
- 개별 선택에 따른 전체 선택 상태 자동 제어
- 선택된 항목 수 UI 연동
- 상단 네비게이션 메뉴 연동 (선택 항목 있을 때 토글 등)
- 선택된 값 외부에서 조회 가능

---

### 사용 방법

```js
import CheckBox from './checkbox.js';

const checkGroup = new CheckBox({
  allSelector: '#check-all',         // 전체 선택 체크박스
  boxesSelector: '.row-checkbox',    // 개별 체크박스들
  tableSelector: '#list-table',      // 이벤트 위임용 컨테이너
  navSync: true                      // 상단 메뉴 UI와 연동 여부 (선택)
});
```

## 입력 폼 유효성 검사 클래스 - formValidation.js

폼 입력값의 유효성 검사와 버튼 활성화 제어할 수 있는 클래스입니다.
회원가입, 로그인, 정보 입력 등에서 필요한 필수값 체크 및 유효성 검사를 관리할 수 있습니다.

---

### CheckFormAsButton 클래스

버튼을 눌러도 되는 상태인지 판단하기 위한 필수값 입력 여부 감지 클래스입니다.

### 주요 기능

- 지정된 입력값들이 모두 채워졌을 때 버튼 활성화
- 하나라도 비어 있으면 버튼 비활성화 유지

### 사용 방법

```js
new CheckFormAsButton({
  form: '#form-id', // 감지할 form 요소
  selectors: ['#input1', '#input2', ...], // 필수 입력 요소들의 셀렉터 배열
  button: '#submit-btn' // 제어할 버튼 요소
});
```

## 파일관리 클래스 - file.js

HTML input[type="file"] 요소를 제어하는 클래스입니다.,  
파일 리스트를 시각적으로 표현하며 삭제, 제한 처리 등을 담당하는 파일 업로드 관리할 수 있습니다.

---

### 주요 기능

- 싱글/멀티 파일 업로드 지원
- 미리보기 또는 파일명 리스트 렌더링
- 파일 최대 개수 및 크기 제한
- 동일 파일 중복 방지
- 삭제 시 DOM과 `input.files` 객체 동기화
- change 이벤트 강제 발생 처리

---

### 사용 방법

```js
import File from './file.js';

new File({
  fileSeletor: '#upload-input',       // input[type="file"] 요소
  listSelector: '#upload-preview',    // 파일 리스트를 렌더링할 DOM
  type: 'thumbnail',                  // 렌더링 타입: 'single' | 'multiple' | 'thumbnail'
  max: 5                              // 업로드 가능한 최대 파일 개수
});
```

## 모달 관리 클래스 - modal.js

HTML 모달 UI를 제어하기 위한 클래스입니다.  
모달 오픈/닫기, 외부 클릭으로 닫기, ESC 키 및 탭 포커스 순환 등 접근성이 고려된 모달 클래스입니다.

---

### 주요 기능

- 버튼 클릭 시 모달 열기
- 지정된 버튼 또는 배경 클릭 시 모달 닫기
- ESC 키 입력 시 닫기
- 포커스 탭 순환 처리 (접근성 고려)
- body 스크롤 차단 및 복구

---

### 사용 방법

```js
import Modal from './modal.js';

new Modal({
  btnSelector: '#open-modal-btn',     // 모달 열기 버튼
  btnClose: '.modal-close-btn',       // 모달 닫기 버튼(복수 가능)
  modal: '#target-modal'              // 모달 요소
});
```