//LambdaOnline Runtime

LOG_TREES = false


/*
Assignment detection. Returns 
0 - no assignment
1 - Assign and evaluate
2 - assign with lazy evaluation. 
*/
function isAssignment(tok) {
  var i = tok.tokens.indexOf("=")
  if (i != -1) {
    //An equal sign is in this token stream.
    //Is this a normal assignment?
    if (i == 1) {
      return 1
    } else if (i == 2 && tok.tokens[1] == ':') {
      return 2
    } else {
      throw new Error("illegal assignment operator")
    }
    return 0;
  }
}

class Runtime {
  constructor() {
    this.translators = [constTranslator, decimalTranslator]
    this.consts = {}
  }

  run(str) {
    var tok = new TokenStream(str)
    var assign = isAssignment(tok)
    var aName;
    if (assign > 0) {
      aName = tok.tokens[0]
      tok.index = ((assign == 1) ? 2 : 3)
    }
    var named_tree = parenthesisParse(tok)
    named_tree.debruijn()
    var l_tree = named_tree.toLambda(this.translators)
    //Always simplify. Later add operators to disable this func.
    if (LOG_TREES) { console.log(l_tree.toString()); }
    if (assign != 2) {
      l_tree.fullReduce()
    }
    if (assign) {
      this.consts[aName] = l_tree
    }
    return superToString(l_tree, this.translators)
  }
}
