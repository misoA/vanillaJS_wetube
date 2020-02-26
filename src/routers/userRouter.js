import express from 'express';
import routes from '../routes';
import {
  userDetail,
  getProfile,
  editProfile,
  getChangePassword,
  postChangePassword
} from '../controllers/userController';
import { onlyPrivate, uploadAvatar } from '../middlewares';

const userRouter = express.Router();

userRouter.get(routes.profile, onlyPrivate, getProfile);
userRouter.post(routes.profile, onlyPrivate, uploadAvatar, editProfile);

userRouter.get(routes.changePassword, onlyPrivate, getChangePassword);
userRouter.post(routes.changePassword, onlyPrivate, postChangePassword);

userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
