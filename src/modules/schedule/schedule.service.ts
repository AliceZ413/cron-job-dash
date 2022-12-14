import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { v4 } from 'node-uuid';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as schedule from 'node-schedule';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

@Injectable()
export class ScheduleService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private redisCache: RedisCacheService,
  ) {}

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
      await this.execSchedule(id);
    });
    this.redisCache.set(`schedule_stacks:${uuid}`, `${jobName}-${Date.now()}`);
  }

  async execSchedule(id: number) {
    const schedule = await this.prisma.schedule_job.findFirst({
      where: {
        job_id: id,
        deleted: false,
      },
    });

    try {
      if (schedule.status === -1) {
        // 任务状态停止，则取消当前任务
        // 任务容错，防止用户取消不是用的当前的worker
        // todo 取消定时任务
        this.logger.verbose(`${schedule.job_id} ${schedule.jobName} 停止任务`);
      } else {
        // 执行任务
        console.log(schedule.jobHandler);

        await this[schedule.jobHandler](schedule.params);
      }
    } catch (err) {
      this.logger.log(
        `执行任务 ${schedule.job_id} ${
          schedule.jobName
        } 失败, 时间 ${new Date().toLocaleString()}`,
      );
      this.logger.error(err.message);
    }
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
