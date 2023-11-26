import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DbModule } from './db/db.module';
import { UsersModule } from './users';
import { StudiesModule } from './studies';
import { CategoriesModule } from './categories';
import { TechStacksModule } from './tech-stacks';
import { FilesModule } from './files';
import { MongoModule } from './mongo/mongo.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { ChatModule } from './chat/chat.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { EmailModule } from './email';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        // '.env.local',
        '.env.dev',
        // '.env',
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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
