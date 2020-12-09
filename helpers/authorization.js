function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function isCustomer(req, res, next) {
  if (req.user.type !== 'customer') {
    req.flash('message', 'You don\'t have authorization to complete this action');
    res.redirect("/home");
    return;
    //req.path
  }
  return next();
}

function isBroker(req, res, next) {
  if (req.user.type !== 'broker') {
    req.flash('message', 'You don\'t have authorization to complete this action');
    res.redirect("/home");
    return;
    //req.path
  }
  return next();
}


function isHotelOwner(req, res, next) {
  if (req.user.type !== 'hotel_owner' && req.user.type !== 'broker') {
    req.flash('message', 'You don\'t have authorization to complete this action');
    res.redirect("/login");
    return;
    //req.path
  }
  return next();
}
function isBlacklisted(req, res, next) {

  if (req.user.isBlacklisted) {
    req.flash('message', 'You Are Blacklisted');
    res.redirect("/login");
    return;
  }
  return next();

}


module.exports = {
  isHotelOwner,
  isBroker,
  isAuthenticated,
  isCustomer,
  isBlacklisted
};