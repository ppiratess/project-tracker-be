import { In, Repository } from 'typeorm';

import { User } from 'src/database/core/user.entity';

async function validateUserIds(
  assignedUserIds: string[],
  userRepository: Repository<User>,
): Promise<string[]> {
  const users = await userRepository.find({
    where: { id: In(assignedUserIds) },
    select: ['id'],
  });

  const foundUserIds = users.map((user) => user.id);

  const missingUserIds = assignedUserIds.filter(
    (id) => !foundUserIds.includes(id),
  );

  return missingUserIds;
}

export { validateUserIds };
