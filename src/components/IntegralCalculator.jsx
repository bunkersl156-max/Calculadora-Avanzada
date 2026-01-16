import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, HelpCircle, Book, List } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { validateFunction } from '@/utils/calculator';
import { detectIntegrationMethod, solveAdvancedIntegral } from '@/utils/advancedIntegralSolver';
import { generateDetailedSteps } from '@/utils/integralStepExplainer';
import StepByStepSolver from '@/components/StepByStepSolver';
import MethodSuggestion from '@/components/MethodSuggestion';
import PracticeExamples from '@/components/PracticeExamples';
import IntegrationMethodGuide from '@/components/IntegrationMethodGuide';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

function IntegralCalculator({ addToHistory }) {
  const [functionInput, setFunctionInput] = useState('');
  const [lowerLimit, setLowerLimit] = useState('');
  const [upperLimit, setUpperLimit] = useState('');
  const [integralType, setIntegralType] = useState('indefinite');
  const [solution, setSolution] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (functionInput.length > 2) {
      const detected = detectIntegrationMethod(functionInput);
      setSuggestion(detected);
    } else {
      setSuggestion(null);
    }
  }, [functionInput]);

  const handleCalculate = () => {
    try {
      const validation = validateFunction(functionInput);
      if (!validation.valid) throw new Error(validation.error);

      // Advanced Solver
      const rawSolution = solveAdvancedIntegral(
        functionInput,
        integralType,
        integralType === 'definite' ? parseFloat(lowerLimit) : null,
        integralType === 'definite' ? parseFloat(upperLimit) : null
      );

      // Augment steps with explanations
      const detailedSteps = generateDetailedSteps(functionInput, rawSolution.method, rawSolution.steps);
      
      const fullSolution = {
        ...rawSolution,
        steps: detailedSteps
      };

      setSolution(fullSolution);

      addToHistory({
        type: 'integral',
        function: functionInput,
        integralType,
        lowerLimit: integralType === 'definite' ? lowerLimit : null,
        upperLimit: integralType === 'definite' ? upperLimit : null,
        result: fullSolution.finalResult
      });

      toast({
        title: '✓ Cálculo completado',
        description: `Resuelto usando ${fullSolution.method}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const loadExample = (expr) => {
    setFunctionInput(expr);
    setSolution(null);
    setShowExamples(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {/* Main Calculator Column */}
        <div className="flex-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                Calculadora de Integrales
              </h2>
              <div className="flex gap-2">
                 <Dialog open={showExamples} onOpenChange={setShowExamples}>
                  <DialogTrigger asChild>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Ejemplos">
                      <List className="w-5 h-5 text-pink-300" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white p-0 overflow-hidden rounded-2xl">
                    <PracticeExamples onLoadExample={loadExample} />
                  </DialogContent>
                </Dialog>

                <Dialog open={showGuide} onOpenChange={setShowGuide}>
                  <DialogTrigger asChild>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Guía">
                      <Book className="w-5 h-5 text-blue-300" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-slate-900 border-slate-700 text-white p-0 overflow-hidden rounded-2xl">
                    <IntegrationMethodGuide />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-slate-900/50 p-1 rounded-lg inline-flex mb-4">
                <button
                  onClick={() => setIntegralType('indefinite')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    integralType === 'indefinite' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Indefinida ∫
                </button>
                <button
                  onClick={() => setIntegralType('definite')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    integralType === 'definite' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Definida ∫ᵃᵇ
                </button>
              </div>

              {integralType === 'definite' && (
                <div className="flex gap-4 mb-4 items-end">
                   <div className="w-20">
                    <Label className="text-xs text-gray-400 mb-1 block">Inferior</Label>
                    <input 
                      type="number" 
                      value={lowerLimit}
                      onChange={(e) => setLowerLimit(e.target.value)}
                      className="w-full bg-slate-800 border-slate-600 rounded p-2 text-center text-white"
                    />
                   </div>
                   <div className="pb-3 text-gray-400">to</div>
                   <div className="w-20">
                    <Label className="text-xs text-gray-400 mb-1 block">Superior</Label>
                    <input 
                      type="number" 
                      value={upperLimit}
                      onChange={(e) => setUpperLimit(e.target.value)}
                      className="w-full bg-slate-800 border-slate-600 rounded p-2 text-center text-white"
                    />
                   </div>
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  value={functionInput}
                  onChange={(e) => setFunctionInput(e.target.value)}
                  placeholder="Ingresa función, ej: x*e^x"
                  className="w-full pl-4 pr-12 py-4 text-lg bg-slate-800 text-white rounded-xl border border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all font-mono"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">dx</div>
              </div>
            </div>

            {suggestion && <MethodSuggestion suggestion={suggestion} onSelect={() => setShowGuide(true)} />}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCalculate}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-lg shadow-lg transition-all"
            >
              Resolver Paso a Paso
            </motion.button>
          </motion.div>

          {solution && <StepByStepSolver solution={solution} />}
        </div>
      </div>
    </div>
  );
}

export default IntegralCalculator;