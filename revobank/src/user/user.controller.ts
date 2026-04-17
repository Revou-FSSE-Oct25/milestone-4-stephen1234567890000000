import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.authGuard';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.prisma.user.findUnique({
      where: { id: req.user.id },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req, @Body() body) {
    return this.prisma.user.update({
      where: { id: req.user.sub },
      data: {
        name: body,
      },
    });
  }
}
