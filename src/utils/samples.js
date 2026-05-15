export const SAMPLES = {
  code: `if (a >= 10 && b != 5) {
   total = price * 5 / 2;
   discount = total - (total * 0.15);
}

while (i <= n && flag != 0) {
   result += array[i] * weights[i];
   i++;
}

return (x === y) ? true : false;`,

  math: `The Pythagorean theorem: a^2 + b^2 = c^2

Quadratic formula: x = (-b +- sqrt(b^2 - 4*a*c)) / (2*a)

Sum of first n integers: sum_(i=1)^n i = n*(n+1)/2

Euler's identity: e^(i*pi) + 1 = 0

Integral of e^(-x): int_0^infty e^(-x) dx = 1

For all x in R, x^2 >= 0`,

  physics: `Einstein's equation: E = m*c^2

Newton's second law: F = m*a

Kinetic energy: KE = (1/2) * m * v^2

Wave equation: lambda = v / f

Heisenberg uncertainty: delta_x * delta_p >= h / (4*pi)

Temperature: 100 deg C ~= 212 deg F
Greek constants: alpha, beta, gamma, theta, omega`,

  economics: `Q1 Revenue: USD 1500 + EUR 200 = total inflow
Q2 Forecast: GBP 3500, JPY 50000, INR 25000

Net profit margin: (revenue - cost) / revenue * 100 >= 15
ROI = (gain - investment) / investment

if (price <= target && demand >= supply) {
   action = "buy";
} else if (price >= ceiling || risk != low) {
   action = "hold";
}

Budget: USD 10000 -> EUR conversion approx 9200`,

  logic: `forall x in S, P(x) implies Q(x)

(p && q) || (!p && !q) iff (p <-> q)

A subset B && B subset C => A subset C

exists x in N such that x^2 = 4

if (alpha >= beta && gamma != 0) {
   theta = arctan(beta / alpha);
}`,

  chemistry: `Photosynthesis: 6*CO2 + 6*H2O -> C6H12O6 + 6*O2

Combustion: CH4 + 2*O2 -> CO2 + 2*H2O

Acid reaction: H2SO4 + 2*NaOH -> Na2SO4 + 2*H2O

Carbonic acid: CO2 + H2O <-> H2CO3

Ammonia synthesis: N2 + 3*H2 -> 2*NH3

Limestone: CaCO3 -> CaO + CO2 (at temp >= 800 deg C)`,
}

export const INITIAL_DEMO = `// === PROGRAMMING / OPERATORS ===
if (a >= 10 && b != 5) {
   total = price * 5 / 2;
   discount = total - (total * 0.15);
   tax = (subtotal >= 1000) ? subtotal * 0.18 : 0;
}

while (i <= n && flag != 0) {
   result += array[i] * weights[i];
   i++;
}

return (x === y) ? true : false;

// === MATHEMATICS ===
The Pythagorean theorem: a^2 + b^2 = c^2
Quadratic formula: x = (-b +- sqrt(b^2 - 4*a*c)) / (2*a)
Sum of first n integers: sum_(i=1)^n i = n*(n+1)/2
Euler's identity: e^(i*pi) + 1 = 0
Integral of e^(-x): int_0^infty e^(-x) dx = 1

// === PHYSICS / GREEK ===
Einstein's equation: E = m * c^2
Newton's second law: F = m * a
Kinetic energy: KE = (1/2) * m * v^2
Wave equation: lambda = v / f
Heisenberg uncertainty: delta_x * delta_p >= h / (4*pi)
Greek constants: alpha, beta, gamma, theta, omega, sigma, mu
Temperature: 100 deg C ~= 212 deg F

// === SET THEORY / LOGIC ===
forall x in S, P(x) implies Q(x)
(p && q) || (!p && !q) iff (p <-> q)
A subset B && B subset C => A subset C
exists x in N such that x^2 = 4

// === ECONOMICS / CURRENCY ===
Q1 Revenue: USD 1500 + EUR 200 = total inflow
Q2 Forecast: GBP 3500, JPY 50000, INR 25000
Budget conversion: USD 10000 -> EUR approx 9200
Net profit margin: (revenue - cost) / revenue * 100 >= 15

// === CHEMISTRY ===
Photosynthesis: 6*CO2 + 6*H2O -> C6H12O6 + 6*O2
Combustion: CH4 + 2*O2 -> CO2 + 2*H2O
Carbonic acid: CO2 + H2O <-> H2CO3
Ammonia synthesis: N2 + 3*H2 -> 2*NH3
Limestone decomposition: CaCO3 -> CaO + CO2

// ✨ Now scroll either box — both will sync ✨`
