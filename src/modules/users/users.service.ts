import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Query } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { HashUtil } from 'src/utils/hash.utils';
import { User } from 'src/database/core/user.entity';
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

  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await HashUtil.hashPassword(createUserDto.password);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
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
