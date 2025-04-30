import {Schema, model} from 'mongoose';


const UserSchema = Schema({
    email: {
      type: String,
      unique: true,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['ADMIN_ROLE', 'USER_ROLE'],
      default: 'USER_ROLE'
    },
    estado: {
      type: Boolean,
      default: true,
    }
}, 
{
  timestamps: true
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default model('User', UserSchema);

