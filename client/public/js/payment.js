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

// formタグ内の div にマウント（要素とアプリの紐付け）
card.mount('#card-element')

// クレジットカード情報の入力の正誤判定
card.on('change', (error) => {
  // displayError に div要素を取得して代入
  const displayError = document.getElementById('card-errors')
  if (error) {
    displayError.textContent = error.message
  } else {
    displayError.textContent = ''
  }
})

// 注文確定ボタンの DOM を取得する
const submitButton = document.getElementById('payment-form-submit')

// ボタンがクリックされたらアクション実行
submitButton.addEventListener('click', function (event) {
  // Promise が返ってくるので then で処理を続ける
  stripe
    .createPaymentMethod('card', card)
    .then(function (result) {
      if (result.error) {
        // エラー時の処理
      } else {
        // 成功した時の処理
        // 支払いメソッドID をリクエストデータに詰める
        order.paymentMethodId = result.paymentMethodId.id
        // サーバーサイドに注文情報を送信する
        // サーバーは http://localhost:3000/v1/order/payment に POST
        fetch('http://localhost:3000/v1/order/payment', {
          method: 'POST',
          headers: { 'Content-TYpe': 'application/json' },
          body: JSON.stringify(order),
        })
          .then(function (result) {
            // HTTPレスポンスからボディの JSON を取り出して次のメソッドに引き渡す
            return result.json()
          })
          .then(function (response) {})
      }
    })
    .catch(function () {})
})
