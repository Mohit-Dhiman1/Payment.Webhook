
const stripe = require('stripe')('sk_test_51OgmJHSCvtRGYhfBf8FYcphsx0UlZXJ7ypEAGNvUkhoQbKWOowejK6s6zuGPknYEHBybFrfmP8li3AQMnq2PRaZd00SlvBTU62');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_1e999f6771952d2adcced71e6dd9c5140e5fca02882a27766b0e93dc10fbc67c";

 // Function to handle payment_intent.PartiallyFunded event
// function handlePaymentIntentPartiallyFunded(paymentIntent) {
//  const paymentId = paymentIntent.id;
//   const amountReceived = paymentIntent.amount_received;
//   const amountExpected = paymentIntent.amount;  
// const remainingAmount = amountExpected - amountReceived;
//  if (remainingAmount === 0) {
//   console.log(`Payment ${paymentId} has been fully funded.`);
//  } else {
//    console.log(`Payment ${paymentId} has been partially funded. Remaining amount: ${remainingAmount}`);
//  }
// }


app.use(express.urlencoded({ extended: true }));  
app.use(bodyParser.json ({
  verify:(req, res, buf) =>{
    req.rawBody = buf
  }
}))




app.post('/webhook', express.raw({ type: 'application/json' }), (req, response) => {
  const sig = req.headers['stripe-signature'];
      console.log(sig,"lllllllll")
  
  let event;
console.log("body", JSON.stringify(req.rawBody))
  try { 

    event = stripe.webhooks.constructEvent(req.rawBody,sig,endpointSecret );
    console.log(event,"kkkkkkkkk")
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.partially_funded':
      const paymentIntentPartiallyFunded = event.data.object;
      console.log(paymentIntentPartiallyFunded, "ooooooooooooooo")
      // handlePaymentIntentPartiallyFunded(paymentIntentPartiallyFunded);

      break;
    

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));

