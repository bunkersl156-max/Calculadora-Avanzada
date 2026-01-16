import nerdamer from 'nerdamer';
import 'nerdamer/Algebra.js';
import 'nerdamer/Calculus.js';
import 'nerdamer/Solve.js';

export function formatExpressionForNerdamer(expression) {
  if (!expression) return '';
  // Basic cleanup: remove extra spaces, handle potential weird characters
  // Nerdamer handles most standard input well, but consistent spacing helps
  return expression.trim();
}

export function detectIntegrationMethod(func) {
  // Nerdamer doesn't explicitly expose the method used in its basic `integrate` call.
  // We can infer heuristics based on the function structure, similar to before.
  const cleanFunc = func.replace(/\s+/g, '').toLowerCase();

  if (/^[+-]?(\d*\.?\d*)?x(\^\d+)?([+-](\d*\.?\d*)?x(\^\d+)?)*$/.test(cleanFunc)) {
    return 'Power Rule (Polynomial)';
  }
  if (/x\s*\*\s*(e\^|sin|cos|ln)/.test(cleanFunc) || /ln\(x\)/.test(cleanFunc)) {
    return 'Integration by Parts';
  }
  if (/\(.*x.*\)\s*\/\s*\(.*x.*\)/.test(cleanFunc) || /1\s*\/\s*\(x\^2/.test(cleanFunc)) {
    return 'Partial Fractions / Rational Function';
  }
  if (/sqrt\(\d*-\d*x\^2\)/.test(cleanFunc) || /sqrt\(\d*x\^2[+-]\d*\)/.test(cleanFunc)) {
    return 'Trigonometric Substitution';
  }
  if (cleanFunc.includes('sin') || cleanFunc.includes('cos') || cleanFunc.includes('tan')) {
    return 'Trigonometric Integration';
  }
  return 'Symbolic Integration';
}

export function formatResultToLaTeX(expression) {
  try {
    return nerdamer(expression).toTeX();
  } catch (e) {
    return expression;
  }
}

export function evaluateDefiniteIntegral(expression, lower, upper) {
  try {
    // F(b) - F(a)
    const integrated = nerdamer(`integrate(${expression}, x)`);
    const valUpper = integrated.evaluate({ x: upper });
    const valLower = integrated.evaluate({ x: lower });
    const result = Number(valUpper.text()) - Number(valLower.text());
    
    // Check if result is valid number
    if (isNaN(result) || !isFinite(result)) {
      throw new Error('Numerical evaluation failed');
    }
    
    return result;
  } catch (e) {
    console.error("Definite integral evaluation error:", e);
    return null;
  }
}

export function simplifyExpression(expression) {
  try {
    return nerdamer(expression).simplify().text();
  } catch (e) {
    return expression;
  }
}