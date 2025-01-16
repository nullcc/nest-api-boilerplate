import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '@libs/dto/base.response.dto';

export class AuditLogResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: 'Audit log id',
  })
  id: number;

  @ApiProperty({
    description: 'User id',
  })
  userId: number;

  @ApiProperty({
    description: 'User ip',
  })
  ip: string;

  @ApiProperty({
    description: 'Audit log description',
  })
  description: string;

  @ApiProperty({
    description: 'Audit log parameters',
  })
  parameters: any;
}
