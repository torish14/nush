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

// 決済処理が正常に終了した時
function onComplete(response) {
  shutdown()

  // スピナー終了
  hideSpinner()

  if (response.error) {
    onError()
  } else if (response.paymentIntentStatus === 'succeeded') {
    // 確定ボタンを消して完了メッセージを表示
    displayMessage()
  } else {
    displayNotYetMessage()
  }
}

function onError() {
  shutdown()

  if (
    !document
      .querySelector('.spinner-border')
      .classList.contains('collapse')
  ) {
    hideSpinner()
  }
  // エラーメッセージの表示
  displayError()
}

function shutdown() {
  card.unmount()
  hideButton()
}

// スピナーの非表示
function hideSpinner() {
  document.querySelector('.spinner-border').classList.add('collapse')
}

// スピナーの表示
function displaySpinner() {
  document
    .querySelector('.spinner-border')
    .classList.remove('collapse')
}

// エラーメッセージ
function hideError() {
  document
    .querySelector('.contents-payment-error')
    .classList.add('collapse')
}

function displayError() {
  document
    .querySelector('.contents-payment-error')
    .classList.remove('collapse')
}

// 成功メッセージ
function displayMessage() {
  document
    .querySelector('.contents-payment-result')
    .classList.remove('collapse')
}

function hideMessage() {
  document
    .querySelector('.contents-payment-result')
    .classList.add('collapse')
}

function displayNotYetMessage() {
  document
    .querySelector('.contents-payment-not-yet')
    .classList.remove('collapse')
}

function hideNotYetMessage() {
  document
    .querySelector('.contents-payment-not-yet')
    .classList.add('collapse')
}

// 注文確定ボタン
function hideButton() {
  document
    .querySelector('#payment-form-submit')
    .classList.add('collapse')
}

function displayButton() {
  document
    .querySelector('#payment-form-submit')
    .classList.remove('collapse')
}
