import { HttpException, HttpStatus } from '@nestjs/common';
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
    return callback(new HttpException('Only image files and pdfs are allowed!', HttpStatus.BAD_REQUEST), false);
  }
  callback(null, true);
};