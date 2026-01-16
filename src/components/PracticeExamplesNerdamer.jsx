import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

const exampleIntegrals = [
  { id: 1, integral: 'x * e^x', difficulty: 'Medium', expected: 'x*e^x - e^x' },
  { id: 2, integral: 'sin(x) * cos(x)', difficulty: 'Easy', expected: '-cos(x)^2/2' },
  { id: 3, integral: '1/(x^2 + 1)', difficulty: 'Medium', expected: 'atan(x)' },
  { id: 4, integral: 'sqrt(1 - x^2)', difficulty: 'Hard', expected: 'asin(x)/2 + x*sqrt(1-x^2)/2' },
  { id: 5, integral: 'e^x * sin(x)', difficulty: 'Hard', expected: 'e^x*sin(x)/2 - e^x*cos(x)/2' },
  { id: 6, integral: '(x+1)/(x^2+2*x+5)', difficulty: 'Hard', expected: 'ln(x^2+2x+5)/2' },
  { id: 7, integral: 'x^2 * sin(x)', difficulty: 'Medium', expected: '-x^2*cos(x) + 2*x*sin(x) + 2*cos(x)' },
  { id: 8, integral: 'ln(x)', difficulty: 'Easy', expected: 'x*ln(x) - x' },
  { id: 9, integral: '1/(x^2-1)', difficulty: 'Medium', expected: 'ln(|x-1|)/2 - ln(|x+1|)/2' },
  { id: 10, integral: 'x/(sqrt(1+x^2))', difficulty: 'Medium', expected: 'sqrt(1+x^2)' }
];

function PracticeExamplesNerdamer({ onLoadExample }) {
  const [filter, setFilter] = useState('All');

  const filteredExamples = filter === 'All' 
    ? exampleIntegrals 
    : exampleIntegrals.filter(ex => ex.difficulty === filter);

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-full overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
          <BookOpen className="w-5 h-5 text-pink-400" />
          Ejemplos (Cálculo Integral) {/* Updated title */}
        </h3>
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
            className="p-4 rounded-xl border transition-all cursor-pointer group bg-slate-800/50 border-slate-700 hover:border-pink-500/50"
            onClick={() => onLoadExample(example.integral)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-lg font-semibold text-white bg-black/20 px-2 py-1 rounded">
                ∫ {example.integral} dx
              </span>
            </div>
            
            <div className="flex justify-between items-end mt-2">
              <div>
                <div className={`text-xs font-bold ${
                  example.difficulty === 'Easy' ? 'text-green-400' :
                  example.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {example.difficulty}
                </div>
              </div>
              <button className="text-xs flex items-center gap-1 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Cargar <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PracticeExamplesNerdamer;