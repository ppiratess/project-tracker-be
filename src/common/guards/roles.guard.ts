import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

import { JwtUtils } from 'src/utils/jwt.utils';
import { UserRole } from 'src/enums/user-role.enums';
import { ROLES_KEY } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtUtils: JwtUtils,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request: Request = context.switchToHttp().getRequest();

    try {
      const user = this.jwtUtils.getUserFromRequest(request);

      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new ForbiddenException('Access denied. Invalid credentials.');
    }
  }
}
