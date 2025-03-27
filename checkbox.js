
export default class CheckBox {
  constructor( { allSelector, boxesSelector, tableSelector, navSync }) {
    /**
     * allSelector :  전체체크박스
     * boxesSelector : 전체 체크 박스 외 체크박스 DOM
     * tableSelector : 해당 클래스에 타겟 table DOM
     * navSync : 해당 체크박스와 탑 메뉴와 연결 유무
     */
    this.$all = document.querySelector(allSelector);
    this.boxesSelector = boxesSelector;
    this.boxes = [];
    this.$table = document.querySelector(tableSelector);
    this.navSync = navSync;
    this.$navCount = document.querySelector('#select-count');
    this.$navAll = document.querySelector('#select-all');
    this.$contentBody = document.querySelector('#content_body');
    this.$topNav = document.querySelector('#select_nav');

    this.init();
  };

  init() {
    // 전체 선택 체크박스의 변경 이벤트 핸들러
    this.$all.addEventListener("change", this.handleAllChangeCheck.bind(this));
    // 개별 체크박스들의 변경 이벤트 핸들러
    this.$table.addEventListener("change", this.handleChangeCheck.bind(this));
    // this.boxes.forEach((box) => {
    //   box.addEventListener("change", this.handleChangeCheck.bind(this));
    // });
    // 전체선택 클릭 체크박스 변경 이벤트 핸들러
    if(this.$navAll) {
      this.$navAll.addEventListener('click', this.handleClickAllCheck.bind(this));
    };
    // 체크박스 선택 시 탑 네비 토글 이벤트 핸들러
    if(this.$topNav && this.navSync) {
      this.$table.addEventListener('change', this.handleToggleTopNav.bind(this));
    };

  }; 
  refreshInputsSelector() {
    this.boxes =  Array.from(document.querySelectorAll(this.boxesSelector))
    return this.boxes;
  };
   // 전체 선택 체크박스의 변경 이벤트
  handleAllChangeCheck(e) {
    const checked = e.target.checked;
    const boxes = this.refreshInputsSelector();

    boxes.forEach((box) => {
      box.checked = checked;
      this.triggerChangeEvent(box);
    });
    
    this.setCount(this.getChecked().length);
  };
  // 개별 체크박스들의 변경 이벤트
  handleChangeCheck() {
    const boxes = this.refreshInputsSelector();
    const checkedLength = boxes.filter((box) => box.checked).length;
    this.$all.checked = checkedLength === boxes.length;
    this.setCount(this.getChecked().length);
  };
   // 전체선택 클릭 체크박스 변경 이벤트
  handleClickAllCheck() {
    this.$all.checked = true;
    const boxes = this.refreshInputsSelector();
    
    boxes.forEach((box) => {
      box.checked = true;
      this.triggerChangeEvent(box);
    });
    this.setCount(this.getChecked().length);
  }
  // 체크박스 선택 시 탑 네비 토글 이벤트
  handleToggleTopNav() {
    const ACTIVE = 'active';
    const isChecked = this.getChecked().length ? true : false;

    if(isChecked) {
      this.$contentBody.classList.add(ACTIVE);
    } else {
      this.$contentBody.classList.remove(ACTIVE);
    };

  };
  // 선택된 체크박스들의 값을 반환하는 메서드
  getChecked() {
    const boxe = this.refreshInputsSelector();
    return boxe.filter((box) => box.checked).map((box) => box.value);
  };
  // 체크박스들이 모두 선택됐는지 반환하는 메서드
  getAllChecked() {
    return this.boxes.length === this.getChecked().length ? true : false;
  };
  setCount(count) {
    if(!this.navSync) return;
    if(!this.$navCount) return;
    this.$navCount.innerText = `(${count})`;
  }; 
  // change 이벤트를 수동으로 트리거하는 메서드
  triggerChangeEvent(element) {
      const event = new Event('change', { bubbles: true });
      element.dispatchEvent(event);
   };
};


