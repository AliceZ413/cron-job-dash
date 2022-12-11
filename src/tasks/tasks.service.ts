import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.server';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('5 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 5');
  }

  @Interval(10_000)
  hadleInterval() {
    this.logger.debug('Called every 10 seconds');
  }

  async scheduleList({
    page = 1,
    size = 20,
  }: {
    page: number | string;
    size: number | string;
  }) {
    const limit = parseInt(size as string),
      offset = (parseInt(page as string) - 1) * parseInt(size as string);

    const [list, total] = await Promise.all([
      this.prisma.schedule_job.findMany({
        where: {},
        orderBy: {
          create_time: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      this.prisma.schedule_job.count(),
    ]);

    return { list, total };
  }

  async createOrEditSchedule({
    job_id = null,
    cron,
    jobName,
    jobHandler,
    params = '',
    desciption = '',
  }) {
    if (!job_id) {
      // create
      await this.prisma.schedule_job.create({
        data: {
          cron,
          jobName,
          jobHandler,
          params,
          desciption,
          create_by: 'admin',
          update_by: 'admin',
          create_time: new Date(),
          update_time: new Date(),
        },
      });
    }
  }
}
