import { IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty()
  @IsString()
  fromAccountId: string;

  @ApiProperty()
  @IsString()
  toAccountId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}
