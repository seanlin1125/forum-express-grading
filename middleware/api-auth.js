const passport = require('../config/passport')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.logIn(user, (error = err) => {
      if (error) next(error) // req.logIn會自動把user塞回req.user；另logIn()需要含callback function
    })
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
