
function debruijnIncrement(db) {
  var out = {}
  var keys = Object.keys(db)
  for (var i = 0; i < keys.length; i++) {
    out[keys[i]] = db[keys[i]] + 1
  }
  return out
}

//Determine if any translator can evaluate the given label. If so,
//return the appropriate equivalent lambda term. Otherwise, return
//null.
function labelTranslate(label, translators){
  for(var t=0; t<translators.length; t++){
    var l = translators[t].constToLambda(label)
    if(l){
      return l
    }
  }
  return null
}

class NamedLambdaNode {
  constructor() {
    this.left = undefined
    this.right = undefined
    this.name = undefined
    this.type = undefined
    this.deb = {}
    this.debruijnCheck = false
  }

  /*
  Determines the debruijn index of all bound variables.
  Unbound variables will have an index of undefined.
  */
  debruijn() {
    if (this.type == 'abs') {
      this.deb[this.name] = 0
      this.right.deb = debruijnIncrement(this.deb)
      this.right.debruijn()
    } else if (this.type == 'app') {
      this.left.deb = Object.assign({}, this.deb)
      this.right.deb = Object.assign({}, this.deb)
      this.left.debruijn()
      this.right.debruijn()
    } else if (this.type == 'var') {
      this.index = this.deb[this.name]
    }
    this.debruijnCheck = true
  }

  /*
  Converts a named lambda tree into a lambda.js compatible tree.
   
  consts maps constant names to lambda trees.

  Call after running a debruijn index.
  */
  toLambda(translators) {
    if(!this.debruijnCheck){
      throw new Error("Cannot convert to lambda tree before running a debruijn index.")
    }
    if (this.type == 'var') {
      if (this.index != undefined) { //Bound variables take precedence over definitions.
        return new LambdaVar(this.index)
      } else { //Unbound variable. Check if it is a defined const.
        var translated = labelTranslate(this.name, translators)
      
        if (translated) {
          return translated.clone()
        } else {
          throw new Error("undefined unbound variable " + this.name)
        }
      }
    } else if (this.type == 'app') {
      return new LambdaApp(this.left.toLambda(translators), this.right.toLambda(translators))
    } else if (this.type == 'abs') {
      return new LambdaAbs(this.right.toLambda(translators))
    } else {
      throw new Error("invalid node type!")
    }
  }
}

class NamedLambdaVariable extends NamedLambdaNode {
  constructor(name) {
    super()
    this.name = name
    this.type = 'var'
  }
}

class NamedLambdaApp extends NamedLambdaNode {
  constructor(left, right) {
    super()
    this.left = left
    this.right = right
    this.type = 'app'
  }
}

class NamedLambdaAbs extends NamedLambdaNode {
  constructor(name, body) {
    super()
    this.right = body
    this.name = name
    this.type = 'abs'
  }
}

function bulkLambda(tok) {
  root = null
  if (!tok.hasNext()) {
    throw new Error("Incomplete lambda statement")
  }
  if (tok.currType() == 'label') {
    return new NamedLambdaAbs(tok.next(), bulkLambda(tok))
  } else if (tok.currType() == 'dot') {
    tok.next()
    return nullStandardParse(tok)
  } else {
    throw new Error("illegal token in lambda abstraction statement")
  }
}

function nextTerm(tok) {
  var out = null
  if (tok.currType() == 'label') {
    out = new NamedLambdaVariable(tok.current())
    tok.next()
  } else if (tok.currType() == 'lparen') {
    tok.next();
    out = nullStandardParse(tok)
  } else if (tok.currType() == 'rparen') {
    tok.next() //implicitly outputs null.
  } else if (tok.currType() == 'lambda') {
    tok.next();
    out = bulkLambda(tok)
  } else if (tok.currType() == 'dot') {
    throw new Error("illegal dot placement.")
  }
  return out
}

function nullStandardParse(tok) {
  var root = null
  var mode = "nstd"
  var run = true
  while (run && tok.hasNext()) {
    // console.log(tok, tok.currType(), mode, root)
    var next = nextTerm(tok)
    if(next == null){
      run = false
    }else{
      root = root ? new NamedLambdaApp(root, next) : next
    }
  }
  return root
}
