import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context); // LocalStrategy의 validate 함수로 들어감
    const request = context.switchToHttp().getRequest();
    await super.logIn(request); // LocalSerializer의 serializeUser 함수로 들어감
    return result as boolean;
  }
}
