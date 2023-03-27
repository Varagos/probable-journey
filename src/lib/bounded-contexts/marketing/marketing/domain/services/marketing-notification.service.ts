import { Application, Either, ok } from '@bitloops/bl-boilerplate-core';
import { NotificationTemplateReadRepoPort } from '../../ports/notification-template-read.repo-port.';
import { NotificationTemplateReadModel } from '../read-models/notification-template.read-model';
import { UserEntity } from '../user.entity';

export class MarketingNotificationService {
  constructor(
    private notificationTemplateRepo: NotificationTemplateReadRepoPort,
  ) {}

  public async getNotificationTemplateToBeSent(user: UserEntity): Promise<
    Either<
      {
        emailOrigin: string;
        notificationTemplate: NotificationTemplateReadModel | null;
      },
      Application.Repo.Errors.Unexpected
    >
  > {
    const emailOrigin = 'marketing@bitloops.com';
    let notificationTemplate: NotificationTemplateReadModel | null;
    if (user.isFirstTodo()) {
      const notificationTemplateResponse =
        await this.notificationTemplateRepo.getByType('firstTodo');
      if (notificationTemplateResponse.isFail()) {
        return fail(notificationTemplateResponse.value);
      }
      notificationTemplate = notificationTemplateResponse.value;
    } else {
      throw new Error('No notification template found'); //TODO add a new error
    }

    return ok({ emailOrigin: emailOrigin, notificationTemplate });
  }
}
