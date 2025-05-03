import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/core/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/users.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(@Query() query: PaginationQueryDto): Promise<User[]> {
    const { page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    const data = this.userRepository.find({
      skip,
      take: limit,
    });

    return data;
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: id.toString() });
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
