/*
Preprocessor removes slash asterisk comments, double slash comments, and blank lines.
*/

function removeSlashAsterisk(string){
  // get all comment start points
  var starts = string.split("/*")
  var out = starts[0]
  for(var i=1; i<starts.length; i++){
    var subStart = starts[i].indexOf("*/")
    if(subStart != -1){
      out += starts[i].slice(subStart+2)
    }
  }
  return out
}

function removeDoubleComment(string){
  var lines = string.split("\n")
  for(var i=0; i<lines.length; i++){
    var l = lines[i].indexOf("//")
    if(l != -1){
      console.log("removing double comment in line: "+lines[i])
      lines[i] = lines[i].slice(0, l)
      console.log("line is now: "+lines[i])
    }
  }
  return lines.join("\n")
}

function isWhitespace(line){
  var wschars = " \t\r\n"
  for(var c=0; c<line.length; c++){
    if(wschars.indexOf(line[c]) == -1){
      return false
    }
  }
  return true
}

function removeBlankLines(string){
  var lines = string.split("\n")
  var outLines = []
  for(var i=0; i<lines.length; i++){
    if(!isWhitespace(lines[i])){
      outLines.push(lines[i])
    }
  }
  return outLines.join("\n")
}

function preprocess(string){
  var t = removeSlashAsterisk(string)
  t = removeDoubleComment(string)
  t = removeBlankLines(t)
  return t
}