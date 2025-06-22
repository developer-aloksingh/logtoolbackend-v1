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
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit to 10MB
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


      





      const parsedLogs = [];

      //parsed SQUID_LOG
for (const line of logLines) {
  // Split the line by whitespace
  const parts = line.trim().split(/\s+/);
  const partsIdAddress = parts[3];
  const logTypeName = 'AN_SQUID_LOG'

  // Ensure there are enough parts to parse (at least 15 fields based on the log format)
  if (parts.length >= 15 && partsIdAddress==logTypeName) {
    // Extract fields based on their positions
    const logLevel = parts[0].match(/^<(\d+)>/)?.[1] || null; // Extract number from <134>
    const timestamp = parts[1] || '-';
    const host = parts[2] || '-';
    const logType = parts[3] || '-';
    const dash1 = parts[4] || '-';
    const dash2 = parts[5] || '-';
    const dash3 = parts[6] || '-';
    const elapsedTime = parts[7] || '-';
    const bytes = parts[8] || '-';
    const userField = parts[9] || '-';
    const clientIp = parts[10] || '-';
    const methodStatus = parts[11] || '-';
    const port = parts[12] || '-'; // Assuming 1257 is bytes transferred
    const method = parts[13] || '-'; // Assuming Get is the HTTP method
    const url = parts[14] || '-';
    const hierarchy = parts[15] || '-';
    const peer = parts[16] || '-';
    const other = '-';

    // Parse user from userField (e.g., "user=aman")
    const userMatch = userField.match(/user=(\S+)/);
    const user = userMatch ? userMatch[1] : '-';

    // Create parsed log object
    const parsedLog = {
      logLevel,
      timestamp,
      host,
      logType,
      dash1,
      dash2,
      dash3,
      elapsedTime,
      bytes,
      user,
      clientIp,
      methodStatus,
      port,
      method,
      url,
      hierarchy,
      peer,
      other
    };

    parsedLogs.push(parsedLog);
    // console.log(parsedLogs);
    
  }
}



//parrs ID=arrayos
for (const line of logLines) {
  // Split the line by whitespace
  const parts = line.trim().split(/\s+/);
  const partsIdAddress = parts[3];
  const logTypeName = 'id=Arrayos'
  // Ensure there are enough parts to parse (at least 15 fields based on the log format)
  if (parts.length >= 15 && partsIdAddress == logTypeName) {
    // Extract fields based on their positions
    const logLevel = parts[0].match(/^<(\d+)>/)?.[1] || null; // Extract number from <134>
    const timestamp = parts[1] || '-';
    const host = parts[2] || '-';
    const logType = parts[3] || '-';
    const dash1 = parts[4] || '-';
    const dash2 = parts[5] || '-';
    const dash3 = parts[6] || '-';
    const elapsedTime = '-';
    const bytes = '-';
    const userField = parts[13] || '-';
    const clientIp = '-';
    const methodStatus = '-';
    const port = '-'; // Assuming 1257 is bytes transferred
    const method = '-'; // Assuming Get is the HTTP method
    const url = '-';
    const hierarchy = '-';
    const peer = '-';
    const other = `${parts[11]}, ${parts[12]}, ${parts[14]}, ${parts[15]}, ${parts[16]}, ${parts[17]}, ${parts[18]}, ${parts[19]}, ${parts[20]}, ${parts[21]}, ${parts[22]}` || '-';

    // Parse user from userField (e.g., "user=aman")
    const userMatch = userField.match(/user=(\S+)/);
    const user = userMatch ? userMatch[1] : '-';

    // Create parsed log object
    const parsedLog = {
      logLevel,
      timestamp,
      host,
      logType,
      dash1,
      dash2,
      dash3,
      elapsedTime,
      bytes,
      user,
      clientIp,
      methodStatus,
      port,
      method,
      url,
      hierarchy,
      peer,
      other
    };

    parsedLogs.push(parsedLog);
    console.log(parsedLogs.length);
    
  }
}








      // Clean up: Delete the uploaded file
      fs.unlinkSync(filePath);

      // Return JSON response
      res.status(200).json({
        status: "logs parsed successfully and stored in database",
        count: parsedLogs.length,
        data: parsedLogs
      });

      //  Save as a single document in MongoDB
    const logDocument = new logModel({ logs: parsedLogs });
    await logDocument.save();
    // console.log(parsedLogs);
    
    logModel.deleteMany();
    // Delete all documents in the collection
      try {
        const deleteResult = await logModel.deleteMany({});
        console.log(`${deleteResult.deletedCount} documents deleted`);
        const result = await logModel.insertMany(parsedLogs);
        console.log(`${result.length} documents saved`);

      } catch (error) {
        console.log('error while saving data' ,error);
        
      }






     
    
      



      
    } catch (error) {
      console.error("Error processing log file:", error);
      res.status(500).json({ error: "Failed to process log file" });
    }
  });
};

module.exports = {
    uploadAndPars,
};