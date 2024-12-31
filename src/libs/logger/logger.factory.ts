import { ConfigService } from '@nestjs/config';
import pino from 'pino';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

type LogLevel = pino.Level;

export class LoggerFactory {
  constructor(private readonly config: ConfigService) {}

  create() {
    return {
      pinoHttp: {
        level: this.getLogLevel(),
        genReqId: () => uuidv4(),
        customProps: (req) => {
          return {
            correlation_id: req.id,
            request_method: req.method,
            request_url: req.url,
          };
        },
        transport: this.getTargets(),
      },
    };
  }

  getTargets() {
    const targets: any[] = [
      {
        target: 'pino-pretty',
        level: this.getLogLevel(),
        options: {
          colorize: true,
          hideObject: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          destination: this.getLogDestination(),
          mkdir: true,
        },
      },
    ];
    const esEnabled = this.getLogEsHost() && this.getLogEsIndexPattern();
    if (esEnabled) {
      targets.push({
        target: 'pino-elasticsearch',
        level: this.getEsLogLevel(),
        options: {
          index: this.getLogEsIndexPattern(),
          node: this.getLogEsHost(),
          esVersion: 7,
          flushBytes: 1000,
        },
      });
    }
    return { targets };
  }

  /**
   * debug < log < warn < error < fatal
   * @private
   */
  private getLogLevel(): LogLevel {
    return this.config.get<string>('LOG_LEVEL', 'info') as LogLevel;
  }

  private getLogDestination(): string | number {
    return this.config.get<string>('LOG_FILE') || 1; // 1 is stdout
  }

  private getLogEsHost(): string {
    return this.config.get<string>('LOG_ES_HOST');
  }

  private getLogEsIndexPattern(): string {
    if (!this.config.get<string>('LOG_ES_INDEX_PATTERN')) {
      return null;
    }
    const date = moment(new Date()).format('YYYY.MM.DD');
    const indexPattern = this.config.get<string>('LOG_ES_INDEX_PATTERN');
    return `${indexPattern}-${date}`;
  }

  /**
   * debug < log < warn < error < fatal
   * @private
   */
  private getEsLogLevel(): LogLevel {
    return this.config.get<string>('LOG_ES_LOG_LEVEL', 'info') as LogLevel;
  }
}
