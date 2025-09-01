import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  client: Client;
  bucket: string;

  constructor() {
    this.client = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'minio',
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
    this.bucket = process.env.MINIO_BUCKET || 'uploads';
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket).catch(() => false);
    if (!exists) {
      await this.client.makeBucket(this.bucket, 'us-east-1');
    }
  }

  async putObject(
    name: string,
    data: Buffer | string,
    meta?: Record<string, string>
  ) {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    // MinIO Node SDK signature: putObject(bucket, object, data, size, meta?)
    return this.client.putObject(this.bucket, name, buf, buf.length, meta);
  }

  async getPresignedUrl(name: string, expirySeconds = 3600) {
    return this.client.presignedGetObject(this.bucket, name, expirySeconds);
  }
}
