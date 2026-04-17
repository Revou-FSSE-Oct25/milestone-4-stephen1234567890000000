import { IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty()
  @IsString()
  accountId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
