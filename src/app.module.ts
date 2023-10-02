import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StudiesModule } from './studies/studies.module';
import { CategoriesModule } from './categories/categories.module';
import { TechStacksModule } from './tech-stacks/tech-stacks.module';

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
    DbModule,
    UsersModule,
    AuthModule,
    StudiesModule,
    CategoriesModule,
    TechStacksModule,
  ],
})
export class AppModule {}
