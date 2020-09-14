export class MessageService {
  constructor(message) {
    this.message = message;
  }

  create({ channelId, text, userId }) {
    return this.message.create({ author: userId, channel: channelId, text });
  }

  findById(id) {
    return this.message.findById(id);
  }

  findByChannel(channelId) {
    return this.message.find({ channel: channelId });
  }
}
