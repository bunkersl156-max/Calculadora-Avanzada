import React from 'react';
import { motion } from 'framer-motion';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function IntegrationMethodGuide() {
  const methods = [
    {
      id: 'substitution',
      title: 'Integración por Sustitución',
      description: 'El método "u-substitution" es la regla de la cadena a la inversa.',
      steps: [
        'Elegir u = g(x)',
        'Calcular du = g\'(x) dx',
        'Reemplazar todo en la integral en términos de u',
        'Integrar respecto a u',
        'Reemplazar u por g(x) nuevamente'
      ],
      example: '∫ 2x(x^2+1)^3 dx'
    },
    {
      id: 'parts',
      title: 'Integración por Partes',
      description: 'Derivada de la regla del producto. Útil para productos de funciones dispares.',
      steps: [
        'Fórmula: ∫ u dv = uv - ∫ v du',
        'Elegir u según regla ILATE (Inversa, Log, Alg, Trig, Exp)',
        'Calcular du y v',
        'Aplicar fórmula y resolver la nueva integral'
      ],
      example: '∫ x e^x dx'
    },
    {
      id: 'fractions',
      title: 'Fracciones Parciales',
      description: 'Para funciones racionales P(x)/Q(x).',
      steps: [
        'Asegurar grado(P) < grado(Q)',
        'Factorizar el denominador Q(x)',
        'Escribir como suma de fracciones simples A/(x-a) + ...',
        'Resolver constantes A, B...',
        'Integrar cada término (usualmente logaritmos)'
      ],
      example: '∫ 1/(x^2-1) dx'
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-full overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-white/20">
      <h3 className="text-xl font-bold mb-6 text-white">Guía de Métodos</h3>
      
      <Accordion type="single" collapsible className="w-full">
        {methods.map((method) => (
          <AccordionItem key={method.id} value={method.id} className="border-white/10">
            <AccordionTrigger className="text-white hover:text-purple-400 hover:no-underline">
              {method.title}
            </AccordionTrigger>
            <AccordionContent className="text-gray-300">
              <p className="mb-3 text-sm italic">{method.description}</p>
              <div className="bg-black/20 p-3 rounded-lg mb-3">
                <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Algoritmo</h5>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {method.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="text-xs text-gray-400">
                Ejemplo común: <span className="font-mono text-purple-300">{method.example}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default IntegrationMethodGuide;