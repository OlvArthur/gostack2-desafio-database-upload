import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Insufficient Funds to perform this action');
    }
    const categoriesRepository = getRepository(Category);

    let existentCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!existentCategory) {
      existentCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(existentCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: existentCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
