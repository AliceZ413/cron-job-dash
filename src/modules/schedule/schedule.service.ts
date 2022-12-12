import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import NodeUUID from 'node-uuid';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ScheduleService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(ScheduleService.name);

  async onModuleInit() {
    console.log('[onModuleInit] [ScheduleService]');

    this.logger.log('[初始化定时任务] start');
    // 查询启动状态的定时任务
    // const schedules = await
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
    this.logger.log(
      `[创建定时任务]，任务ID：${id}，cron：${cron}，任务名：${jobName}，任务方法：${jobHandler}`,
    );
    const uuid = NodeUUID.v4();
    this.logger.log('uuid: ' + uuid);
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
