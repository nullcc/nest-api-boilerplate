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

  const stdoutStream = pretty({
    sync: true,
    colorize: true,
    hideObject: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
    destination: 1,
  });
  streams.push({ level: 'info', stream: stdoutStream });

  const stderrStream = pretty({
    sync: true,
    colorize: true,
    hideObject: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
    destination: 2,
  });
  streams.push({ level: 'error', stream: stderrStream });

  const logFileStream = pretty({
    sync: true,
    colorize: false,
    hideObject: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
    destination: config.get<string>('LOG_FILE', 'logs/app.stdout.log'),
    mkdir: true,
  });
  streams.push({ level: 'info', stream: logFileStream });

  const errLogFileStream = pretty({
    sync: true,
    colorize: false,
    hideObject: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
    destination: config.get<string>('ERR_LOG_FILE', 'logs/app.stderr.log'),
    mkdir: true,
  });
  streams.push({ level: 'error', stream: errLogFileStream });

  if (
    config.get<string>('APP_ENV') === 'production' ||
    config.get<string>('ELASTICSEARCH_INDEX_PATTERN') ||
    config.get<string>('ELASTICSEARCH')
  ) {
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
      },
      multistream(streams, opts),
    ],
  };
};
