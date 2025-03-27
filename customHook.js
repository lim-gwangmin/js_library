// useState custom hook
export const useState = initialValue => {
   let state = initialValue; 

   const getState = () => state; 
 
   const setState = (newValue) => {
     state = newValue;
   };
 
   return [getState, setState];
 };
 
