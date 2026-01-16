import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, List, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { solveIntegralWithNerdamer } from '@/utils/nerdamerIntegralSolver';
import { validateFunction } from '@/utils/calculator';
import StepByStepNerdamerSolver from '@/components/StepByStepNerdamerSolver';
import IntegralResultDisplay from '@/components/IntegralResultDisplay';
import PracticeExamplesNerdamer from '@/components/PracticeExamplesNerdamer';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

function NerdamerIntegralCalculator({ addToHistory }) {
  const [functionInput, setFunctionInput] = useState('');
  const [lowerLimit, setLowerLimit] = useState('');
  const [upperLimit, setUpperLimit] = useState('');
  const [integralType, setIntegralType] = useState('indefinite');
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async () => {
    setLoading(true);
    setSolution(null);
    try {
      // 1. Validate Input
      const validation = validateFunction(functionInput);
      if (!validation.valid) throw new Error(validation.error);

      // 2. Solve using Nerdamer
      // Use setTimeout to allow UI to show loading state for heavy computations
      await new Promise(resolve => setTimeout(resolve, 100));

      const result = solveIntegralWithNerdamer(
        functionInput,
        integralType,
        integralType === 'definite' ? parseFloat(lowerLimit) : null,
        integralType === 'definite' ? parseFloat(upperLimit) : null
      );

      setSolution(result);
      addToHistory({
        type: 'integral',
        function: functionInput,
        integralType,
        lowerLimit: integralType === 'definite' ? lowerLimit : null,
        upperLimit: integralType === 'definite' ? upperLimit : null,
        result: result.finalResult,
        method: result.method
      });

      toast({
        title: '✓ Cálculo completado',
        description: `Resuelto usando ${result.method}`
      });
    } catch (error) {
      toast({
        title: 'Error de cálculo',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
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
                Calculadora Nerdamer
              </h2>
              <Dialog open={showExamples} onOpenChange={setShowExamples}>
                <DialogTrigger asChild>
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Ejemplos">
                    <List className="w-5 h-5 text-pink-300" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white p-0 overflow-hidden rounded-2xl">
                  <PracticeExamplesNerdamer onLoadExample={loadExample} />
                </DialogContent>
              </Dialog>
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
                  onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">dx</div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculando...
                </>
              ) : (
                'Resolver'
              )}
            </motion.button>
          </motion.div>

          {solution && (
            <>
              <IntegralResultDisplay result={solution} integralType={integralType} />
              <StepByStepNerdamerSolver solution={solution} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NerdamerIntegralCalculator;