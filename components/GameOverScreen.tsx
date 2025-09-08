import React from 'react';
import { Player } from '../types';

interface GameOverScreenProps {
  winner: Player | null;
  players: Player[];
  onPlayAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ winner, players, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="text-center bg-indigo-900/80 backdrop-blur-md border border-white/10 p-10 rounded-lg shadow-2xl">
        <h1 className="text-5xl font-bold mb-4 text-yellow-300 [text-shadow:0_0_12px_rgba(253,224,71,0.7)]">Fim de Jogo!</h1>
        <h2 className="text-3xl mb-6"><span className="font-bold text-cyan-300">{winner?.name}</span> é o vencedor com <span className="font-bold text-cyan-300">{winner?.score}</span> pontos!</h2>
        <div className="mb-8 bg-black/20 p-4 rounded-md">
          <h3 className="text-xl font-bold mb-2">Placar Final</h3>
          <ul className="text-left space-y-1">
            {players.sort((a, b) => b.score - a.score).map((p, index) => (
              <li key={p.id} className={`text-lg p-1 rounded ${index === 0 ? 'bg-yellow-400/80 text-indigo-900 font-bold' : ''}`}>
                {p.name}: {p.score} pontos
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onPlayAgain}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
        >
          Jogar Novamente
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;