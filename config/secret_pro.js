module.exports = {
  database: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  secretKey: process.env.SECRET_KEY
};
