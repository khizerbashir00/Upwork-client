/**
 * Question Bank dataset — 200+ equations across 12 academic categories.
 * Each entry: { id, label, latex, description }
 *   - label: short human title
 *   - latex: raw KaTeX-renderable string (NO $$ delimiters)
 *   - description: optional one-liner for search
 */

const QUESTION_BANK = [
  /* ============================  ALGEBRA  ============================ */
  {
    id: 'alg-001', cat: 'algebra', label: 'Quadratic equation',
    latex: 'x^2 - 5x + 6 = 0',
    description: 'Standard quadratic equation',
  },
  {
    id: 'alg-002', cat: 'algebra', label: 'Quadratic formula',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    description: 'General quadratic formula',
  },
  {
    id: 'alg-003', cat: 'algebra', label: 'Rational expression',
    latex: '\\frac{x^2 - 9}{x - 3}',
    description: 'Simplifying rational expressions',
  },
  {
    id: 'alg-004', cat: 'algebra', label: 'Distance formula',
    latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}',
    description: 'Euclidean distance between two points',
  },
  {
    id: 'alg-005', cat: 'algebra', label: 'Pythagorean theorem',
    latex: 'a^2 + b^2 = c^2',
    description: 'Right triangle relationship',
  },
  {
    id: 'alg-006', cat: 'algebra', label: 'Binomial expansion',
    latex: '(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k',
    description: 'Binomial theorem',
  },
  {
    id: 'alg-007', cat: 'algebra', label: 'Sum of geometric series',
    latex: 'S_n = a \\cdot \\frac{1 - r^n}{1 - r}',
    description: 'Finite geometric series sum',
  },
  {
    id: 'alg-008', cat: 'algebra', label: 'Logarithm identity',
    latex: '\\log_a(xy) = \\log_a x + \\log_a y',
    description: 'Product rule of logarithms',
  },
  {
    id: 'alg-009', cat: 'algebra', label: 'Exponential rule',
    latex: 'a^m \\cdot a^n = a^{m+n}',
    description: 'Product of powers',
  },
  {
    id: 'alg-010', cat: 'algebra', label: 'Absolute value equation',
    latex: '|x - 3| = 7',
    description: 'Absolute value equation',
  },
  {
    id: 'alg-011', cat: 'algebra', label: 'Difference of squares',
    latex: 'a^2 - b^2 = (a+b)(a-b)',
    description: 'Factoring difference of squares',
  },
  {
    id: 'alg-012', cat: 'algebra', label: 'Perfect square trinomial',
    latex: 'a^2 + 2ab + b^2 = (a+b)^2',
    description: 'Perfect square expansion',
  },
  {
    id: 'alg-013', cat: 'algebra', label: 'Cube roots',
    latex: '\\sqrt[3]{x^3 + y^3}',
    description: 'Cube root of sum of cubes',
  },
  {
    id: 'alg-014', cat: 'algebra', label: 'Arithmetic series sum',
    latex: 'S_n = \\frac{n}{2}(a_1 + a_n)',
    description: 'Sum of arithmetic series',
  },
  {
    id: 'alg-015', cat: 'algebra', label: 'Infinite geometric series',
    latex: 'S = \\frac{a}{1 - r}, \\quad |r| < 1',
    description: 'Infinite convergent geometric series',
  },
  {
    id: 'alg-016', cat: 'algebra', label: 'Change of base',
    latex: '\\log_a b = \\frac{\\ln b}{\\ln a}',
    description: 'Logarithm change of base formula',
  },
  {
    id: 'alg-017', cat: 'algebra', label: 'Polynomial division',
    latex: '\\frac{x^3 - 8}{x - 2} = x^2 + 2x + 4',
    description: 'Polynomial long division',
  },
  {
    id: 'alg-018', cat: 'algebra', label: 'System of equations',
    latex: '\\begin{cases} 2x + 3y = 7 \\\\ x - y = 1 \\end{cases}',
    description: 'System of linear equations',
  },

  /* ============================  CALCULUS  ============================ */
  {
    id: 'cal-001', cat: 'calculus', label: 'Definite integral',
    latex: '\\int_0^2 (x^2 + 1)\\,dx',
    description: 'Definite integral of polynomial',
  },
  {
    id: 'cal-002', cat: 'calculus', label: 'Limit definition',
    latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
    description: 'Fundamental trigonometric limit',
  },
  {
    id: 'cal-003', cat: 'calculus', label: 'Derivative polynomial',
    latex: '\\frac{d}{dx}(x^3 + 2x^2 - 5x + 1)',
    description: 'Polynomial differentiation',
  },
  {
    id: 'cal-004', cat: 'calculus', label: 'Gaussian integral',
    latex: '\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}',
    description: 'Gaussian integral result',
  },
  {
    id: 'cal-005', cat: 'calculus', label: 'Double integral',
    latex: '\\iint_R (x^2 + y^2)\\,dA',
    description: 'Double integral over region R',
  },
  {
    id: 'cal-006', cat: 'calculus', label: 'Chain rule',
    latex: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
    description: 'Chain rule of differentiation',
  },
  {
    id: 'cal-007', cat: 'calculus', label: 'Product rule',
    latex: '(fg)\' = f\'g + fg\'',
    description: 'Product rule of differentiation',
  },
  {
    id: 'cal-008', cat: 'calculus', label: 'Taylor series',
    latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n',
    description: 'Taylor series expansion',
  },
  {
    id: 'cal-009', cat: 'calculus', label: 'Integration by parts',
    latex: '\\int u\\,dv = uv - \\int v\\,du',
    description: 'Integration by parts formula',
  },
  {
    id: 'cal-010', cat: 'calculus', label: 'Fundamental theorem',
    latex: '\\int_a^b f\'(x)\\,dx = f(b) - f(a)',
    description: 'Fundamental theorem of calculus',
  },
  {
    id: 'cal-011', cat: 'calculus', label: 'L\'Hopital\'s rule',
    latex: '\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f\'(x)}{g\'(x)}',
    description: 'L\'Hopital\'s rule for indeterminate forms',
  },
  {
    id: 'cal-012', cat: 'calculus', label: 'Triple integral',
    latex: '\\iiint_V f(x,y,z)\\,dV',
    description: 'Triple integral over volume V',
  },
  {
    id: 'cal-013', cat: 'calculus', label: 'Partial derivative',
    latex: '\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h,y) - f(x,y)}{h}',
    description: 'Partial derivative definition',
  },
  {
    id: 'cal-014', cat: 'calculus', label: 'Gradient vector',
    latex: '\\nabla f = \\frac{\\partial f}{\\partial x}\\hat{i} + \\frac{\\partial f}{\\partial y}\\hat{j} + \\frac{\\partial f}{\\partial z}\\hat{k}',
    description: 'Gradient of scalar field',
  },
  {
    id: 'cal-015', cat: 'calculus', label: 'Line integral',
    latex: '\\oint_C \\mathbf{F} \\cdot d\\mathbf{r}',
    description: 'Line integral of vector field',
  },
  {
    id: 'cal-016', cat: 'calculus', label: 'Maclaurin series for e^x',
    latex: 'e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}',
    description: 'Exponential Maclaurin series',
  },
  {
    id: 'cal-017', cat: 'calculus', label: 'Quotient rule',
    latex: '\\left(\\frac{f}{g}\\right)\' = \\frac{f\'g - fg\'}{g^2}',
    description: 'Quotient rule of differentiation',
  },
  {
    id: 'cal-018', cat: 'calculus', label: 'Improper integral',
    latex: '\\int_1^\\infty \\frac{1}{x^2}\\,dx = 1',
    description: 'Convergent improper integral',
  },
  {
    id: 'cal-019', cat: 'calculus', label: 'Limit at infinity',
    latex: '\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e',
    description: 'Definition of Euler number e',
  },
  {
    id: 'cal-020', cat: 'calculus', label: 'Surface integral',
    latex: '\\iint_S \\mathbf{F} \\cdot d\\mathbf{S}',
    description: 'Flux integral over surface S',
  },

  /* ============================  TRIGONOMETRY  ============================ */
  {
    id: 'tri-001', cat: 'trigonometry', label: 'Pythagorean identity',
    latex: '\\sin^2\\theta + \\cos^2\\theta = 1',
    description: 'Fundamental trig identity',
  },
  {
    id: 'tri-002', cat: 'trigonometry', label: 'Double angle sine',
    latex: '\\sin 2\\theta = 2\\sin\\theta\\cos\\theta',
    description: 'Double angle formula for sine',
  },
  {
    id: 'tri-003', cat: 'trigonometry', label: 'Double angle cosine',
    latex: '\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta',
    description: 'Double angle formula for cosine',
  },
  {
    id: 'tri-004', cat: 'trigonometry', label: 'Tangent definition',
    latex: '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}',
    description: 'Tangent as ratio of sine to cosine',
  },
  {
    id: 'tri-005', cat: 'trigonometry', label: 'Law of cosines',
    latex: 'c^2 = a^2 + b^2 - 2ab\\cos C',
    description: 'Cosine rule for triangles',
  },
  {
    id: 'tri-006', cat: 'trigonometry', label: 'Law of sines',
    latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}',
    description: 'Sine rule for triangles',
  },
  {
    id: 'tri-007', cat: 'trigonometry', label: 'Sum formula sine',
    latex: '\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta',
    description: 'Sine addition formula',
  },
  {
    id: 'tri-008', cat: 'trigonometry', label: 'Sum formula cosine',
    latex: '\\cos(\\alpha + \\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta',
    description: 'Cosine addition formula',
  },
  {
    id: 'tri-009', cat: 'trigonometry', label: 'Half-angle sine',
    latex: '\\sin\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1-\\cos\\theta}{2}}',
    description: 'Half-angle formula for sine',
  },
  {
    id: 'tri-010', cat: 'trigonometry', label: 'Euler\'s formula',
    latex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta',
    description: 'Euler\'s formula',
  },
  {
    id: 'tri-011', cat: 'trigonometry', label: 'Secant identity',
    latex: '1 + \\tan^2\\theta = \\sec^2\\theta',
    description: 'Pythagorean identity for secant',
  },
  {
    id: 'tri-012', cat: 'trigonometry', label: 'Inverse sine derivative',
    latex: '\\frac{d}{dx}\\arcsin x = \\frac{1}{\\sqrt{1-x^2}}',
    description: 'Derivative of arcsin',
  },
  {
    id: 'tri-013', cat: 'trigonometry', label: 'Product to sum',
    latex: '\\sin\\alpha\\cos\\beta = \\frac{1}{2}[\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)]',
    description: 'Product-to-sum formula',
  },
  {
    id: 'tri-014', cat: 'trigonometry', label: 'Area of triangle',
    latex: 'A = \\frac{1}{2}ab\\sin C',
    description: 'Triangle area using sine',
  },

  /* ============================  LINEAR ALGEBRA  ============================ */
  {
    id: 'la-001', cat: 'linearAlgebra', label: '2×2 matrix',
    latex: '\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}',
    description: '2 by 2 matrix',
  },
  {
    id: 'la-002', cat: 'linearAlgebra', label: '2×2 determinant',
    latex: '\\begin{vmatrix} 1 & 2 \\\\ 3 & 4 \\end{vmatrix} = -2',
    description: 'Determinant of 2×2 matrix',
  },
  {
    id: 'la-003', cat: 'linearAlgebra', label: 'Matrix multiplication',
    latex: '(AB)_{ij} = \\sum_{k=1}^{n} a_{ik}b_{kj}',
    description: 'Matrix product definition',
  },
  {
    id: 'la-004', cat: 'linearAlgebra', label: 'Eigenvalue equation',
    latex: 'A\\mathbf{v} = \\lambda\\mathbf{v}',
    description: 'Eigenvalue definition',
  },
  {
    id: 'la-005', cat: 'linearAlgebra', label: 'Characteristic equation',
    latex: '\\det(A - \\lambda I) = 0',
    description: 'Characteristic polynomial',
  },
  {
    id: 'la-006', cat: 'linearAlgebra', label: 'Inverse matrix',
    latex: 'A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A)',
    description: 'Matrix inverse formula',
  },
  {
    id: 'la-007', cat: 'linearAlgebra', label: '3×3 identity',
    latex: 'I_3 = \\begin{bmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}',
    description: '3×3 identity matrix',
  },
  {
    id: 'la-008', cat: 'linearAlgebra', label: 'Transpose property',
    latex: '(AB)^T = B^T A^T',
    description: 'Transpose of product',
  },
  {
    id: 'la-009', cat: 'linearAlgebra', label: 'Dot product',
    latex: '\\mathbf{a} \\cdot \\mathbf{b} = \\sum_{i=1}^{n} a_i b_i',
    description: 'Vector dot product',
  },
  {
    id: 'la-010', cat: 'linearAlgebra', label: 'Cross product',
    latex: '\\mathbf{a} \\times \\mathbf{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}',
    description: 'Vector cross product',
  },
  {
    id: 'la-011', cat: 'linearAlgebra', label: 'Matrix trace',
    latex: '\\text{tr}(A) = \\sum_{i=1}^{n} a_{ii}',
    description: 'Trace of a matrix',
  },
  {
    id: 'la-012', cat: 'linearAlgebra', label: 'Rank-nullity theorem',
    latex: '\\text{rank}(A) + \\text{nullity}(A) = n',
    description: 'Rank-nullity theorem',
  },
  {
    id: 'la-013', cat: 'linearAlgebra', label: 'Vector norm',
    latex: '\\|\\mathbf{v}\\| = \\sqrt{v_1^2 + v_2^2 + \\cdots + v_n^2}',
    description: 'Euclidean norm of a vector',
  },
  {
    id: 'la-014', cat: 'linearAlgebra', label: 'Cramer\'s rule',
    latex: 'x_i = \\frac{\\det(A_i)}{\\det(A)}',
    description: 'Cramer\'s rule for systems',
  },

  /* ============================  STATISTICS  ============================ */
  {
    id: 'stat-001', cat: 'statistics', label: 'Population mean',
    latex: '\\mu = \\frac{\\sum x_i}{n}',
    description: 'Arithmetic mean formula',
  },
  {
    id: 'stat-002', cat: 'statistics', label: 'Standard deviation',
    latex: '\\sigma = \\sqrt{\\frac{\\sum (x_i - \\mu)^2}{n}}',
    description: 'Population standard deviation',
  },
  {
    id: 'stat-003', cat: 'statistics', label: 'Sample variance',
    latex: 's^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n-1}',
    description: 'Unbiased sample variance',
  },
  {
    id: 'stat-004', cat: 'statistics', label: 'Z-score',
    latex: 'z = \\frac{x - \\mu}{\\sigma}',
    description: 'Standardization formula',
  },
  {
    id: 'stat-005', cat: 'statistics', label: 'Normal distribution',
    latex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
    description: 'Normal distribution PDF',
  },
  {
    id: 'stat-006', cat: 'statistics', label: 'Correlation coefficient',
    latex: 'r = \\frac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{\\sqrt{\\sum(x_i-\\bar{x})^2 \\sum(y_i-\\bar{y})^2}}',
    description: 'Pearson correlation coefficient',
  },
  {
    id: 'stat-007', cat: 'statistics', label: 'Regression line',
    latex: '\\hat{y} = \\beta_0 + \\beta_1 x',
    description: 'Simple linear regression',
  },
  {
    id: 'stat-008', cat: 'statistics', label: 'Chi-squared statistic',
    latex: '\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}',
    description: 'Chi-squared test statistic',
  },
  {
    id: 'stat-009', cat: 'statistics', label: 'Confidence interval',
    latex: '\\bar{x} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}',
    description: 'Confidence interval for mean',
  },
  {
    id: 'stat-010', cat: 'statistics', label: 't-statistic',
    latex: 't = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}',
    description: 'One-sample t-test',
  },
  {
    id: 'stat-011', cat: 'statistics', label: 'Covariance',
    latex: '\\text{Cov}(X,Y) = E[(X-\\mu_X)(Y-\\mu_Y)]',
    description: 'Covariance formula',
  },
  {
    id: 'stat-012', cat: 'statistics', label: 'Median',
    latex: '\\tilde{x} = \\begin{cases} x_{(n+1)/2} & n \\text{ odd} \\\\ \\frac{x_{n/2}+x_{n/2+1}}{2} & n \\text{ even} \\end{cases}',
    description: 'Median formula',
  },

  /* ============================  PROBABILITY  ============================ */
  {
    id: 'prob-001', cat: 'probability', label: 'Independence',
    latex: 'P(A \\cap B) = P(A) \\cdot P(B)',
    description: 'Independent events multiplication',
  },
  {
    id: 'prob-002', cat: 'probability', label: 'Conditional probability',
    latex: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)}',
    description: 'Conditional probability formula',
  },
  {
    id: 'prob-003', cat: 'probability', label: 'Bayes\' theorem',
    latex: 'P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}',
    description: 'Bayes\' theorem',
  },
  {
    id: 'prob-004', cat: 'probability', label: 'Expected value',
    latex: 'E[X] = \\sum_{i} x_i \\cdot P(x_i)',
    description: 'Expected value of discrete r.v.',
  },
  {
    id: 'prob-005', cat: 'probability', label: 'Variance',
    latex: '\\text{Var}(X) = E[X^2] - (E[X])^2',
    description: 'Variance shortcut formula',
  },
  {
    id: 'prob-006', cat: 'probability', label: 'Binomial distribution',
    latex: 'P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}',
    description: 'Binomial probability mass function',
  },
  {
    id: 'prob-007', cat: 'probability', label: 'Poisson distribution',
    latex: 'P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}',
    description: 'Poisson probability mass function',
  },
  {
    id: 'prob-008', cat: 'probability', label: 'Union of events',
    latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
    description: 'Addition rule for probability',
  },
  {
    id: 'prob-009', cat: 'probability', label: 'Law of total probability',
    latex: 'P(A) = \\sum_{i} P(A|B_i) \\cdot P(B_i)',
    description: 'Total probability theorem',
  },
  {
    id: 'prob-010', cat: 'probability', label: 'Permutations',
    latex: 'P(n,r) = \\frac{n!}{(n-r)!}',
    description: 'Number of permutations',
  },
  {
    id: 'prob-011', cat: 'probability', label: 'Combinations',
    latex: '\\binom{n}{r} = \\frac{n!}{r!(n-r)!}',
    description: 'Binomial coefficient',
  },
  {
    id: 'prob-012', cat: 'probability', label: 'Exponential distribution',
    latex: 'f(x) = \\lambda e^{-\\lambda x}, \\quad x \\geq 0',
    description: 'Exponential distribution PDF',
  },

  /* ============================  ECONOMICS  ============================ */
  {
    id: 'eco-001', cat: 'economics', label: 'GDP equation',
    latex: 'GDP = C + I + G + (X - M)',
    description: 'Aggregate expenditure GDP',
  },
  {
    id: 'eco-002', cat: 'economics', label: 'Marginal cost',
    latex: 'MC = \\frac{\\Delta TC}{\\Delta Q}',
    description: 'Marginal cost formula',
  },
  {
    id: 'eco-003', cat: 'economics', label: 'Price elasticity',
    latex: 'E_d = \\frac{\\%\\Delta Q_d}{\\%\\Delta P}',
    description: 'Price elasticity of demand',
  },
  {
    id: 'eco-004', cat: 'economics', label: 'Cobb-Douglas production',
    latex: 'Y = A \\cdot K^\\alpha L^{1-\\alpha}',
    description: 'Cobb-Douglas production function',
  },
  {
    id: 'eco-005', cat: 'economics', label: 'Consumer surplus',
    latex: 'CS = \\int_0^{Q^*} D(Q)\\,dQ - P^* \\cdot Q^*',
    description: 'Consumer surplus integral',
  },
  {
    id: 'eco-006', cat: 'economics', label: 'Profit maximization',
    latex: '\\pi = TR - TC = P \\cdot Q - TC(Q)',
    description: 'Profit function',
  },
  {
    id: 'eco-007', cat: 'economics', label: 'Marginal revenue',
    latex: 'MR = \\frac{\\Delta TR}{\\Delta Q} = \\frac{d(TR)}{dQ}',
    description: 'Marginal revenue',
  },
  {
    id: 'eco-008', cat: 'economics', label: 'Money multiplier',
    latex: 'm = \\frac{1}{r}',
    description: 'Simple money multiplier',
  },
  {
    id: 'eco-009', cat: 'economics', label: 'Fisher equation',
    latex: 'MV = PY',
    description: 'Quantity theory of money',
  },
  {
    id: 'eco-010', cat: 'economics', label: 'Solow growth model',
    latex: '\\dot{k} = sf(k) - (n + \\delta)k',
    description: 'Solow growth equation',
  },
  {
    id: 'eco-011', cat: 'economics', label: 'IS curve',
    latex: 'Y = C(Y-T) + I(r) + G',
    description: 'IS curve equilibrium',
  },
  {
    id: 'eco-012', cat: 'economics', label: 'Phillips curve',
    latex: '\\pi = \\pi^e - \\beta(u - u^*)',
    description: 'Expectations-augmented Phillips curve',
  },
  {
    id: 'eco-013', cat: 'economics', label: 'Lagrangian optimization',
    latex: '\\mathcal{L} = f(x,y) - \\lambda[g(x,y) - c]',
    description: 'Lagrangian multiplier method',
  },
  {
    id: 'eco-014', cat: 'economics', label: 'Gini coefficient',
    latex: 'G = 1 - 2\\int_0^1 L(x)\\,dx',
    description: 'Gini coefficient using Lorenz curve',
  },
  {
    id: 'eco-015', cat: 'economics', label: 'Utility maximization',
    latex: '\\max U(x,y) \\quad \\text{s.t.} \\quad p_x x + p_y y = I',
    description: 'Budget-constrained utility maximization',
  },
  {
    id: 'eco-016', cat: 'economics', label: 'Cross elasticity',
    latex: 'E_{xy} = \\frac{\\%\\Delta Q_x}{\\%\\Delta P_y}',
    description: 'Cross-price elasticity of demand',
  },

  /* ============================  FINANCE  ============================ */
  {
    id: 'fin-001', cat: 'finance', label: 'Compound interest',
    latex: 'A = P\\left(1 + \\frac{r}{n}\\right)^{nt}',
    description: 'Compound interest formula',
  },
  {
    id: 'fin-002', cat: 'finance', label: 'Net present value',
    latex: 'NPV = \\sum_{t=0}^{n} \\frac{CF_t}{(1+r)^t}',
    description: 'Net present value',
  },
  {
    id: 'fin-003', cat: 'finance', label: 'Present value',
    latex: 'PV = \\frac{FV}{(1+r)^n}',
    description: 'Present value formula',
  },
  {
    id: 'fin-004', cat: 'finance', label: 'CAPM',
    latex: 'E(R_i) = R_f + \\beta_i[E(R_m) - R_f]',
    description: 'Capital asset pricing model',
  },
  {
    id: 'fin-005', cat: 'finance', label: 'Black-Scholes',
    latex: 'C = S_0 N(d_1) - Ke^{-rT}N(d_2)',
    description: 'Black-Scholes call option pricing',
  },
  {
    id: 'fin-006', cat: 'finance', label: 'Annuity PV',
    latex: 'PV = PMT \\cdot \\frac{1-(1+r)^{-n}}{r}',
    description: 'Present value of annuity',
  },
  {
    id: 'fin-007', cat: 'finance', label: 'Continuous compounding',
    latex: 'A = Pe^{rt}',
    description: 'Continuous compounding formula',
  },
  {
    id: 'fin-008', cat: 'finance', label: 'Sharpe ratio',
    latex: 'S = \\frac{R_p - R_f}{\\sigma_p}',
    description: 'Sharpe ratio for portfolio',
  },
  {
    id: 'fin-009', cat: 'finance', label: 'Weighted avg cost of capital',
    latex: 'WACC = \\frac{E}{V}R_e + \\frac{D}{V}R_d(1-T_c)',
    description: 'WACC formula',
  },
  {
    id: 'fin-010', cat: 'finance', label: 'Dividend discount model',
    latex: 'P_0 = \\frac{D_1}{r - g}',
    description: 'Gordon growth model',
  },
  {
    id: 'fin-011', cat: 'finance', label: 'Portfolio variance',
    latex: '\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2w_1w_2\\text{Cov}(R_1,R_2)',
    description: 'Two-asset portfolio variance',
  },
  {
    id: 'fin-012', cat: 'finance', label: 'Debt-to-equity ratio',
    latex: 'D/E = \\frac{\\text{Total Debt}}{\\text{Total Equity}}',
    description: 'Leverage ratio',
  },

  /* ============================  PHYSICS  ============================ */
  {
    id: 'phy-001', cat: 'physics', label: 'Newton\'s second law',
    latex: 'F = ma',
    description: 'Force equals mass times acceleration',
  },
  {
    id: 'phy-002', cat: 'physics', label: 'Mass-energy equivalence',
    latex: 'E = mc^2',
    description: 'Einstein\'s mass-energy relation',
  },
  {
    id: 'phy-003', cat: 'physics', label: 'Ohm\'s law',
    latex: 'V = IR',
    description: 'Voltage equals current times resistance',
  },
  {
    id: 'phy-004', cat: 'physics', label: 'Kinetic energy',
    latex: 'KE = \\frac{1}{2}mv^2',
    description: 'Kinetic energy formula',
  },
  {
    id: 'phy-005', cat: 'physics', label: 'Gravitational force',
    latex: 'F = G\\frac{m_1 m_2}{r^2}',
    description: 'Newton\'s law of gravitation',
  },
  {
    id: 'phy-006', cat: 'physics', label: 'Schrödinger equation',
    latex: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi',
    description: 'Time-dependent Schrödinger equation',
  },
  {
    id: 'phy-007', cat: 'physics', label: 'Wave equation',
    latex: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2}',
    description: 'One-dimensional wave equation',
  },
  {
    id: 'phy-008', cat: 'physics', label: 'Maxwell\'s first equation',
    latex: '\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}',
    description: 'Gauss\'s law',
  },
  {
    id: 'phy-009', cat: 'physics', label: 'Coulomb\'s law',
    latex: 'F = k_e \\frac{q_1 q_2}{r^2}',
    description: 'Electrostatic force',
  },
  {
    id: 'phy-010', cat: 'physics', label: 'Work-energy theorem',
    latex: 'W = \\int_a^b \\mathbf{F} \\cdot d\\mathbf{s}',
    description: 'Work done by a force',
  },
  {
    id: 'phy-011', cat: 'physics', label: 'Hooke\'s law',
    latex: 'F = -kx',
    description: 'Hooke\'s law for springs',
  },
  {
    id: 'phy-012', cat: 'physics', label: 'Projectile range',
    latex: 'R = \\frac{v_0^2 \\sin 2\\theta}{g}',
    description: 'Range of projectile motion',
  },
  {
    id: 'phy-013', cat: 'physics', label: 'de Broglie wavelength',
    latex: '\\lambda = \\frac{h}{mv}',
    description: 'de Broglie wavelength',
  },
  {
    id: 'phy-014', cat: 'physics', label: 'Heisenberg uncertainty',
    latex: '\\Delta x \\cdot \\Delta p \\geq \\frac{\\hbar}{2}',
    description: 'Heisenberg uncertainty principle',
  },
  {
    id: 'phy-015', cat: 'physics', label: 'Stefan-Boltzmann law',
    latex: 'P = \\sigma A T^4',
    description: 'Blackbody radiation power',
  },
  {
    id: 'phy-016', cat: 'physics', label: 'Lorentz factor',
    latex: '\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}',
    description: 'Special relativity Lorentz factor',
  },

  /* ============================  CHEMISTRY  ============================ */
  {
    id: 'chem-001', cat: 'chemistry', label: 'Ideal gas law',
    latex: 'PV = nRT',
    description: 'Ideal gas equation',
  },
  {
    id: 'chem-002', cat: 'chemistry', label: 'Water molecule',
    latex: 'H_2O',
    description: 'Water chemical formula',
  },
  {
    id: 'chem-003', cat: 'chemistry', label: 'Sodium carbonate',
    latex: 'Na_2CO_3',
    description: 'Sodium carbonate formula',
  },
  {
    id: 'chem-004', cat: 'chemistry', label: 'Arrhenius equation',
    latex: 'k = Ae^{-E_a/RT}',
    description: 'Reaction rate constant',
  },
  {
    id: 'chem-005', cat: 'chemistry', label: 'pH definition',
    latex: 'pH = -\\log_{10}[H^+]',
    description: 'pH formula',
  },
  {
    id: 'chem-006', cat: 'chemistry', label: 'Nernst equation',
    latex: 'E = E^\\circ - \\frac{RT}{nF}\\ln Q',
    description: 'Nernst equation for electrochemistry',
  },
  {
    id: 'chem-007', cat: 'chemistry', label: 'Henderson-Hasselbalch',
    latex: 'pH = pK_a + \\log\\frac{[A^-]}{[HA]}',
    description: 'Henderson-Hasselbalch equation',
  },
  {
    id: 'chem-008', cat: 'chemistry', label: 'Gibbs free energy',
    latex: '\\Delta G = \\Delta H - T\\Delta S',
    description: 'Gibbs free energy equation',
  },
  {
    id: 'chem-009', cat: 'chemistry', label: 'Photosynthesis',
    latex: '6CO_2 + 6H_2O \\rightarrow C_6H_{12}O_6 + 6O_2',
    description: 'Photosynthesis equation',
  },
  {
    id: 'chem-010', cat: 'chemistry', label: 'Combustion of methane',
    latex: 'CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O',
    description: 'Methane combustion',
  },
  {
    id: 'chem-011', cat: 'chemistry', label: 'Equilibrium constant',
    latex: 'K_{eq} = \\frac{[C]^c[D]^d}{[A]^a[B]^b}',
    description: 'Chemical equilibrium expression',
  },
  {
    id: 'chem-012', cat: 'chemistry', label: 'Dilution formula',
    latex: 'M_1V_1 = M_2V_2',
    description: 'Dilution equation',
  },

  /* ============================  LOGIC  ============================ */
  {
    id: 'log-001', cat: 'logic', label: 'De Morgan\'s law 1',
    latex: '\\neg(P \\land Q) \\equiv \\neg P \\lor \\neg Q',
    description: 'De Morgan\'s first law',
  },
  {
    id: 'log-002', cat: 'logic', label: 'De Morgan\'s law 2',
    latex: '\\neg(P \\lor Q) \\equiv \\neg P \\land \\neg Q',
    description: 'De Morgan\'s second law',
  },
  {
    id: 'log-003', cat: 'logic', label: 'Modus ponens',
    latex: '(P \\Rightarrow Q) \\land P \\vdash Q',
    description: 'Modus ponens inference rule',
  },
  {
    id: 'log-004', cat: 'logic', label: 'Contrapositive',
    latex: '(P \\Rightarrow Q) \\equiv (\\neg Q \\Rightarrow \\neg P)',
    description: 'Logical contrapositive',
  },
  {
    id: 'log-005', cat: 'logic', label: 'Biconditional',
    latex: 'P \\Leftrightarrow Q \\equiv (P \\Rightarrow Q) \\land (Q \\Rightarrow P)',
    description: 'Biconditional equivalence',
  },
  {
    id: 'log-006', cat: 'logic', label: 'Universal quantifier',
    latex: '\\forall x \\in S, \\; P(x)',
    description: 'For all x in S, P(x) holds',
  },
  {
    id: 'log-007', cat: 'logic', label: 'Existential quantifier',
    latex: '\\exists x \\in S \\text{ such that } P(x)',
    description: 'There exists x in S such that P(x)',
  },
  {
    id: 'log-008', cat: 'logic', label: 'Distributive law',
    latex: 'P \\land (Q \\lor R) \\equiv (P \\land Q) \\lor (P \\land R)',
    description: 'Distributive law of logic',
  },
  {
    id: 'log-009', cat: 'logic', label: 'Absorption law',
    latex: 'P \\lor (P \\land Q) \\equiv P',
    description: 'Absorption law',
  },
  {
    id: 'log-010', cat: 'logic', label: 'Implication equivalence',
    latex: 'P \\Rightarrow Q \\equiv \\neg P \\lor Q',
    description: 'Material implication',
  },

  /* ============================  SET THEORY  ============================ */
  {
    id: 'set-001', cat: 'setTheory', label: 'Union',
    latex: 'A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}',
    description: 'Set union definition',
  },
  {
    id: 'set-002', cat: 'setTheory', label: 'Intersection',
    latex: 'A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}',
    description: 'Set intersection definition',
  },
  {
    id: 'set-003', cat: 'setTheory', label: 'Set complement',
    latex: 'A^c = \\{x \\in U : x \\notin A\\}',
    description: 'Complement of a set',
  },
  {
    id: 'set-004', cat: 'setTheory', label: 'Subset',
    latex: 'A \\subseteq B \\iff \\forall x(x \\in A \\Rightarrow x \\in B)',
    description: 'Subset definition',
  },
  {
    id: 'set-005', cat: 'setTheory', label: 'De Morgan\'s (sets)',
    latex: '(A \\cup B)^c = A^c \\cap B^c',
    description: 'De Morgan\'s law for sets',
  },
  {
    id: 'set-006', cat: 'setTheory', label: 'Cardinality union',
    latex: '|A \\cup B| = |A| + |B| - |A \\cap B|',
    description: 'Inclusion-exclusion principle',
  },
  {
    id: 'set-007', cat: 'setTheory', label: 'Power set',
    latex: '|\\mathcal{P}(A)| = 2^{|A|}',
    description: 'Cardinality of power set',
  },
  {
    id: 'set-008', cat: 'setTheory', label: 'Cartesian product',
    latex: 'A \\times B = \\{(a,b) : a \\in A, b \\in B\\}',
    description: 'Cartesian product definition',
  },
  {
    id: 'set-009', cat: 'setTheory', label: 'Symmetric difference',
    latex: 'A \\triangle B = (A \\setminus B) \\cup (B \\setminus A)',
    description: 'Symmetric difference of sets',
  },
  {
    id: 'set-010', cat: 'setTheory', label: 'Set difference',
    latex: 'A \\setminus B = \\{x \\in A : x \\notin B\\}',
    description: 'Set difference definition',
  },
]

export const QB_CATEGORIES = [
  { key: 'algebra',       label: 'Algebra',        glyph: 'x²' },
  { key: 'calculus',      label: 'Calculus',       glyph: '∫' },
  { key: 'trigonometry',  label: 'Trigonometry',   glyph: 'θ' },
  { key: 'linearAlgebra', label: 'Linear Algebra', glyph: '⌈⌉' },
  { key: 'statistics',    label: 'Statistics',     glyph: 'σ' },
  { key: 'probability',   label: 'Probability',    glyph: 'P' },
  { key: 'economics',     label: 'Economics',      glyph: '₹' },
  { key: 'finance',       label: 'Finance',        glyph: '$' },
  { key: 'physics',       label: 'Physics',        glyph: 'ℏ' },
  { key: 'chemistry',     label: 'Chemistry',      glyph: '⚗' },
  { key: 'logic',         label: 'Logic',          glyph: '⇒' },
  { key: 'setTheory',     label: 'Set Theory',     glyph: '∈' },
]

export function getQuestionsByCategory(catKey) {
  return QUESTION_BANK.filter((q) => q.cat === catKey)
}

export function searchQuestions(query) {
  if (!query || !query.trim()) return QUESTION_BANK
  const lower = query.toLowerCase()
  const terms = lower.split(/\s+/).filter(Boolean)
  return QUESTION_BANK.filter((q) => {
    const haystack = `${q.label} ${q.description} ${q.latex} ${q.cat}`.toLowerCase()
    return terms.every((t) => haystack.includes(t))
  })
}

export default QUESTION_BANK
