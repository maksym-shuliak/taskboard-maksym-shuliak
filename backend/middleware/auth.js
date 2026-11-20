// Ochrona tras: bez zalogowania odpowiadamy 401
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Zaloguj się, aby kontynuować' });
  }
  next();
}
 
module.exports = { requireAuth };
 