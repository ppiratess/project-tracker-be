import { Injectable } from '@nestjs/common';

import { UserRole } from 'src/enums/user-role.enums';

@Injectable()
export class RbacService {
  canManageRole(actorRole: UserRole, targetRole: UserRole): boolean {
    if (actorRole === UserRole.OWNER || actorRole === UserRole.MANAGER) {
      return true;
    }

    if (actorRole === UserRole.QA) {
      return [
        UserRole.QA,
        UserRole.DEVELOPER,
        UserRole.DESIGNER,
        UserRole.GUEST,
      ].includes(targetRole);
    }

    return false;
  }

  canAssignRole(actorRole: UserRole, targetRole: UserRole): boolean {
    return this.canManageRole(actorRole, targetRole);
  }
}
