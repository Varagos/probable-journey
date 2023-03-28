import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';

type AsyncLocalStorageKeys = 'correlationId' | 'userContext' | 'context';

export type AsyncLocalStorageStore = Map<AsyncLocalStorageKeys, any>;

export interface IAsyncLocalStorageService {
  asyncLocalStorage: AsyncLocalStorage<AsyncLocalStorageStore>;
  getAsyncLocalStore(): AsyncLocalStorageStore;
  getCorrelationId(): string;
  setCorrelationId(correlationId: string): void;
}

/**
 *  There is the async local storage.
 *  On each run it contains the store, which is a map of keys and values.
 *
 */
@Injectable()
export class AsyncLocalStorageService implements IAsyncLocalStorageService {
  private static _asyncLocalStorage =
    new AsyncLocalStorage<AsyncLocalStorageStore>();
  constructor() {
    console.log('AsyncLocalStorageService constructor');
  }

  get asyncLocalStorage() {
    return AsyncLocalStorageService._asyncLocalStorage;
  }

  static get asyncLocalStorage() {
    return AsyncLocalStorageService._asyncLocalStorage;
  }

  public getAsyncLocalStore(): AsyncLocalStorageStore {
    const store = this.asyncLocalStorage.getStore();
    if (!store) {
      throw new Error('No async local storage store found');
    }
    return store;
  }

  public getCorrelationId(): string {
    const store = this.getAsyncLocalStore();
    const correlationId = store.get('correlationId');
    if (!correlationId) {
      throw new Error('No correlation id found');
    }
    return correlationId;
  }

  public setCorrelationId(correlationId: string) {
    const store = this.getAsyncLocalStore();
    store.set('correlationId', correlationId);
  }

  public returnEmptyStore(): AsyncLocalStorageStore {
    return new Map();
  }
}
