import { useState } from './customHook.js';

const DELETE_BTN = 'btn_fileDelete';

const FILE_TYPE = (index, fileData, imageUrl, type) => {
   const { name } = fileData;
   const template = {
      single:` <div class="file-item ${type}">
         <span class="file-name">${name}</span>
         <button class="${DELETE_BTN}" data-index="${index}" type="button"></button>
      </div>`,
      multiple:` <div class="file-item ${type}">
         <span class="file-name">${name}</span>
         <button class="${DELETE_BTN}" data-index="${index}" type="button"></button>
      </div>`,
      thumbnail:` <div class="file-item ${type}">
         <img src="${imageUrl}">
         <button class="${DELETE_BTN}" data-index="${index}" type="button"></button>
      </div>`, 
   };
   return template[type];
};
const FILE_NONE_TYPE = type => {
   const template = {
      single: '<span class="file-placeholder">업로드 파일명</span>',
      multiple: '<span><span>',
      thumbnail: '<span><span>',
   };

   return template[type];
};
export default class File {
   constructor({fileSeletor, listSelector, type, max}) {
      this.inputFile = document.querySelector(fileSeletor);
      this.files = Array.from(this.inputFile.files);
      this.list = document.querySelector(listSelector);
      this.type = type;
      this.max = max;

      [this.state, this.setState] = useState(this.files);
      this.init();
   };
   init() {
      this.list.innerHTML = FILE_NONE_TYPE(this.type);
      // 파일 객체 리프레시 핸들러
      this.inputFile.addEventListener('change', e => {
         // isTrusted : dispatchEvent 일 경우 false 
         const { target, isTrusted } = e; 
         const isMultiple = target.multiple;

         if(!isTrusted) return;

         // input file Multiple check 
         if(isMultiple) {
            this.setMultipleFile(target);
         } else {
            this.setFile(target);
         };
      });
      // 파일 삭제 핸들러
      this.list.addEventListener('click', e => {
         const isDeleteBtn = e.target.classList.contains(DELETE_BTN);

         if(!isDeleteBtn) return;

         const getFileIndex = Number(e.target.getAttribute('data-index'));

         this.deleteFile(getFileIndex);
         this.triggerChangeEvent(this.inputFile);
      });
   };
   // 업로드 파일 리스트 갱신 메소드
   setFile(target) {
      const files = Array.from(target.files);
      const sizeFilterFiles = files.filter( file => !this.isFileMaxSize(file.size));
      const resultFiles = sizeFilterFiles.filter( newFile => {
         return !this.state().some( file => {
            if(newFile.size === file.size && newFile.name === file.name) file;
         } );
      });

      const newFileCount = this.state().length + resultFiles.length;

      if (newFileCount > this.max) {
         alert(`파일은 최대 ${this.max}개까지만 업로드할 수 있습니다.`);
         return;
      }

      this.setState(resultFiles)
      this.getFileDOM();
      // this.getFileDOM(file);
   };
   // 업로드 멀티 파일 리스트 갱신 메소드
   setMultipleFile(target) {
      const files = Array.from(target.files);
      const isMaxSizeFile = files.filter( file => this.isFileMaxSize(file.size)).length ? true : false;
      const sizeFilterFiles = files.filter( file => !this.isFileMaxSize(file.size));

      const resultFiles = sizeFilterFiles.filter( newFile => {
         return !this.state().some( file => {
            if(newFile.size === file.size && newFile.name === file.name) file;
         });
      });

      const newFileCount = this.state().length + resultFiles.length;

      if (newFileCount > this.max) {
         alert(`파일은 최대 ${this.max}개까지만 업로드할 수 있습니다.`);
         return;
      }

      if(isMaxSizeFile) {
         alert('파일 용량은 1024MB를 넘을 수 없습니다.');
      };

      this.setState([ ...this.state(), ...resultFiles]);

      this.getFileDOM();
      this.changeFileObject();
   };
   // 파일 갯수를 반환하는 메서드 
   getFileLength() {
      return this.files.length;
   };
   // 파일 삭제하는 메서드 
   deleteFile(fileIndex = 0) {
      const resultFiles = this.state().filter( (_, index) => index !== fileIndex);

      this.setState(resultFiles);
      this.getFileDOM();
      this.changeFileObject();
      
   };
   // 파일이 추가될때 추가되는 DOM ELEMENT를 반환하는 메서드
   getFileDOM() {
      const files = this.state();
      const list = this.list;
      const type = this.type;

      this.list.innerHTML = '';

      if(files.length) {
         files.forEach( (file, index) => {
            const reader = new FileReader();
   
            reader.addEventListener('load', function(e) {
               const { result } = e.target;
               list.innerHTML += FILE_TYPE(index, file, result, type);
            });
   
            reader.readAsDataURL(file);
         });
         return;
      };

      this.list.innerHTML = FILE_NONE_TYPE(type);
   };
   // change File object 
   changeFileObject() {
      const dataTransfer = new DataTransfer();

      dataTransfer.items.clear();

      this.state().forEach( file => {
         dataTransfer.items.add(file)
      });

      this.inputFile.files = dataTransfer.files;

      return Array.from(this.inputFile.files);
   };
   // 파일 확장자 메서드
   isFileType(type) {
      const setting = { 
         'image/jpeg': true,
         'image/png': true,
         'text/csv': true,
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true,
         'application/vnd.ms-excel': true
      };
   
       return setting[type] ? true : false;
   };
   isFileMaxSize(size) {
      const maxSizeMB = 1024; // 최대 파일 크기 (MB)
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      return size > maxSizeBytes ? true : false;
   };
   triggerChangeEvent(element) {
      const event = new Event('change', {
         bubbles: true
      });
      element.dispatchEvent(event);
  };

}