import type { Request } from 'express';
import { nanoid } from 'nanoid';
import type { Params } from 'nestjs-pino';
import pretty from 'pino-pretty';
import { multistream } from 'pino';
import type { ReqId } from 'pino-http';
import pinoElastic, {
  Options as PinoElasticsearchOptions,
} from 'pino-elasticsearch';

import { ConfigService } from '@nestjs/config';

const passUrl = new Set(['/health', '/graphql']);

const getStreams = (config: ConfigService) => {
  // https://getpino.io/#/docs/help?id=log-to-different-streams
  // level: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
  const streams = [];
  const consoleStream = pretty({
    sync: true,
    colorize: true,
    hideObject: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
    // ignore: 'pid,hostname',
    destination: config.get<string>('LOG_FILE') || 1, // 1 is stdout
    mkdir: true,
  });
  streams.push({ level: 'info', stream: consoleStream });
  if (config.get<string>('APP_ENV') === 'production') {
    const elasticStream = pinoElastic({
      index: config.get<string>('ELASTICSEARCH_INDEX_PATTERN'),
      node: config.get<string>('ELASTICSEARCH'),
      esVersion: 7,
      flushBytes: 1000,
    } as PinoElasticsearchOptions);
    streams.push({ level: 'info', stream: elasticStream });
  }
  return streams;
};

export const getLoggerOptions = (config: ConfigService): Params => {
  const streams = getStreams(config);
  const opts = {
    dedupe: true,
  };
  return {
    pinoHttp: [
      {
        // https://getpino.io/#/docs/api?id=timestamp-boolean-function
        // Change time value in production log.
        // timestamp: stdTimeFunctions.isoTime,
        level: 'trace',
        quietReqLogger: true,
        genReqId: (req): ReqId => (<Request>req).header('X-Request-Id') ?? nanoid(),
        autoLogging: {
          ignore: (req) => passUrl.has((<Request>req).originalUrl),
        },
        customProps: (req) => (<Request>req).customProps,
      },
      multistream(streams, opts),
    ],
  };
};
