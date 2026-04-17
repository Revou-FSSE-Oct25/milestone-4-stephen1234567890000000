import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@ApiTags('Transaction')
@ApiBearerAuth()
@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private service: TransactionService) {}

  @Post('deposit')
  @ApiBody({ type: DepositDto })
  deposit(@Req() req, @Body() dto: DepositDto) {
    return this.service.deposit(req.user.id, dto);
  }

  @Post('withdraw')
  @ApiBody({ type: WithdrawDto })
  withdraw(@Req() req, @Body() dto: WithdrawDto) {
    return this.service.withdraw(req.user.id, dto);
  }

  @Post('transfer')
  @ApiBody({ type: TransferDto })
  transfer(@Req() req, @Body() dto: TransferDto) {
    return this.service.transfer(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.service.findOne(req.user.id, id);
  }
}
