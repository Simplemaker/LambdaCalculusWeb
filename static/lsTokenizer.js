/* 
Tokenizer for Lambda Online
Thomas Williams 2021

Reserved characters: L () . =
Update 1.3 reserves : for delayed assignment.

*/

function charType(c) {
  if ('  \n\r'.indexOf(c) != -1) {
    return 'whitespace'
  } else if ('L().=:'.indexOf(c) != -1) {
    return 'ctrl'
  } else {
    return 'label'
  }
}

function parseTokens(string) {
  var state = 'whitespace'
  var data = ''
  var tokens = []
  var i = 0;
  while (i < string.length) {
    var c = string[i]
    if (charType(c) == 'whitespace') {
      if (state == 'whitespace') {
        i++
      } else if (state == 'label') {
        i++
        state = 'whitespace'
        tokens.push(data)
        data = ''
      }
    } else if (charType(c) == 'ctrl') {
      if (state == 'label') {
        state = 'whitespace'
        tokens.push(data)
        data = ''
      }
      tokens.push(c)
      i++
    } else if (charType(c) == 'label') {
      if (state == 'label') {
        data = data + c
      } else {
        state = 'label'
        data = c
      }
      i++
    }
  }
  //out of tokens. Add label if necessary.
  if(state == 'label'){
    tokens.push(data)
  }
  return tokens
}

class TokenStream {
  constructor(string) {
    this.tokens = parseTokens(string)
    this.index = 0
  }

  hasNext(){
    return this.index < this.tokens.length
  }

  next(){
    return this.tokens[this.index++]
  }

  current(){
    return this.tokens[this.index]
  }

  currType(){
    var c = this.tokens[this.index]
    if("L.()=".indexOf(c) == -1){
      return 'label'
    }else if(c == 'L'){
      return 'lambda'
    }else if(c == '='){
      return 'equals'
    }else if(c == '('){
      return 'lparen'
    }else if(c == ')'){
      return 'rparen'
    }else if(c == '.'){
      return 'dot'
    }else if(c == ':'){
      return 'colon'
    }
  }
}
