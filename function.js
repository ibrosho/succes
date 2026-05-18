
//input = array, what we are searching fpr
//loop through the array
//compare each itrm in the array with the search key
//if its the same terminate the search
// if not continue search
//at the end, if no result , report no result
/*function lsearch(arr, key){
  let found;
  myNum.forEach(function(value,index){
    if(key == value){
        found= `item found at index ${index}`;
        console.log(found);
        myNum.length = index;
    }
    console.log("searching....");
  });
  return found ? found : "item not found";
}
let myNum = [1,2,3,9,6,77,8,96,50];
let output = lsearch(myNum, 2);
console.log(output);*/

// write an algorithm to sort numbers 

// input array
// output => sorted array
// compare the 0th index with 1st
// loop thru the array and compare the first with
// if the second is lower, swap, else ignore
//once there is nothing to swap, we terminate
 function sSort(arr) {
    for (let i=0; i < arr.length; i++) {
      // first item
      for (let j=0; j < arr.length -1 -i; j++) {
        if (arr[j] > arr[j+1]) {
          // swap
          let temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;
        }
      }
    }
    return arr;
 }
let arr = [ 5,6, 23, 65,845,64,27,0,4];
let output = sSort(arr);
console.log(output);
// find tune the bubble sort and make it more efficient
function sSort2(arr) {
  let swapped;
  for (let i=0; i < arr.length; i++) {
    swapped = false;
    for (let j=0; j < arr.length -1 -i; j++) {
      if (arr[j] > arr[j+1]) {
          // swap
          let temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;
          swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}