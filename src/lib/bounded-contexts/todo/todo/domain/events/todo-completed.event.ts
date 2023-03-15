import { Domain } from '@bitloops/bl-boilerplate-core';
import { TodoEntity } from '../TodoEntity';

export class TodoCompletedDomainEvent extends Domain.Event<TodoEntity> {
  public static readonly eventName = TodoCompletedDomainEvent.name;
  public static readonly fromContextId = 'Todo';

  constructor(
    public readonly todo: TodoEntity,
    // @CHANGED HERE
    ack?: () => Promise<void>,
    uuid?: string,
  ) {
    const metadata = {
      fromContextId: TodoCompletedDomainEvent.fromContextId,
      // @CHANGED HERE
      ack,
      id: uuid,
    };
    super(TodoCompletedDomainEvent.getEventTopic(), todo, metadata, todo.id);
  }

  static getEventTopic() {
    return TodoCompletedDomainEvent.eventName;
  }
}
