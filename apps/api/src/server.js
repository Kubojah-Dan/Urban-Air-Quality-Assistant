import { createContainer } from './composition/createContainer.js';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './observability/logger.js';

const container = createContainer();
const app = createApp(container);

const server = app.listen(env.PORT, () => {
  logger.info(`DayShift API listening on http://localhost:${env.PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
