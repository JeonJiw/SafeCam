import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body()
    body: {
      username: string;
      email: string;
      password: string;
      phone: string;
    },
  ) {
    return this.usersService.createUser(
      body.username,
      body.email,
      body.password,
      body.phone,
    );
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}
