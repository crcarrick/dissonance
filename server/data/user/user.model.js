import bcrypt from 'bcrypt';
import { addDays, getUnixTime } from 'date-fns';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'is required'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'is invalid'],
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, 'is required'],
      match: [
        /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        'is invalid',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'is required'],
    },
    servers: [{ type: Schema.Types.ObjectId, ref: 'Server' }],
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = function generateJWT() {
  const today = new Date();
  const exp = addDays(today, 1);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: getUnixTime(exp),
    },
    process.env.JWT_SECRET
  );
};

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function (next) {
  if (this.password && !this.isModified('password')) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 10);

  next();
});

export const User = mongoose.model('User', userSchema);
