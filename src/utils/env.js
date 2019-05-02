const { production, development, test } = [
  "production",
  "development",
  "test"
].reduce((acc, env) => {
  acc[env] = (val) => (process.env["NODE_ENV"] === env ? val : null);
  return acc;
}, {});

const isProduction = !!production(true);
const isDevelopment = !!development(true);
const isTest = !!test(true);

module.exports = {
  production,
  development,
  test,
  isProduction,
  isDevelopment,
  isTest
};
