import { Message } from './message.model';

export class MessageService {
  create({ channelId, text, userId }) {
    return Message.create({ author: userId, channel: channelId, text });
  }

  findById(id) {
    return Message.findById(id);
  }

  findByChannel(channelId) {
    return Message.find({ channel: channelId });
  }
}
