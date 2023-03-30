import { Domain } from '@bitloops/bl-boilerplate-core';
import { asyncLocalStorage } from '@bitloops/bl-boilerplate-core';
import { TodoEntity } from '../TodoEntity';

export class TodoAddedDomainEvent implements Domain.IDomainEvent<TodoEntity> {
  public aggregateId: string;
  public metadata: Domain.TDomainEventMetadata;

  constructor(public readonly data: TodoEntity) {
    const uuid = new Domain.UUIDv4();
    this.metadata = {
      boundedContextId: 'Todo',
      createdAtTimestamp: Date.now(),
      messageId: uuid.toString(),
      context: asyncLocalStorage.getStore()?.get('context'),
      correlationId: asyncLocalStorage.getStore()?.get('correlationId'),
    };
    this.aggregateId = data.id.toString();
  }
}
