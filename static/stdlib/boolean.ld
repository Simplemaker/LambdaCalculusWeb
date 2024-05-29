I = Lx.x
true = Lx y.x
false = Lx y.y
not = Lb.b false true
and = Lx y.x y false
or = Lx y.x true y
xor = Lx y.x (not y) y
xnor = Lx y.x y (not y)
