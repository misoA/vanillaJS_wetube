import passport from 'passport';
import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    req.flash('error', "Passwords don't match");
    res.status(400);
    res.render('join', { pageTitle: 'Join' });
  } else {
    try {
      const user = await User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render('login', { pageTitle: 'Login' });

export const postLogin = passport.authenticate('local', {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: 'Welcome',
  failureFlash: "Can't Logged in, Check Id or Pwd."
});

export const githubLogin = passport.authenticate('github', {
  successFlash: 'Welcome',
  failureFlash: "Can't Logged in, Check Id or Pwd."
});

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    } else {
      const newUser = await User.create({
        email,
        name,
        githubId: id,
        avatarUrl
      });
      return cb(null, newUser);
    }
  } catch (error) {
    console.log(error);
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate('facebook', {
  successFlash: 'Welcome',
  failureFlash: "Can't Logged in, Check Id or Pwd."
});

export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    } else {
      const newUser = await User.create({
        email,
        name,
        facebookId: id,
        avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
      });
      return cb(null, newUser);
    }
  } catch (error) {
    console.log(error);
    return cb(error);
  }
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash('info', 'Logged out');
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  const {
    user: { id }
  } = req;
  try {
    const user = await User.findById(id).populate('videos');
    res.render('userDetail', { pageTitle: 'User Detail', user });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id).populate('videos');
    res.render('userDetail', { pageTitle: 'User Detail', user });
  } catch (error) {
    console.log(error);
    req.flash('error', 'User not found');
    res.redirect(routes.home);
  }
};

export const getProfile = (req, res) =>
  res.render('profile', { pageTitle: 'Profile' });

export const editProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
    req.flash('success', 'Profile updated');
    res.redirect(routes.me);
  } catch (error) {
    console.log(error);
    req.flash('error', "Can't update password");
    res.redirect(routes.users + routes.profile);
  }
};

export const getChangePassword = (req, res) =>
  res.render('changePassword', { pageTitle: 'Change Password' });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword2 }
  } = req;
  try {
    if (newPassword !== newPassword2) {
      res.status(400);
      req.flash('error', "Passwords don't match");
      res.redirect(routes.users + routes.changePassword);
      return;
    }
    req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    console.log(error);
    req.flash('error', "Can't change password");
    res.status(400);
    res.render(routes.users + routes.changePassword);
  }
};
