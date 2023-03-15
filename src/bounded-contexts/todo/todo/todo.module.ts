import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoWriteRepository } from './repository/todo-write.repository';
import { Todo, TodoSchema } from './repository/schema/todo.schema';
import { TodoReadRepository } from './repository/todo-read.repository';
import { TodoModule as LibTodoModule } from 'src/lib/bounded-contexts/todo/todo/todo.module';
import { TodoWriteRepoPortToken } from '@src/lib/bounded-contexts/todo/todo/ports/TodoWriteRepoPort';
import { TodoReadRepoPortToken } from '@src/lib/bounded-contexts/todo/todo/ports/TodoReadRepoPort';

const RepoProviders = [
  {
    provide: TodoWriteRepoPortToken,
    useClass: TodoWriteRepository,
  },
  {
    provide: TodoReadRepoPortToken,
    useClass: TodoReadRepository,
  },
];
@Module({
  imports: [
    // MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    LibTodoModule.register({
      inject: [...RepoProviders],
      imports: [
        MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
      ],
    }),
  ],
  controllers: [],
  // Probably don't need to inject the repositories here
  //   providers: [...RepoProviders],
  exports: [LibTodoModule],
})
export class TodoModule {}
