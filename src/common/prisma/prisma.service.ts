import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit(): Promise<void> {
    console.log('[OnModuleInit] [PrismaService]');
    try {
      await this.$connect();
    } catch (err) {
      console.log(err);
    }
  }

  async onModuleDestroy(): Promise<void> {
    console.log('[OnModuleDestroy] [PrismaService]');
    await this.$disconnect();
  }
}
