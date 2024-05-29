//Translation library for lambda terms.
//Translators function in two directions. From constant/string notation
//to lambda terms, and from lambda terms to strings.
//if a translation fails, return null.


class Translator {
  constructor(ltc, ctl) {
    this.constToLambda = ctl
    this.lambdaToConst = ltc
  }
}

decimalTranslator = new Translator((l) => {
  //first check for two lambdas
  if (l.type != 'lambda' || l.right.type != 'lambda') {
    return null;
  }
  var runner = l.right.right
  var count = 0
  while (true) {
    if (runner.type == 'application' && runner.left.type == 'variable' && runner.left.val == 2) {
      //valid count sequence.
      count++
      runner = runner.right
    } else if (runner.type == 'variable' && runner.val == 1) {
      return "" + count;
    } else {
      return null;
    }
  }
}, (s) => {
  var i = parseInt(s)
  if (isNaN(i) || i < 0) {
    return null
  }
  //i is a non-negative integer.
  var out = new LambdaVar(1)
  //Wrap i times
  for(var i2=0; i2<i; i2++){
    out = new LambdaApp(new LambdaVar(2), out);
  }
  //wrap in abstractions.
  return new LambdaAbs(new LambdaAbs(out));
}
)

constTranslator = new Translator((l)=>{
  var keys = Object.keys(r.consts)
  for(var k=0; k<keys.length; k++){
    var key = keys[k]
    if(l.equals(r.consts[key])){
      return key
    }
  }
  return null
}, (s)=>{
  var search = r.consts[s]
  if(search){
    return search
  }else{
    return null
  }
})


/*
Given a lambda term, determines if the term can be directly converted into a constant value.
*/
function lambdaTranslate(lambda, translators){
  for(var t=0; t<translators.length; t++){
    var translation = translators[t].lambdaToConst(lambda)
    if(translation){
      return translation
    }
  }
  return null
}

/*
Superior toString function for lambda terms.
Produces the most simplified constant notation of a given lambda term.
*/
function superToString(lambda, translators, depth){
  depth = depth ?? 1 
  //check if is a const
  var t1 = lambdaTranslate(lambda, translators)
  if(t1){
    return t1
  }
  //Not directly a constant. Manage based on subterms.
  if(lambda.type == "lambda"){
    return "(L"+numToString(depth)+ "."+superToString(lambda.right, translators, depth + 1) + ")"
  }else if(lambda.type == "application"){
    return "(" +superToString(lambda.left, translators, depth)+ " " +superToString(lambda.right, translators, depth)+ ")"
  }else{
    return numToString(depth - lambda.val)
  }
}
