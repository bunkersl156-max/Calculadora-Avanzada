import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check, Lightbulb } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function StepByStepSolver({ solution }) {
  const { toast } = useToast();
  const [copiedStep, setCopiedStep] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);

  if (!solution || !solution.steps) return null;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(index);
    toast({ description: "Copiado al portapapeles" });
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const toggleStep = (index) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Pasos de Solución
        </h3>
        <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm border border-purple-500/30">
          Método: {solution.method}
        </span>
      </div>

      <div className="space-y-3">
        {solution.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleStep(index)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-mono text-sm border border-blue-500/30">
                  {index + 1}
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-200">{step.description}</p>
                </div>
              </div>
              {expandedStep === index ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedStep === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10 bg-black/20"
                >
                  <div className="p-4 space-y-3">
                    {step.formula && (
                      <div className="bg-slate-900/50 p-3 rounded-lg font-mono text-blue-200 text-sm overflow-x-auto flex justify-between items-center group">
                        <span>{step.formula}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(step.formula, index);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                        >
                          {copiedStep === index ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                      </div>
                    )}
                    
                    <div className="flex gap-2 text-sm text-gray-400 bg-yellow-500/5 p-2 rounded border border-yellow-500/10">
                       <span className="text-yellow-500/70">ℹ️</span>
                       <p>{step.reasoning || "Aplicación de reglas algebraicas estándar."}</p>
                    </div>

                    {step.result && step.result !== '...' && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Resultado intermedio: </span>
                        <span className="font-mono text-gray-300">{step.result}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: solution.steps.length * 0.1 + 0.2 }}
        className="mt-6 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 text-center"
      >
        <h4 className="text-green-300 text-sm uppercase tracking-wider font-semibold mb-2">Resultado Final</h4>
        <div className="text-2xl md:text-3xl font-mono text-white font-bold break-all">
          {solution.finalResult}
        </div>
      </motion.div>
    </div>
  );
}

export default StepByStepSolver;