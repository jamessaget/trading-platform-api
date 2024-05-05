import { UserTypeEnum } from '../src/core/enums/user-type-enum'
import { PrismaDatabaseClientFactory } from '../src/core/database/prisma-database-client-factory'

const prismaClient = PrismaDatabaseClientFactory.get().resolve();

(async () => {
    await prismaClient.user_types.createMany({
        data: [
            {
                type: UserTypeEnum.BUYER
            },
            {
                type: UserTypeEnum.SELLER
            }
        ]
    })
})().then(async () => {
    await prismaClient.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismaClient.$disconnect()
    process.exit(1)
  })