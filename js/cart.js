// Atualiza a pagina de carrinho com itens, quantidades e total.
document.addEventListener("DOMContentLoaded", function () {
  var listNode = document.querySelector("#cart-items");
  if (!listNode) {
    return;
  }

  renderCartPage();
});

function renderCartPage() {
  var items = window.JSMP.getCartDetails();
  var listNode = document.querySelector("#cart-items");
  var summaryNode = document.querySelector("#cart-summary");

  if (!items.length) {
    listNode.innerHTML = '<div class="empty-state">Seu carrinho esta vazio. Explore as colecoes premium para continuar.</div>';
    summaryNode.innerHTML = '<div class="summary-card"><p class="muted-text">Adicione produtos para calcular o total.</p></div>';
    clearCartShipping();
    setupHeader();
    return;
  }

  listNode.innerHTML = items
    .map(function (item) {
      return [
        '<article class="cart-item reveal">',
        '<img class="cart-thumb" src="' + item.image + '" alt="' + item.name + '">',
        "<div>",
        '<span class="badge">' + item.brand + "</span>",
        "<h3>" + item.name + "</h3>",
        '<p class="muted-text">Valor unitario: ' + formatCurrency(item.price) + "</p>",
        '<p class="muted-text">Tamanho: ' + (item.size || "Nao escolhido") + " • Numero: " + (item.number || "Nao escolhido") + "</p>",
        '<label for="qty-' + item.productId + '">Quantidade</label>',
        '<input class="input qty-control" id="qty-' + item.itemKey + '" type="number" min="1" value="' + item.quantity + '" data-qty="' + item.itemKey + '">',
        "</div>",
        "<div>",
        '<strong class="product-price">' + formatCurrency(item.subtotal) + "</strong>",
        '<div class="button-row">',
        '<button class="btn-secondary" data-update-item="' + item.itemKey + '">Atualizar</button>',
        '<button class="btn-danger" data-remove-item="' + item.itemKey + '">Remover</button>',
        "</div>",
        "</div>",
        "</article>"
      ].join("");
    })
    .join("");

  var subtotal = items.reduce(function (total, item) {
    return total + item.subtotal;
  }, 0);
  var shippingQuote = getCartShipping();
  var shipping = shippingQuote ? shippingQuote.amount : 29.9;
  var total = subtotal + shipping;

  summaryNode.innerHTML = [
    '<div class="summary-card">',
    "<h3>Resumo do pedido</h3>",
    '<div class="summary-list">',
    '<div class="summary-line"><span>Subtotal</span><strong>' + formatCurrency(subtotal) + "</strong></div>",
    '<div class="summary-line"><span>Entrega premium</span><strong>' + formatCurrency(shipping) + "</strong></div>",
    '<div class="summary-line"><span>Total</span><strong class="product-price">' + formatCurrency(total) + "</strong></div>",
    "</div>",
    '<section class="shipping-card shipping-card-cart">',
    '<div class="shipping-card-header">',
    "<div>",
    '<span class="eyebrow">Frete</span>',
    "<h4>Entrega do pedido</h4>",
    "</div>",
    '<p class="muted-text">Atualize o CEP para recalcular valor e prazo.</p>',
    "</div>",
    '<div class="shipping-card-form">',
    '<div class="shipping-input-wrap">',
    '<label for="cart-cep">CEP</label>',
    '<input class="input shipping-input" id="cart-cep" type="text" inputmode="numeric" placeholder="00000-000" maxlength="9" value="' + (shippingQuote ? shippingQuote.cep : "") + '">',
    "</div>",
    '<button class="btn-secondary shipping-action" id="calc-cart-shipping" type="button">Atualizar</button>',
    "</div>",
    '<div id="cart-shipping-feedback" class="shipping-result' + (shippingQuote ? ' success' : '') + '">' + buildCartShippingMessage(shippingQuote) + "</div>",
    "</section>",
    '<div class="button-row">',
    '<a class="btn" href="./pagamento.html">Ir para pagamento</a>',
    '<button class="btn-ghost" id="clear-cart">Limpar carrinho</button>',
    "</div>",
    "</div>"
  ].join("");

  attachCartEvents();
  setupHeader();
}

function attachCartEvents() {
  document.querySelectorAll("[data-update-item]").forEach(function (button) {
    button.addEventListener("click", function () {
      var productId = Number(button.getAttribute("data-update-item"));
      var quantityField = document.querySelector('[data-qty="' + button.getAttribute("data-update-item") + '"]');
      window.JSMP.updateCartItem(button.getAttribute("data-update-item"), Number(quantityField.value));
      renderCartPage();
    });
  });

  document.querySelectorAll("[data-remove-item]").forEach(function (button) {
    button.addEventListener("click", function () {
      window.JSMP.removeCartItem(button.getAttribute("data-remove-item"));
      renderCartPage();
    });
  });

  var clearButton = document.querySelector("#clear-cart");
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      window.JSMP.clearCart();
      clearCartShipping();
      renderCartPage();
    });
  }

  var shippingButton = document.querySelector("#calc-cart-shipping");
  if (shippingButton) {
    shippingButton.addEventListener("click", function () {
      var items = window.JSMP.getCartDetails();
      var subtotal = items.reduce(function (sum, item) {
        return sum + item.subtotal;
      }, 0);
      var quantity = items.reduce(function (sum, item) {
        return sum + item.quantity;
      }, 0);
      var result = simulateShipping(document.querySelector("#cart-cep").value, subtotal, quantity);
      var feedback = document.querySelector("#cart-shipping-feedback");

      if (!result) {
        feedback.className = "shipping-result error";
        feedback.textContent = "Digite um CEP valido com 8 numeros.";
        return;
      }

      saveCartShipping(result);
      renderCartPage();
    });
  }
}

function buildCartShippingMessage(shippingQuote) {
  if (!shippingQuote) {
    return "Digite seu CEP para atualizar o valor e o prazo estimado da entrega.";
  }

  return '<strong>' + formatCurrency(shippingQuote.amount) + '</strong><span>Entrega em ate ' + shippingQuote.deadline + ' dias uteis para o CEP ' + shippingQuote.cep + ".</span>";
}

