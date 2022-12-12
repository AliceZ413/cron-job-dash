import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// 导出PrismaService，之后在其他地方导入PrismaModule时都可以共享同一个PrismaService实例（单例模式）
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
