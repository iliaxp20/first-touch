import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { INITIAL_AGILITY_DRILLS, AgilityDrillItem } from './drills.data';
import { CreateDrillDto } from './dto/create-drill.dto';

@Injectable()
export class DrillsService implements OnModuleInit {
  private readonly logger = new Logger(DrillsService.name);
  private memoryDrills: AgilityDrillItem[] = [...INITIAL_AGILITY_DRILLS];

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDrillsIfEmpty();
  }

  private async seedDrillsIfEmpty() {
    try {
      if ((this.prisma as any).agilityDrill) {
        const count = await (this.prisma as any).agilityDrill.count();
        if (count === 0) {
          this.logger.log('Seeding agility drills into PostgreSQL...');
          for (const drill of INITIAL_AGILITY_DRILLS) {
            await (this.prisma as any).agilityDrill.create({
              data: {
                id: drill.id,
                categoryIndex: drill.categoryIndex,
                categoryTitle: drill.categoryTitle,
                englishName: drill.englishName,
                persianName: drill.persianName,
                imageUrl: drill.imageUrl,
                equipment: drill.equipment,
                targetSkill: drill.targetSkill,
                difficulty: drill.difficulty,
                description: drill.description,
              },
            });
          }
          this.logger.log(`Successfully seeded ${INITIAL_AGILITY_DRILLS.length} agility drills to PostgreSQL.`);
        }
      }
    } catch {
      this.logger.warn('PostgreSQL not accessible for seeding drills. Operating with in-memory drill library.');
    }
  }

  async findAll(categoryIndex?: number, search?: string): Promise<AgilityDrillItem[]> {
    try {
      if ((this.prisma as any).agilityDrill) {
        const where: any = {};
        if (categoryIndex) where.categoryIndex = categoryIndex;
        if (search) {
          where.OR = [
            { persianName: { contains: search, mode: 'insensitive' } },
            { englishName: { contains: search, mode: 'insensitive' } },
            { targetSkill: { contains: search, mode: 'insensitive' } },
          ];
        }

        const dbDrills = await (this.prisma as any).agilityDrill.findMany({
          where,
          orderBy: { categoryIndex: 'asc' },
        });

        if (dbDrills && dbDrills.length > 0) {
          return dbDrills;
        }
      }
    } catch {
      // Fallback to in-memory store
    }

    let results = this.memoryDrills;
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
          d.categoryTitle.includes(q)
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
      id: `drill-${dto.categoryIndex}-${Date.now()}`,
      categoryIndex: dto.categoryIndex,
      categoryTitle: dto.categoryTitle,
      englishName: dto.englishName,
      persianName: dto.persianName,
      imageUrl: dto.imageUrl,
      description: dto.description || 'تمرین تخصصی ثبت شده توسط مربی/ادمین',
      difficulty: dto.difficulty || 'INTERMEDIATE',
      equipment: dto.equipment || 'تجهیزات ورزشی',
      targetSkill: dto.targetSkill || 'چابکی و لمس اول',
    };

    try {
      if ((this.prisma as any).agilityDrill) {
        const saved = await (this.prisma as any).agilityDrill.create({
          data: {
            ...newDrill,
          },
        });
        this.memoryDrills.unshift(saved);
        return saved;
      }
    } catch {
      this.logger.warn('Saved drill in-memory (PostgreSQL offline).');
    }

    this.memoryDrills.unshift(newDrill);
    return newDrill;
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
