import { DatabaseService } from './../database.service';

import { TableNames } from './../constants';

export class MessageService extends DatabaseService {
  table = TableNames.MESSAGES;

  constructor(args) {
    super(args);
  }

  async create({ text, authorId, channelId }) {
    const [message] = await this.connection(TableNames.MESSAGES)
      .insert({
        text,
        authorId,
        channelId,
      })
      .returning([
        'id',
        'text',
        'authorId',
        'channelId',
        'createdAt',
        'updatedAt',
      ]);

    return message;
  }
}
