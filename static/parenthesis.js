/*
VLT2 uses parenthesis-first parsing.
1. Creates a tree of parenthesis statements.

2. Converts Lambda-dot notation into discrete postfix lambda notation
i.e. Lx y z. ==> x L y L z L  

2. Wraps lambda declarations into right-associative parenthesis.

3. NamedLambda conversion flattens parenthesis appropriately.

4. debruijn index of a NamedLambda tree and then final conversion yields a 
lambda object
*/

/*
Items contained in a parsed parenthesis block.
Items are of type:
paren - a parenthesis children
token - a token of either lambda, variable, or dot.

*/
class PItem{
  constructor(item, type){
    this.item = item
    this.type = type
  }

  toLambda(){
    if(this.type == 'token'){
      //After stage 3 processing, this should not be 'L' or '.'
      return new NamedLambdaVariable(this.item)
    }else if(this.type == 'paren'){
      //Is parenthesis.
      return this.item.toLambda()
    }else{
      console.log(this)
      throw new Error("Tried to convert ill formed PItem:")
    }
  }
}

class Parenthesis{
  constructor(lambdaVar){
    if(lambdaVar===undefined){
      this.isLambda = false
    }else{
      this.isLambda = true
      this.lambdaVar = lambdaVar
    }
    this.children = []
  }

  fill(tok){
    var t = ''
    while(tok.hasNext()){
      var t = tok.next();
      if(t == '('){
        var cParen = new Parenthesis()
        cParen.fill(tok)
        this.children.push(new PItem(cParen, 'paren'))
      }else if(t==')'){
        break;
      }else{
        this.children.push(new PItem(t, 'token'))
      }
    }
  }

  toString(){

    var out=this.isLambda? "[" + this.lambdaVar+ "](" : "("
    for(var i=0; i<this.children.length; i++){
      if(this.children[i].type == 'paren'){
        out+=this.children[i].item.toString()
      }else{
        out+=this.children[i].item
      }
    }
    return out + ")"
  }

  /*
  Convert lambda-dot notation to discrete postfix lambda notation.
  */
  stage2(){
    var children2 = []
    var inLambda = false;
    for(var i=0; i<this.children.length; i++){
      var c = this.children[i];
      if(c.type == 'paren'){
        c.item.stage2(); //recursively process stage 2.
        children2.push(c)
      }else if(c.type == 'token'){
        if(inLambda){
          if(c.item == '.'){
            inLambda = false;
          }else if(c.item == 'L'){
            throw new Error("Cannot have a L in lambda statement.")
          }else{
            children2.push(c)
            children2.push(new PItem('L', 'token'))
          }
        }else{ //NOT in lambda statement.
           if(c.item == '.'){
            throw new Error("Cannot have a . outside of lambda statement.")
          }else if(c.item == 'L'){
            inLambda = true
          }else{
            children2.push(c)
          }
        }
      }
    }
    this.children = children2; //replace children array.
  }

  stage3(){ //replace, from right to left, lambda statements with lambda-parenthesis.
    var children2 = []
    var i = this.children.length - 1
    while(i >= 0){
      var c= this.children[i]
      if(c.type == 'paren'){
        c.item.stage3(); //recursively manage subtrees
        children2.splice(0, 0, c) //insert child at beginning of chile array
      }else{
        if(c.item == 'L'){ //encountered a lambda marker!
          var lambdaVar = this.children[i - 1].item
          var lambdaParen = new Parenthesis(lambdaVar)
          lambdaParen.children = children2
          children2 = [new PItem(lambdaParen, 'paren')]
          i--; //Double decrement i.
        }else{
          children2.splice(0,0,c)
        }
      }
      i--;
    }
    this.children = children2
  }

  toLambda(){
    //Only wrap the inner lambda statement
    var lambda;
    if(this.children.length == 0){ //Empty case
      throw new Error("Attempted to lambda empty parenthesis.")
    }else if(this.children.length == 1){ //Single child case
      lambda = this.children[0].toLambda() 
    }else{
      var left = this.children[0].toLambda()
      var right = this.children[1].toLambda()
      lambda = new NamedLambdaApp(left, right)
      for(var i = 2; i<this.children.length; i++){
        right = this.children[i].toLambda()
        lambda = new NamedLambdaApp(lambda, right)
      }
    }
    if(this.isLambda){
      return new NamedLambdaAbs(this.lambdaVar, lambda)
    }else{
      return lambda
    }
  }
}

function parenthesisParse(tok){
  var p = new Parenthesis()
  p.fill(tok)
  p.stage2()
  p.stage3()
  return p.toLambda()
}

// tok = new TokenStream("La.(Lb.((a (Lc.(Ld.c))) b))")

// // tok = new TokenStream("(Ld.c)")
// p.fill(tok)
// p.stage2()
// console.log(p.toString())
// p.stage3()
// console.log(p.toString())
// l = p.toLambda()
// l.debruijn()
// lp = l.toLambda()