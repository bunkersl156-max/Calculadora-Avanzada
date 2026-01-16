import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calculator, Sigma } from 'lucide-react';
import SimpleCalculator from '@/components/SimpleCalculator';
import CalculadoraIntegral from '@/components/CalculadoraIntegral';
import CalculationHistory from '@/components/CalculationHistory';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [activeTab, setActiveTab] = useState('simple');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('calculatorHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeRestoreData, setActiveRestoreData] = useState(null);

  const addToHistory = (calculation) => {
    const newHistory = [
      {
        ...calculation,
        timestamp: new Date().toISOString(),
        id: Date.now()
      },
      ...history
    ].slice(0, 50); // Keep last 50 calculations
    
    setHistory(newHistory);
    localStorage.setItem('calculatorHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  };

  const restoreCalculation = (calculation) => {
    setActiveRestoreData(calculation);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora Científica Avanzada - Nerdamer & Simple</title>
        <meta name="description" content="Calculadora científica con motor Nerdamer para integrales simbólicas complejas y cálculos aritméticos precisos." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
        <Toaster />
        
        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl"
        >
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              Calculadora Científica Avanzada
            </h1>
            <p className="text-center text-blue-100 mt-2">
              Potenciada por Nerdamer para cálculo simbólico
            </p>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calculator Section */}
            <div className="lg:col-span-3">
              {/* Tab Navigation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 mb-6 bg-white/10 backdrop-blur-md p-2 rounded-xl"
              >
                <button
                  onClick={() => setActiveTab('simple')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === 'simple'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg scale-105'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Calculator className="w-5 h-5" />
                  <span className="hidden sm:inline">Calculadora Simple</span>
                  <span className="sm:hidden">Simple</span>
                </button>
                <button
                  onClick={() => setActiveTab('integral')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === 'integral'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-105'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Sigma className="w-5 h-5" />
                  <span className="hidden sm:inline">Calculadora Integral</span>
                  <span className="sm:hidden">Integrales</span>
                </button>
              </motion.div>

              {/* Calculator Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === 'simple' ? (
                  <SimpleCalculator addToHistory={addToHistory} history={history} />
                ) : (
                  <CalculadoraIntegral addToHistory={addToHistory} history={history} />
                )}
              </motion.div>
            </div>

            {/* History Sidebar */}
            <div className="lg:col-span-1">
              <CalculationHistory
                history={history}
                clearHistory={clearHistory}
                onRestore={restoreCalculation}
                activeTab={activeTab}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-6 bg-black/30 backdrop-blur-md">
          <div className="container mx-auto px-4 text-center text-gray-300">
            <p className="text-sm">
              Calculadora Científica Avanzada © 2026
            </p>
            <p className="text-xs mt-2 text-gray-400">
              Integración simbólica precisa con Nerdamer
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;