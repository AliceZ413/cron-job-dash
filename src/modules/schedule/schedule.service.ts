import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { v4 } from 'node-uuid';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as schedule from 'node-schedule';

@Injectable()
export class ScheduleService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(ScheduleService.name);

  private scheduleStacks: Record<string, any> = {};

  async onModuleInit() {
    console.log('[onModuleInit] [ScheduleService]');

    this.logger.verbose('[初始化定时任务] start');
    // 查询启动状态的定时任务
    const schedules = await this.prisma.schedule_job.findMany({
      where: {
        status: 0,
        deleted: false,
      },
    });

    // 循环注册定时任务
    schedules.forEach(async (schedule) => {
      this.logger.verbose(
        `[注册job] name: ${schedule.jobName}, handler: ${schedule.jobHandler}`,
      );
      this.generateSchedule(
        schedule.job_id,
        schedule.cron,
        schedule.jobName,
        schedule.jobHandler,
      );
    });

    this.logger.verbose(
      `[初始化定时任务] 初始化定时任务数量: ${schedules.length}, 结束`,
    );
  }

  async beforeApplicationShutdown() {
    console.log('[beforeApplicationShutdown] [SecheduleService]');
  }

  async generateSchedule(
    id: number,
    cron: string,
    jobName: string,
    jobHandler: string,
  ) {
    this.logger.verbose(
      `[创建定时任务]，任务ID：${id}，cron：${cron}，任务名：${jobName}，任务方法：${jobHandler}`,
    );

    const uuid = v4();
    this.logger.log('uuid: ' + uuid);

    // console.log((this.scheduleStacks[jobName] = 1));

    // todo 不使用jobName（存在jobName相同的情况）
    this.scheduleStacks[id] = schedule.scheduleJob(uuid, cron, async () => {
      console.log(`[${id}] callback: ` + cron);
      // await this.executeSchedule(id);
    });

    console.log(this.scheduleStacks);
  }

  testHandler(params: string) {
    // 具体业务代码
    this.logger.log(`这是测试任务，任务参数: ${params}`);
  }

  testCurlHandler(params: string) {
    // const paramsObj = JSON.parse(params);
    // const result = await this

    this.logger.log(`测试调用接口任务，状态码: `, params);
  }
}
