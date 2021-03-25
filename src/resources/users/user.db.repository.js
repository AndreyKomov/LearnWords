const User = require('./user.model');
const { NOT_FOUND_ERROR, ENTITY_EXISTS } = require('../../errors/appErrors');
const ENTITY_NAME = 'user';
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const cloudinary = require('../../core/cloudinary');

const getUserByEmail = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { email });
  }

  return user;
};

const get = async id => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { id });
  }

  return user;
};

const save = async user => {
  try {
    return await User.create(user);
  } catch (err) {
    if (err.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`${ENTITY_NAME} with this e-mail exists`);
    } else {
      throw err;
    }
  }
};

const update = async (id, user, avatarImage, res) => {
  cloudinary.v2.uploader
    .upload_stream({ resource_type: 'auto' }, async (error, result) => {
      if (error || !result) {
        res.json(error);
      }

      const newData = {
        ...user,
        avatar: result.url || ''
      };

      const newUser = await User.Instance.findOneAndUpdate(
        { _id: id },
        { $set: newData },
        { new: true }
      ).select('-password');
      res.json(newUser);
    })
    .end(avatarImage.buffer);
};

const remove = async id => User.deleteOne({ _id: id });

module.exports = { get, getUserByEmail, save, update, remove };
