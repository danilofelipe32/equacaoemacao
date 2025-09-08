import React, { useState, useEffect, useCallback } from 'react';
import { Card, Player, GamePhase, EquationCard, CardType, Solution, SolutionCard, SpecialCardAction, SpecialCard } from './types';
import { createDeck, WINNING_SCORE, INITIAL_HAND_SIZE } from './constants';
import CardView from './components/CardView';
import SetupScreen from './components/SetupScreen';
import SolveModal from './components/SolveModal';
import GameOverScreen from './components/GameOverScreen';
import RulesModal from './components/RulesModal';

// --- Helper Functions ---
const shuffleDeck = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const solveLinearSystem = (eq1: EquationCard, eq2: EquationCard): Solution | 'impossible' | 'infinite' => {
  const { a: a1, b: b1, c: c1 } = eq1.equation;
  const { a: a2, b: b2, c: c2 } = eq2.equation;

  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    if (a1 * c2 - a2 * c1 === 0 && b1 * c2 - b2 * c1 === 0) {
      return 'infinite';
    } else {
      return 'impossible';
    }
  } else {
    const x = (c1 * b2 - c2 * b1) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
  }
};


// --- Main App Component ---
export default function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [deck, setDeck] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [playAreaCards, setPlayAreaCards] = useState<Card[]>([]);
  const [solutionAttempt, setSolutionAttempt] = useState<{ x: string, y: string }>({ x: '', y: '' });
  const [message, setMessage] = useState<string>('');
  const [winner, setWinner] = useState<Player | null>(null);
  const [isTurnActionTaken, setIsTurnActionTaken] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isDraggingOverDiscard, setIsDraggingOverDiscard] = useState<boolean>(false);
  const [scoreAnimation, setScoreAnimation] = useState<{playerId: number, points: number} | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [showReshuffleOption, setShowReshuffleOption] = useState<boolean>(false);
  
  const currentPlayer = players[currentPlayerIndex];

  // --- Game Setup ---
  const startGame = () => {
    const initialDeck = shuffleDeck(createDeck());
    const initialPlayers: Player[] = [];
    for (let i = 1; i <= numPlayers; i++) {
      const hand = initialDeck.splice(0, INITIAL_HAND_SIZE);
      initialPlayers.push({ id: i, name: `Jogador ${i}`, score: 0, hand, hasBonus: false });
    }
    setPlayers(initialPlayers);
    setDeck(initialDeck);
    setGamePhase(GamePhase.PLAYER_TURN);
    setMessage(`Começa o turno do Jogador 1. Compre uma carta.`);
  };

  // --- Core Game Actions ---
  const drawCard = useCallback(() => {
    if (!currentPlayer || isTurnActionTaken) return;

    if (deck.length === 0) {
      if (discardPile.length > 0) {
        setShowReshuffleOption(true);
        return;
      }
      setMessage('O monte de compra acabou!');
      endTurn();
      return;
    }
    
    const newDeck = [...deck];
    const drawnCard = newDeck.pop()!;
    
    const updatedPlayers = players.map(p => 
      p.id === currentPlayer.id ? { ...p, hand: [...p.hand, drawnCard] } : p
    );
    
    setDeck(newDeck);
    setPlayers(updatedPlayers);
    setIsTurnActionTaken(true);
    setMessage(`${currentPlayer.name} comprou uma carta. Agora jogue ou descarte.`);
  }, [deck, discardPile, players, currentPlayer, isTurnActionTaken]);

  const endTurn = () => {
    // This function is now only responsible for advancing to the next player's turn.
    // The player is responsible for clearing the play area (by returning cards to hand) before passing their turn.
    // Actions like solving or discarding will handle moving cards from the play area to the discard pile.
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);
    setMessage(`É a vez do ${players[nextPlayerIndex].name}. Compre uma carta.`);
    setPlayAreaCards([]);
    setIsTurnActionTaken(false);

    if (deck.length === 0 && discardPile.length === 0) {
        endGame();
    }
  };
  
  const endGame = () => {
      const winningPlayer = [...players].sort((a,b) => b.score - a.score)[0];
      setWinner(winningPlayer);
      setGamePhase(GamePhase.GAME_OVER);
  }

    // --- Reshuffle Logic ---
  const handleReshuffle = () => {
    const newShuffledDeck = shuffleDeck(discardPile);
    setDeck(newShuffledDeck);
    setDiscardPile([]);
    setShowReshuffleOption(false);
    setMessage(`${currentPlayer.name} embaralhou o descarte! Compre uma carta do novo monte.`);
  };

  const handleSkipReshuffle = () => {
    setShowReshuffleOption(false);
    setMessage("Você optou por não embaralhar. Jogue com as cartas na mão ou passe o turno.");
    setIsTurnActionTaken(true); // Mark action as taken, they can now end their turn.
  };


  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
    e.dataTransfer.setData("cardId", card.id);
    e.dataTransfer.effectAllowed = "move";
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (!isTurnActionTaken) {
        setMessage("Você deve comprar uma carta primeiro!");
        return;
    }

    const cardId = e.dataTransfer.getData("cardId");
    const cardToMove = currentPlayer.hand.find(c => c.id === cardId);

    if (cardToMove) {
        const eqInArea = playAreaCards.filter(c => c.type === CardType.EQUATION).length;
        const solInArea = playAreaCards.filter(c => c.type === CardType.SOLUTION).length;
        const specialInArea = playAreaCards.filter(c => c.type === CardType.SPECIAL).length;

        if (cardToMove.type === CardType.EQUATION && eqInArea >= 2) return;
        if (cardToMove.type === CardType.SOLUTION && solInArea >= 1) return;
        if (cardToMove.type === CardType.SPECIAL && specialInArea >= 1) return;
        if ((cardToMove.type === CardType.SPECIAL && playAreaCards.length > 0) || (specialInArea > 0)) return;

        setPlayAreaCards([...playAreaCards, cardToMove]);
        const updatedHand = currentPlayer.hand.filter(c => c.id !== cardId);
        const updatedPlayers = players.map(p => p.id === currentPlayer.id ? { ...p, hand: updatedHand } : p);
        setPlayers(updatedPlayers);
    }
  };

  const handleDragOverDiscard = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOverDiscard(true);
  };

  const handleDragLeaveDiscard = () => {
    setIsDraggingOverDiscard(false);
  };

  const handleDropOnDiscard = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOverDiscard(false);
    
    if (!isTurnActionTaken) {
      setMessage("Você deve comprar uma carta primeiro!");
      return;
    }
    
    if (playAreaCards.length > 0) {
      setMessage("Retorne as cartas da área de jogo para sua mão antes de descartar.");
      return;
    }
    
    const cardId = e.dataTransfer.getData("cardId");
    const cardToDiscard = currentPlayer.hand.find(c => c.id === cardId);

    if (cardToDiscard) {
      const updatedHand = currentPlayer.hand.filter(c => c.id !== cardId);
      const updatedPlayers = players.map(p => p.id === currentPlayer.id ? { ...p, hand: updatedHand } : p);
      
      setPlayers(updatedPlayers);
      setDiscardPile([...discardPile, cardToDiscard]);
      setMessage(`${currentPlayer.name} descartou uma carta.`);
      endTurn();
    }
  };

  const returnCardToHand = (cardToReturn: Card) => {
    setPlayAreaCards(playAreaCards.filter(c => c.id !== cardToReturn.id));
    const updatedHand = [...currentPlayer.hand, cardToReturn];
    const updatedPlayers = players.map(p => p.id === currentPlayer.id ? { ...p, hand: updatedHand } : p);
    setPlayers(updatedPlayers);
  };

  const triggerScoreAnimation = (playerId: number, points: number) => {
    if (points > 0) {
      setScoreAnimation({ playerId, points });
      setTimeout(() => {
        setScoreAnimation(null);
      }, 1500);
    }
  }

  // --- System Solving ---
  const handleSolveSystem = () => {
      const eqCards = playAreaCards.filter(c => c.type === CardType.EQUATION) as EquationCard[];
      if (eqCards.length !== 2) return;
      setGamePhase(GamePhase.SOLVING);
  };
  
  const submitSolution = () => {
    const eqCards = playAreaCards.filter(c => c.type === CardType.EQUATION) as EquationCard[];
    const solCard = playAreaCards.find(c => c.type === CardType.SOLUTION) as SolutionCard | undefined;
    
    const actualSolution = solveLinearSystem(eqCards[0], eqCards[1]);
    const attemptX = parseFloat(solutionAttempt.x);
    const attemptY = parseFloat(solutionAttempt.y);
    let points = 0;
    let turnMessage = '';

    if (actualSolution === 'impossible') {
        points = 0;
        turnMessage = `${currentPlayer.name} formou um sistema impossível. Sem pontos.`;
    } else if (actualSolution === 'infinite') {
        points = 5;
        turnMessage = `${currentPlayer.name} formou um sistema com infinitas soluções! +5 pontos.`;
    } else if (!isNaN(attemptX) && !isNaN(attemptY) && actualSolution.x === attemptX && actualSolution.y === attemptY) {
        points = 10;
        turnMessage = `${currentPlayer.name} resolveu o sistema corretamente! +10 pontos.`;
        if (solCard && solCard.solution.x === actualSolution.x && solCard.solution.y === actualSolution.y) {
            points += 5;
            turnMessage += ` E usou a carta de solução! +5 pontos extras.`;
        }
    } else {
        points = 0;
        turnMessage = `${currentPlayer.name} errou a solução. Sem pontos.`;
    }

    if (currentPlayer.hasBonus && points > 0) {
        points *= 2;
        turnMessage += ` Bônus aplicado! Pontos dobrados!`;
    }

    triggerScoreAnimation(currentPlayer.id, points);
    const newScore = currentPlayer.score + points;
    const updatedPlayers = players.map(p => p.id === currentPlayer.id ? { ...p, score: newScore, hasBonus: false } : p);
    
    setPlayers(updatedPlayers);
    setDiscardPile([...discardPile, ...playAreaCards]);
    setMessage(turnMessage);
    
    if (newScore >= WINNING_SCORE) {
        const winner = updatedPlayers.find(p => p.id === currentPlayer.id);
        setWinner(winner ?? null);
        setGamePhase(GamePhase.GAME_OVER);
    } else {
        setGamePhase(GamePhase.PLAYER_TURN);
        setSolutionAttempt({ x: '', y: '' });
        endTurn();
    }
  };
  
  const handleSpecialCard = () => {
      const special = playAreaCards[0] as SpecialCard;
      if (!special) return;
      
      switch(special.action) {
          case SpecialCardAction.BONUS:
            setPlayers(players.map(p => p.id === currentPlayer.id ? {...p, hasBonus: true} : p));
            setMessage(`${currentPlayer.name} ativou um Bônus! A próxima pontuação será dobrada.`);
            setDiscardPile([...discardPile, special]);
            setPlayAreaCards([]);
            endTurn();
            break;
          case SpecialCardAction.HINT:
            setPlayers(players.map(p => p.id === currentPlayer.id ? {...p, score: Math.max(0, p.score - 3)} : p));
            setMessage(`${currentPlayer.name} usou uma Dica e perdeu 3 pontos. O professor sugere o método da adição!`);
            setDiscardPile([...discardPile, special]);
            setPlayAreaCards([]);
            endTurn();
            break;
          case SpecialCardAction.SWAP:
            const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
            const targetPlayer = players[nextPlayerIndex];
            if (targetPlayer.hand.length > 0) {
                 const cardToTake = targetPlayer.hand[0];
                 const p_updated = players.map(p => {
                     if (p.id === currentPlayer.id) return {...p, hand: [...p.hand, cardToTake]};
                     if (p.id === targetPlayer.id) return {...p, hand: p.hand.filter(c => c.id !== cardToTake.id)};
                     return p;
                 });
                 // now give the special card to target player
                 const final_players = p_updated.map(p => {
                     if (p.id === targetPlayer.id) return {...p, hand: [...p.hand, special]};
                     return p;
                 });

                 setPlayers(final_players);
                 setMessage(`${currentPlayer.name} trocou uma carta com ${targetPlayer.name}.`);
            } else {
                setMessage("O oponente não tem cartas para trocar.");
                returnCardToHand(special); // Return card if opponent has no cards
                return; // Do not end turn
            }
             setPlayAreaCards([]);
             endTurn();
             break;
      }
  }

  // --- Render Functions ---
  const renderGame = () => {
      if (!currentPlayer) return null;
      
      const eqInPlay = playAreaCards.filter(c => c.type === CardType.EQUATION).length;
      const solInPlay = playAreaCards.filter(c => c.type === CardType.SOLUTION).length;
      const specialInPlay = playAreaCards.filter(c => c.type === CardType.SPECIAL).length;

      return (
        <div className="flex flex-col h-screen p-4 space-y-4">
            <header className="flex justify-between items-center bg-black/20 backdrop-blur-sm p-3 rounded-lg border-b-2 border-white/10">
                <h1 className="text-2xl font-bold text-cyan-300 [text-shadow:0_0_8px_rgba(207,250,254,0.7)]">Equação em Ação</h1>
                <div className="flex items-center space-x-6">
                    {players.map(p => (
                        <div key={p.id} className={`relative p-2 rounded-md transition-all duration-300 ${p.id === currentPlayer.id ? 'bg-yellow-400 text-indigo-900 shadow-lg ring-2 ring-yellow-300' : 'bg-black/20'}`}>
                            <span className="font-bold">{p.name}:</span>
                            <span className={`font-bold ml-2 ${scoreAnimation?.playerId === p.id ? 'score-text-pulse' : ''}`}>
                                {p.score} pts
                            </span>
                             {scoreAnimation?.playerId === p.id && (
                                <span className="score-popup ml-2">
                                    +{scoreAnimation.points}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                 <div className="flex items-center gap-4">
                    <span className="font-semibold text-white/80">Cartas no Monte: {deck.length}</span>
                    <button onClick={() => setIsRulesModalOpen(true)} className="bg-cyan-500/80 hover:bg-cyan-400 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold text-white transition-all transform hover:scale-110 shadow-lg">
                        i
                    </button>
                 </div>
            </header>
            
            <main className="flex-grow flex flex-col items-center justify-center space-y-4">
                <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg min-h-[3rem] w-full max-w-4xl text-center text-lg italic text-cyan-100">{message}</div>
                <div 
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`w-full max-w-4xl min-h-[16rem] border-2 border-dashed rounded-lg flex items-center justify-center p-4 transition-all duration-300 ${isDraggingOver ? 'bg-white/20 border-yellow-300 ring-2 ring-yellow-300' : 'bg-black/20 border-white/20'}`}
                >
                    {playAreaCards.length === 0 ? (
                        <p className="text-slate-300/80">Arraste as cartas aqui para jogar</p>
                    ) : (
                        <div className="flex justify-center items-end gap-3">
                            {playAreaCards.map(card => (
                                <CardView key={card.id} card={card} onClick={() => returnCardToHand(card)} />
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center space-x-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-40 h-56 rounded-lg bg-black/40 border-2 border-white/20 flex items-center justify-center font-bold text-xl text-white/50">Monte</div>
                        <span className="mt-2 font-semibold">{deck.length} cartas</span>
                    </div>
                     <div className="flex flex-col items-center text-center">
                        <div
                            onDrop={handleDropOnDiscard}
                            onDragOver={handleDragOverDiscard}
                            onDragLeave={handleDragLeaveDiscard}
                            className={`w-40 h-56 rounded-lg border-2 flex items-center justify-center transition-colors duration-300 ${isDraggingOverDiscard ? 'bg-orange-500/40 border-orange-400 ring-2 ring-orange-300' : 'bg-black/40 border-white/20'}`}
                        >
                           {discardPile.length > 0 ? (
                                <CardView card={discardPile[discardPile.length - 1]} />
                            ) : (
                                <span className="text-slate-400 text-center p-2">Arraste aqui para descartar</span>
                            )}
                        </div>
                        <span className="mt-2 font-semibold">Descarte</span>
                    </div>
                </div>
            </main>

            <footer className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border-t-2 border-white/10">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">{currentPlayer.name} - Mão {currentPlayer.hasBonus && <span className="text-yellow-300 animate-pulse [text-shadow:0_0_8px_rgba(253,224,71,0.7)]"> (BÔNUS ATIVO)</span>}</h2>
                </div>
                <div className="flex justify-center items-end gap-3 min-h-[15rem]">
                    {currentPlayer.hand.map(card => (
                        <CardView key={card.id} card={card} onDragStart={(e) => handleDragStart(e, card)} />
                    ))}
                </div>
                <div className="flex justify-center mt-4 space-x-4">
                    <button onClick={drawCard} disabled={isTurnActionTaken} className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md shadow-md transition-all transform hover:scale-105 disabled:transform-none">
                        1. Comprar Carta
                    </button>
                    <button onClick={handleSolveSystem} disabled={!isTurnActionTaken || eqInPlay !== 2 || specialInPlay > 0} className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md shadow-md transition-all transform hover:scale-105 disabled:transform-none">
                       2. Resolver Sistema
                    </button>
                    <button onClick={handleSpecialCard} disabled={!isTurnActionTaken || specialInPlay !== 1 || eqInPlay > 0 || solInPlay > 0} className="bg-fuchsia-500 hover:bg-fuchsia-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md shadow-md transition-all transform hover:scale-105 disabled:transform-none">
                       2. Usar Especial
                    </button>
                    <button onClick={endTurn} disabled={!isTurnActionTaken || playAreaCards.length > 0} className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md shadow-md transition-all transform hover:scale-105 disabled:transform-none">
                        3. Passar Turno
                    </button>
                </div>
            </footer>
        </div>
    );
  };
  
  const renderReshuffleModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="text-center bg-indigo-900/80 backdrop-blur-md border border-white/10 p-10 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold mb-4 text-cyan-300">O Monte Acabou!</h2>
        <p className="text-lg mb-6">Deseja embaralhar a pilha de descarte para formar um novo monte?</p>
        <div className="flex justify-center gap-4">
          <button onClick={handleReshuffle} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-md transition-colors">
            Sim, Embaralhar
          </button>
          <button onClick={handleSkipReshuffle} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md transition-colors">
            Não, Continuar
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
      switch (gamePhase) {
          case GamePhase.SETUP:
              return <SetupScreen numPlayers={numPlayers} setNumPlayers={setNumPlayers} onStartGame={startGame} />;
          case GamePhase.GAME_OVER:
              return (
                  <>
                      {renderGame()}
                      <GameOverScreen winner={winner} players={players} onPlayAgain={() => { setGamePhase(GamePhase.SETUP); setWinner(null); setDiscardPile([]); setPlayAreaCards([]); }} />
                  </>
              );
          case GamePhase.SOLVING:
              return (
                  <>
                    {renderGame()}
                    <SolveModal 
                        playAreaCards={playAreaCards}
                        solutionAttempt={solutionAttempt}
                        setSolutionAttempt={setSolutionAttempt}
                        onSubmit={submitSolution}
                        onCancel={() => setGamePhase(GamePhase.PLAYER_TURN)}
                    />
                  </>
              )
          case GamePhase.PLAYER_TURN:
          default:
              return renderGame();
      }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
        {isRulesModalOpen && <RulesModal onClose={() => setIsRulesModalOpen(false)} />}
        {showReshuffleOption && renderReshuffleModal()}
        {renderContent()}
    </div>
  )
}