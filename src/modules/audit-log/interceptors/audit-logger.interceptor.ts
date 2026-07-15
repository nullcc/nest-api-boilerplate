import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getClientIp } from 'request-ip';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { AuditLog } from '@modules/audit-log/entities/audit-log.entity';
import { AUDIT_LOG_DATA } from '@modules/audit-log/decorators/audit-log.decorator';

const REDACTED = '[REDACTED]';
const SENSITIVE_KEYS = new Set([
  'authorization',
  'cookie',
  'password',
  'token',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'secret',
  'appSecret',
  'app_secret',
]);

export const redactSensitiveData = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item));
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.entries(value as Record<string, unknown>).reduce(
    (acc, [key, item]) => {
      acc[key] =
        SENSITIVE_KEYS.has(key) || SENSITIVE_KEYS.has(key.toLowerCase())
          ? REDACTED
          : redactSensitiveData(item);
      return acc;
    },
    {} as Record<string, unknown>,
  );
};

@Injectable()
export class AuditLoggerInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly reflector: Reflector,
    private logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditLog = this.reflector.get<string>(
      AUDIT_LOG_DATA,
      context.getHandler(),
    );
    return next.handle().pipe(
      tap((res) =>
        (async () => {
          if (!auditLog) {
            return;
          }
          const request = context.switchToHttp().getRequest();
          const userId = request['user'].id;
          if (!userId) {
            return;
          }
          const ip = getClientIp(request);
          const data = {
            userId,
            ip,
            description: auditLog,
            parameters: {
              body: redactSensitiveData(request.body),
              params: redactSensitiveData(request.params),
              res: redactSensitiveData(res),
            } as Record<string, unknown>,
          } as QueryDeepPartialEntity<AuditLog>;
          await this.auditLogRepository.insert(data);
          return;
        })()
          .then(() => {})
          .catch((err) => {
            this.logger.error(`Unable to save audit log, error: ${err}`);
          }),
      ),
    );
  }
}
