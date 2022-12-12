import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { ScheduleModule as TestScheduleModule } from './modules/schedule/schedule.module';
import { PrismaModule } from './common/prisma/prisma.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
    TestScheduleModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
