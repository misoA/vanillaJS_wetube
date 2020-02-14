import express from 'express';
import routes from '../routes';
import {
  userDetail,
  profile,
  changePassword
} from '../controllers/userController';
import { onlyPrivate } from '../middlewares';

const userRouter = express.Router();

userRouter.get(routes.profile, onlyPrivate, profile);
userRouter.get(routes.changePassword, onlyPrivate, changePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
