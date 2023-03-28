import {
  Application,
  Either,
  ok,
  fail,
} from '@src/bitloops/bl-boilerplate-core';
import { UserEmailReadRepoPort } from '@src/lib/bounded-contexts/marketing/marketing/ports/user-email-read.repo-port';
import { UserReadModel } from '@src/lib/bounded-contexts/marketing/marketing/domain/read-models/user-email.read-model';
import {
  UPDATE_USER_REPO_ERROR_CASE,
  UPDATE_USER_SUCCESS_CASE,
} from './update-user-email.mock';

export class MockUpdateUserReadRepo {
  public readonly mockSaveMethod: jest.Mock;
  private mockUserReadRepo: UserEmailReadRepoPort;

  constructor() {
    this.mockSaveMethod = this.getMockSaveMethod();
    this.mockUserReadRepo = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getUserEmail: jest.fn(),
      create: jest.fn(),
      save: this.mockSaveMethod,
    };
  }

  getMockMarketingReadRepo(): UserEmailReadRepoPort {
    return this.mockUserReadRepo;
  }

  private getMockSaveMethod(): jest.Mock {
    return jest.fn(
      (
        userIdEmail: UserReadModel,
      ): Promise<Either<void, Application.Repo.Errors.Unexpected>> => {
        if (userIdEmail.userId === UPDATE_USER_SUCCESS_CASE.userId) {
          return Promise.resolve(ok());
        }
        if (userIdEmail.userId === UPDATE_USER_REPO_ERROR_CASE.userId) {
          return Promise.resolve(
            fail(new Application.Repo.Errors.Unexpected('Unexpected error')),
          );
        }
        return Promise.resolve(ok());
      },
    );
  }
}
