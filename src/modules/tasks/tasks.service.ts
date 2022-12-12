import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.server';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(TasksService.name);

  // 任务列表
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
        where: {
          deleted: false,
        },
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

  // 创建/修改任务
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
    } else {
      await this.prisma.schedule_job.update({
        data: {
          cron,
          jobName,
          jobHandler,
          params,
          desciption,
          update_by: 'admin',
          update_time: new Date(),
        },
        where: {
          job_id,
        },
      });
    }
  }

  // 删除任务
  async deleteSchedule({ job_id }: { job_id: number }) {
    try {
      // const result = await this.prisma.schedule_job.delete({
      //   where: {
      //     job_id,
      //   },
      // });
      // if (result) {
      //   // 停止任务
      // }
      const result = await this.prisma.schedule_job.update({
        data: {
          deleted: true,
        },
        where: {
          job_id,
        },
      });
      if (result) {
        if (result.status === 0) {
          // 停止任务
        }
      }
    } catch (err) {}
  }

  // 更新任务状态
  async updateScheduleStatus({
    job_id,
    status,
  }: {
    job_id: number;
    status: number;
  }) {
    await this.prisma.schedule_job.update({
      data: {
        status,
      },
      where: {
        job_id,
      },
    });
  }

  async runSchedule({ job_id }) {
    const schedule = await this.prisma.schedule_job.findFirst({
      where: {
        job_id,
      },
    });
    if (schedule == null) {
      this.logger.error('任务不存在');
      return;
    }
  }
}
