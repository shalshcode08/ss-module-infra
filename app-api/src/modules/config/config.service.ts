import { prisma } from "../../db";

export const configService = {
  getConfig: async (userId: string) => {
    return prisma.userConfig.upsert({
      where: {
        userId: userId,
      },
      create: {
        userId,
      },
      update: {},
    });
  },
};
