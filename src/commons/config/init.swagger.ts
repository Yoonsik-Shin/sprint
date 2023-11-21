import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setUpSwagger(app: INestApplication): void {
  const config = app.get<ConfigService>(ConfigService);
  const title = config.getOrThrow('DOCS_TITLE');
  const description = config.getOrThrow('DOCS_DESCRIPTION');
  const version = config.getOrThrow('DOCS_VERSION');

  const docsConfig = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('docs', app, document);
}
