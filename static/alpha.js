
/*
Simple translator for assigning variable names to numbers

*/


//Start num at 1. 
function numToString(num){
  //
  var offset = Math.floor((num-1) / 26)
  num -= 26*offset
  var suffix = offset == 0 ? "" : offset + ""
  return String.fromCharCode(0x60 + num) + suffix
}