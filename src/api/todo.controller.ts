import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwtwebtoken from 'jsonwebtoken';
import { TodoReadModel } from '../lib/bounded-contexts/todo/todo/domain/TodoReadModel';
import { AddTodoCommand } from '../lib/bounded-contexts/todo/todo/commands/add-todo.command';
import { AddTodoDto } from './dto/add-todo.dto';
import { CompleteTodoDto } from './dto/complete-todo.dto';
import { GetTodosQuery } from '../lib/bounded-contexts/todo/todo/queries/get-todos.query';
import {
  PubSubCommandBus,
  PubSubCommandBusToken,
} from '@src/infra/jetstream/buses/nats-pubsub-command-bus';
import {
  PubSubQueryBus,
  PubSubQueryBusToken,
} from '@src/infra/jetstream/buses/nats-pubsub-query-bus';
// import { CompleteTodoCommand } from '@src/lib/bounded-contexts/todo/todo/commands/complete-todo.command';

@Injectable()
@Controller('todo')
export class TodoController {
  private readonly JWT_SECRET: string;
  constructor(
    @Inject(PubSubCommandBusToken)
    private readonly commandBus: PubSubCommandBus, // private readonly queryBus: QueryBus, // @Inject('NATS_JETSTREAM') private readonly nc: any,
    @Inject(PubSubQueryBusToken)
    private readonly queryBus: PubSubQueryBus,
    private configService: ConfigService,
  ) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET') || '';

    if (this.JWT_SECRET === '') {
      throw new Error('JWT_SECRET is not defined!');
    }
  }

  @Post()
  async addTodo(@Body() dto: AddTodoDto) {
    // userId get from context
    const jwt = jwtwebtoken.sign({ userId: dto.userId }, this.JWT_SECRET);
    const command = new AddTodoCommand(dto.title, dto.userId, { jwt });
    const results = await this.commandBus.request(command);
    if (results.isOk) return results.data;
    else throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Post('/complete')
  async completeTodo(@Body() dto: CompleteTodoDto) {
    // userId get from context
    // return this.commandBus.execute(
    //   new CompleteTodoCommand({ todoId: dto.todoId }),
    // );
  }

  @Get()
  async findAll(): Promise<TodoReadModel[]> {
    const jwt = jwtwebtoken.sign({ userId: 'vasilis' }, this.JWT_SECRET);
    const results = await this.queryBus.request(new GetTodosQuery({ jwt }));
    if (results.isOk) return results.data;
    else throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
