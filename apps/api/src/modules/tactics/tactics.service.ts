import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';

export interface TacticalPlayer {
  id: string;
  number: number;
  name: string;
  team: 'HOME' | 'AWAY';
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  position: string;
}

export interface TacticalDrawing {
  id: string;
  tool: 'pen' | 'arrow' | 'rect' | 'circle' | 'line';
  color: string;
  strokeWidth: number;
  points?: { x: number; y: number }[]; // for freehand pen
  startX?: number; // percentage (0 - 100)
  startY?: number; // percentage (0 - 100)
  endX?: number; // percentage (0 - 100)
  endY?: number; // percentage (0 - 100)
}

export interface TacticalBoard {
  id: string;
  title: string;
  creatorName?: string;
  creatorPhone?: string;
  createdAt: string;
  players: TacticalPlayer[];
  drawings: TacticalDrawing[];
  ball?: { x: number; y: number };
}

export const INITIAL_PLAYERS: TacticalPlayer[] = [
  // Goalkeeper
  { id: '1', number: 1, name: 'دروازه‌بان', team: 'HOME', x: 8, y: 50, position: 'GK' },
  // Defenders
  { id: '2', number: 2, name: 'دفاع راست', team: 'HOME', x: 25, y: 20, position: 'RB' },
  { id: '3', number: 4, name: 'دفاع وسط', team: 'HOME', x: 22, y: 40, position: 'CB' },
  { id: '4', number: 5, name: 'دفاع وسط', team: 'HOME', x: 22, y: 60, position: 'CB' },
  { id: '5', number: 3, name: 'دفاع چپ', team: 'HOME', x: 25, y: 80, position: 'LB' },
  // Midfielders
  { id: '6', number: 6, name: 'هافبک دفاعی', team: 'HOME', x: 42, y: 50, position: 'DM' },
  { id: '7', number: 8, name: 'هافبک وسط', team: 'HOME', x: 55, y: 32, position: 'CM' },
  { id: '8', number: 10, name: 'هافبک هجومی', team: 'HOME', x: 55, y: 68, position: 'AM' },
  // Forwards
  { id: '9', number: 7, name: 'وینگر راست', team: 'HOME', x: 75, y: 20, position: 'RW' },
  { id: '10', number: 9, name: 'مهاجم نوک', team: 'HOME', x: 82, y: 50, position: 'ST' },
  { id: '11', number: 11, name: 'وینگر چپ', team: 'HOME', x: 75, y: 80, position: 'LW' },
];

@Injectable()
export class TacticsService {
  private boards = new Map<string, TacticalBoard>();

  constructor() {
    this.boards.set('demo', {
      id: 'demo',
      title: 'تخته تاکتیک تمرینی اصلی',
      creatorName: 'کادر ارشد فنی فرست تاچ',
      creatorPhone: '09120000000',
      createdAt: new Date().toISOString(),
      players: JSON.parse(JSON.stringify(INITIAL_PLAYERS)),
      drawings: [],
      ball: { x: 50, y: 50 },
    });
  }

  createBoard(dto: CreateBoardDto): TacticalBoard {
    const randomHex = Math.random().toString(36).substring(2, 10);
    const id = `tb-${randomHex}`;

    const newBoard: TacticalBoard = {
      id,
      title: dto.title.trim(),
      creatorName: dto.creatorName?.trim() || 'مربی',
      creatorPhone: dto.creatorPhone?.trim() || '',
      createdAt: new Date().toISOString(),
      players: JSON.parse(JSON.stringify(INITIAL_PLAYERS)),
      drawings: [],
      ball: { x: 50, y: 50 },
    };

    this.boards.set(id, newBoard);
    return newBoard;
  }

  getBoard(id: string): TacticalBoard {
    let board = this.boards.get(id);
    if (!board) {
      board = {
        id,
        title: `تخته تاکتیک ${id}`,
        creatorName: 'مربی',
        createdAt: new Date().toISOString(),
        players: JSON.parse(JSON.stringify(INITIAL_PLAYERS)),
        drawings: [],
        ball: { x: 50, y: 50 },
      };
      this.boards.set(id, board);
    }
    return board;
  }

  updatePlayerPosition(boardId: string, playerId: string, x: number, y: number): TacticalBoard {
    const board = this.getBoard(boardId);
    board.players = board.players.map((p) =>
      p.id === playerId ? { ...p, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } : p,
    );
    this.boards.set(boardId, board);
    return board;
  }

  updatePlayerDetails(
    boardId: string,
    playerId: string,
    details: { name?: string; number?: number; position?: string },
  ): TacticalBoard {
    const board = this.getBoard(boardId);
    board.players = board.players.map((p) => {
      if (p.id === playerId) {
        return {
          ...p,
          ...(details.name !== undefined && { name: details.name.trim() }),
          ...(details.number !== undefined && { number: details.number }),
          ...(details.position !== undefined && { position: details.position.trim().toUpperCase() }),
        };
      }
      return p;
    });
    this.boards.set(boardId, board);
    return board;
  }

  updateBallPosition(boardId: string, x: number, y: number): TacticalBoard {
    const board = this.getBoard(boardId);
    board.ball = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    this.boards.set(boardId, board);
    return board;
  }

  addDrawing(boardId: string, drawing: TacticalDrawing): TacticalBoard {
    const board = this.getBoard(boardId);
    if (!board.drawings) board.drawings = [];
    board.drawings.push(drawing);
    this.boards.set(boardId, board);
    return board;
  }

  clearDrawings(boardId: string): TacticalBoard {
    const board = this.getBoard(boardId);
    board.drawings = [];
    this.boards.set(boardId, board);
    return board;
  }

  resetBoard(boardId: string): TacticalBoard {
    const board = this.getBoard(boardId);
    board.players = JSON.parse(JSON.stringify(INITIAL_PLAYERS));
    board.drawings = [];
    board.ball = { x: 50, y: 50 };
    this.boards.set(boardId, board);
    return board;
  }
}
