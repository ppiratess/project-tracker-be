import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { UserDetailsFromToken } from 'src/common/schema/common.schema';

@Injectable()
export class JwtUtils {
  constructor(private readonly jwtService: JwtService) {}

  getUserFromRequest(request: Request): UserDetailsFromToken {
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new Error('No token found');
    }

    const decodedUserData: UserDetailsFromToken = this.jwtService.decode(token);

    return decodedUserData;
  }
}
