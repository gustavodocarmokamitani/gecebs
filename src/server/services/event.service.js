import { prisma } from './database';
import { Prisma } from '@prisma/client';

class EventService {
  async findAll() {
    return prisma.event.findMany();
  }

  async findById(id) {
    return prisma.event.findUnique({
      where: { id: Number(id) },
    });
  }

  async create(data: Prisma.EventCreateInput) {
    return prisma.event.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.event.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id) {
    return prisma.event.delete({
      where: { id: Number(id) },
    });
  }
}

export default new EventService();
