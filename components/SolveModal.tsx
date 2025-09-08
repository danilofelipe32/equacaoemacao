import React from 'react';
import { Card, CardType, EquationCard } from '../types';

interface SolveModalProps {
  playAreaCards: Card[];
  solutionAttempt: { x: string; y: string };
  setSolutionAttempt: (attempt: { x: string; y: string }) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const SolveModal: React.FC<SolveModalProps> = ({ playAreaCards, solutionAttempt, setSolutionAttempt, onSubmit, onCancel }) => {
  const eqCards = playAreaCards.filter(c => c.type === CardType.EQUATION) as EquationCard[];
  
  if (eqCards.length < 2) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-indigo-900/80 backdrop-blur-md border border-white/10 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-cyan-300">Resolva o Sistema</h2>
        <div className="bg-black/30 p-4 rounded-md mb-6 text-center font-mono text-xl">
          <p>{eqCards[0].text}</p>
          <p>{eqCards[1].text}</p>
        </div>
        <div className="flex gap-4 mb-6 justify-center">
          <div className="flex items-center">
            <label htmlFor="x" className="text-3xl font-bold mr-2 text-cyan-300">x =</label>
            <input
              id="x"
              type="number"
              value={solutionAttempt.x}
              onChange={e => setSolutionAttempt({ ...solutionAttempt, x: e.target.value })}
              className="w-28 p-2 rounded bg-black/30 text-white text-lg border-2 border-white/20 focus:border-cyan-400 focus:ring-cyan-400 outline-none"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="y" className="text-3xl font-bold mr-2 text-cyan-300">y =</label>
            <input
              id="y"
              type="number"
              value={solutionAttempt.y}
              onChange={e => setSolutionAttempt({ ...solutionAttempt, y: e.target.value })}
              className="w-28 p-2 rounded bg-black/30 text-white text-lg border-2 border-white/20 focus:border-cyan-400 focus:ring-cyan-400 outline-none"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md transition-colors">
            Cancelar
          </button>
          <button onClick={onSubmit} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-md transition-colors">
            Verificar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolveModal;