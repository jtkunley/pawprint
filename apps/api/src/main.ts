import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { API_PREFIX, configureApp, DOCS_PATH } from './configure-app.js';

const port = Number(process.env.PORT ?? 3000);
const demoResetEnabled = process.env.NODE_ENV !== 'production';

const app = await NestFactory.create(AppModule.register({ demoResetEnabled }));
configureApp(app);
app.enableShutdownHooks();
await app.listen(port);

const logger = new Logger('Pawprint');
logger.log(`API ready at http://localhost:${port}/${API_PREFIX}`);
logger.log(`Swagger UI at http://localhost:${port}/${DOCS_PATH}`);
logger.log(`Demo reset endpoint ${demoResetEnabled ? 'enabled' : 'disabled (production)'}`);
logger.warn('Data is stored in memory: all changes are lost when the API restarts.');
