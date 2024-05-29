
EXEC_LIMIT = 100000

class LambdaTerm {

  constructor(cObj) {
    this.become(cObj)
  }

  toString(){
    if(this.type == "variable"){
      return this.val + ""
    }else if(this.type == "application"){
      return "(" + this.left.toString() + " " + this.right.toString() + ")"
    }else if(this.type == "lambda"){
      return "L." + this.right.toString() +"]"
    }
  }

  become(cObj) { //Shallow copies qualities of cObj to this.
    this.left = cObj.left   //left used only for applications
    this.right = cObj.right
    this.type = cObj.type
    this.val = cObj.val
  }

  clone() { //Deep copies this term.
    var out = new LambdaTerm(this)
    if (this.type == "application") {
      out.left = this.left.clone()
      out.right = this.right.clone()
    }
    else if (this.type == "lambda") { //abstraction handling
      out.right = this.right.clone()
    }
    //else is variable. no references used.
    return out
  }

  reduce() {
    if (this.type == "application") {
      if (this.left.type == "lambda") {
        //found a case of application!
        var branch = this.right
        this.left.right.replace(1, branch)
        this.become(this.left.right.altClone(1,-1))
        return true;
      } else {
        //Irreducible application
        return this.left.reduce() || this.right.reduce();
      }
    }else if(this.type == "lambda"){
      return this.right.reduce()
    }
    return false;
  }
  
  fullReduce(){
    var t = 0
    while(t < EXEC_LIMIT && this.reduce()){
      // console.log(this.toString())
      ++t;
    }
    return true;
  }

  reportUnbound(limit){
    limit = limit || 1
    //report all variables that are greater or equal to limit
    // console.log("Finding values >= "+limit+" in "+this.toString())
    if(this.type == 'variable'){
      if(this.val >= limit){
        console.log("Found unbound var of val "+this.val)
      }
    }else if(this.type == 'application'){
      this.left.reportUnbound(limit)
      this.right.reportUnbound(limit)
    }else if(this.type == 'lambda'){
      //Limit is now 1 larger
      this.right.reportUnbound(limit + 1)
    }
  }

  /*
  Clone this lambda statement, but all unbound variables are incremented (positively or negatively) by the given increment.

  Call with d value of 1.
  */
  altClone(d, increment){
    var out = new LambdaTerm(this)
    if (this.type == "application") {
      out.left = this.left.altClone(d,increment)
      out.right = this.right.altClone(d,increment)
    }
    else if (this.type == "lambda") { //abstraction handling
      out.right = this.right.altClone(d+1, increment)
    }
    //else is variable. no references used.
    if(out.val >= d){
      out.val += increment
    }
    return out
  }

  /*
  Call this on an application node with a left abstraction.
  
  Depth starts as 1.
  */
  replace(depth, branch) {
    if (this.type == "variable" && this.val == depth) {
      this.become(branch.altClone(1, depth))
      return;
    }
    else if (this.type == "application") {
      this.left.replace(depth, branch)
      this.right.replace(depth, branch)
    } else if (this.type == "lambda") {
      this.right.replace(depth + 1, branch)
    }
  }

  apply(l2){
    return new LambdaTerm({"type":"application", "left":this.clone(), "right":l2.clone()})
  }

  equals(l2){
    if(l2.type != this.type){
      return false
    }
    if(this.type == "variable"){
      return this.val == l2.val
    }else if(this.type == "lambda"){
      return this.right.equals(l2.right)
    }else if(this.type == "application"){
      return this.right.equals(l2.right) && this.left.equals(l2.left)
    }
  }
}

class LambdaApp extends LambdaTerm{
  constructor(left, right){
    super({"type":"application", "left":left, "right":right})
  }
}

class LambdaAbs extends LambdaTerm{
  constructor(body){
    super({"type":"lambda", "right":body})
  }
}

class LambdaVar extends LambdaTerm{
  constructor(value){
    super({"type":"variable", "val":value})
  }
}
