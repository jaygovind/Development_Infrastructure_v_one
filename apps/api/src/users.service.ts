import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  list() {
    return this.prisma.user.findMany({ orderBy: { id: 'asc' } });
  }

  // optional helper if kabhi need ho
  create(data: { email: string; passwordHash: string; name?: string | null }) {
    return this.prisma.user.create({ data });
  }
}
