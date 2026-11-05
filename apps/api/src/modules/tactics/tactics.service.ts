import { Injectable, Logger } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import * as fs from 'fs';
import * as path from 'path';

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
  updatedAt?: string;
  players: TacticalPlayer[];
  drawings: TacticalDrawing[];
  ball?: { x: number; y: number };
}

export const INITIAL_PLAYERS: TacticalPlayer[] = [
  // Goalkeeper
  { id: '1', number: 1, name: '', team: 'HOME', x: 8, y: 50, position: 'GK' },
  // Defenders
  { id: '2', number: 2, name: '', team: 'HOME', x: 25, y: 20, position: 'RB' },
  { id: '3', number: 4, name: '', team: 'HOME', x: 22, y: 40, position: 'CB' },
  { id: '4', number: 5, name: '', team: 'HOME', x: 22, y: 60, position: 'CB' },
  { id: '5', number: 3, name: '', team: 'HOME', x: 25, y: 80, position: 'LB' },
  // Midfielders
  { id: '6', number: 6, name: '', team: 'HOME', x: 42, y: 50, position: 'DM' },
  { id: '7', number: 8, name: '', team: 'HOME', x: 55, y: 32, position: 'CM' },
  { id: '8', number: 10, name: '', team: 'HOME', x: 55, y: 68, position: 'AM' },
  // Forwards
  { id: '9', number: 7, name: '', team: 'HOME', x: 75, y: 20, position: 'RW' },
  { id: '10', number: 9, name: '', team: 'HOME', x: 82, y: 50, position: 'ST' },
  { id: '11', number: 11, name: '', team: 'HOME', x: 75, y: 80, position: 'LW' },
];

@Injectable()
export class TacticsService {
  private readonly logger = new Logger('TacticsService');
  private boards = new Map<string, TacticalBoard>();
  private readonly storageFilePath = path.resolve(process.cwd(), 'data', 'tactics-boards.json');

  constructor() {
    this.loadFromDisk();
    if (this.boards.size === 0) {
      this.boards.set('demo', {
        id: 'demo',
        title: 'طراحی تاکتیک تمرینی اصلی تیم',
        creatorName: 'کادر فنی فرست تاچ',
        creatorPhone: '09120000000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        players: JSON.parse(JSON.stringify(INITIAL_PLAYERS)),
        drawings: [],
        ball: { x: 50, y: 50 },
      });
      this.saveToDisk();
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, 'utf-8');
        const list: TacticalBoard[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          list.forEach((b) => this.boards.set(b.id, b));
          this.logger.log(`Loaded ${list.length} tactical boards from disk.`);
        }
      }
    } catch (err: any) {
      this.logger.warn(`Failed loading boards from disk: ${err.message}`);
    }
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(this.storageFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data = Array.from(this.boards.values());
      fs.writeFileSync(this.storageFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err: any) {
      this.logger.error(`Failed saving boards to disk: ${err.message}`);
    }
  }

  getAllBoards(): TacticalBoard[] {
    return Array.from(this.boards.values()).sort(
      (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime(),
    );
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
      updatedAt: new Date().toISOString(),
      players: JSON.parse(JSON.stringify(INITIAL_PLAYERS)),
      drawings: [],
      ball: { x: 50, y: 50 },
    };

    this.boards.set(id, newBoard);
    this.saveToDisk();
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
        updatedAt: new Date().toISOString(),
        players: JSON.parse(JSON.stringify(INITIAL_PLAYERS)),
        drawings: [],
        ball: { x: 50, y: 50 },
      };
      this.boards.set(id, board);
      this.saveToDisk();
    }
    return board;
  }

  saveFullBoard(
    id: string,
    data: {
      title?: string;
      players?: TacticalPlayer[];
      drawings?: TacticalDrawing[];
      ball?: { x: number; y: number };
    },
  ): TacticalBoard {
    const board = this.getBoard(id);
    if (data.title) board.title = data.title;
    if (data.players) board.players = data.players;
    if (data.drawings) board.drawings = data.drawings;
    if (data.ball) board.ball = data.ball;
    board.updatedAt = new Date().toISOString();
    this.boards.set(id, board);
    this.saveToDisk();
    return board;
  }

  deleteBoard(id: string): boolean {
    const existed = this.boards.delete(id);
    if (existed) {
      this.saveToDisk();
    }
    return existed;
  }

  updatePlayerPosition(boardId: string, playerId: string, x: number, y: number): TacticalBoard {
    const board = this.getBoard(boardId);
    board.players = board.players.map((p) =>
      p.id === playerId ? { ...p, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } : p,
    );
    board.updatedAt = new Date().toISOString();
    this.boards.set(boardId, board);
    this.saveToDisk();
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
    board.updatedAt = new Date().toISOString();
    this.boards.set(boardId, board);
    this.saveToDisk();
    return board;
  }

  updateBallPosition(boardId: string, x: number, y: number): TacticalBoard {
    const board = this.getBoard(boardId);
    board.ball = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    board.updatedAt = new Date().toISOString();
    this.boards.set(boardId, board);
    this.saveToDisk();
    return board;
  }

  addDrawing(boardId: string, drawing: TacticalDrawing): TacticalBoard {
    const board = this.getBoard(boardId);
    if (!board.drawings) board.drawings = [];
    board.drawings.push(drawing);
    board.updatedAt = new Date().toISOString();
    this.boards.set(boardId, board);
    this.saveToDisk();
    return board;
  }

  clearDrawings(boardId: string): TacticalBoard {
    const board = this.getBoard(boardId);
    board.drawings = [];
    board.updatedAt = new Date().toISOString();
    this.boards.set(boardId, board);
    this.saveToDisk();
    return board;
  }

  removeDrawing(boardId: string, drawingId: string): TacticalBoard {
    const board = this.getBoard(boardId);
    board.drawings = (board.drawings || []).filter((d) => d.id !== drawingId);
    board.updatedAt = new Date().toISOString();
    this.boards.set(boardId, board);
    this.saveToDisk();
    return board;
  }

  resetBoard(boardId: string): TacticalBoard {
    const board = this.getBoard(boardId);
    board.players = JSON.parse(JSON.stringify(INITIAL_PLAYERS));
    board.drawings = [];
    board.ball = { x: 50, y: 50 };
    board.updatedAt = new Date().toISOString();
    this.boards.set(boardId, board);
    this.saveToDisk();
    return board;
  }
}
