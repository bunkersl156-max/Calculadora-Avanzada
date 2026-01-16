export const integralTestCases = [
  {
    id: 1,
    integral: "x * e^x",
    method: "Integration by Parts",
    difficulty: "Medium",
    hint: "Choose u = x and dv = e^x dx",
    expectedResult: "x * e^x - e^x + C"
  },
  {
    id: 2,
    integral: "1/(x^2 + 1)",
    method: "Trigonometric Substitution",
    difficulty: "Medium",
    hint: "This is a standard integral form resulting in arctan(x)",
    expectedResult: "arctan(x) + C"
  },
  {
    id: 3,
    integral: "(x + 1)/(x^2 + 2*x + 5)",
    method: "Substitution",
    difficulty: "Hard",
    hint: "Let u = x^2 + 2x + 5, then du = (2x + 2)dx",
    expectedResult: "0.5 * ln|x^2 + 2x + 5| + C"
  },
  {
    id: 4,
    integral: "sin(x) * cos(x)",
    method: "Substitution",
    difficulty: "Easy",
    hint: "Let u = sin(x), then du = cos(x)dx",
    expectedResult: "0.5 * sin(x)^2 + C"
  },
  {
    id: 5,
    integral: "sqrt(1 - x^2)",
    method: "Trigonometric Substitution",
    difficulty: "Hard",
    hint: "Let x = sin(theta)",
    expectedResult: "0.5 * arcsin(x) + 0.5 * x * sqrt(1 - x^2) + C"
  },
  {
    id: 6,
    integral: "x/(x^2 + 1)",
    method: "Substitution",
    difficulty: "Easy",
    hint: "Let u = x^2 + 1, then du = 2x dx",
    expectedResult: "0.5 * ln|x^2 + 1| + C"
  },
  {
    id: 7,
    integral: "e^x * sin(x)",
    method: "Integration by Parts (Repeated)",
    difficulty: "Hard",
    hint: "Apply integration by parts twice to solve for the original integral",
    expectedResult: "0.5 * e^x * (sin(x) - cos(x)) + C"
  },
  {
    id: 8,
    integral: "1/(x^2 - 1)",
    method: "Partial Fractions",
    difficulty: "Medium",
    hint: "Factor the denominator as (x-1)(x+1) and split",
    expectedResult: "0.5 * ln|x - 1| - 0.5 * ln|x + 1| + C"
  },
  {
    id: 9,
    integral: "x^2 * sin(x)",
    method: "Integration by Parts (Repeated)",
    difficulty: "Hard",
    hint: "Apply parts twice to reduce x^2 to a constant",
    expectedResult: "-x^2 * cos(x) + 2x * sin(x) + 2cos(x) + C"
  },
  {
    id: 10,
    integral: "ln(x)",
    method: "Integration by Parts",
    difficulty: "Easy",
    hint: "Let u = ln(x) and dv = 1 dx",
    expectedResult: "x * ln(x) - x + C"
  }
];