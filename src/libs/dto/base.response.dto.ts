import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({ example: '1970-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '1970-01-01T00:00:00.000Z' })
  updatedAt: string;
}
