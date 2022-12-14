import { CacheModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { ScheduleModule as TestScheduleModule } from './modules/schedule/schedule.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisCacheModule } from './common/redis-cache/redis-cache.module';
import { TestModule } from './modules/test/test.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
    TestScheduleModule,
    PrismaModule,
    // RedisCacheModule,
    CacheModule.register({ isGlobal: true }),
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
