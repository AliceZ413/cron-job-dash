import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.server';
import { ScheduleService } from './schedule.service';

@Module({
  providers: [ScheduleService, PrismaService],
})
export class ScheduleModule {}
