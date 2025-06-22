

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
  peer: { type: String, },
  other: { type: String, }
});



module.exports = mongoose.model('LogDocument', logSchema);