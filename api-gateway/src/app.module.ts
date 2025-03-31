import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import * as process from 'node:process';

const services = [
  {
    prefix: '/inventory',
    target: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3011',
  },
  {
    prefix: '/catalog',
    target: process.env.CATALOG_SERVICE_URL || 'http://localhost:3012',
  },
  {
    prefix: '/auth',
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3013',
  },
];

// Реализация простого API GW на основе middleware http proxy
@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    services.forEach(({ prefix, target }) => {
      consumer
        .apply(
          createProxyMiddleware({
            target,
            changeOrigin: true,
            pathRewrite: { [`^${prefix}`]: '' },
            on: {
              proxyReq: fixRequestBody,
            },
          }),
        )
        .forRoutes({ path: `${prefix}/*path`, method: RequestMethod.ALL });
    });
  }
}
