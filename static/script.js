r = new Runtime()
var textarea = document.querySelector("textarea")
var outbox = document.getElementById("outbox")
var constTable = document.querySelector("table")
var importSelect = document.getElementById("imports")

function printConsts(consts){
  constTable.innerHTML = ""
  var keys = Object.keys(consts);
  for(var k=0; k<keys.length; k++){
    var key = keys[k];
    var keyData = document.createElement("td")
    keyData.innerHTML = key
    var resData = document.createElement("td")
    resData.innerHTML = superToString(consts[key], []) //Call consts without translators.
    var row = document.createElement("tr")
    row.appendChild(keyData)
    row.appendChild(resData)
    constTable.appendChild(row)
  }
}

document.getElementById("evalButton").onclick = function(e){
  outbox.innerHTML = ""
  var raw = textarea.value
  var inputs = preprocess(raw)
  if(inputs == ""){
    return;
  }
  var lines = inputs.split("\n")
  for(var i=0; i<lines.length; i++){
    outbox.innerHTML += ">"+lines[i] + "\n"
    outbox.innerHTML += r.run(lines[i]) + "\n"
  }
  printConsts(r.consts)
}

function loadSelects(){
  importSelect.innerHTML = ""
  var si = document.createElement("option")
  si.value = "none"
  si.innerHTML = ""
  importSelect.appendChild(si)
  $.ajax("stdlib/index.txt").done((e)=>{
    var lines = e.split("\n")
    for(var i=0; i<lines.length;i++){
      si = document.createElement("option")
      si.value = lines[i]
      si.innerHTML = lines[i]
      importSelect.appendChild(si)
    }
  })
}
loadSelects()

importSelect.onchange = function(e){
  var value = e.target.value
  if(value == "none"){
textarea.value = ""
return;
  }
  $.ajax("./stdlib/"+value).done((e)=>{
    textarea.value = e
  })
}