var express = require('express');
var router = express.Router();

const getMore = () => {
  return 'Get More!';
};

/* GET users listing. */
router.get('/', function (req, res, next) {
  const result = getMore();
  res.send('respond with a resource' + ` ${result}`);
});
router.get('/cool', function (req, res, next) {
  res.send("You're so cool");
});

module.exports = router;
