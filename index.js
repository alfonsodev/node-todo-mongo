module.exports = process.env.TODO_COV
  ? require('./lib-cov')
  : require('./lib');
