import { User } from './user.model';

export class UserService {
  create({ username }) {
    return User.create({ username });
  }

  findById(id) {
    return User.findById(id);
  }

  findAll() {
    return User.find();
  }
}
