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
          const ip = getClientIp(request);
          const data: QueryDeepPartialEntity<AuditLog> = {
            userId,
            ip,
            description: auditLog,
            parameters: {
              body: request.body,
              params: request.params,
              res,
            },
          };
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
