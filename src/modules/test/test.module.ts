import { Module } from '@nestjs/common';
import { RedisCacheModule } from 'src/common/redis-cache/redis-cache.module';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [RedisCacheModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
