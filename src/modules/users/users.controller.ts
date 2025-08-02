import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { User } from 'src/database/core/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { TPromiseBaseResponse } from 'src/common/schema/types';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): TPromiseBaseResponse<User> {
    return this.userService.register(createUserDto, file);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<UserResponseDto | null> {
    return this.userService.findById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    return this.userService.updateUser(id, updateUserDto);
  }
}
