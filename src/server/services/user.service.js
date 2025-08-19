import { prisma } from './database';

class UserService {
  async findAll() {
    return prisma.user.findMany();
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id: Number(id) },
    });
  }

  async create(data) {
    return prisma.user.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.user.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id) {
    return prisma.user.delete({
      where: { id: Number(id) },
    });
  }
}

export default new UserService();
