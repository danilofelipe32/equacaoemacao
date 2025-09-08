
export enum CardType {
  EQUATION = 'EQUATION',
  SOLUTION = 'SOLUTION',
  SPECIAL = 'SPECIAL',
}

export enum SpecialCardAction {
  SWAP = 'Troca',
  HINT = 'Dica',
  BONUS = 'Bônus',
}

export interface Equation {
  a: number;
  b: number;
  c: number;
}

export interface Solution {
  x: number;
  y: number;
}

interface BaseCard {
  id: string;
}

export interface EquationCard extends BaseCard {
  type: CardType.EQUATION;
  equation: Equation;
  text: string;
}

export interface SolutionCard extends BaseCard {
  type: CardType.SOLUTION;
  solution: Solution;
  text: string;
}

export interface SpecialCard extends BaseCard {
  type: CardType.SPECIAL;
  action: SpecialCardAction;
  text: string;
  description: string;
}

export type Card = EquationCard | SolutionCard | SpecialCard;

export interface Player {
  id: number;
  name: string;
  score: number;
  hand: Card[];
  hasBonus: boolean;
}

export enum GamePhase {
    SETUP = 'SETUP',
    PLAYER_TURN = 'PLAYER_TURN',
    SOLVING = 'SOLVING',
    ACTION_SPECIAL = 'ACTION_SPECIAL',
    GAME_OVER = 'GAME_OVER',
}
