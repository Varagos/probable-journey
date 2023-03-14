import { Domain } from '@bitloops/bl-boilerplate-core';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TitleVO } from '../domain/TitleVO';
import { TodoEntity } from '../domain/TodoEntity';
import { TodoWriteRepoPort } from '../ports/TodoWriteRepoPort';
import { Todo, TodoDocument } from './schema/todo.schema';

@Injectable()
export class TodoWriteRepository implements TodoWriteRepoPort {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async getById(id: Domain.UUIDv4): Promise<TodoEntity> {
    throw new Error('Method not implemented.');
  }

  async update(todo: TodoEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: Domain.UUIDv4): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async save(todo: TodoEntity): Promise<void> {
    const createdTodo = new this.todoModel(todo.toPrimitives());
    // this.publish(todo.events)
    await createdTodo.save();
  }
}
