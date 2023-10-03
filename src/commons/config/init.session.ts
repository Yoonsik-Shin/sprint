import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import * as passport from 'passport';
import * as session from 'express-session';

export function setUpSession(app: INestApplication): void {
  const config = app.get<ConfigService>(ConfigService);
  const host = config.getOrThrow('REDIS_HOST');
  const port = Number(config.getOrThrow('REDIS_PORT'));
  const client = new Redis({ host, port });
  const redisStore = new RedisStore({ client });

  app.use(
    session({
      secret: config.getOrThrow('SESSION_SECRET_KEY'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 30, //
        // sameSite: 'none',
        // secure: true,
      },
      store: redisStore,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
}
