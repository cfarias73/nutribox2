require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nutribox:<db_password>@cluster0.bu4jp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

module.exports = {
  MONGODB_URI
};