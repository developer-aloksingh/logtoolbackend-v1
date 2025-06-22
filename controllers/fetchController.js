const mongoose = require('mongoose');
const logModel = require('./../models/logModel'); // Adjust the path to your schema file

// // Controller to fetch all data from MongoDB
async function fetchall(req, res) {
  try {
    // Fetch all documents from the LogDocument collection
    const logs = await logModel.find({}).sort({ _id: -1 }).exec();

    // Return JSON response with the fetched data
    res.status(200).json({
      status: "success",
      count: logs.length,
      logs: logs
    });
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch logs from database",
      error: error.message
    });
  }
}



module.exports = { fetchall };