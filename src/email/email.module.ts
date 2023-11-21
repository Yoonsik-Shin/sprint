import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UsersModule } from '../users';

@Global()
@Module({
  imports: [UsersModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
