import { prisma } from './database';

class CategoryService {
  async findAll() {
    return prisma.category.findMany();
  }

  async findById(id: number) {
    return prisma.category.findUnique({
      where: { id: id },
    });
  }

  async create(data: any) {
    return prisma.category.create({
      data,
    });
  }

  async update(id: number, data: any) {
    return prisma.category.update({
      where: { id: id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.category.delete({
      where: { id: id },
    });
  }
}

export default new CategoryService();
