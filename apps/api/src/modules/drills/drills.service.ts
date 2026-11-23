import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { INITIAL_AGILITY_DRILLS, AgilityDrillItem } from './drills.data';
import { CreateDrillDto } from './dto/create-drill.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DrillsService implements OnModuleInit {
  private readonly logger = new Logger(DrillsService.name);
  private memoryDrills: AgilityDrillItem[] = [...INITIAL_AGILITY_DRILLS];
  private readonly storageFilePath = path.resolve(process.cwd(), 'data', 'drills.json');

  constructor(private readonly prisma: PrismaService) {
    this.loadFromDisk();
  }

  async onModuleInit() {
    await this.seedDrillsIfEmpty();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, 'utf-8');
        const customDrills: AgilityDrillItem[] = JSON.parse(raw);
        if (Array.isArray(customDrills)) {
          this.memoryDrills = customDrills;
          this.logger.log(`Loaded ${this.memoryDrills.length} drills from disk.`);
          return;
        }
      }
    } catch (err: any) {
      this.logger.warn(`Failed loading drills from disk: ${err.message}`);
    }
    this.memoryDrills = [];
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(this.storageFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storageFilePath, JSON.stringify(this.memoryDrills, null, 2), 'utf-8');
    } catch (err: any) {
      this.logger.error(`Failed saving drills to disk: ${err.message}`);
    }
  }

  private async seedDrillsIfEmpty() {
    try {
      if ((this.prisma as any).agilityDrill) {
        const count = await (this.prisma as any).agilityDrill.count();
        this.logger.log(`Current agility drills in PostgreSQL: ${count}`);
      }
    } catch {
      this.logger.warn('PostgreSQL check notice for drills.');
    }
  }

  async findAll(categoryIndex?: number, search?: string): Promise<AgilityDrillItem[]> {
    let results = this.memoryDrills.filter(
      (d) =>
        d &&
        d.id &&
        !d.id.startsWith('drill-1-') &&
        (d.videoUrl?.includes('/uploads/') || d.id.startsWith('drill-adm-')),
    );

    if (results.length === 0) {
      results = this.memoryDrills;
    }

    if (categoryIndex) {
      results = results.filter((d) => d.categoryIndex === Number(categoryIndex));
    }
    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (d) =>
          d.persianName.includes(q) ||
          d.englishName.toLowerCase().includes(q) ||
          d.targetSkill.includes(q) ||
          d.categoryTitle.includes(q),
      );
    }
    return results;
  }

  async findOne(id: string): Promise<AgilityDrillItem | null> {
    try {
      if ((this.prisma as any).agilityDrill) {
        const drill = await (this.prisma as any).agilityDrill.findUnique({ where: { id } });
        if (drill) return drill;
      }
    } catch {
      // Fallback
    }
    return this.memoryDrills.find((d) => d.id === id) || null;
  }

  async create(dto: CreateDrillDto): Promise<AgilityDrillItem> {
    const newDrill: AgilityDrillItem = {
      id: `drill-adm-${Date.now()}`,
      categoryIndex: dto.categoryIndex || 1,
      categoryTitle: dto.categoryTitle || 'تمرین تخصصی',
      englishName: dto.englishName || 'Custom Drill',
      persianName: dto.persianName,
      imageUrl: dto.imageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
      videoUrl: dto.videoUrl || undefined,
      description: dto.description || 'تمرین تخصصی ثبت شده توسط مدیر',
      difficulty: dto.difficulty || 'INTERMEDIATE',
      equipment: dto.equipment || 'توپ، مخروط',
      targetSkill: dto.targetSkill || dto.persianName,
      duration: dto.duration || '۱۵ دقیقه',
      setsReps: dto.setsReps || '۴ ست',
    };

    try {
      if ((this.prisma as any).agilityDrill) {
        const saved = await (this.prisma as any).agilityDrill.create({
          data: {
            ...newDrill,
          },
        });
        this.memoryDrills.unshift(saved);
        this.saveToDisk();
        return saved;
      }
    } catch {
      // PostgreSQL offline
    }

    this.memoryDrills.unshift(newDrill);
    this.saveToDisk();
    return newDrill;
  }

  async update(id: string, dto: Partial<CreateDrillDto>): Promise<AgilityDrillItem | null> {
    const index = this.memoryDrills.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const existing = this.memoryDrills[index];
    const updated: AgilityDrillItem = {
      ...existing,
      persianName: dto.persianName ?? existing.persianName,
      englishName: dto.englishName ?? existing.englishName,
      categoryTitle: dto.categoryTitle ?? existing.categoryTitle,
      categoryIndex: dto.categoryIndex ?? existing.categoryIndex,
      difficulty: dto.difficulty ?? existing.difficulty,
      description: dto.description ?? existing.description,
      imageUrl: dto.imageUrl ?? existing.imageUrl,
      videoUrl: dto.videoUrl ?? existing.videoUrl,
      equipment: dto.equipment ?? existing.equipment,
      targetSkill: dto.targetSkill ?? existing.targetSkill,
      duration: dto.duration ?? existing.duration,
      setsReps: dto.setsReps ?? existing.setsReps,
    };

    this.memoryDrills[index] = updated;
    this.saveToDisk();

    try {
      if ((this.prisma as any).agilityDrill) {
        await (this.prisma as any).agilityDrill.update({
          where: { id },
          data: {
            persianName: updated.persianName,
            englishName: updated.englishName,
            categoryTitle: updated.categoryTitle,
            categoryIndex: updated.categoryIndex,
            difficulty: updated.difficulty,
            description: updated.description,
            imageUrl: updated.imageUrl,
            videoUrl: updated.videoUrl,
            equipment: updated.equipment,
            targetSkill: updated.targetSkill,
          },
        });
      }
    } catch {}

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.memoryDrills.length;
    this.memoryDrills = this.memoryDrills.filter((d) => d.id !== id);
    this.saveToDisk();
    try {
      if ((this.prisma as any).agilityDrill) {
        await (this.prisma as any).agilityDrill.delete({ where: { id } });
      }
    } catch {}
    return this.memoryDrills.length < initialLen;
  }

  async getCategories() {
    const categoriesMap = new Map<number, { index: number; title: string; count: number }>();

    for (const drill of this.memoryDrills) {
      const existing = categoriesMap.get(drill.categoryIndex);
      if (existing) {
        existing.count += 1;
      } else {
        categoriesMap.set(drill.categoryIndex, {
          index: drill.categoryIndex,
          title: drill.categoryTitle,
          count: 1,
        });
      }
    }

    return Array.from(categoriesMap.values()).sort((a, b) => a.index - b.index);
  }
}
