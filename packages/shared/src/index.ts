// User & Auth Types
export type UserRole = 'COACH' | 'STUDENT' | 'ADMIN';

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
  createdAt: string;
}

// Tactics Board Types
export type PitchView = 'FULL' | 'ATTACKING_HALF' | 'DEFENDING_HALF';

export interface PlayerTacticMarker {
  id: string;
  number: number;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  team: 'HOME' | 'AWAY';
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
}

export interface TacticalArrow {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  dashed?: boolean;
}

export interface TacticBoardDto {
  id: string;
  title: string;
  description?: string;
  formation: string; // e.g. "4-3-3", "4-2-3-1"
  pitchView: PitchView;
  players: PlayerTacticMarker[];
  arrows: TacticalArrow[];
  coachId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTacticDto {
  title: string;
  description?: string;
  formation: string;
  pitchView: PitchView;
  players: PlayerTacticMarker[];
  arrows: TacticalArrow[];
}

// Training Plans Types
export type PlanDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO';

export interface ExerciseItem {
  id: string;
  title: string;
  durationMinutes: number;
  repetitions?: number;
  sets?: number;
  restSeconds?: number;
  videoUrl?: string;
  description: string;
}

export interface TrainingPlanDto {
  id: string;
  title: string;
  description: string;
  difficulty: PlanDifficulty;
  durationWeeks: number;
  sessionsPerWeek: number;
  exercises: ExerciseItem[];
  coachId: string;
  coachName: string;
  price: number;
  createdAt: string;
}

export interface CreatePlanDto {
  title: string;
  description: string;
  difficulty: PlanDifficulty;
  durationWeeks: number;
  sessionsPerWeek: number;
  exercises: Omit<ExerciseItem, 'id'>[];
  price: number;
}

// Subscription & Payment Types
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'CANCELLED';

export interface SubscriptionPlanDto {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  coachId: string;
  features: string[];
}

export interface UserSubscriptionDto {
  id: string;
  userId: string;
  coachId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
}
