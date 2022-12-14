import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';

@Injectable()
export class TestService {
  constructor(private readonly redisCacheService: RedisCacheService) {}
  async getTest(): Promise<string> {
    const key = 'key1';
    const cachedData = await this.redisCacheService.get(key);
    if (cachedData) {
      return cachedData;
    }

    const data = Math.random() * 100 + '';
    this.redisCacheService.set(key, data, 10);
    return data;
  }
}
