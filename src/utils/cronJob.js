const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { default: isEmail } = require("validator/lib/isEmail");
const sendEmail = require("../services/sendEmail");
const pendingTemplate = require("./templates/pendingRequestTemplate");

const scheduleCronJob = cron.schedule("0 10 * * 3", async () => {
  console.log("Running daily pending request email job");

  const connectionRequests = await ConnectionRequest.find({
    status: "interested",
  }).populate("toUserId");

  const userRequestMap = {};
  connectionRequests.forEach((request) => {
    const toUserId = request.toUserId._id.toString();
    if (!userRequestMap[toUserId]) {
      userRequestMap[toUserId] = {
        firstName: request.toUserId.firstName,
        email: request.toUserId.email,
        count: 1,
      };
    } else {
      userRequestMap[toUserId].count++;
    }
  });

  for (let userId in userRequestMap) {
    const { email, count, firstName } = userRequestMap[userId];
    await sendEmail({
      to: email,
      subject: "Pending Connection Requests",
      html: pendingTemplate(firstName, count),
    });
  }
});

module.exports = scheduleCronJob;
