var express = require('express')
var router = express.Router()

const stripe = require('stripe')('sk_test_xxx')

const logger = require('../logger')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.post('/v1/order/payment', async function (req, res, next) {
  const {
    paymentMethodId,
    paymentIntentId,
    items,
    currency,
    useStripeSdk,
  } = req.body

  const total = calculateAmount(req.body.items)

  let intent
  if (paymentMethodId) {
    const request = {
      amount: total,
      currency: currency,
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      use_stripe_sdk: useStripeSdk,
    }

    intent = await stripe.paymentIntents.create(request)
  } else if (paymentIntentId) {
    intent = await stripe.paymentIntents.confirm(paymentIntentId)
  }

  const response = generateResponse(intent)

  res.send(response)
})

function calculateAmount(items) {
  let total = 0
  for (let i = 0; i < items.length; i++) {
    const current = items[i].amount * items[i].quantity
    total += current
  }

  return total
}

function generateResponse(paymentIntent) {
  // レスポンスオブジェクトの初期化
  let response = {
    requiresAction: false,
    clientSecret: '',
    paymentIntentStatus: ' ',
  }

  switch (paymentIntent.status) {
    case 'requires_action':
      response.paymentIntentStatus = 'requires_action'
      break

    case 'requires_source_action':
      response.paymentIntentStatus = 'requires_source_action'
      response.requiresAction = true
      response.clientSecret = paymentIntent.client_secret
      break

    case 'requires_payment_method':
      response.paymentIntentStatus = 'requires_payment_method'
      break

    case 'requires_source':
      response.paymentIntentStatus = 'requires_source'
      response.error = {
        messages: [
          'カードが拒否されました。別の決済方法をお試しください。',
        ],
      }
      break

    case 'succeeded':
      response.paymentIntentStatus = 'succeeded'
      response.clientSecret = paymentIntent.client_secret
      break

    default:
      response.error = {
        messages: ['システムエラーが発生しました。'],
      }
      break
  }

  return response
}

module.exports = router
