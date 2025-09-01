import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello() { return { message: 'Hello from NestJS + Prisma' }; }

  async getUsers() {
    return this.prisma.user.findMany({ select: { id:true, email:true, name:true, createdAt:true }, orderBy: { id: 'asc' } });
  }
}
