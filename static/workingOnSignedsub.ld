T = Lx y.x
F = Lx y.y
NOT = Lb.b F T
AND = Lx y.x y F
OR = Lx y.x T y
XOR = Lx y.x (NOT y) y
NXOR = Lx y.x y (NOT y)
//requires boolean.ld

0 = F
S = Lw f x.f(w f x)
1 = S 0
2 = S 1
3 = S 2

Tft = Lw.w F F
Phi = Lx.Ly.(y (S(x T)) (x T) )
P = Lx.x Phi Tft F

IFZ = Lx.x F NOT F
GTE = La b.IFZ(a P b)

pos = Lx t.t F x
neg = Lx t.t T x
sign = Ls.s T
val = Ls.s F

absdif = Ls1 s2. (val s1 P (val s2)) S (val s2 P (val s1))

addSameSign = Ls1 s2 s.s (sign s1) ((val s1) S (val s2))
addDiffSign = Ls1 s2 s.s (GTE (val s1) (val s2) (sign s1) (sign s2)) (absdif s1 s2)

adds = Ls1 s2.(NXOR (sign s1) (sign s2)) (addSameSign s1 s2) (addDiffSign s1 s2)

adds (pos 1) (neg 1)