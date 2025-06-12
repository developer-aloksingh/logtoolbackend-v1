const fs = require("fs");
const path = require("path");
const multer = require("multer");
const logModel = require('./../models/logModel');

// Configure Multer for file upload
const upload = multer({
  dest: "public/uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/plain" || path.extname(file.originalname) === ".log") {
      cb(null, true);
    } else {
      cb(new Error("Only .log files are allowed"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
});

// Controller to handle log file upload and parsing
const uploadAndPars = (req, res) => {
  upload.single("logFile")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No log file uploaded" });
      }

      const filePath = req.file.path;
      const logData = fs.readFileSync(filePath, "utf8");
      const logLines = logData.split("\n").filter((line) => line.trim() !== "");

      // Array to store parsed log entries
      const parsedLogs = [];

      // Updated regex to match the log format
      const logRegex = /^<(\d+)>\d+\s+(\S+)\s+(\S+)\s+(\S+)\s+(-)\s+(-)\s+(-)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)$/;

      for (const line of logLines) {
        const match = line.match(logRegex);
        if (match) {
          const [
            ,
            logLevel,
            timestamp,
            logType,
            clientIp,
            dash1,
            dash2,
            dash3,
            elapsedTime,
            bytes,
            userField,
            ip,
            methodStatus,
            method,
            urlAndExtra
          ] = match;

          // Parse user from userField (e.g., "user=asingh")
          const userMatch = userField.match(/user=(\S+)/);
          const user = userMatch ? userMatch[1] : null;

          // Split urlAndExtra into url, hierarchy, and peer
          const extraParts = urlAndExtra.match(/(\S+)\s+(-)\s+(\S+)/);
          let url = null, hierarchy = null, peer = null;
          if (extraParts) {
            [, url, hierarchy, peer] = extraParts;
          }

          // Create JSON object for the log entry
          const logEntry = {
            logLevel,
            timestamp,
            logType,
            clientIp,
            elapsedTime: parseFloat(elapsedTime) || null,
            bytes: parseInt(bytes, 10) || 0,
            user,
            ip,
            methodStatus,
            method,
            url,
            hierarchy,
            peer,
          };

          parsedLogs.push(logEntry);
        }
      }

      // Clean up: Delete the uploaded file
      fs.unlinkSync(filePath);

      // Return JSON response
      res.status(200).json({
        status: "logs parsed successfully and stored in database",
        count: parsedLogs.length
      });

       // Save as a single document in MongoDB
    const logDocument = new logModel({ logs: parsedLogs });
    await logDocument.save();




     
    
      



      
    } catch (error) {
      console.error("Error processing log file:", error);
      res.status(500).json({ error: "Failed to process log file" });
    }
  });
};

module.exports = {
    uploadAndPars,
};