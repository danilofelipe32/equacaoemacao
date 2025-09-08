
import { Card, CardType, EquationCard, SolutionCard, SpecialCard, SpecialCardAction } from './types';

export const WINNING_SCORE = 50;
export const INITIAL_HAND_SIZE = 5;

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper to format equation text
const formatEquation = (a: number, b: number, c: number): string => {
    const xPart = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
    const ySign = b > 0 ? '+' : '-';
    const absB = Math.abs(b);
    const yPart = absB === 1 ? 'y' : `${absB}y`;
    return `${xPart} ${ySign} ${yPart} = ${c}`;
};

export const createDeck = (): Card[] => {
    const deck: Card[] = [];

    // --- Generate Solution & corresponding Equation cards ---
    const solutions: { sol: { x: number; y: number }, eqs: { a: number, b: number }[] }[] = [
        { sol: { x: 2, y: 3 }, eqs: [{ a: 1, b: 1 }, { a: 2, b: -1 }, { a: 3, b: 2 }, {a: 4, b: 1}] },
        { sol: { x: 3, y: 1 }, eqs: [{ a: 1, b: 2 }, { a: 2, b: -1 }, { a: 3, b: 1 }, {a: 1, b: -2}] },
        { sol: { x: 1, y: 4 }, eqs: [{ a: 2, b: 1 }, { a: -1, b: 1 }, { a: 3, b: -1 }, {a: 5, b: 1}] },
        { sol: { x: -1, y: 2 }, eqs: [{ a: 1, b: 3 }, { a: 3, b: 1 }, { a: -2, b: 1 }, {a: 2, b: 2}] },
        { sol: { x: 4, y: -2 }, eqs: [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4}] },
    ];

    solutions.forEach(({ sol, eqs }) => {
        // Add Solution Card
        deck.push({
            id: generateId(),
            type: CardType.SOLUTION,
            solution: sol,
            text: `(${sol.x}, ${sol.y})`,
        } as SolutionCard);

        // Add corresponding Equation Cards
        eqs.forEach(({ a, b }) => {
            const c = a * sol.x + b * sol.y;
            deck.push({
                id: generateId(),
                type: CardType.EQUATION,
                equation: { a, b, c },
                text: formatEquation(a, b, c),
            } as EquationCard);
        });
    });

    // --- Add more generic/filler equation cards ---
    const fillerEquations: { a: number, b: number, c: number }[] = [
        { a: 1, b: 1, c: 7 }, { a: 1, b: -1, c: 1 }, { a: 2, b: 3, c: 12 },
        { a: 3, b: -1, c: 5 }, { a: 1, b: 4, c: 8 }, { a: 2, b: 2, c: 10 },
        { a: 4, b: 1, c: 9 }, { a: -1, b: 2, c: 5 }, { a: 5, b: -2, c: 1 }
    ];
    fillerEquations.forEach(({a,b,c}) => deck.push({ id: generateId(), type: CardType.EQUATION, equation: {a,b,c}, text: formatEquation(a,b,c)}));


    // --- Add cards for impossible/infinite solutions ---
    // Infinite (e.g., 2x + 4y = 6 and x + 2y = 3)
    deck.push({ id: generateId(), type: CardType.EQUATION, equation: {a: 2, b: 4, c: 6}, text: formatEquation(2,4,6) });
    deck.push({ id: generateId(), type: CardType.EQUATION, equation: {a: 1, b: 2, c: 3}, text: formatEquation(1,2,3) });
    // Impossible (e.g., x + y = 5 and x + y = 10)
    deck.push({ id: generateId(), type: CardType.EQUATION, equation: {a: 1, b: 1, c: 5}, text: formatEquation(1,1,5) });
    deck.push({ id: generateId(), type: CardType.EQUATION, equation: {a: 1, b: 1, c: 10}, text: formatEquation(1,1,10) });


    // --- Add Special Cards ---
    const specialCards: Omit<SpecialCard, 'id'>[] = [
        { type: CardType.SPECIAL, action: SpecialCardAction.SWAP, text: 'Troca', description: 'Troque uma carta com outro jogador.' },
        { type: CardType.SPECIAL, action: SpecialCardAction.SWAP, text: 'Troca', description: 'Troque uma carta com outro jogador.' },
        { type: CardType.SPECIAL, action: SpecialCardAction.SWAP, text: 'Troca', description: 'Troque uma carta com outro jogador.' },
        { type: CardType.SPECIAL, action: SpecialCardAction.HINT, text: 'Dica', description: 'Peça uma dica ao professor. Custa 3 pontos.' },
        { type: CardType.SPECIAL, action: SpecialCardAction.HINT, text: 'Dica', description: 'Peça uma dica ao professor. Custa 3 pontos.' },
        { type: CardType.SPECIAL, action: SpecialCardAction.HINT, text: 'Dica', description: 'Peça uma dica ao professor. Custa 3 pontos.' },
        { type: CardType.SPECIAL, action: SpecialCardAction.BONUS, text: 'Bônus', description: 'Dobre os pontos da sua próxima jogada de resolução.' },
        { type: CardType.SPECIAL, action: SpecialCardAction.BONUS, text: 'Bônus', description: 'Dobre os pontos da sua próxima jogada de resolução.' },
        { type: CardType.SPECIAL, action: SpecialCardAction.BONUS, text: 'Bônus', description: 'Dobre os pontos da sua próxima jogada de resolução.' },
        { type: CardType.SPECIAL, action: SpecialCardAction.BONUS, text: 'Bônus', description: 'Dobre os pontos da sua próxima jogada de resolução.' },
    ];

    specialCards.forEach(sc => deck.push({ ...sc, id: generateId() } as SpecialCard));
    
    // Fill up to 60 cards if needed
    while (deck.filter(c => c.type === CardType.EQUATION).length < 40) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1) + 1;
        const c = Math.floor(Math.random() * 15) + 1;
        deck.push({id: generateId(), type: CardType.EQUATION, equation: {a,b,c}, text: formatEquation(a,b,c) })
    }
     while (deck.filter(c => c.type === CardType.SOLUTION).length < 10) {
        const x = Math.floor(Math.random() * 5) + 1;
        const y = Math.floor(Math.random() * 5) + 1;
        deck.push({ id: generateId(), type: CardType.SOLUTION, solution: {x,y}, text: `(${x}, ${y})` } as SolutionCard);
    }

    return deck;
};
