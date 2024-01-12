// redirect.js
module.exports = (req, res) => {
  const userParam = req.query.user;

  if (userParam) {
    res.redirect(302, `https://tvj.rediptv.live/a?user=${encodeURIComponent(userParam)}`);
  } else {
    res.status(200).send('Original request');
  }
};