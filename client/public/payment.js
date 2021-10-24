var stripe = Stripe('pk_test_xxx')
var elements = stripe.elements()

// 注文情報
// サーバーで JSON を受け取って処理を行う
var order = {
  items: [
    {
      name: 'scrub',
      amount: 2000,
      quantity: 2,
    },
    {
      name: 'soap',
      amount: 1500,
      quantity: 1,
    },
  ],
  currency: 'jpy',
  paymentMethodId: null,
}

var style = {
  base: {
    color: '#32325d',
  },
}

// インスタンス化
var card = elements.create('card', { style: style })

// マウント（要素とアプリの紐付け）
card.mount('#card-element')

// クレジットカード情報の入力の正誤判定
card.on('change', (error) => {
  const displayError = document.getElementById('card-errors')
  if (error) {
    displayError.textContent = error.message
  } else {
    displayError.textContent = ''
  }
})
