// This file contains stub functions to integrate with a payment provider (e.g., Razorpay).
// Implement provider-specific code here.

exports.createOrder = async ({ amount, currency = 'INR', receipt }) => {
  // return provider order object
  return { id: 'order_stub_123', amount, currency, receipt };
};

exports.verifySignature = (body, signature) => {
  // verify provider webhook signature
  return true;
};
