import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

function ExplanationCard({ explanation, result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border-2 border-purple-500/30"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Solución Paso a Paso</h3>
          <p className="text-sm text-gray-300">Explicación detallada del cálculo</p>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
        <p className="text-sm text-gray-300 mb-2">Problema:</p>
        <div className="text-xl font-mono text-white">
          {explanation.problem}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold text-lg">Pasos de Resolución</h4>
        </div>
        
        {explanation.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-gray-200 mb-1">{step.description}</p>
              {step.formula && (
                <div className="p-3 bg-slate-800/70 rounded-lg border border-slate-600 font-mono text-sm text-blue-200">
                  {step.formula}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Final Result */}
      <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border-2 border-green-500/50">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h4 className="font-semibold text-lg">Resultado Final</h4>
        </div>
        <div className="text-2xl md:text-3xl font-mono text-white font-bold">
          {result.result}
        </div>
        {result.constant && (
          <p className="text-sm text-gray-300 mt-2">
            donde C es la constante de integración
          </p>
        )}
      </div>

      {/* Educational Notes */}
      {explanation.notes && explanation.notes.length > 0 && (
        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <h4 className="font-semibold mb-2 text-blue-200">📚 Notas Educativas</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {explanation.notes.map((note, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

export default ExplanationCard;