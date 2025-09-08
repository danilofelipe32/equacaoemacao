import React from 'react';

interface RulesModalProps {
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-indigo-900/90 text-slate-200 p-8 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] relative border-2 border-cyan-400"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-3xl font-bold text-slate-400 hover:text-cyan-400 transition-colors">&times;</button>
        <h1 className="text-3xl font-bold mb-4 text-cyan-300 border-b-2 border-cyan-300/50 pb-2">Como Jogar Equação em Ação</h1>
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] pr-4 rules-content">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-yellow-200">Objetivo</h2>
              <p>Resolver sistemas de equações lineares para ganhar pontos e ser o primeiro a atingir 50 pontos.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-yellow-200">Preparação</h2>
              <ul className="list-disc list-inside">
                <li>O baralho é embaralhado e 5 cartas são distribuídas para cada jogador.</li>
                <li>O restante forma o monte de compra. Cada jogador começa com 0 pontos.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-yellow-200">Como Jogar (Passo a Passo)</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>Compre uma Carta:</strong> No início do seu turno, você DEVE comprar uma carta do monte.</li>
                <li>
                  <strong>Forme um Sistema:</strong> Arraste duas cartas de Equação da sua mão para a área de jogo para formar um sistema. Você também pode arrastar uma carta de Solução correspondente.
                </li>
                <li>
                  <strong>Resolva o Sistema:</strong> Clique no botão "Resolver Sistema". Uma janela aparecerá para você inserir sua solução para (x, y).
                </li>
                 <li>
                  <strong>Use uma Carta Especial:</strong> Alternativamente, arraste uma carta Especial para a área de jogo e clique no botão "Usar Especial".
                </li>
                 <li>
                  <strong>Descarte:</strong> Se não puder ou não quiser jogar, você pode arrastar uma carta da sua mão para a pilha de Descarte. Isso termina seu turno.
                </li>
              </ol>
            </div>
             <div>
              <h2 className="text-xl font-semibold text-yellow-200">Pontuação</h2>
              <ul className="list-disc list-inside">
                <li><strong>Sistema resolvido corretamente:</strong> +10 pontos.</li>
                <li><strong>Usar uma carta de Solução para confirmar:</strong> +5 pontos extras (totalizando 15).</li>
                <li><strong>Sistema com infinitas soluções:</strong> +5 pontos.</li>
                <li><strong>Sistema impossível:</strong> 0 pontos.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-yellow-200">Cartas Especiais</h2>
              <ul className="list-disc list-inside">
                <li><strong>"Troca":</strong> Force um oponente a trocar uma carta com você.</li>
                <li><strong>"Dica":</strong> Peça ajuda. Custa 3 pontos.</li>
                <li><strong>"Bônus":</strong> Dobre os pontos da sua próxima jogada de resolução.</li>
              </ul>
            </div>
             <div>
              <h2 className="text-xl font-semibold text-yellow-200">Fim de Jogo</h2>
              <p>O jogo termina quando um jogador atinge 50 pontos ou quando o monte de compra acaba. Vence quem tiver mais pontos!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;