import {
  BadRequestException,
  type INestApplication,
  StandardSchemaValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { ApiErrorBody } from '@pawprint/contracts';

export const API_PREFIX = 'api';
export const DOCS_PATH = 'docs';

/** Applies HTTP configuration shared by `main.ts` and the end-to-end tests. */
export function configureApp(app: INestApplication): INestApplication {
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalPipes(
    new StandardSchemaValidationPipe({
      exceptionFactory: (issues) => {
        const body: ApiErrorBody = {
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed',
          issues: issues.map((issue) => ({
            path: (issue.path ?? [])
              .map((segment) => String(typeof segment === 'object' ? segment.key : segment))
              .join('.'),
            message: issue.message,
          })),
        };
        return new BadRequestException(body);
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Pawprint API')
    .setDescription(
      'Pet-adoption catalog reference API. All data is in memory and resets when the process restarts.',
    )
    .setVersion('1.0')
    .build();
  SwaggerModule.setup(DOCS_PATH, app, () => SwaggerModule.createDocument(app, config), {
    jsonDocumentUrl: `${DOCS_PATH}/openapi.json`,
  });

  return app;
}
