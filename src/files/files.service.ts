import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import {
  Injectable,
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@Injectable()
export class FilesService {
  private readonly s3Client: S3Client;

  constructor(private readonly config: ConfigService) {
    this.s3Client = new S3Client({
      region: this.config.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('파일이 존재하지 않습니다.');
    return {
      statusCode: HttpStatus.CREATED,
      url: await this.uploadFileToS3ResUrl(file),
    };
  }

  async uploadFiles(files: Express.Multer.File[]) {
    if (!files) throw new BadRequestException('파일이 존재하지 않습니다.');
    return {
      status: HttpStatus.CREATED,
      urls: await Promise.all(
        files.map((file) => this.uploadFileToS3ResUrl(file)),
      ),
    };
  }

  private async uploadFileToS3ResUrl(file: Express.Multer.File) {
    const { originalname, buffer } = file;
    const ext = path.extname(originalname);
    const basename = path.basename(originalname, ext);
    const newFileName = `${basename}_${Date.now()}${ext}`;
    const isUploadSuccess = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: newFileName,
        Body: buffer,
      }),
    );
    if (!isUploadSuccess)
      throw new InternalServerErrorException('S3 파일업로드에 실패했습니다.');
    return `${this.config.get('AWS_S3_BUCKET_URL')}/${newFileName}`;
  }

  async deleteS3File(imageUrl: string) {
    const { bucket, key } = this.parseImageUrl(imageUrl);
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }

  private parseImageUrl(imageUrl: string) {
    const regex = /^https:\/\/([^/]+)\/(.+)$/;
    const match = imageUrl.match(regex);
    if (!match) throw new Error('잘못된 이미지 URL 주소입니다.');
    return {
      bucket: match[1].split('.s3.ap-northeast-2.amazonaws.com')[0],
      key: match[2],
    };
  }
}
