import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Post,
} from '@nestjs/common';
import * as jwtwebtoken from 'jsonwebtoken';
// import { CommandBus, QueryBus } from '@nestjs/cqrs';
// import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
// import {
//   Ctx,
//   EventPattern,
//   MessagePattern,
//   Payload,
// } from '@nestjs/microservices';
import { TodoReadModel } from '../lib/bounded-contexts/todo/todo/domain/TodoReadModel';
import { AddTodoCommand } from '../lib/bounded-contexts/todo/todo/commands/add-todo.command';
import { AddTodoDto } from './dto/add-todo.dto';
import { GetTodosQuery } from '../lib/bounded-contexts/todo/todo/queries/get-todos.query';
import {
  PubSubCommandBus,
  PubSubCommandBusToken,
} from '@src/infra/jetstream/buses/nats-pubsub-command-bus';

@Injectable()
@Controller('todos')
export class TodosController {
  constructor(
    @Inject(PubSubCommandBusToken)
    private readonly commandBus: PubSubCommandBus, // private readonly queryBus: QueryBus, // @Inject('NATS_JETSTREAM') private readonly nc: any,
  ) {}

  @Post()
  async addTodo(@Body() dto: AddTodoDto) {
    // userId get from context
    const command = new AddTodoCommand(dto.title, dto.userId, {
      jwt: jwtwebtoken.sign({ userId: dto.userId }, 'jwtSecret'),
    });
    return this.commandBus.publish(command);
  }

  // @Get()
  // async findAll(): Promise<TodoReadModel[]> {
  //   return this.queryBus.execute(new GetTodosQuery());
  // }
}
