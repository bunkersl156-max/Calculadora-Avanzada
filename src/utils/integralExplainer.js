export function generateExplanation(func, type, result, lowerLimit, upperLimit) {
  const explanation = {
    problem: '',
    steps: [],
    notes: []
  };
  
  // Generate problem statement
  if (type === 'indefinite') {
    explanation.problem = `∫ ${func} dx`;
  } else {
    explanation.problem = `∫[${lowerLimit} to ${upperLimit}] ${func} dx`;
  }
  
  // Identify function type and generate steps
  const functionType = identifyFunctionType(func);
  
  switch (functionType) {
    case 'power':
      generatePowerSteps(explanation, func);
      break;
    case 'trigonometric':
      generateTrigSteps(explanation, func);
      break;
    case 'exponential':
      generateExpSteps(explanation, func);
      break;
    case 'logarithmic':
      generateLogSteps(explanation, func);
      break;
    case 'constant':
      generateConstantSteps(explanation, func);
      break;
    default:
      generateGeneralSteps(explanation, func);
  }
  
  // Add evaluation step for definite integrals
  if (type === 'definite') {
    explanation.steps.push({
      description: 'Evaluar en los límites de integración',
      formula: `F(${upperLimit}) - F(${lowerLimit}) = ${result.result}`
    });
  }
  
  return explanation;
}

function identifyFunctionType(func) {
  if (func.match(/^x\^?\d*$/)) return 'power';
  if (func.match(/sin|cos|tan/)) return 'trigonometric';
  if (func.match(/e\^|exp/)) return 'exponential';
  if (func.match(/ln|log/)) return 'logarithmic';
  if (!isNaN(func)) return 'constant';
  return 'general';
}

function generatePowerSteps(explanation, func) {
  explanation.steps.push({
    description: 'Identificar que es una función potencia',
    formula: `f(x) = ${func}`
  });
  
  explanation.steps.push({
    description: 'Aplicar la regla de la potencia: ∫ x^n dx = x^(n+1)/(n+1) + C',
  });
  
  const match = func.match(/x\^?(\d+)?/);
  const n = match && match[1] ? parseInt(match[1]) : 1;
  
  explanation.steps.push({
    description: 'Incrementar el exponente en 1 y dividir por el nuevo exponente',
    formula: `∫ x^${n} dx = x^${n+1}/${n+1} + C`
  });
  
  explanation.notes.push(
    'La regla de la potencia es una de las reglas más fundamentales del cálculo integral'
  );
  explanation.notes.push(
    'No olvides agregar la constante de integración C para integrales indefinidas'
  );
}

function generateTrigSteps(explanation, func) {
  explanation.steps.push({
    description: 'Identificar que es una función trigonométrica',
    formula: `f(x) = ${func}`
  });
  
  if (func.includes('sin')) {
    explanation.steps.push({
      description: 'Aplicar la regla: ∫ sin(x) dx = -cos(x) + C',
      formula: '∫ sin(x) dx = -cos(x) + C'
    });
    explanation.notes.push(
      'La integral del seno es el negativo del coseno'
    );
  } else if (func.includes('cos')) {
    explanation.steps.push({
      description: 'Aplicar la regla: ∫ cos(x) dx = sin(x) + C',
      formula: '∫ cos(x) dx = sin(x) + C'
    });
    explanation.notes.push(
      'La integral del coseno es el seno'
    );
  } else if (func.includes('tan')) {
    explanation.steps.push({
      description: 'Aplicar la regla: ∫ tan(x) dx = -ln|cos(x)| + C',
      formula: '∫ tan(x) dx = -ln|cos(x)| + C'
    });
    explanation.notes.push(
      'La integral de la tangente involucra logaritmos naturales'
    );
  }
  
  explanation.notes.push(
    'Las funciones trigonométricas tienen patrones específicos de integración'
  );
}

function generateExpSteps(explanation, func) {
  explanation.steps.push({
    description: 'Identificar que es una función exponencial',
    formula: `f(x) = ${func}`
  });
  
  explanation.steps.push({
    description: 'Aplicar la regla: ∫ e^x dx = e^x + C',
    formula: '∫ e^x dx = e^x + C'
  });
  
  explanation.notes.push(
    'La función exponencial e^x es única: su derivada e integral son iguales a sí misma'
  );
  explanation.notes.push(
    'Esta propiedad hace a e^x especialmente importante en matemáticas'
  );
}

function generateLogSteps(explanation, func) {
  explanation.steps.push({
    description: 'Identificar que es una función logarítmica',
    formula: `f(x) = ${func}`
  });
  
  if (func.includes('ln')) {
    explanation.steps.push({
      description: 'Aplicar integración por partes',
      formula: '∫ ln(x) dx'
    });
    
    explanation.steps.push({
      description: 'Usar u = ln(x), dv = dx',
      formula: '= x·ln(x) - ∫ x·(1/x) dx'
    });
    
    explanation.steps.push({
      description: 'Simplificar y resolver',
      formula: '= x·ln(x) - x + C'
    });
    
    explanation.notes.push(
      'La integración por partes es necesaria para logaritmos'
    );
  } else if (func === '1/x') {
    explanation.steps.push({
      description: 'Aplicar la regla: ∫ 1/x dx = ln|x| + C',
      formula: '∫ 1/x dx = ln|x| + C'
    });
    
    explanation.notes.push(
      '1/x es un caso especial de la regla de la potencia (cuando n = -1)'
    );
  }
}

function generateConstantSteps(explanation, func) {
  explanation.steps.push({
    description: 'Identificar que es una constante',
    formula: `f(x) = ${func}`
  });
  
  explanation.steps.push({
    description: 'Aplicar la regla: ∫ k dx = k·x + C',
    formula: `∫ ${func} dx = ${func}·x + C`
  });
  
  explanation.notes.push(
    'La integral de una constante es la constante multiplicada por x'
  );
}

function generateGeneralSteps(explanation, func) {
  explanation.steps.push({
    description: 'Analizar la función',
    formula: `f(x) = ${func}`
  });
  
  explanation.steps.push({
    description: 'Aplicar métodos numéricos o simbólicos de integración'
  });
  
  explanation.steps.push({
    description: 'Calcular el resultado',
    formula: 'Usando aproximación numérica (Regla de Simpson)'
  });
  
  explanation.notes.push(
    'Algunas funciones complejas requieren métodos numéricos de integración'
  );
  explanation.notes.push(
    'El resultado es una aproximación precisa del valor real'
  );
}