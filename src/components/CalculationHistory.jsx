import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, Clock, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function CalculationHistory({ history, clearHistory, onRestore, activeTab }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter history based on active tab type
  // 'simple' tab shows 'simple' type
  // 'integral' tab shows 'integral' type (now includes Nerdamer results)
  const filteredHistory = history.filter(item => 
    activeTab === 'simple' ? item.type === 'simple' : item.type === 'integral'
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)} hrs`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 lg:p-6 sticky top-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5" />
          <h3 className="font-bold text-lg">Historial</h3>
          {filteredHistory.length > 0 && (
            <span className="px-2 py-1 bg-blue-500 rounded-full text-xs">
              {filteredHistory.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {(isExpanded || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay cálculos aún</p>
              </div>
            ) : (
              <>
                {/* Clear History Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full mb-4 py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Limpiar Historial
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 text-white border-slate-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        Esta acción eliminará todo el historial de cálculos. No se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={clearHistory}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* History Items */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {filteredHistory.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onRestore(item)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all border border-white/10 hover:border-white/20 group relative"
                    >
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <RotateCcw className="w-4 h-4 text-blue-300" />
                      </div>
                      
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          {item.type === 'simple' ? (
                            <div className="font-mono text-sm text-white truncate">
                              {item.expression}
                            </div>
                          ) : (
                            <div className="text-sm">
                              <div className="font-mono text-white truncate font-semibold">
                                ∫ {item.function} dx
                              </div>
                              <div className="flex gap-2 text-xs text-gray-400 mt-1">
                                <span>{item.integralType === 'definite' ? `[${item.lowerLimit}, ${item.upperLimit}]` : 'Indefinida'}</span>
                                {item.method && <span className="text-purple-300">• {item.method}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                        <div className="font-mono text-xs text-green-400 truncate max-w-[70%]">
                          = {item.result}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          {formatTimestamp(item.timestamp)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CalculationHistory;