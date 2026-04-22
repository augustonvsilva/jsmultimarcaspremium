document.addEventListener("DOMContentLoaded", function () {
  var root = document.querySelector("#product-detail");
  if (!root) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var productId = Number(params.get("id"));
  var product = window.JSMP.getProductById(productId);

  if (!product) {
    root.innerHTML = '<div class="empty-state">Produto nao encontrado. Volte para o catalogo e escolha outro item.</div>';
    return;
  }

  renderProductDetail(root, product);
});

function renderProductDetail(root, product) {
  root.innerHTML = [
    '<article class="glass-panel product-detail-card reveal">',
    '<div class="product-detail-media">',
    '<img id="product-main-image" class="product-detail-image" src="' + product.image + '" alt="' + product.name + '">',
    '<div class="product-gallery">',
    (product.images || [product.image]).map(function (image, index) {
      return '<button class="product-thumb-button' + (index === 0 ? ' active' : '') + '" type="button" data-product-thumb="' + image + '"><img class="product-thumb-image" src="' + image + '" alt="' + product.name + '"></button>';
    }).join(""),
    "</div>",
    "</div>",
    '<div class="product-detail-content">',
    '<span class="badge">' + product.brand + "</span>",
    "<h1>" + product.name + "</h1>",
    '<strong class="product-price">' + formatCurrency(product.price) + "</strong>",
    '<p class="page-subtitle">' + product.description + "</p>",
    '<div class="detail-row">Disponivel em tamanhos: ' + product.sizes.join(", ") + "</div>",
    '<div class="detail-row">Numeracao: ' + product.numbers.join(", ") + "</div>",
    '<section class="shipping-card shipping-card-product">',
    '<div class="shipping-card-header">',
    "<div>",
    '<span class="eyebrow">Entrega</span>',
    "<h3>Consulte o frete</h3>",
    "</div>",
    '<p class="muted-text">Simule prazo e valor antes de adicionar ao carrinho.</p>',
    "</div>",
    '<div class="shipping-card-form">',
    '<div class="shipping-input-wrap">',
    '<label for="product-cep">CEP</label>',
    '<input class="input shipping-input" id="product-cep" type="text" inputmode="numeric" placeholder="00000-000" maxlength="9">',
    "</div>",
    '<button class="btn-secondary shipping-action" id="product-shipping-button" type="button">Calcular</button>',
    "</div>",
    '<div id="product-shipping-feedback" class="shipping-result">Informe seu CEP para ver prazo e valor estimado.</div>',
    "</div>",
    '<form id="product-purchase-form" class="form-grid product-purchase-form">',
    '<div class="field">',
    '<label for="selected-size">Tamanho</label>',
    '<select class="select" id="selected-size" name="size" required>',
    '<option value="">Selecione</option>',
    product.sizes.map(function (size) {
      return '<option value="' + size + '">' + size + "</option>";
    }).join(""),
    "</select>",
    "</div>",
    '<div class="field">',
    '<label for="selected-number">Numeracao</label>',
    '<select class="select" id="selected-number" name="number" required>',
    '<option value="">Selecione</option>',
    product.numbers.map(function (number) {
      return '<option value="' + number + '">' + number + "</option>";
    }).join(""),
    "</select>",
    "</div>",
    '<div class="field-full">',
    '<button class="btn" type="submit">Adicionar ao carrinho</button>',
    '<a class="btn-secondary" href="./produtos.html">Voltar ao catalogo</a>',
    "</div>",
    "</form>",
    '<div id="product-feedback" class="feedback">Escolha o tamanho e a numeracao antes de adicionar.</div>',
    "</div>",
    "</article>"
  ].join("");

  document.querySelectorAll("[data-product-thumb]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelector("#product-main-image").src = button.getAttribute("data-product-thumb");
      document.querySelectorAll("[data-product-thumb]").forEach(function (item) {
        item.classList.remove("active");
      });
      button.classList.add("active");
    });
  });

  document.querySelector("#product-shipping-button").addEventListener("click", function () {
    var cep = document.querySelector("#product-cep").value;
    var result = simulateShipping(cep, product.price, 1);
    var feedback = document.querySelector("#product-shipping-feedback");

    if (!result) {
      feedback.className = "shipping-result error";
      feedback.textContent = "Digite um CEP valido com 8 numeros.";
      return;
    }

    feedback.className = "shipping-result success";
    feedback.innerHTML = '<strong>' + formatCurrency(result.amount) + '</strong><span>Entrega em ate ' + result.deadline + ' dias uteis para o CEP ' + result.cep + ".</span>";
  });

  document.querySelector("#product-purchase-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var size = event.target.size.value;
    var number = event.target.number.value;
    var feedback = document.querySelector("#product-feedback");

    if (!size || !number) {
      feedback.className = "feedback error";
      feedback.textContent = "Selecione tamanho e numeracao para continuar.";
      return;
    }

    window.JSMP.addToCart(product.id, {
      size: size,
      number: number
    });

    feedback.className = "feedback success";
    feedback.textContent = "Produto adicionado ao carrinho com sucesso.";
    setupHeader();
  });
}

