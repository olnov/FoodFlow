import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.usersService.create(userDto);
  }

  @Post('/find-by-email')
  async findByEmail(@Body('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  // Quick accessibility test
  @Get('ping')
  ping() {
    return { status: 'auth-service is alive' };
  }

  // TBD: I'm not gonna need it for the prototype

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
