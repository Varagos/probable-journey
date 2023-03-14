import { Domain } from '@bitloops/bl-boilerplate-core';
import { TodoEntity } from '../TodoEntity';

export class TodoAddedDomainEvent extends Domain.Event<TodoEntity> {
  public static readonly eventName = TodoAddedDomainEvent.name;
  public static readonly fromContextId = 'Todo';

  constructor(public readonly todo: TodoEntity, uuid?: string) {
    const metadata = {
      fromContextId: TodoAddedDomainEvent.fromContextId,
      id: uuid,
    };
    super(TodoAddedDomainEvent.getEventTopic(), todo, metadata, todo.id);
  }

  static getEventTopic() {
    return TodoAddedDomainEvent.eventName;
  }
}
