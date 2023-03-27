/* eslint-disable @typescript-eslint/no-namespace */
import 'reflect-metadata';
import { AppError } from './application/AppError';
import {
  CRUDReadRepoPort,
  CRUDRepoPort,
  CRUDWriteRepoPort,
} from './application/ICRUDRepoPort';
import { IMQ as IMQImport } from './application/mq/IMQ';
import { CommandHandler, UseCase, QueryHandler } from './application/UseCase';
import { AggregateRoot } from './domain/AggregateRoot';
import { applyRules as applyRulesImport } from './domain/applyRule';
import {
  IPubSubCommandBus as IPubSubCommandBusImport,
  IStreamCommandBus as IStreamCommandBusImport,
} from './domain/commands/ICommandBus';
import { DomainError } from './domain/DomainError';
import { Entity as EntityImport } from './domain/Entity';
import { IEventBus as IEventBusImport } from './domain/events/IEventBus';
import { IIntegrationEvent as IIntegrationEventImport } from './domain/events/IIntegrationEvent';
import { IRule as IRuleImport } from './domain/IRule';
import { IMessageBus as IMessageBusImport } from './domain/messages/IMessageBus';
import { ReadModel as ReadModelImport } from './domain/ReadModel';
import { UUIDv4 as UUIDv4Import } from './domain/UUIDv4';
import {
  ValueObject as ValueObjectImport,
  ValueObjectProps,
} from './domain/ValueObject';
import { Either, fail, ok } from './Either';
import {
  Command as CommandImport,
  CommandMetadata as CommandMetadataImport,
} from './domain/commands/Command';
import { TContext as TContextImport } from './domain/context';
import { IDomainEvent as IDomainEventImport } from './domain/events/IDomainEvent';
import { IEvent as IEventImport } from './domain/events/IEvent';
import {
  IQuery as IQueryImport,
  QueryMetadata as TQueryMetadataImport,
} from './domain/queries/IQuery';

import { IHandle as IHandleImport } from './application/IHandle';
import {
  ApplicationConfig as ApplicationConfigImport,
  CONTEXT_TYPES as CONTEXT_TYPES_IMPORT,
  MESSAGE_BUS as MESSAGE_BUS_IMPORT,
  TOPIC_PREFIXES as TOPIC_PREFIXES_IMPORT,
} from './config';
import { IQueryBus as IQueryBusImport } from './domain/queries/IQueryBus';
import { NotFoundError } from './errors/repository/NotFoundError';
import { ConcurrencyError } from './errors/repository/ConcurrencyError';
import {
  CurrencyVO as CurrencyVOImport,
  ErrorTypes as CurrencyVOErrorTypesImport,
} from './domain/standard-values';
import { IErrorEvent as IErrorEventImport } from './application/events/IErrorEvent';
import { ConflictError } from './errors/repository/ConflictError';
import { UnexpectedError } from './errors/repository/UnexpectedError';

namespace Domain {
  export class Error extends DomainError {}
  export class Aggregate<T> extends AggregateRoot<T> {}
  export class Entity<T> extends EntityImport<T> {}
  export class ValueObject<
    T extends ValueObjectProps,
  > extends ValueObjectImport<T> {}
  export class ReadModel<T> extends ReadModelImport<T> {}
  export class UUIDv4 extends UUIDv4Import {}
  export type IRule = IRuleImport;
  export const applyRules = applyRulesImport;
  export type IDomainEvent<T> = IDomainEventImport<T>;
  export namespace StandardVO {
    export namespace Currency {
      export class Value extends CurrencyVOImport {}
      export type ErrorTypes = CurrencyVOErrorTypesImport;
    }
  }
}

namespace Application {
  export class Error extends AppError {}
  export type IErrorEvent = IErrorEventImport<any>;
  export type IUseCase<IRequest, IResponse> = UseCase<IRequest, IResponse>;
  export type ICommandHandler<IRequest, IResponse> = CommandHandler<
    IRequest,
    IResponse
  >;
  export type IQueryHandler<IRequest, IResponse> = QueryHandler<
    IRequest,
    IResponse
  >;
  export type IHandle = IHandleImport;
  export interface IHandleIntegrationEvent extends IHandleImport {
    version: string;
  }

  export abstract class Command extends CommandImport {}
  export type TCommandMetadata = CommandMetadataImport;
  export type TContext = TContextImport;

  export type IQuery = IQueryImport;
  export type TQueryMetadata = TQueryMetadataImport;

  export namespace Repo {
    export namespace Errors {
      export class NotFound extends NotFoundError {}
      export class Concurrency extends ConcurrencyError {}
      export class Conflict extends ConflictError {}
      export class Unexpected extends UnexpectedError {}
    }
    export type ICRUDPort<Aggregate, AggregateId> = CRUDRepoPort<
      Aggregate,
      AggregateId
    >;
    export type ICRUDReadPort<ReadModel> = CRUDReadRepoPort<ReadModel>;
    export type ICRUDWritePort<Aggregate, AggregateId> = CRUDWriteRepoPort<
      Aggregate,
      AggregateId
    >;
  }
}

namespace Infra {
  // export namespace REST {
  //   export type IBaseController<Req, Res> = IBaseControllerImport<Req, Res>;
  //   export type ErrorMessage = ErrorMessageImport;
  // }

  // export namespace GraphQL {
  //   export type IBaseController<TRequest, TResponseData> =
  //     IBaseGraphQLControllerImport<TRequest, TResponseData>;
  // }

  export namespace EventBus {
    export type IntegrationEvent<T> = IIntegrationEventImport<T>;
    export type IEventBus = IEventBusImport;
    export type IEvent<T> = IEventImport<T>;
  }
  export namespace CommandBus {
    export type IPubSubCommandBus = IPubSubCommandBusImport;
    export type IStreamCommandBus = IStreamCommandBusImport;
  }

  export namespace QueryBus {
    export type IQueryBus = IQueryBusImport;
  }

  export namespace MessageBus {
    export type IMessageBus = IMessageBusImport;
  }
}

namespace Constants {
  export const TOPIC_PREFIXES = TOPIC_PREFIXES_IMPORT;
  export const CONTEXT_TYPES = CONTEXT_TYPES_IMPORT;
  export const MESSAGE_BUS = MESSAGE_BUS_IMPORT;
  export type ApplicationConfig = ApplicationConfigImport;
}

export { Application, Domain, Either, Infra, fail, ok, Constants };
