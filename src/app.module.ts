import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StudiesModule } from './studies/studies.module';
import { CategoriesModule } from './categories/categories.module';
import { TechStacksModule } from './tech-stacks/tech-stacks.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { FilesModule } from './files/files.module';
import { MongoModule } from './mongo/mongo.module';
import { SocketModule } from './socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        // '.env.local',
        '.env.dev',
        // '.env'
      ],
      expandVariables: true,
    }),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        config: {
          host: config.getOrThrow('REDIS_HOST'),
          port: config.getOrThrow('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    MongoModule,
    DbModule,
    UsersModule,
    AuthModule,
    StudiesModule,
    CategoriesModule,
    TechStacksModule,
    EmailModule,
    FilesModule,
    SocketModule,
    ChatModule,
  ],
  providers: [],
})
export class AppModule {}
