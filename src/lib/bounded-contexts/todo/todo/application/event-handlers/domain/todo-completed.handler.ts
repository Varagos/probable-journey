import { Infra, Application } from '@bitloops/bl-boilerplate-core';
import { Inject } from '@nestjs/common';
import { TodoCompletedDomainEvent } from '../../../domain/events/todo-completed.event';
import { TodoCompletedIntegrationEvent } from '../../../contracts/integration-events/todo-completed.integration-event';
import { StreamingIntegrationEventBusToken } from '../../../constants';

export class TodoCompletedDomainToIntegrationEventHandler
  implements Application.IHandle
{
  constructor(
    @Inject(StreamingIntegrationEventBusToken)
    private integrationEventBus: Infra.EventBus.IEventBus,
  ) {}
  get event() {
    return TodoCompletedDomainEvent;
  }

  get boundedContext(): string {
    return 'Todo';
  }

  public async handle(event: TodoCompletedDomainEvent): Promise<void> {
    const events = TodoCompletedIntegrationEvent.create(event);

    await this.integrationEventBus.publish(events);

    console.log(
      `[TodoCompletedDomainEventHandler]: Successfully published TodoCompletedIntegrationEvent`,
    );
  }
}
