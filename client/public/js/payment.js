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
submitButton.addEventListener('click', function (event) {})
