import { create, all } from 'mathjs';

const math = create(all);

export function evaluateExpression(expression) {
  try {
    // Replace √ with sqrt
    let processedExpr = expression.replace(/√\(([^)]+)\)/g, 'sqrt($1)');
    processedExpr = processedExpr.replace(/√(\d+)/g, 'sqrt($1)');
    
    // Replace ^ with pow for better parsing
    processedExpr = processedExpr.replace(/\^/g, '^');
    
    const result = math.evaluate(processedExpr);
    
    if (!isFinite(result)) {
      throw new Error('Resultado inválido (división por cero o infinito)');
    }
    
    return result;
  } catch (error) {
    throw new Error('Expresión matemática inválida');
  }
}

export function formatNumber(num) {
  if (typeof num !== 'number') return String(num);
  
  // Round to avoid floating point errors
  const rounded = Math.round(num * 1e10) / 1e10;
  
  // Format with appropriate precision
  if (Math.abs(rounded) < 0.0001 && rounded !== 0) {
    return rounded.toExponential(4);
  }
  
  return String(rounded);
}

export function validateFunction(func) {
  if (!func || func.trim() === '') {
    return { valid: false, error: 'Por favor ingresa una función' };
  }
  
  // Check for valid characters
  const validPattern = /^[x0-9+\-*/^().sincogtanexplnlog\s]+$/i;
  if (!validPattern.test(func)) {
    return { valid: false, error: 'Función contiene caracteres inválidos' };
  }
  
  // Check for balanced parentheses
  let openCount = 0;
  for (let char of func) {
    if (char === '(') openCount++;
    if (char === ')') openCount--;
    if (openCount < 0) {
      return { valid: false, error: 'Paréntesis no balanceados' };
    }
  }
  
  if (openCount !== 0) {
    return { valid: false, error: 'Paréntesis no balanceados' };
  }
  
  return { valid: true };
}

export function calculateIntegral(func, type, lowerLimit = null, upperLimit = null) {
  // This is a simplified integral calculator
  // For production, you'd want to use a symbolic math library
  
  const integralRules = {
    // Power rule: x^n -> x^(n+1)/(n+1)
    power: (n) => {
      if (n === -1) return 'ln|x|';
      return `x^${n + 1}/${n + 1}`;
    },
    
    // Trigonometric
    'sin(x)': '-cos(x)',
    'cos(x)': 'sin(x)',
    'tan(x)': '-ln|cos(x)|',
    
    // Exponential
    'e^x': 'e^x',
    'exp(x)': 'exp(x)',
    
    // Logarithmic
    'ln(x)': 'x*ln(x) - x',
    '1/x': 'ln|x|'
  };
  
  let result = '';
  let numericalValue = null;
  
  // Detect function type and apply appropriate rule
  if (func === 'sin(x)') {
    result = integralRules['sin(x)'];
    if (type === 'definite') {
      numericalValue = -Math.cos(upperLimit) - (-Math.cos(lowerLimit));
    }
  } else if (func === 'cos(x)') {
    result = integralRules['cos(x)'];
    if (type === 'definite') {
      numericalValue = Math.sin(upperLimit) - Math.sin(lowerLimit);
    }
  } else if (func === 'tan(x)') {
    result = integralRules['tan(x)'];
  } else if (func === 'e^x' || func === 'exp(x)') {
    result = integralRules['e^x'];
    if (type === 'definite') {
      numericalValue = Math.exp(upperLimit) - Math.exp(lowerLimit);
    }
  } else if (func === 'ln(x)') {
    result = integralRules['ln(x)'];
    if (type === 'definite') {
      numericalValue = (upperLimit * Math.log(upperLimit) - upperLimit) - 
                       (lowerLimit * Math.log(lowerLimit) - lowerLimit);
    }
  } else if (func === '1/x') {
    result = integralRules['1/x'];
    if (type === 'definite') {
      numericalValue = Math.log(upperLimit) - Math.log(lowerLimit);
    }
  } else if (func.match(/^x\^(\d+)$/)) {
    // Power function
    const n = parseInt(func.match(/^x\^(\d+)$/)[1]);
    result = integralRules.power(n);
    if (type === 'definite') {
      numericalValue = (Math.pow(upperLimit, n + 1) / (n + 1)) - 
                       (Math.pow(lowerLimit, n + 1) / (n + 1));
    }
  } else if (func === 'x') {
    result = 'x^2/2';
    if (type === 'definite') {
      numericalValue = (Math.pow(upperLimit, 2) / 2) - (Math.pow(lowerLimit, 2) / 2);
    }
  } else if (!isNaN(func)) {
    // Constant
    const c = parseFloat(func);
    result = `${c}*x`;
    if (type === 'definite') {
      numericalValue = c * upperLimit - c * lowerLimit;
    }
  } else {
    // Complex function - use numerical approximation
    result = `∫(${func})dx`;
    if (type === 'definite') {
      numericalValue = numericalIntegration(func, lowerLimit, upperLimit);
    }
  }
  
  return {
    result: type === 'definite' 
      ? (numericalValue !== null ? formatNumber(numericalValue) : result)
      : `${result} + C`,
    constant: type === 'indefinite',
    numericalValue: numericalValue
  };
}

function numericalIntegration(func, a, b, n = 1000) {
  // Simpson's rule for numerical integration
  const h = (b - a) / n;
  let sum = 0;
  
  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    let y;
    
    try {
      // Evaluate function at x
      y = evaluateFunctionAtX(func, x);
    } catch {
      y = 0;
    }
    
    if (i === 0 || i === n) {
      sum += y;
    } else if (i % 2 === 0) {
      sum += 2 * y;
    } else {
      sum += 4 * y;
    }
  }
  
  return (h / 3) * sum;
}

function evaluateFunctionAtX(func, x) {
  // Replace x with the actual value
  let expression = func.replace(/x/g, `(${x})`);
  
  // Replace common functions
  expression = expression.replace(/sin/g, 'Math.sin');
  expression = expression.replace(/cos/g, 'Math.cos');
  expression = expression.replace(/tan/g, 'Math.tan');
  expression = expression.replace(/ln/g, 'Math.log');
  expression = expression.replace(/log/g, 'Math.log10');
  expression = expression.replace(/exp/g, 'Math.exp');
  expression = expression.replace(/e\^/g, 'Math.exp');
  expression = expression.replace(/\^/g, '**');
  
  try {
    return eval(expression);
  } catch {
    return 0;
  }
}