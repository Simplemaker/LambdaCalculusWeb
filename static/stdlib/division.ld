//requires comparison
delta = Ld t t2.t2 (GTE (t true) d (0) (S(t true))) ((GTE (t true) d) (S(t false)) (t false))

Delta = Ln d.n (delta (P d)) NullCouple

Div = Ln d.Delta n d false
Mod = Ln d.Delta n d true

