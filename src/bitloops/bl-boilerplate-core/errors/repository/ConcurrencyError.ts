import { RepoError } from '@src/bitloops/bl-boilerplate-core/application/RepoError';

export class ConcurrencyError extends RepoError {
  static errorId = '5d2c22ee-86d4-4d20-8c87-3761be2eba0c';

  constructor(id: string) {
    super(
      `Object with id: ${id} had concurrency error`,
      ConcurrencyError.errorId,
    );
  }
}
