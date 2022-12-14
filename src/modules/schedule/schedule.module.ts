import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { RedisCacheModule } from 'src/common/redis-cache/redis-cache.module';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [PrismaModule, RedisCacheModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
