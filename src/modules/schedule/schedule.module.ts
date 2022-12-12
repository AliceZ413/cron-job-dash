import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [PrismaModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
