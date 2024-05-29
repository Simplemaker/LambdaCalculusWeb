//Parser for binary lambda calculus.

class bitStream{
  constructor(string){
    this.data = []
    this.index = 0
    for(var i=0; i<string.length; i++){
      var c = string[i]
      if(c!="0" && c!="1"){
        throw "bad binary string"
      }else{
        this.data.push(c*1)
      }
    }
  }

  getToken(){
    if(this.index >= this.data.length){
      return {"type":"done"}
    }
    if(this.data[this.index] == 0){
      if(this.data[this.index+1] == 1){ //01 is application
        //application of 2 events.
        this.index += 2
        return {"type":"application"}
      }else{    //00 is lambda
        this.index += 2
        return {"type":"lambda"}
      }
    }else{
      var startindex = this.index
      while(this.data[this.index] == 1){
        this.index ++
      }
      this.index++ //finish out the token.
      return {"type":"variable", "val":this.index-startindex-1}
    }
  }
}

function blcParse(bits){
  var tok = bits.getToken()
  if(tok.type == "variable"){
    return new LambdaVar(tok.val)
  }else if(tok.type == "application"){
    return new LambdaApp(blcParse(bits), blcParse(bits))
  }else if(tok.type == "lambda"){
    return new LambdaAbs(blcParse(bits))
  }else{
    //die
    throw "bad bitstring"
  }
}

function numToVar(num){
  out = ""
  for(var i=0; i<num; i++){
    out+="1"
  }
  return out + "0"
}

function lambdaToBLC(lambda){
  if(lambda.type == "variable"){
    return numToVar(lambda.val)
  }else if(lambda.type=='lambda'){
    return "00" + lambdaToBLC(lambda.right)
  }else if(lambda.type=='application'){
    return "01" + lambdaToBLC(lambda.left) + lambdaToBLC(lambda.right)
  }
}

function bitStreamToHex(bs){
  var i = 0
  out = ""
  var chars = "0123456789abcdef"
  while(i < bs.length){
    //get 4 bits
    var s = 0
    for(d=0; d<4; d++){
      var bit = bs[i+d] ?? 0
      s+=2**(3-d) * bit
    }
    out += chars[s]
    i+=4
  }
  return out
}

function hexToBitStream(hex){
  hex = hex.toLowerCase()
  out = ""
  var chars = "0123456789abcdef"
  for(var i=0; i<hex.length; i++){
    var c = chars.indexOf(hex[i])
    out+=c.toString(2)
  }
  return out
}