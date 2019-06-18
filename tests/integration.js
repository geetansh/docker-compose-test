import test from 'tape';
import requestPromise from 'request-promise';

let ruleId = '';
const rule = {
  "day": {
    "month": 6,
    "weekday": "mon"
  },
  "lunch_break_from": {
    "hours": 12,
    "minutes": 30
  },
  "lunch_break_duration": 30,
  "closed": false,
  "first_checkin": {
    "hours": 9,
    "minutes": 30
  },
  "last_checkin": {
    "hours": 15,
    "minutes": 30
  },
  "slot_default_duration": 60,
  "slot_default_spaces": 10,
  "slot_default_deposit_price": 50,
  "slot_default_invoice_price": 200,
  "lunch_break": true,
  "location_id": 1
};

let customRuleId = '';
const customRule = {
  "date": "2019-06-03",
  "lunch_break_from": {
    "hours": 12,
    "minutes": 30
  },
  "lunch_break_duration": 30,
  "closed": false,
  "first_checkin": {
    "hours": 6,
    "minutes": 30
  },
  "last_checkin": {
    "hours": 14,
    "minutes": 30
  },
  "slot_default_duration": 60,
  "slot_default_spaces": 15,
  "slot_default_deposit_price": 50,
  "slot_default_invoice_price": 200,
  "lunch_break": true,
  "location_id": 1
};

let invoiceId = '';
let depositPrice = 0;
let bookingId = '';

test('Create a new default rule for monday of june.', (t) => {
  requestPromise({
    method: 'POST',
    uri: 'http://localhost:8080/api/v1/defaultRule',
    body: rule,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    ruleId = response.body._id;
    t.equal(response.statusCode, 200, 'statusCode: 200');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Check availability on 2019-06-03 (monday of june). Number of slots should be 6.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body.length, 6, '6 slots');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Reduced last checkin time by 30 mins and increased lunch time by 15 minutes.', (t) => {
  rule.last_checkin.minutes = 0;
  rule.lunch_break_duration = 45;
  requestPromise({
    method: 'PUT',
    uri: `http://localhost:8080/api/v1/defaultRule/${ruleId}`,
    body: rule,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Check availability on 2019-06-03 (monday of june). Number of slots after the last change should be 5.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body.length, 5, '5 slots');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Increased last checkin time by 30 mins and removed lunch break.', (t) => {
  rule.lunch_break = false;
  rule.last_checkin.minutes = 30;
  requestPromise({
    method: 'PUT',
    uri: `http://localhost:8080/api/v1/defaultRule/${ruleId}`,
    body: rule,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Check availability on 2019-06-03 (monday of june). Number of slots after the last change should be 7.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body.length, 7, '7 slots');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Modifying the existing default rule to set the day to closed.', (t) => {
  rule.closed = true;
  requestPromise({
    method: 'PUT',
    uri: `http://localhost:8080/api/v1/defaultRule/${ruleId}`,
    body: rule,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Check availability on 2019-06-03 (monday of june). Number of slots after the last change should be 0.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body.length, 0, '0 slots');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Create a new custom rule for 2019-06-03.', (t) => {
  requestPromise({
    method: 'POST',
    uri: 'http://localhost:8080/api/v1/customRule',
    body: customRule,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    customRuleId = response.body._id;
    t.equal(response.statusCode, 200, 'statusCode: 200');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Check availability on 2019-06-03 (monday of june). After creating custom rule, number of slots after the last change should be 8.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body.length, 8, '8 slots');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Delete the custom rule.', (t) => {
  requestPromise({
    method: 'DELETE',
    uri: `http://localhost:8080/api/v1/customRule/${customRuleId}`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Check availability on 2019-06-03 (monday of june). After deleting the custom rule, number of slots should change back to 0 as the day is closed.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body.length, 0, '0 slots');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Set the day to open in default rule.', (t) => {
  rule.closed = false;
  requestPromise({
    method: 'PUT',
    uri: `http://localhost:8080/api/v1/defaultRule/${ruleId}`,
    body: rule,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Check availability on 2019-06-03 (monday of june). After last change, number of slots should be back to 7.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body.length, 7, '7 slots');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Create an invoice for 2019-06-03 (monday of june).', (t) => {
  setTimeout(() => {
    requestPromise({
      method: 'POST',
      uri: `http://localhost:8082/api/v1/invoice`,
      body: {
        "location_id": 1,
        "name": "David Cowman",
        "email": "david@cowman.com",
        "phone": "9999999999",
        "number_of_spaces": 5,
        "addons": [],
        "checkin_time": {
          "hours": 11,
          "minutes": 30
        },
        "date": "2019-06-03T04:56:07.000+00:00"
      },
      json: true,
      resolveWithFullResponse: true
    })
    .then((response) => {
      t.equal(response.statusCode, 200, 'statusCode: 200');
      invoiceId = response.body.invoice_id;
      depositPrice = response.body.deposit_price;
    })
    .catch((error) => t.fail(error))
    .then(() => t.end());
  }, 3000);
});

test('Retrieve the created invoice.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8082/api/v1/invoice/invoiceId/${invoiceId}`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body.invoice_id, invoiceId, 'Invoice id matches');
    t.equal(response.body.line_items.length, 1, 'Should have one entry for credit');
    t.equal(response.body.paid, false, 'Full payment is not done');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});


test('Create payment for previous invoice so that a booking is created.', (t) => {
  setTimeout(() => {
    requestPromise({
      method: 'POST',
      uri: `http://localhost:8083/api/v1/payment`,
      body: {
        "invoice_id": invoiceId,
        "payment_method": "credit_card",
        "credit_card_details": {
            "card_no": 1234567812345678,
            "exp": "11/23",
            "cvv": 111
        },
        "amount_due": 250,
        "status": "successful"
      },
      json: true,
      resolveWithFullResponse: true
    })
    .then((response) => {
      t.equal(response.statusCode, 200, 'statusCode: 200');
      t.equal(response.body.amount_due, depositPrice, 'Due amount is equal to deposit price');
      t.equal(response.body.status, 'successful', 'Payment was successful');
    })
    .catch((error) => t.fail(error))
    .then(() => t.end());
  }, 3000)
});

test('Retrieve the created invoice to get updates after payment.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8082/api/v1/invoice/invoiceId/${invoiceId}`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    bookingId = response.body.booking_id;
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body.line_items.length, 2, 'Debit line item should have been added after payment');
    t.equal(response.body.line_items[1].amount, depositPrice, 'Debit amount is equal to deposit price');
    t.equal(response.body.line_items[1].type, 'debit', 'Line item added after payment is of type debit');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Retrieve the created booking to see if it was successful.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/booking/bookingId/${bookingId}`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    bookingId = response.body.booking_id;
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body.booking_id, bookingId, 'Invoice is linked to booking');
    t.equal(response.body.invoice_id, invoiceId, 'Booking is linked to invoice');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('After invoice and booking has been created for a booking, the number of slots should reduce for that time slot when we check availability.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body[2].number_of_spaces, 5, 'Number of spaces reduced by the number of booked spaces');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Create an manual booking for 2019-06-03 (monday of june).', (t) => {
  requestPromise({
    method: 'POST',
    uri: `http://localhost:8081/api/v1/confirmBooking`,
    body: {
      "location_id": 1,
      "invoice_id": "abcde",
      "name": "David Cowman",
      "email": "david@cowman.com",
      "phone": "9999999999",
      "checkin_time": {
        "hours": 9,
        "minutes": 30
      },
      "date": "2019-06-03T04:56:07.000+00:00",
      "paid": false,
      "line_items": [
        {
          "type": "credit",
          "timestamp": "2019-06-03T04:56:07.000+00:00",
          "code": "tandem",
          "label": "Tandem",
          "quantity": 2,
          "invoice_price": 1000
        }
      ],
      "deposit_price": 250
    },
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('After creating manual booking, the number of slots should reduce for that time slot when we check availability.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body[0].number_of_spaces, 8, 'Number of spaces reduced by the number of booked spaces');
    t.equal(response.body[2].number_of_spaces, 5, 'Number of spaces reduced by a previous booking');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Create another manual booking for 2019-06-03 (monday of june).', (t) => {
  requestPromise({
    method: 'POST',
    uri: `http://localhost:8081/api/v1/confirmBooking`,
    body: {
      "location_id": 1,
      "invoice_id": "abcde",
      "name": "David Cowman",
      "email": "david@cowman.com",
      "phone": "9999999999",
      "checkin_time": {
        "hours": 9,
        "minutes": 30
      },
      "date": "2019-06-03T04:56:07.000+00:00",
      "paid": false,
      "line_items": [
        {
          "type": "credit",
          "timestamp": "2019-06-03T04:56:07.000+00:00",
          "code": "tandem",
          "label": "Tandem",
          "quantity": 5,
          "invoice_price": 1000
        }
      ],
      "deposit_price": 250
    },
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('After creating manual booking, the number of slots of 9.30 should reduce further to 3.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body[0].number_of_spaces, 3, 'Number of spaces reduced by the number of booked spaces');
    t.equal(response.body[2].number_of_spaces, 5, 'Number of spaces reduced by a previous booking');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Delete the default rule.', (t) => {
  requestPromise({
    method: 'DELETE',
    uri: `http://localhost:8080/api/v1/defaultRule/${ruleId}`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});

test('Check availability on 2019-06-03 (monday of june). Since, there is neither default nor custom rule for that day, slots should be 0.', (t) => {
  requestPromise({
    method: 'GET',
    uri: `http://localhost:8081/api/v1/checkAvailability/2019-06-03`,
    json: true,
    resolveWithFullResponse: true
  })
  .then((response) => {
    t.equal(response.statusCode, 200, 'statusCode: 200');
    t.equal(response.body instanceof Array, false, 'Not a slot array')
    t.equal(typeof response.body, 'string', 'Error message telling no rules exist for given date.');
  })
  .catch((error) => t.fail(error))
  .then(() => t.end());
});
