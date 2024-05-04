import {PrismaClient} from '@prisma/client';
import {PrismaDatabaseClientFactory} from '../../../core/database/prisma-database-client-factory';
import bcrypt from 'bcrypt';
import {createUserHttpSchema} from '../../../core/schema/create-user-http-schema';
import {FastifyRequest, FastifyReply} from 'fastify';
import {generalConfig} from '../../../config/general';

export class CreateUserHandler {
  private prismaClient: PrismaClient;
    
  constructor(prismaClient = PrismaDatabaseClientFactory.get().resolve()
  ) {
    this.prismaClient = prismaClient;
  }

  public async handle(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const data = createUserHttpSchema.parse(request.body);
    await this.prismaClient.users.create({
      data: {
        name: data.name as string,
        email: data.email as string,
        password: await new Promise((resolve, reject) => {
          bcrypt.hash(data.password, generalConfig.passwordSalt, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
          });
        }),
        users_type_relation: {
          create: [
            ...(await this.prismaClient.user_types.findMany({
              where: {
                type: {
                  in: data.user_type.map(userType => userType.toUpperCase())
                }
              }
            })).map(userType => ({
              type_id: userType.id
            }))
          ]
        }
      }
    });
    return reply.code(201).send();
  }
}