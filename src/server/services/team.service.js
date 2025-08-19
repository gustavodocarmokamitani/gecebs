import { prisma } from './database';

class TeamService {
  async findAll() {
    return prisma.team.findMany();
  }

  async findById(id) {
    return prisma.team.findUnique({
      where: { id: Number(id) },
    });
  }

  async create(data) {
    return prisma.team.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.team.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id) {
    return prisma.team.delete({
      where: { id: Number(id) },
    });
  }
}

export default new TeamService();