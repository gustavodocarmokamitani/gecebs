import { prisma } from './database';

class PaymentService {
  async findAll() {
    return prisma.payment.findMany();
  }

  async findById(id) {
    return prisma.payment.findUnique({
      where: { id: Number(id) },
    });
  }

  async create(data) {
    return prisma.payment.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.payment.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id) {
    return prisma.payment.delete({
      where: { id: Number(id) },
    });
  }
}

export default new PaymentService();