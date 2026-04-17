import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateAccountDto } from './dto/updateAcc.dto';
import { ApiBody } from '@nestjs/swagger';

@ApiTags('Account')
@Controller('account')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  create(@Req() req) {
    return this.accountService.create(req.user.id);
  }

  @Get()
  findAll(@Req() req) {
    return this.accountService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.accountService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateAccountDto })
  update(@Req() req, @Param('id') id: string, @Body() body: UpdateAccountDto) {
    return this.accountService.update(id, req.user.id, body);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.accountService.remove(id, req.user.id);
  }
}
