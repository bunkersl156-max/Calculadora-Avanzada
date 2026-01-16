import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Delete, RotateCcw } from 'lucide-react';
import { evaluateExpression, formatNumber } from '@/utils/calculator';
import { useToast } from '@/components/ui/use-toast';

function SimpleCalculator({ addToHistory, history }) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const { toast } = useToast();

  const buttons = [
    { label: 'C', type: 'clear', className: 'bg-red-500 hover:bg-red-600' },
    { label: '⌫', type: 'backspace', className: 'bg-orange-500 hover:bg-orange-600' },
    { label: '^', type: 'operator', className: 'bg-purple-500 hover:bg-purple-600' },
    { label: '/', type: 'operator', className: 'bg-purple-500 hover:bg-purple-600' },
    
    { label: '7', type: 'number' },
    { label: '8', type: 'number' },
    { label: '9', type: 'number' },
    { label: '*', type: 'operator', className: 'bg-purple-500 hover:bg-purple-600' },
    
    { label: '4', type: 'number' },
    { label: '5', type: 'number' },
    { label: '6', type: 'number' },
    { label: '-', type: 'operator', className: 'bg-purple-500 hover:bg-purple-600' },
    
    { label: '1', type: 'number' },
    { label: '2', type: 'number' },
    { label: '3', type: 'number' },
    { label: '+', type: 'operator', className: 'bg-purple-500 hover:bg-purple-600' },
    
    { label: '√', type: 'function', className: 'bg-blue-500 hover:bg-blue-600' },
    { label: '0', type: 'number' },
    { label: '.', type: 'number' },
    { label: '=', type: 'equals', className: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' },
  ];

  const handleButtonClick = (button) => {
    switch (button.type) {
      case 'clear':
        setDisplay('0');
        setExpression('');
        setLastResult(null);
        break;
        
      case 'backspace':
        if (display.length > 1) {
          setDisplay(display.slice(0, -1));
        } else {
          setDisplay('0');
        }
        break;
        
      case 'number':
        if (display === '0' || lastResult !== null) {
          setDisplay(button.label);
          setLastResult(null);
        } else {
          setDisplay(display + button.label);
        }
        break;
        
      case 'operator':
        setDisplay(display + button.label);
        setLastResult(null);
        break;
        
      case 'function':
        if (button.label === '√') {
          setDisplay('√(' + display + ')');
        }
        break;
        
      case 'equals':
        try {
          const result = evaluateExpression(display);
          const formatted = formatNumber(result);
          
          addToHistory({
            type: 'simple',
            expression: display,
            result: formatted
          });
          
          setExpression(display);
          setDisplay(formatted);
          setLastResult(formatted);
        } catch (error) {
          toast({
            title: 'Error de cálculo',
            description: error.message,
            variant: 'destructive'
          });
        }
        break;
    }
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
      handleButtonClick({ label: key, type: 'number' });
    } else if (['+', '-', '*', '/', '^'].includes(key)) {
      handleButtonClick({ label: key, type: 'operator' });
    } else if (key === '.') {
      handleButtonClick({ label: '.', type: 'number' });
    } else if (key === 'Enter' || key === '=') {
      handleButtonClick({ type: 'equals' });
    } else if (key === 'Backspace') {
      handleButtonClick({ type: 'backspace' });
    } else if (key === 'Escape') {
      handleButtonClick({ type: 'clear' });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display]);

  const restoreFromHistory = (item) => {
    if (item.type === 'simple') {
      setDisplay(item.expression);
      setExpression('');
      setLastResult(null);
    }
  };

  useEffect(() => {
    const simpleHistory = history.filter(h => h.type === 'simple');
    if (simpleHistory.length > 0) {
      // History restoration is handled via parent component
    }
  }, [history]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
      {/* Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 mb-6 shadow-inner"
      >
        {expression && (
          <div className="text-right text-gray-400 text-sm mb-2 font-mono">
            {expression} =
          </div>
        )}
        <div className="text-right text-4xl md:text-5xl font-bold text-white font-mono break-all">
          {display}
        </div>
      </motion.div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-3">
        {buttons.map((button, index) => (
          <motion.button
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleButtonClick(button)}
            className={`
              py-4 px-3 rounded-xl font-bold text-lg md:text-xl
              shadow-lg transition-all duration-200
              ${button.className || 'bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600'}
              text-white
            `}
          >
            {button.label === '⌫' ? <Delete className="w-6 h-6 mx-auto" /> : button.label}
          </motion.button>
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>💡 Puedes usar el teclado: números, +, -, *, /, ^, Enter, Backspace, Esc</p>
      </div>
    </div>
  );
}

export default SimpleCalculator;