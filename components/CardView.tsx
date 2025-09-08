import React from 'react';
import { Card, CardType, SpecialCardAction } from '../types';

interface CardViewProps {
  card: Card;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const CardView: React.FC<CardViewProps> = ({ card, onClick, onDragStart }) => {
  const getCardStyle = () => {
    let baseStyle = 'w-40 h-56 rounded-lg p-1 flex flex-col justify-center items-center text-center shadow-xl transform transition-all duration-300 border-0 text-white relative overflow-hidden hover:scale-105';
    
    const cursorStyle = onDragStart ? 'cursor-grab active:cursor-grabbing' : (onClick ? 'cursor-pointer' : 'cursor-default');

    switch (card.type) {
      case CardType.EQUATION:
        return `${baseStyle} ${cursorStyle} bg-gradient-to-br from-cyan-500 to-blue-600`;
      case CardType.SOLUTION:
        return `${baseStyle} ${cursorStyle} bg-gradient-to-br from-emerald-500 to-green-600`;
      case CardType.SPECIAL:
        return `${baseStyle} ${cursorStyle} bg-gradient-to-br from-fuchsia-500 to-purple-600`;
      default:
        return `${baseStyle} ${cursorStyle}`;
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
        onDragStart(e);
        e.currentTarget.style.opacity = '0.5';
        e.currentTarget.style.transform = 'scale(0.95) rotate(-5deg)';
    }
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = '';
  }
  
  const getIconForCard = () => {
      let iconUrl = '';
      switch(card.type) {
          case CardType.EQUATION:
            iconUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M21 11.18V11a2 2 0 0 0-2-2h-1V3a1 1 0 0 0-2 0v1h-1a2 2 0 0 0-2 2v1h-1V6a1 1 0 0 0-2 0v1h-1a2 2 0 0 0-2 2v.18A3 3 0 0 0 5 14a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3a3 3 0 0 0-1-2.82ZM7 14a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z'/%3E%3C/svg%3E")`;
            break;
          case CardType.SOLUTION:
            iconUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='m10.61 17.173-4.242-4.243a1 1 0 0 1 1.414-1.414L11.32 15.25l6.51-6.51a1 1 0 0 1 1.414 1.414z'/%3E%3Cpath d='M20 12.18a8.08 8.08 0 0 0-8-8 8 8 0 0 0-8 8 8 8 0 0 0 8 8 8.08 8.08 0 0 0 8-8zm-2 0a6 6 0 0 1-6 6 6 6 0 0 1-6-6 6 6 0 0 1 6-6 6 6 0 0 1 6 6z'/%3E%3C/svg%3E")`;
            break;
          case CardType.SPECIAL:
            iconUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 1.25a1 1 0 0 1 .91.58l2.508 5.116 5.644.82a1 1 0 0 1 .555 1.705l-4.084 3.98.964 5.621a1 1 0 0 1-1.45 1.054L12 17.21l-5.04 2.65a1 1 0 0 1-1.45-1.054l.964-5.62-4.084-3.98a1 1 0 0 1 .555-1.706l5.644-.82L11.09 1.83a1 1 0 0 1 .91-.58Z'/%3E%3C/svg%3E")`;
            break;
      }
      return <div className="card-icon-bg" style={{ backgroundImage: iconUrl }}></div>;
  }

  const renderCardContent = () => {
    return (
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-2 [text-shadow:1px_1px_3px_rgba(0,0,0,0.5)]">
        {card.type === CardType.EQUATION && <span className="text-2xl font-bold font-mono">{card.text}</span>}
        {card.type === CardType.SOLUTION && (
          <>
            <span className="text-sm font-semibold">Solução</span>
            <span className="text-3xl font-bold font-mono">{card.text}</span>
          </>
        )}
        {card.type === CardType.SPECIAL && (
          <>
            <span className="text-2xl font-bold">{card.text}</span>
            <span className="text-xs mt-2 italic text-center">{card.description}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div 
        className={getCardStyle()} 
        onClick={onClick}
        draggable={!!onDragStart}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        >
        {getIconForCard()}
        <div className="bg-black/20 backdrop-blur-sm w-full h-full rounded-md flex flex-col justify-center items-center p-2 pointer-events-none">
            {renderCardContent()}
        </div>
    </div>
  );
};

export default CardView;
