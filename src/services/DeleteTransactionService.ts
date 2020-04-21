import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { affected } = await transactionsRepository.delete({ id });

    if (affected === 0) {
      throw new AppError('No transaction found for this search');
    }
  }
}

export default DeleteTransactionService;
