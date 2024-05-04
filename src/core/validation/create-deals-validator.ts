import {PrismaDatabaseClientFactory} from '../database/prisma-database-client-factory';
import {PrismaClient} from '@prisma/client';
import {UserTypeEnum} from '../enums/user-type-enum';
import {FastifyReply, FastifyRequest} from 'fastify';

export class CreateDealsValidator {
  private prismaClient: PrismaClient;

  constructor(prismaClient = PrismaDatabaseClientFactory.get().resolve()) {
    this.prismaClient = prismaClient;
  }

  public async validate(
    request: FastifyRequest & { user_id: number },
    reply: FastifyReply
  ) {
    const user = await this.prismaClient.users.findFirst({
      where: {
        id: request.user_id
      },
      include: {
        users_type_relation: {
          include: {
            user_types: true
          }
        },
      },
    });
    if (
      !user.users_type_relation
        .map(userTypeRelation => userTypeRelation.user_types.type)
        .includes(UserTypeEnum.SELLER.toUpperCase())
    ) {
      reply.code(401);
      throw new Error('Only sellers allowed');
    }
    return;
  }
}