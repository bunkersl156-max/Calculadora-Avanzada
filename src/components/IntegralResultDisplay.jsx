import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function IntegralResultDisplay({ result, integralType }) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.finalResult);
    setCopied(true);
    toast({ description: "Resultado copiado al portapapeles" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 mt-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <CheckCircle className="w-24 h-24 text-green-500" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-green-400 text-sm font-semibold uppercase tracking-wider">
            Resultado Final
          </h4>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-green-300"
            title="Copiar resultado"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-3xl md:text-4xl font-mono font-bold text-white break-all mb-2">
          {result.finalResult}
        </div>

        {integralType === 'definite' && result.rawIndefinite && (
          <div className="mt-4 pt-4 border-t border-green-500/20">
            <p className="text-sm text-gray-400 mb-1">Antiderivada:</p>
            <p className="font-mono text-green-200/80 text-sm break-all">
              F(x) = {result.rawIndefinite}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default IntegralResultDisplay;