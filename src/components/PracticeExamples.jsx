import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { integralTestCases } from '@/utils/integralTestCases';

function PracticeExamples({ onLoadExample, completedIds = [] }) {
  const [filter, setFilter] = useState('All');

  const filteredExamples = filter === 'All' 
    ? integralTestCases 
    : integralTestCases.filter(ex => ex.difficulty === filter);

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-full overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-pink-400" />
          Ejemplos de Práctica
        </h3>
        <div className="text-xs text-gray-400">
          {completedIds.length} / {integralTestCases.length} resueltos
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Easy', 'Medium', 'Hard'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === lvl 
                ? 'bg-pink-500 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {lvl === 'All' ? 'Todos' : lvl}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredExamples.map((example) => (
          <motion.div
            key={example.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl border transition-all cursor-pointer group ${
              completedIds.includes(example.id)
                ? 'bg-green-900/10 border-green-500/30'
                : 'bg-slate-800/50 border-slate-700 hover:border-pink-500/50'
            }`}
            onClick={() => onLoadExample(example.integral)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-lg font-semibold text-white bg-black/20 px-2 py-1 rounded">
                ∫ {example.integral} dx
              </span>
              {completedIds.includes(example.id) ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-600 group-hover:text-pink-400 transition-colors" />
              )}
            </div>
            
            <div className="flex justify-between items-end mt-2">
              <div>
                <div className="text-xs text-gray-400 mb-1">Método: {example.method}</div>
                <div className={`text-xs font-bold ${
                  example.difficulty === 'Easy' ? 'text-green-400' :
                  example.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {example.difficulty}
                </div>
              </div>
              <button className="text-xs flex items-center gap-1 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Resolver <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PracticeExamples;