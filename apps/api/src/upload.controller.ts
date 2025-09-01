import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Req, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt.guard';
import { MinioService } from './minio.service';
import { Request } from 'express';
import * as multer from 'multer';
const storage = multer.memoryStorage();

@Controller()
export class UploadController {
  constructor(private minio: MinioService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) throw new BadRequestException('No file uploaded');
    const user: any = (req as any).user || {};
    const userId = user.userId || 'anon';
    const objectName = `${userId}/${Date.now()}_${file.originalname}`;
   await this.minio.putObject(objectName, file.buffer, {
        'Content-Type': file.mimetype || 'application/octet-stream',
        'X-Uploaded-By': String(userId),
      });
    const url = await this.minio.getPresignedUrl(objectName);
    return { ok: true, objectName, presignedUrl: url };
  }
}
