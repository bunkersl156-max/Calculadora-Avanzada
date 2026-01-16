import nerdamer from 'nerdamer';
import 'nerdamer/Algebra.js';
import 'nerdamer/Calculus.js';
import 'nerdamer/Solve.js';
import { detectIntegrationMethod, simplifyExpression } from './nerdamerHelpers';

export function solveIntegralWithNerdamer(func, type = 'indefinite', lower = null, upper = null) {
  try {
    const formattedFunc = func.replace(/\s+/g, ''); // Basic cleanup
    
    // 1. Solve the indefinite integral symbolically
    const integrated = nerdamer(`integrate(${formattedFunc}, x)`);
    const indefiniteResult = integrated.text();
    
    // 2. Detect Method (Heuristic)
    const method = detectIntegrationMethod(formattedFunc);

    // 3. Construct Steps (Simulated based on Nerdamer's lack of step-by-step API)
    // We can simulate steps by showing the setup and the final result.
    const steps = [
      {
        stepNumber: 1,
        description: `Identify the integral to solve`,
        formula: `∫ ${formattedFunc} dx`,
        result: 'Setup',
        reasoning: 'Standard integral notation setup.'
      },
      {
        stepNumber: 2,
        description: `Apply integration rules (${method})`,
        formula: `Integrate[${formattedFunc}]`,
        result: 'Processing...',
        reasoning: `Based on the function structure, ${method} is likely applied.`
      },
      {
        stepNumber: 3,
        description: 'Simplify the result',
        formula: indefiniteResult,
        result: simplifyExpression(indefiniteResult),
        reasoning: 'Algebraic simplification of the integrated expression.'
      }
    ];

    let finalResult = indefiniteResult;
    let numericalValue = null;

    // 4. Handle Definite Integral
    if (type === 'definite' && lower !== null && upper !== null) {
      try {
        const valUpper = integrated.evaluate({ x: upper });
        const valLower = integrated.evaluate({ x: lower });
        
        // Try to get numerical value
        const numUpper = parseFloat(valUpper.text());
        const numLower = parseFloat(valLower.text());
        
        if (!isNaN(numUpper) && !isNaN(numLower)) {
          numericalValue = numUpper - numLower;
          finalResult = numericalValue.toFixed(6); // Format to 6 decimal places
          
          steps.push({
            stepNumber: 4,
            description: 'Evaluate at limits (Fundamental Theorem of Calculus)',
            formula: `F(${upper}) - F(${lower})`,
            result: `${numUpper.toFixed(4)} - ${numLower.toFixed(4)}`,
            reasoning: 'Subtracting the antiderivative evaluated at the lower limit from the antiderivative evaluated at the upper limit.'
          });
          
          steps.push({
            stepNumber: 5,
            description: 'Final Calculation',
            formula: `${numUpper.toFixed(4)} - ${numLower.toFixed(4)} = ${finalResult}`,
            result: finalResult,
            reasoning: 'Final numerical result.'
          });
        } else {
           // Fallback if direct evaluation fails to produce simple numbers (e.g. symbolic constants)
           finalResult = `(${valUpper.text()}) - (${valLower.text()})`;
        }
      } catch (evalError) {
        console.warn("Evaluation error:", evalError);
        finalResult = "Error evaluating limits";
      }
    } else {
      finalResult = `${indefiniteResult} + C`;
    }

    return {
      method,
      steps,
      finalResult,
      rawIndefinite: indefiniteResult,
      isDefinite: type === 'definite',
      numericalValue
    };

  } catch (error) {
    console.error("Nerdamer Solver Error:", error);
    throw new Error("Could not solve integral. Please check syntax.");
  }
}