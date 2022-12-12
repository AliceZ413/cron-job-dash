import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { ScheduleModule as TestScheduleModule } from './modules/schedule/schedule.module';
import { PrismaService } from './prisma.server';

@Module({
  imports: [ScheduleModule.forRoot(), TasksModule, TestScheduleModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
