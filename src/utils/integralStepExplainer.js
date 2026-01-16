import { format } from 'mathjs';

export function generateDetailedSteps(func, method, stepsData) {
  // This helper augments the raw solver steps with human-readable explanations
  return stepsData.map((step, index) => ({
    stepNumber: index + 1,
    ...step,
    reasoning: getReasoningForStep(step.type, method)
  }));
}

function getReasoningForStep(stepType, method) {
  const reasoningDB = {
    'setup': 'Initial problem setup is crucial to identify the correct integration strategy.',
    'substitution_choice': 'Choosing the right u-substitution simplifies the integrand into a standard form.',
    'parts_selection': 'Selection of u and dv follows the ILATE rule (Inverse, Log, Algebra, Trig, Exp).',
    'derivative_calculation': 'Finding the derivative is necessary to change the differential term (dx to du).',
    'substitution_apply': 'Replacing variables transforms the integral into a simpler domain.',
    'integration': 'Applying standard integration rules to the simplified function.',
    'back_substitution': 'Converting the result back to the original variable x is the final step.'
  };

  return reasoningDB[stepType] || 'Logical mathematical transformation based on algebraic rules.';
}

export function formatMathematicalNotation(expression) {
  // Simple LaTeX-like formatting for display
  if (!expression) return '';
  
  let formatted = expression
    .replace(/\*/g, ' · ')
    .replace(/sqrt\(([^)]+)\)/g, '√($1)')
    .replace(/\^(\d+)/g, '^{$1}')
    .replace(/pi/g, 'π')
    .replace(/infinity/g, '∞');
    
  return formatted;
}

export function suggestNextMethod(currentMethod) {
  const suggestions = {
    'substitution': ['Integration by Parts', 'Trigonometric Substitution'],
    'parts': ['Substitution', 'Tabular Method'],
    'partial_fractions': ['Completing the Square', 'Substitution'],
    'trigonometric': ['Weierstrass Substitution', 'Power Reduction Formulas']
  };
  
  return suggestions[currentMethod] || ['Numerical Integration', 'Series Expansion'];
}

export function validateIntegralInput(input) {
  if (!input) return { isValid: false, message: "Please enter a function." };
  
  const balancedParens = (input.match(/\(/g) || []).length === (input.match(/\)/g) || []).length;
  if (!balancedParens) return { isValid: false, message: "Parentheses are not balanced." };
  
  // Basic check for unsupported characters
  if (/[^x0-9+\-*/^().a-z\s]/i.test(input)) {
    return { isValid: false, message: "Input contains invalid characters." };
  }
  
  return { isValid: true, message: "" };
}

export function generatePracticeExamples() {
  return [
    { integral: 'x * sin(x)', difficulty: 'Medium', method: 'Integration by Parts' },
    { integral: '2x / (x^2 + 1)', difficulty: 'Easy', method: 'Substitution' },
    { integral: '1 / (x^2 - 4)', difficulty: 'Medium', method: 'Partial Fractions' },
    { integral: 'x^2 * e^x', difficulty: 'Hard', method: 'Integration by Parts (Repeated)' },
    { integral: 'cos(x)^3', difficulty: 'Medium', method: 'Trigonometric Powers' }
  ];
}