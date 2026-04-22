// Renderiza grades de produtos reutilizando os dados do LocalStorage.
document.addEventListener("DOMContentLoaded", function () {
  var grids = document.querySelectorAll("[data-product-grid]");
  if (!grids.length) {
    return;
  }

  grids.forEach(function (grid) {
    renderGrid(grid);
  });
});

function renderGrid(grid) {
  var mode = grid.getAttribute("data-product-grid");
  var brand = grid.getAttribute("data-brand");
  var limit = Number(grid.getAttribute("data-limit") || 0);
  var products = window.JSMP.getProducts();

  if (mode === "featured") {
    products = products.filter(function (item) {
      return item.featured;
    });
  }

  if (brand) {
    products = products.filter(function (item) {
      return item.brand === brand;
    });
  }

  if (limit > 0) {
    products = products.slice(0, limit);
  }

  if (!products.length) {
    grid.innerHTML = '<div class="empty-state">Nenhum produto encontrado para esta selecao.</div>';
    return;
  }

  grid.innerHTML = products
    .map(function (product) {
      return [
        '<article class="product-card reveal">',
        '<img class="product-image" src="' + product.image + '" alt="' + product.name + '">',
        '<div class="product-content">',
        '<div class="product-top">',
        "<div>",
        '<span class="badge">' + product.brand + "</span>",
        "<h3>" + product.name + "</h3>",
        "</div>",
        '<strong class="product-price">' + formatCurrency(product.price) + "</strong>",
        "</div>",
        '<div class="detail-row">Tamanhos disponiveis: ' + product.sizes.join(", ") + "</div>",
        '<div class="detail-row">Numeracao: ' + product.numbers.join(", ") + "</div>",
        '<p class="muted-text">' + product.description + "</p>",
        '<div class="tag-list">',
        product.sizes.map(function (size) {
          return '<span class="tag">' + size + "</span>";
        }).join(""),
        "</div>",
        '<div class="button-row">',
        '<a class="btn" href="./produto.html?id=' + product.id + '">Ver produto</a>',
        '<button class="btn-secondary" data-add-cart="' + product.id + '">Compra rapida</button>',
        "</div>",
        "</div>",
        "</article>"
      ].join("");
    })
    .join("");

  grid.querySelectorAll("[data-add-cart]").forEach(function (button) {
    button.addEventListener("click", function () {
      var productId = Number(button.getAttribute("data-add-cart"));
      window.JSMP.addToCart(productId);
      alert("Produto adicionado ao carrinho com sucesso.");
      setupHeader();
    });
  });
}

