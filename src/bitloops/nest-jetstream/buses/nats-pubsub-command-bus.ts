import { Inject, Injectable } from '@nestjs/common';
import { NatsConnection, JSONCodec, headers } from 'nats';
import { Application, Infra } from '@src/bitloops/bl-boilerplate-core';
import { ProvidersConstants } from '../jetstream.constants';

const jsonCodec = JSONCodec();

@Injectable()
export class NatsPubSubCommandBus
  implements Infra.CommandBus.IPubSubCommandBus
{
  private nc: NatsConnection;
  constructor(
    @Inject(ProvidersConstants.JETSTREAM_PROVIDER) private readonly nats: any,
  ) {
    this.nc = this.nats.getConnection();
  }

  async publish(command: Application.Command): Promise<void> {
    const boundedContext = command.metadata.toContextId;
    const topic = `${boundedContext}.${command.constructor.name}`;
    console.log(
      'Publishing in server:',
      topic,
      this.nats.getConnection().getServer(),
    );

    this.nc.publish(topic, jsonCodec.encode(command));
  }

  async request(command: Application.Command): Promise<any> {
    const boundedContext = command.metadata.toContextId;
    const topic = `${boundedContext}.${command.constructor.name}`;
    console.log(
      'Publishing in server:',
      topic,
      this.nats.getConnection().getServer(),
    );

    const h = headers();
    for (const [key, value] of Object.entries(command.metadata)) {
      h.append(key, value.toString());
    }

    try {
      const response = await this.nc.request(topic, jsonCodec.encode(command), {
        headers: h,
        timeout: 10000,
      });
      return jsonCodec.decode(response.data);
    } catch (error) {
      console.log('Error in command request', error);
    }
  }

  async pubSubSubscribe(
    subject: string,
    handler: Application.ICommandHandler<any, any>,
  ) {
    try {
      console.log('Subscribing to:', subject);
      // this.logger.log(`
      //   Subscribing ${subject}!
      // `);
      const sub = this.nc.subscribe(subject);
      (async () => {
        for await (const m of sub) {
          const command = jsonCodec.decode(m.data);
          if (m.headers) {
            const collerationId = m.headers.get('correlationId');
            console.log('correlationId');
          }
          const reply = await handler.execute(command);
          if (reply.isOk && reply.isOk() && m.reply) {
            this.nc.publish(
              m.reply,
              jsonCodec.encode({
                isOk: true,
                data: reply.value,
              }),
            );
          } else if (reply.isFail && reply.isFail() && m.reply) {
            this.nc.publish(
              m.reply,
              jsonCodec.encode({
                isOk: false,
                error: reply.value,
              }),
            );
          }
          console.log(
            `[${sub.getProcessed()}]: ${JSON.stringify(
              jsonCodec.decode(m.data),
            )}`,
          );
        }
        console.log('subscription closed');
      })();
    } catch (err) {
      console.log('Error in command-bus subscribe:', err);
    }
  }
}
