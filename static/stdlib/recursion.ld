//Recursive functions make use of the Y combinator.
//Note that the Y combinator is infinitely reducible. To avoid
//Unnecessary loops, define recursive functions with a walrus
//assignment, :=

Y := (Lf.(Lx.f(x x))(Lx.f(x x)))

gauss = Lf x.IFZ x 0 (x S (f(P x)))
Gauss := Y gauss

fact = Lf x.IFZ x 1 (M x (f(P x)))
Fact := Y fact

rmod = Lf a b.GTE a b (f (b P a) b) a)
Mod := Y rmod