import routes from './routes';

// make local variable to global
export const localsMiddleWare = (req, res, next) => {
  res.locals.siteName = 'WeTube';
  res.locals.routes = routes;
  next();
};
