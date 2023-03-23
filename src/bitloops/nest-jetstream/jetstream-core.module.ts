import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConnectionOptions } from 'nats';
import { NestjsJetstream } from './nestjs-jetstream.class';
import { NatsPubSubCommandBus } from './buses/nats-pubsub-command-bus';
import { NatsPubSubQueryBus } from './buses/nats-pubsub-query-bus';
import { NatsStreamingDomainEventBus } from './buses/nats-streaming-domain-event-bus';
import { JetstreamModuleFeatureConfig } from './interfaces/module-feature-input.interface';
import { BUSES_TOKENS } from './buses/constants';
import {
  NatsStreamingIntegrationEventBus,
  NatsStreamingCommandBus,
} from './buses';
import { Application } from '../bl-boilerplate-core';
import { SubscriptionsService } from './jetstream.subscriptions.service';
import { HANDLERS_TOKENS, ProvidersConstants } from './jetstream.constants';

const pubSubCommandBus = {
  provide: BUSES_TOKENS.PUBSUB_COMMAND_BUS,
  useClass: NatsPubSubCommandBus,
};
const pubSubQueryBus = {
  provide: BUSES_TOKENS.PUBSUB_QUERY_BYS,
  useClass: NatsPubSubQueryBus,
};

const streamingDomainEventBus = {
  provide: BUSES_TOKENS.STREAMING_DOMAIN_EVENT_BUS,
  useClass: NatsStreamingDomainEventBus,
};

const streamingIntegrationEventBus = {
  provide: BUSES_TOKENS.STREAMING_INTEGRATION_EVENT_BUS,
  useClass: NatsStreamingIntegrationEventBus,
};

const streamingCommandBus = {
  provide: BUSES_TOKENS.STREAMING_COMMAND_BUS,
  useClass: NatsStreamingCommandBus,
};

@Global()
@Module({})
export class JetstreamCoreModule {
  static forRoot(connectionOptions: ConnectionOptions): DynamicModule {
    const jetstreamProviders = {
      provide: ProvidersConstants.JETSTREAM_PROVIDER,
      useFactory: (): any => {
        return new NestjsJetstream().connect(connectionOptions);
      },
    };

    return {
      module: JetstreamCoreModule,
      providers: [
        jetstreamProviders,
        pubSubCommandBus,
        pubSubQueryBus,
        streamingDomainEventBus,
        streamingIntegrationEventBus,
        streamingCommandBus,
      ],
      exports: [
        jetstreamProviders,
        pubSubCommandBus,
        pubSubQueryBus,
        streamingDomainEventBus,
        streamingIntegrationEventBus,
        streamingCommandBus,
      ],
    };
  }

  static forFeature(config: JetstreamModuleFeatureConfig): DynamicModule {
    if (config === undefined || config === null) {
      throw new Error('Config missing');
    }
    const { moduleOfHandlers } = config;
    let {
      pubSubCommandHandlers,
      pubSubQueryHandlers,
      streamingDomainEventHandlers,
      streamingIntegrationEventHandlers,
      streamingCommandHandlers,
    } = config;
    if (!pubSubCommandHandlers) pubSubCommandHandlers = [];
    if (!pubSubQueryHandlers) pubSubQueryHandlers = [];
    if (!streamingDomainEventHandlers) streamingDomainEventHandlers = [];
    if (!streamingIntegrationEventHandlers)
      streamingIntegrationEventHandlers = [];
    if (!streamingCommandHandlers) streamingCommandHandlers = [];

    const handlers: Provider<any>[] = [
      {
        provide: HANDLERS_TOKENS.PUBSUB_COMMAND_HANDLERS,
        useFactory: (...commandHandlers) => {
          return commandHandlers;
        },
        inject: [...pubSubCommandHandlers],
      },
      {
        provide: HANDLERS_TOKENS.PUBSUB_QUERY_HANDLERS,
        useFactory: (...queryHandlers) => {
          return queryHandlers;
        },
        inject: [...pubSubQueryHandlers],
      },
      {
        provide: HANDLERS_TOKENS.STREAMING_DOMAIN_EVENT_HANDLERS,
        useFactory: (...domainEventHandlers: Application.IHandle[]) => {
          return domainEventHandlers;
        },
        inject: [...streamingDomainEventHandlers],
      },

      {
        provide: HANDLERS_TOKENS.STREAMING_INTEGRATION_EVENT_HANDLERS,
        useFactory: (...integrationEventHandlers: Application.IHandle[]) => {
          return integrationEventHandlers;
        },
        inject: [...streamingIntegrationEventHandlers],
      },

      {
        provide: HANDLERS_TOKENS.STREAMING_COMMAND_HANDLERS,
        useFactory: (
          ...commandHandlers: Application.ICommandHandler<any, any>[]
        ) => {
          return commandHandlers;
        },
        inject: [...streamingCommandHandlers],
      },
    ];

    return {
      imports: [moduleOfHandlers],
      module: JetstreamCoreModule,
      providers: [
        ...handlers,
        pubSubCommandBus,
        pubSubQueryBus,
        streamingDomainEventBus,
        streamingCommandBus,
        SubscriptionsService,
      ],
      exports: [
        pubSubCommandBus,
        pubSubQueryBus,
        streamingDomainEventBus,
        streamingCommandBus,
      ],
    };
  }
}
