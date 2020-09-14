export class UserService {
  constructor(user) {
    this.user = user;
  }

  create({ email, password, username }) {
    return this.user.create({ email, password, username });
  }

  findByEmail(email) {
    return this.user.findOne({ email });
  }

  findById(id) {
    return this.user.findById(id);
  }
}
