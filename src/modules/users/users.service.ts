import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Query } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { HashUtil } from 'src/utils/hash.utils';
import { User } from 'src/database/core/user.entity';
import { createResponse } from 'src/utils/base-response.util';
import { TPromiseBaseResponse } from 'src/common/schema/types';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<UserResponseDto[] | null> {
    const { page = 1, perPage = 10 } = query;
    const skip = (page - 1) * perPage;

    const users = await this.userRepository.find({
      skip,
      take: perPage,
    });

    return users.map((user) => instanceToPlain(user) as UserResponseDto);
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;

    return instanceToPlain(user) as UserResponseDto;
  }

  async register(createUserDto: CreateUserDto): TPromiseBaseResponse<User> {
    const { email, password } = createUserDto;

    const user = await this.findByEmail(email);

    if (user) {
      return createResponse(200, `User with ${email} already exits`);
    }

    const hashedPassword = await HashUtil.hashPassword(password);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return createResponse(201, 'User registered successfully', savedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return null;

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return null;
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    return instanceToPlain(updatedUser) as UserResponseDto;
  }
}
