pos = Lx t.t false x
neg = Lx t.t true x
sign = Ls.s true
val = Ls.s false


addSameSign = Ls1 s2 s.s (sign s1) ((val s1) S (val s2))
addDiffSign = Ls1 s2 s.s (GTE (val s1) (val s2) (sign s1) (sign s2)) (AbsDif (val s1) (val s2))

adds = Ls1 s2.(xnor (sign s1) (sign s2)) (addSameSign s1 s2) (addDiffSign s1 s2)

flip = Lt1 t2.t2 (not (sign t1)) (val t1)
