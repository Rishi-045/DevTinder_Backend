const pendingTemplate = (name, count) => {
  return `
    <h2>Hi ${name}</h2>
    <p>You have <b>${count}</b> pending connection requests.</p>
    <a href="${process.env.CLIENT_URL}/requests">View Requests</a>
  `;
};

module.exports = pendingTemplate;
