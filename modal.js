import { ACTIVE, OVERFLOW } from "./constant.js";
/**
 * btnSelector = [String] : 이벤트 핸들러
 * closeBtns = [Array] : 모달을 닫는 버튼들
 * modal = [String] : 타겟 모달
 */
export default class Modal {
   constructor({ btnSelector, btnClose, modal }) {
      this.$html = document.querySelector("html");
      this.$body = document.querySelector("body");
      this.$btn = document.querySelector(btnSelector);
      this.$modal = document.querySelector(modal);
      this.closeBtns = document.querySelectorAll(btnClose);
      this.init();

      this.focusableEls = null;
      this.firstFocusableEl = null;
      this.lastFocusableEl = null;
   }
   init() {
      this.$modal.classList.add("modal_bg");

      this.closeBtns.forEach( (arg) => {
        arg.addEventListener("click", this.handleModalClose.bind(this));
      });

      this.$html.addEventListener("click", this.handleBackdropModalClose.bind(this));
      this.$btn.addEventListener("click", this.handleModalOpen.bind(this));
      this.$modal.addEventListener('keydown', this.handleFocusTab.bind(this));
   };
   // 모달을 띄어주는 메서드
   handleModalOpen() {
      this.$body.classList.add(OVERFLOW);
      this.$modal.classList.add(ACTIVE);
      this.$modal.querySelector('.modal_body').setAttribute('tabindex', '0');
      this.$modal.querySelector('.modal_body').focus();
      this.focusableEls = this.$modal.querySelectorAll(
         "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]"
      );
      this.firstFocusableEl = this.focusableEls[0]
      this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];
   };
   // 모달을 닫는 메서드
   handleModalClose() {
      this.$body.classList.remove(OVERFLOW);
      this.$modal.classList.remove(ACTIVE);
   };
   // 모달 배경을 누르면 닫히는 메서드
   handleBackdropModalClose(e) {
      const $target = e.target;
      const isBgClass = $target.classList.contains("modal_bg");

      if (!isBgClass) return;

      $target.classList.remove(ACTIVE);
      this.$body.classList.remove(OVERFLOW);

      e.stopPropagation();
   };
   // 모달 접근성 포커스 탭 메서드
   handleFocusTab(e) {
      const firstFocusableEl = this.firstFocusableEl;
      const lastFocusableEl = this.lastFocusableEl;

      if (e.key === "Tab") {
         if (document.activeElement === lastFocusableEl && !e.shiftKey) {
            firstFocusableEl.focus();
            e.preventDefault();
         } else if (document.activeElement === firstFocusableEl && e.shiftKey) {
           lastFocusableEl.focus();
           e.preventDefault();
         }
       };

      if (e.key === "Escape") {
         this.handleModalClose();
      }
   }
};
