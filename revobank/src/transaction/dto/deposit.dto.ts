import { IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DepositDto {
  @ApiProperty()
  @IsString()
  accountId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;
}
