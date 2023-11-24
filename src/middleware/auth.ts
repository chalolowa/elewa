import jwt from 'jsonwebtoken';

const secretKey = process.env.JSON_SECRET;

const authenticateConfirm = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.redirect('/login');
    }
  
    jwt.verify(token, secretKey, (err: any, user: any) => {
      if (err) {
        return res.redirect('/login');
      }
      req.user = user;
      next();
    });
  };

  export {secretKey, authenticateConfirm};
