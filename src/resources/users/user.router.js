const { OK, NO_CONTENT } = require('http-status-codes');
const router = require('express').Router();

const userService = require('./user.service');
const { id, user } = require('../../utils/validation/schemas');
const {
  validator,
  userIdValidator
} = require('../../utils/validation/validator');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require('cloudinary');

router.post('/', validator(user, 'body'), async (req, res) => {
  const userEntity = await userService.save(req.body);
  res.status(OK).send(userEntity.toResponse());
});

router.get(
  '/:id',
  userIdValidator,
  validator(id, 'params'),
  async (req, res) => {
    const userEntity = await userService.get(req.params.id);
    res.status(OK).send(userEntity.toResponse());
  }
);

router.put(
  '/:id',
  userIdValidator,
  validator(id, 'params'),
  validator(user, 'body'),
  async (req, res) => {
    const userEntity = await userService.update(req.userId, req.body);
    res.status(OK).send(userEntity.toResponse());
  }
);

router.delete(
  '/:id',
  userIdValidator,
  validator(id, 'params'),
  async (req, res) => {
    await userService.remove(req.params.id);
    res.sendStatus(NO_CONTENT);
  }
);
/* router.post('/upload', upload.single('filedata'), (req, res, next) => {
  console.log(req.params.id);
  const filedata = req.file;
  const buf = filedata.buffer.toString('base64');
  if (!filedata) res.send('Error loading ');
  else res.send('File was successfully load');
  cloudinary.uploader.upload(
    `data:image/png;base64,${buf}`,
    result => {
      console.log(result.url);
    },
    {
      folder: 'Avatars'
    }
  );
});
 */
module.exports = router;
