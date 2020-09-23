import { DatabaseService } from './../database.service';

export class MessageService extends DatabaseService {
  constructor({ connection }) {
    super();

    this.connection = connection;
    this.table = 'messages';
  }

  async create({ text, authorId, channelId }) {
    const [message] = await this.getTable()
      .insert({ text, author_id: authorId, channel_id: channelId })
      .returning([
        'id',
        'text',
        'author_id',
        'channel_id',
        'created_at',
        'updated_at',
      ]);

    return message;
  }

  getAuthor(authorId) {
    return this.connection('users').where('id', authorId).first();
  }

  getChannel(channelId) {
    return this.connection('channels').where('id', channelId).first();
  }
}
