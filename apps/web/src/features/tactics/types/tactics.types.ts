export type TacticalTool = 'select' | 'pen' | 'arrow' | 'rect' | 'circle' | 'line' | 'eraser';

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
  drawings?: TacticalDrawing[];
  ball?: { x: number; y: number };
}

export interface ConnectedViewer {
  id: string;
  name: string;
  phone?: string;
  boardId: string;
  joinedAt: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderName: string;
  senderId: string;
  timestamp: string;
}
