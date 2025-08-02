import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Query } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { HashUtil } from 'src/utils/hash.utils';
import { User } from 'src/database/core/user.entity';
import { createResponse } from 'src/utils/base-response.util';
import { TPromiseBaseResponse } from 'src/common/schema/types';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(
    @Query() query: PaginationQueryDto,
  ): TPromiseBaseResponse<UserResponseDto[] | null> {
    const { page = 1, perPage = 10 } = query;
    const skip = (page - 1) * perPage;

    const users = await this.userRepository.find({
      skip,
      take: perPage,
    });

    return createResponse(
      200,
      'Users retrieved successfully',
      users.map((user) => instanceToPlain(user) as UserResponseDto),
    );
  }

  async findById(id: string): TPromiseBaseResponse<UserResponseDto | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return createResponse(404, 'User not found');

    return createResponse(
      200,
      'Users retrieved successfully',
      instanceToPlain(user) as UserResponseDto,
    );
  }

  async register(
    createUserDto: CreateUserDto,
    file?: Express.Multer.File,
  ): TPromiseBaseResponse<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      return createResponse(200, `User with ${email} already exists`);
    }

    const hashedPassword = await HashUtil.hashPassword(password);
    let avatarUrl: string | undefined;

    if (file) {
      try {
        const uploadedImage = await this.cloudinaryService.uploadFile(file);
        avatarUrl = uploadedImage;
      } catch {
        return createResponse(500, 'Failed to upload avatar image');
      }
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    try {
      const savedUser = await this.userRepository.save(newUser);
      return createResponse(201, 'User registered successfully', savedUser);
    } catch {
      return createResponse(500, 'Error saving user to the database');
    }
  }

  async delete(id: string): TPromiseBaseResponse<void> {
    await this.userRepository.delete(id);

    return createResponse(200, 'User deleted successfully');
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return null;

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
    file?: Express.Multer.File,
  ): TPromiseBaseResponse<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return createResponse(404, 'User not found');
    }

    if (file) {
      try {
        const uploadedImage = await this.cloudinaryService.uploadFile(file);
        user.avatar = uploadedImage;
      } catch {
        return createResponse(500, 'Failed to upload avatar image');
      }
    }

    // Apply updates to the original user object
    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);

    return createResponse(
      200,
      'User updated successfully',
      instanceToPlain(updatedUser) as UserResponseDto,
    );
  }
}
