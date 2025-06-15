

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  logLevel: { type: String, },
  timestamp: { type: String, },
  logType: { type: String, },
  clientIp: { type: String, },
  elapsedTime: { type: String, },
  bytes: { type: String, },
  user: { type: String, default:'user' },
  ip: { type: String, },
  methodStatus: { type: String, },
  port: { type: String, },
  method: { type: String, },
  url: { type: String, },
  hierarchy: { type: String, },
  peer: { type: String, }
});

const mainSchema = new mongoose.Schema({
  status: { type: String, },
  count: { type: Number, },
  logs: [logSchema]
});

module.exports = mongoose.model('LogDocument', mainSchema);