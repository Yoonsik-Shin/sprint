import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const SOCIAL_AUTH_GUARD = ['google', 'kakao', 'naver', 'github'].reduce(
  (prev, curr) => {
    return { ...prev, [curr]: new (class extends AuthGuard(curr) {})() };
  },
  {},
);

export class SocialAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { social } = request.params;
    const isValid = await SOCIAL_AUTH_GUARD[social].canActivate(context);
    await SOCIAL_AUTH_GUARD[social].logIn(request);
    return isValid;
  }
}
