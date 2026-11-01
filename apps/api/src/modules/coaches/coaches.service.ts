import { Injectable, NotFoundException } from '@nestjs/common';
import { INITIAL_COACHES, CoachItem } from './coaches.data';

export interface CoachRequest {
  id: string;
  coachId: string;
  coachName: string;
  playerName: string;
  playerAge: string;
  playerPosition: string;
  goals: string;
  status: 'PENDING' | 'ACCEPTED' | 'ACTIVE';
  createdAt: string;
}

@Injectable()
export class CoachesService {
  private coaches = [...INITIAL_COACHES];
  private requests: CoachRequest[] = [];

  async findAll(): Promise<CoachItem[]> {
    return this.coaches;
  }

  async findOne(id: string): Promise<CoachItem> {
    const coach = this.coaches.find((c) => c.id === id);
    if (!coach) throw new NotFoundException('مربی مورد نظر یافت نشد.');
    return coach;
  }

  async requestCoach(data: {
    coachId: string;
    playerName: string;
    playerAge: string;
    playerPosition: string;
    goals: string;
  }): Promise<CoachRequest> {
    const coach = await this.findOne(data.coachId);

    const req: CoachRequest = {
      id: `req-${Date.now()}`,
      coachId: coach.id,
      coachName: coach.fullName,
      playerName: data.playerName,
      playerAge: data.playerAge,
      playerPosition: data.playerPosition,
      goals: data.goals,
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString('fa-IR'),
    };

    this.requests.unshift(req);
    return req;
  }

  async getMyRequests(): Promise<CoachRequest[]> {
    return this.requests;
  }
}
