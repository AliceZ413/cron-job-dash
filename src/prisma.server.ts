import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    console.log('[onModuleInit] [PrismaService]');
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    console.log('[enableShutdownHooks]');
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
