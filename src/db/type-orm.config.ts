import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({ path: '.env.local' });
config({ path: '.env' });
const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.get('DB_PORT') || 3306,
  database: configService.get('DB_NAME'),
  username: configService.getOrThrow('DB_USER'),
  password: configService.getOrThrow('DB_PW'),
  synchronize: false,
  logging: false,
  migrations: ['migrations/**'],
  entities: ['src/*/entities/*.entity.ts'],
});
