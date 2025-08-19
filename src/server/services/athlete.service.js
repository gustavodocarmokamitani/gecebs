import { prisma } from './database';

class AthleteService {
  async findAll() {
    return prisma.athlete.findMany();
  }

  async findById(id: number) {
    return prisma.athlete.findUnique({
      where: { id: id },
    });
  }

  async create(data: any) {
    return prisma.athlete.create({
      data,
    });
  }

  async update(id: number, data: any) {
    return prisma.athlete.update({
      where: { id: id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.athlete.delete({
      where: { id: id },
    });
  }
}

export default new AthleteService();