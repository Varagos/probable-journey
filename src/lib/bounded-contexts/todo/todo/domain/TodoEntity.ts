import { Domain, Either, ok } from '@bitloops/bl-boilerplate-core';
import { TitleVO } from './TitleVO';
import { UserIdVO } from './UserIdVO';
import { DomainErrors } from './errors';
import { TodoAddedDomainEvent } from './events/todo-added.event';
import { TodoTitleModifiedDomainEvent } from './events/todo-title-modified.event';
import { TodoCompletedDomainEvent } from './events/todo-completed.Event';
import { TodoUncompletedDomainEvent } from './events/todo-uncompleted.event';

export interface TodoProps {
  userId: UserIdVO;
  id?: Domain.UUIDv4;
  title: TitleVO;
  completed: boolean;
}

type TTodoEntityPrimitives = {
  userId: string;
  id: string;
  title: string;
  completed: boolean;
};

export class TodoEntity extends Domain.Aggregate<TodoProps> {
  private constructor(props: TodoProps) {
    super(props, props.id);
  }

  public static create(props: TodoProps): Either<TodoEntity, never> {
    const todo = new TodoEntity(props);

    const isNew = !props.id;
    if (isNew) {
      todo.addDomainEvent(new TodoAddedDomainEvent(todo));
    }
    // add domain event todo created
    return ok(todo);
  }

  get completed(): boolean {
    return this.props.completed;
  }

  get id() {
    return this._id;
  }

  get title(): TitleVO {
    return this.props.title;
  }

  get userId(): UserIdVO {
    return this.props.userId;
  }

  public complete(): Either<void, DomainErrors.TodoAlreadyCompletedError> {
    if (this.props.completed) {
      return fail(
        new DomainErrors.TodoAlreadyCompletedError(this.id.toString()),
      );
    }
    this.props.completed = true;
    this.addDomainEvent(new TodoCompletedDomainEvent(this));
    return ok();
  }

  public uncomplete(): Either<void, DomainErrors.TodoAlreadyUncompletedError> {
    if (!this.props.completed) {
      return fail(
        new DomainErrors.TodoAlreadyUncompletedError(this.id.toString()),
      );
    }
    this.props.completed = false;
    this.addDomainEvent(new TodoUncompletedDomainEvent(this));
    return ok();
  }

  public modifyTitle(title: TitleVO): Either<void, never> {
    this.props.title = title;
    this.addDomainEvent(new TodoTitleModifiedDomainEvent(this));
    return ok();
  }

  public static fromPrimitives(data: TTodoEntityPrimitives): TodoEntity {
    const TodoEntityProps = {
      userId: UserIdVO.create({ id: new Domain.UUIDv4(data.userId) })
        .value as UserIdVO,
      id: new Domain.UUIDv4(data.id) as Domain.UUIDv4,
      title: TitleVO.create({
        title: data.title,
      }).value as TitleVO,
      completed: data.completed,
    };
    return new TodoEntity(TodoEntityProps);
  }

  public toPrimitives(): TTodoEntityPrimitives {
    return {
      userId: this.props.userId.id.toString(),
      id: this.id.toString(),
      title: this.props.title.title,
      completed: this.props.completed,
    };
  }
}
