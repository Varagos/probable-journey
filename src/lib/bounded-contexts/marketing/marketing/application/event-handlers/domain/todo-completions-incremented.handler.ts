import { Infra, Application } from '@bitloops/bl-boilerplate-core';
import { TodoCompletionsIncrementedDomainEvent } from '../../../domain/events/todo-completions-incremented.event';
import { SendEmailCommand } from '../../../commands/send-email.command';
import { Inject } from '@nestjs/common';
import {
  UserEmailReadRepoPort,
  UserEmailReadRepoPortToken,
} from '../../../ports/user-email-read.repo-port';
import {
  NotificationTemplateReadRepoPort,
  NotificationTemplateReadRepoPortToken,
} from '../../../ports/notification-template-read.repo-port.';
import { MarketingNotificationService } from '../../../domain/services/marketing-notification.service';

export class TodoCompletionsIncrementedHandler implements Application.IHandle {
  private commandBus: Infra.CommandBus.IPubSubCommandBus;
  constructor(
    @Inject(UserEmailReadRepoPortToken)
    private readonly emailRepoPort: UserEmailReadRepoPort,
    @Inject(NotificationTemplateReadRepoPortToken)
    private notificationTemplateRepo: NotificationTemplateReadRepoPort,
  ) {}

  get event() {
    return TodoCompletionsIncrementedDomainEvent;
  }

  get boundedContext() {
    return 'Marketing';
  }

  public async handle(
    event: TodoCompletionsIncrementedDomainEvent,
  ): Promise<void> {
    const { data: user } = event;

    const marketingNotificationService = new MarketingNotificationService(
      this.notificationTemplateRepo,
    );
    const emailToBeSentInfoResponse =
      await marketingNotificationService.getNotificationTemplateToBeSent(user);
    if (emailToBeSentInfoResponse.isFail()) {
      return fail(emailToBeSentInfoResponse.value);
    }
    const emailToBeSentInfo = emailToBeSentInfoResponse.value;
    const userid = user.id;
    const userEmail = await this.emailRepoPort.getUserEmail(userid);
    if (userEmail.isFail()) {
      //TODO figure out how to return this error to controller
      // return userEmail.value;
      return;
    }

    //TODO figure out how to return this error to controller
    if (!userEmail.value) {
      // this.integrationEventBus().publish(new EmailNotFoundErrorMessage(new ApplicationErrors.EmailNotFoundError(userid.toString())));
      // TODO Error bus
      return;
    }

    const command = new SendEmailCommand({
      origin: emailToBeSentInfo.emailOrigin,
      destination: userEmail.value.email,
      content: emailToBeSentInfo.notificationTemplate?.template || '',
    });
    await this.commandBus.publish(command);
  }
}
