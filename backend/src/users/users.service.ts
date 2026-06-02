import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findAll(query?: { name?: string; username?: string; email?: string; fromDate?: string; toDate?: string; page?: number; limit?: number; }) {
    const page = query?.page ? +query.page : 1;
    const limit = query?.limit ? +query.limit : 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (query?.name) {
      queryBuilder.andWhere('user.name LIKE :name', { name: `%${query.name}%` });
    }
    if (query?.username) {
      queryBuilder.andWhere('user.username LIKE :username', { username: `%${query.username}%` });
    }
    if (query?.email) {
      queryBuilder.andWhere('user.email LIKE :email', { email: `%${query.email}%` });
    }

    if (query?.fromDate) {
      // So sánh từ đầu ngày (00:00:00)
      queryBuilder.andWhere('user.createdAt >= :fromDate', { fromDate: `${query.fromDate} 00:00:00` });
    }
    if (query?.toDate) {
      // So sánh đến cuối ngày (23:59:59) để bao gồm toàn bộ ngày đã chọn
      queryBuilder.andWhere('user.createdAt <= :toDate', { toDate: `${query.toDate} 23:59:59` });
    }

    const [items, total] = await queryBuilder
      .orderBy('user.id', 'DESC')
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }
}
