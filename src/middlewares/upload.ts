import * as multer from 'multer';

/** Returns middleware for uploading avatars. */
const avatar = multer({
  limits: { fileSize: 5000000 },
  fileFilter(_, file, callback) {
    if (
      file.originalname.match(/\.(jp[e]?|pn)g$/) &&
      file.mimetype.match(/^(image\/)(jp[e]?|pn)g$/)
    ) {
      callback(undefined, true);
      return;
    }

    callback(new Error('file is not supported'));
  },
}).single('avatar');

export { avatar };
