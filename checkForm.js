// 버튼 활성화 여부 체크 클래스
export class CheckFormAsButton {
   constructor({ form, selectors, button }) {
     this.form = document.querySelector(form);
     this.selectors = selectors;
     this.button = document.querySelector(button);
 
     this.init();
   }
 
   init() {
     this.form.addEventListener('input', () => {
       const values = this.selectors.map(selector => {
         const value = document.querySelector(selector).value;
         return value ? value.trim() : '';
       });
       const hasEmpty = values.some(value => !value);
       this.button.disabled = hasEmpty;
     });
   }
 }
 
 // 유효성 검사 클래스
 export class CheckValidation {
   constructor({ form, sucesse, fail, not = [] }) {
     this.VALID = 'valid';
     this.INVALID = 'invalid';
     this.$form = document.querySelector(form);
     this.$target = null;
     this.validation = false;
     this.password = '';
     this.password_ck = '';
     this.not = not;
     this.sucesse = sucesse;
     this.fail = fail;
 
     this.validators = {
       userId: this.validateUserId.bind(this),
       userPassword: this.validatePassword.bind(this),
       userPassword_ck: this.verifyPassword.bind(this),
       userbirthday: this.validateBirthdate.bind(this),
       userTel_1: value => this.validateTel(value, 3),
       userTel_2: value => this.validateTel(value, 4),
       userTel_3: value => this.validateTel(value, 4),
       companyTel_1: value => this.validateTel(value, 3),
       companyTel_2: value => this.validateTel(value, 4),
       companyTel_3: value => this.validateTel(value, 4),
       companyFax_1: value => this.validateTel(value, 4),
       companyFax_2: value => this.validateTel(value, 4),
       companyFax_3: value => this.validateTel(value, 4),
       companyDetails_2: this.validateCompanyDetail.bind(this)
     };
 
     this.init();
   }
 
   init() {
     this.$form.addEventListener('input', e => {
       this.$target = e.target;
       this.validateField();
       const result = this.resultValidate();
 
       if (result.length) {
         this.fail && this.fail(result);
       } else {
         this.sucesse && this.sucesse();
       }
     });
   }
 
   validateField() {
     const name = this.$target.name;
     const value = this.$target.value.trim();
     const validator = this.validators[name];
     this.validation = validator ? validator(value) : true;
     this.toggleValidationClass();
   }
 
   onlyNumbers(value) {
     return value.replace(/[^0-9]/g, '');
   }
 
   onlyLetter(value) {
     return value.replace(/[^a-zA-Z]/g, '');
   }
 
   onlyAlphanumeric(value) {
     return value.replace(/[^0-9a-zA-Z]/g, '');
   }
 
   setMaxLength(value, maxLength) {
     if (value.length >= maxLength) {
       return value.slice(0, maxLength);
     }
     return value;
   }
 
   validateUserId(value) {
     const sanitized = this.onlyAlphanumeric(value);
     this.$target.value = sanitized;
     const minLength = 4;
     const maxLength = 16;
     const regex = /^[a-z0-9]+$/;
     return sanitized.length >= minLength && sanitized.length <= maxLength && regex.test(sanitized);
   }
 
   validatePassword(value) {
     const inputValue = value.trim();
     const minLength = 8;
     const hasUpperCase = /[A-Z]/.test(inputValue);
     const hasLowerCase = /[a-z]/.test(inputValue);
     const hasNumber = /[0-9]/.test(inputValue);
     const hasSpecialChar = /[!@#$%^&*]/.test(inputValue);
 
     this.password = inputValue;
 
     if (this.password_ck !== '') {
       return this.password_ck.trim() === inputValue;
     }
 
     return inputValue.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
   }
 
   verifyPassword(value) {
     const inputValue = value.trim();
     this.password_ck = inputValue;
     return this.password.trim() === inputValue;
   }
 
   validateBirthdate(value) {
     const numeric = this.onlyNumbers(value);
     const length = 8;
     const birthdateRegex = /^\d{8}$/;
     const resultValue = this.setMaxLength(numeric, length);
     this.$target.value = resultValue;
     return resultValue.length === length && birthdateRegex.test(resultValue);
   }
 
   validateTel(value, num) {
     const numeric = this.onlyNumbers(value);
     const resultValue = this.setMaxLength(numeric, num);
     this.$target.value = resultValue;
     return resultValue.length === num;
   }
 
   validateCompanyDetail(value) {
     const alphanumeric = this.onlyAlphanumeric(value);
     this.$target.value = alphanumeric;
     return /^[0-9a-zA-Z]*$/.test(alphanumeric);
   }
 
   toggleValidationClass() {
     if (this.validation) {
       this.$target.classList.add(this.VALID);
       this.$target.classList.remove(this.INVALID);
     } else {
       this.$target.classList.add(this.INVALID);
       this.$target.classList.remove(this.VALID);
     }
   }
 
   resultValidate() {
     const $selectors = this.$form.querySelectorAll('input, textarea, select');
     return Array.from($selectors).filter(el => {
       const isExcluded = this.not.includes(el.name);
       const isInvalid = el.classList.contains(this.INVALID);
       const isCheckbox = el.type === 'checkbox';
       const hasValue = !!el.value;
 
       if (isInvalid) return true;
       if (!isExcluded && isCheckbox && !el.checked) return true;
       if (!isExcluded && !hasValue) return true;
       return false;
     });
   }
 }
 