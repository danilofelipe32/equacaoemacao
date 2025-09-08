import React from 'react';

interface SetupScreenProps {
  numPlayers: number;
  setNumPlayers: (num: number) => void;
  onStartGame: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ numPlayers, setNumPlayers, onStartGame }) => {
  return (
    <div className="text-center bg-black/30 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/10">
      <h1 className="text-5xl font-bold mb-4 text-cyan-300 [text-shadow:0_0_12px_rgba(207,250,254,0.7)]">Equação em Ação</h1>
      <p className="mb-8 text-slate-200">Selecione o número de jogadores para começar.</p>
      <div className="flex justify-center items-center space-x-4 mb-8">
        {[2, 3, 4].map(n => (
          <button
            key={n}
            onClick={() => setNumPlayers(n)}
            className={`w-16 h-16 text-2xl font-bold rounded-full transition-all duration-300 transform hover:scale-110 ${
              numPlayers === n ? 'bg-yellow-400 text-indigo-900 ring-4 ring-yellow-300' : 'bg-indigo-500 hover:bg-indigo-400'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <button
        onClick={onStartGame}
        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg"
      >
        Iniciar Jogo
      </button>
    </div>
  );
};

export default SetupScreen;