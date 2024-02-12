
const stripe = require('stripe')('sk_test_51OgmJHSCvtRGYhfBf8FYcphsx0UlZXJ7ypEAGNvUkhoQbKWOowejK6s6zuGPknYEHBybFrfmP8li3AQMnq2PRaZd00SlvBTU62');
const express = require('express');
const app = express();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('sendgrid_api_key');
// app.get('/create', (req, res) => {
//   res.send('Hello, World!');
// });

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_1e999f6771952d2adcced71e6dd9c5140e5fca02882a27766b0e93dc10fbc67c";

 // Function to handle payment_intent.PartiallyFunded event
function handlePaymentIntentPartiallyFunded(paymentIntent) {
 const paymentId = paymentIntent.id;
  const amountReceived = paymentIntent.amount_received;
  const amountExpected = paymentIntent.amount;  
const remainingAmount = amountExpected - amountReceived;
 if (remainingAmount === 0) {
  console.log(`Payment ${paymentId} has been fully funded.`);
 } else {
   console.log(`Payment ${paymentId} has been partially funded. Remaining amount: ${remainingAmount}`);
 }
}

 // Function to handle payment_intent.payment_failed event
function handlePaymentIntentPaymentFailed(paymentIntent) {
  const paymentId = paymentIntent.id;
  const amount = paymentIntent.amount;
  const failureReason = paymentIntent.last_payment_error && paymentIntent.last_payment_error.message;
 console.log(`Payment ${paymentId} of amount ${amount} failed. Reason: ${failureReason}`);
 updatePaymentStatus(paymentId, 'failed');
 sendEmailNotification(paymentIntent.customer_email, 'Payment Failed', `Your payment of ${amount} failed. Reason: ${failureReason}`);
 sendEmailNotification('whizcamp@example.com', 'Payment Failed', `Payment ${paymentId} failed for customer ${paymentIntent.customer_email}. Reason: ${failureReason}`);
}
function updatePaymentStatus(paymentId, status) {
 

}
function sendEmailNotification(to, subject, text) {
  const msg = {
    to: to,
    from: 'whizcamp@example.com', 
    subject: subject,
    text: text,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
}
const recipientEmail = 'recipient@example.com';
const notificationSubject = ' Notification Subject';
const notificationText = ' Notification Text';

sendEmailNotification(recipientEmail, notificationSubject, notificationText);
// Function to handle subscription_schedule.created event
function handleSubscriptionScheduleCreated(subscriptionSchedule) {
  const scheduleId = subscriptionSchedule.id;
  const customerId = subscriptionSchedule.customer;
  const startDate = new Date(subscriptionSchedule.start_date * 1000); 
  const intervals = subscriptionSchedule.phases.map(phase => ({
    interval: phase.iterations === 1 ? 'once' : `${phase.iterations} ${phase.interval}`,
    amount: phase.plans[0].amount,
    currency: phase.plans[0].currency
  }));


  console.log(`Subscription schedule ${scheduleId} created for customer ${customerId}`);
  console.log(`Start Date: ${startDate}`);
  console.log('Intervals:');
  intervals.forEach(interval => {
    console.log(`- ${interval.interval}: ${interval.amount} ${interval.currency}`);
  });
sendWelcomeEmail(customerId);
}
function sendWelcomeEmail(customerId) {
  const msg = {
    to: 'customer@example.com', 
    from: 'whizcamp@example.com',
    subject: 'Welcome to Our Service!',
    text: `Dear Customer, 

Welcome to our service! Thank you for choosing us. If you have any questions or need assistance, feel free to contact us.

Best regards,
Your Team`
  };

  sgMail.send(msg)
    .then(() => {
      console.log('Welcome email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending welcome email:', error);
    });
}
// Define a function to handle subscription schedule completed event
function handleSubscriptionScheduleCompleted(subscriptionSchedule) {
  const scheduleId = subscriptionSchedule.id;
  const customerId = subscriptionSchedule.customer;
 console.log(`Subscription schedule ${scheduleId} completed for customer ${customerId}`);
 updateSubscriptionStatus(customerId, 'active');
 sendCompletionEmail(customerId);
}
function updateSubscriptionStatus(customerId, status) {
  
  console.log(`Updating subscription status for customer ${customerId} to ${status}`);
}
function sendCompletionEmail(customerId) {
  const msg = {
    to: 'customer@example.com', 
    from: 'whizcamp@example.com', 
    subject: 'Your Subscription Schedule is Complete!',
    text: `Dear Customer,

Your subscription schedule has been successfully completed. Thank you for choosing our service.

Best regards,
Your Team`
  };

  sgMail.send(msg)
    .then(() => {
      console.log('Completion email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending completion email:', error);
    });
}

// Define a function to handle subscription schedule canceled event
function handleSubscriptionScheduleCanceled(subscriptionSchedule) {
  const scheduleId = subscriptionSchedule.id;
  const customerId = subscriptionSchedule.customer;
  console.log(`Subscription schedule ${scheduleId} canceled for customer ${customerId}`);
   updateSubscriptionStatus(customerId, 'canceled');
 sendCancellationEmail(customerId);
}
function updateSubscriptionStatus(customerId, status) {
  
  console.log(`Updating subscription status for customer ${customerId} to ${status}`);
}
function sendCancellationEmail(customerId) {
  const msg = {
    to: 'customer@example.com', 
    from: 'whizcamp@example.com', 
    subject: 'Your Subscription Has Been Canceled',
    text: `Dear Customer,

We regret to inform you that your subscription has been canceled. If you have any questions or concerns, please don't hesitate to contact us.

Best regards,
Your Team`
  };

  sgMail.send(msg)
    .then(() => {
      console.log('Cancellation email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending cancellation email:', error);
    });

}
// Define a function to handle subscription schedule Expiring  event
function handleSubscriptionScheduleExpiring(subscriptionSchedule) {

  const scheduleId = subscriptionSchedule.id;
  const customerId = subscriptionSchedule.customer;
   console.log(`Subscription schedule ${scheduleId} expiring for customer ${customerId}`);
  sendExpirationNotification(customerId);
}
function sendExpirationNotification(customerId) {
  const msg = {
    to: 'customer@example.com', 
    from: 'whizcamp@example.com', 
    subject: 'Your Subscription is Expiring Soon',
    text: `Dear Customer,

Your subscription is expiring soon. Please renew your subscription to continue enjoying our services.

Best regards,
Your Team`
  };

  sgMail.send(msg)
    .then(() => {
      console.log('Expiration notification email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending expiration notification email:', error);
    });
    
}
// Define a function to handle subscription schedule updated event
function handleSubscriptionScheduleUpdated(subscriptionSchedule) {
const scheduleId = subscriptionSchedule.id;
const customerId = subscriptionSchedule.customer;
 console.log(`Subscription schedule ${scheduleId} updated for customer ${customerId}`);
  sendUpdateNotification(customerId);
}


function sendUpdateNotification(customerId) {
  const msg = {
    to: 'customer@example.com', 
    from: 'whizcamp@example.com', 
    subject: 'Your Subscription Schedule Has Been Updated',
    text: `Dear Customer,

We want to inform you that there have been updates to your subscription schedule. Please review the changes and contact us if you have any questions or concerns.

Best regards,
Your Team`
  };

  sgMail.send(msg)
    .then(() => {
      console.log('Update notification email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending update notification email:', error);
    });
  
}
app.use(bodyParser.json ({
  verify:(req, res, buf) =>{
    req.rawBody = buf
  }
}))

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.partially_funded':
      const paymentIntentPartiallyFunded = event.data.object;
      console.log(paymentIntentPartiallyFunded, "ooooooooooooooo")
      handlePaymentIntentPartiallyFunded(paymentIntentPartiallyFunded);

      break;
    case 'payment_intent.payment_failed':
      const paymentIntentPaymentFailed = event.data.object;
      handlePaymentIntentPaymentFailed(paymentIntentPaymentFailed);

      break;
    case 'subscription_schedule.canceled':
      const subscriptionScheduleCanceled = event.data.object;
      handleSubscriptionScheduleCanceled(subscriptionScheduleCanceled);
 
      break;
    case 'subscription_schedule.completed':
        const subscriptionScheduleCompleted = event.data.object;
        handleSubscriptionScheduleCompleted(subscriptionScheduleCompleted)
        break;
    case 'subscription_schedule.created':
       const subscriptionScheduleCreated = event.data.object;
      handleSubscriptionScheduleCreated(subscriptionScheduleCreated)
      break;
    case 'subscription_schedule.expiring':
      const subscriptionScheduleExpiring = event.data.object;
      
      handleSubscriptionScheduleExpiring(subscriptionScheduleExpiring)
      break;
    case 'subscription_schedule.updated':
      const subscriptionScheduleUpdated = event.data.object;
      handleSubscriptionScheduleUpdated(subscriptionScheduleUpdated)
      
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));

