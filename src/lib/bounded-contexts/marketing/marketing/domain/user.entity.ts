import { Either, Domain, ok, fail } from "@src/bitloops/bl-boilerplate-core";
import { CompletedTodosVO } from "./completed-todos.vo";
import { UserIdVO } from "./user-id.vo";
import { TodoCompletionsIncrementedDomainEvent } from "./events/todo-completions-incremented.event";
import { DomainErrors } from "@src/lib/bounded-contexts/marketing/marketing/domain/errors";

export interface UserProps {
  id?: Domain.UUIDv4;
  userId: UserIdVO;
  completedTodos: CompletedTodosVO;
}

type TUserEntityPrimitives = {
  id: string;
  userId: string;
  completedTodos: number;
};

export class UserEntity extends Domain.Aggregate<UserProps> {
  private constructor(props: UserProps) {
    super(props, props.userId.id);
  }

  public static create(props: UserProps): Either<UserEntity, never> {
    const user = new UserEntity(props);
    return ok(user);
  }

  get completedTodos(): CompletedTodosVO {
    return this.props.completedTodos;
  }

  get id() {
    return this._id;
  }

  incrementCompletedTodos(): Either<void, DomainErrors.InvalidTodosCounterError> {
    const incrementedCompletedTodos = this.props.completedTodos.counter + 1;
    const completedTodos = CompletedTodosVO.create({
      counter: incrementedCompletedTodos,
    });
    if (completedTodos.isFail()) {
      return fail(completedTodos.value);
    }

    this.props.completedTodos = completedTodos.value;
    this.addDomainEvent(new TodoCompletionsIncrementedDomainEvent(this))
    return ok();
  }

  isFirstTodo(): boolean {
    return this.props.completedTodos.counter === 1;
  }

  public static fromPrimitives(data: TUserEntityPrimitives): UserEntity {
    const userEntityProps = {
      id: new Domain.UUIDv4(data.id),
      userId: UserIdVO.create({ id: new Domain.UUIDv4(data.userId) })
        .value as UserIdVO,
      completedTodos: CompletedTodosVO.create({
        counter: data.completedTodos,
      }).value as CompletedTodosVO,
    };
    return new UserEntity(userEntityProps);
  }

  public toPrimitives(): TUserEntityPrimitives {
    return {
      id: this.id.toString(),
      userId: this.props.userId.id.toString(),
      completedTodos: this.props.completedTodos.counter,
    };
  }
}
