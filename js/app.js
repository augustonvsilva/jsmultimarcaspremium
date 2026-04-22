// Inicializa a aplicacao e atualiza elementos globais da interface.
document.addEventListener("DOMContentLoaded", function () {
  window.JSMP.seedData();
  setupHeader();
  updateFooterYear();
});

var SHIPPING_STORAGE_KEY = "jsmp_cart_shipping";

function getBasePath() {
  return document.body.getAttribute("data-base-path") || "./";
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function setupHeader() {
  var session = window.JSMP.getSession();
  var statusNode = document.querySelector("[data-user-status]");
  var cartCountNode = document.querySelector("[data-cart-count]");
  var logoutButtons = document.querySelectorAll("[data-logout]");
  var currentPage = document.body.getAttribute("data-page");

  document.querySelectorAll(".main-nav a[data-page-link]").forEach(function (link) {
    if (link.getAttribute("data-page-link") === currentPage) {
      link.classList.add("active");
    }
  });

  if (statusNode) {
    statusNode.textContent = session ? "Ola, " + session.name.split(" ")[0] : "Entrar";
    statusNode.setAttribute("href", session ? getBasePath() + "admin/produtos.html" : getBasePath() + "login.html");

    if (session && session.role !== "admin") {
      statusNode.setAttribute("href", getBasePath() + "produtos.html");
    }
  }

  if (cartCountNode) {
    var items = window.JSMP.getCart().reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
    cartCountNode.textContent = "Carrinho (" + items + ")";
  }

  logoutButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      window.JSMP.logout();
      window.location.href = getBasePath() + "login.html";
    });
  });
}

function updateFooterYear() {
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });
}

function normalizeCep(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 8);
}

function simulateShipping(cep, subtotal, itemCount) {
  var normalizedCep = normalizeCep(cep);
  if (normalizedCep.length !== 8) {
    return null;
  }

  var regionFactor = Number(normalizedCep.charAt(0) || 0);
  var base = 18.9 + regionFactor * 1.75 + Math.max((itemCount || 1) - 1, 0) * 2.5;
  var discount = subtotal >= 700 ? 8 : subtotal >= 400 ? 4 : 0;
  var amount = Math.max(14.9, base - discount);
  var deadline = 2 + (regionFactor % 5);

  return {
    cep: normalizedCep,
    amount: Number(amount.toFixed(2)),
    deadline: deadline
  };
}

function saveCartShipping(shipping) {
  localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(shipping));
}

function getCartShipping() {
  try {
    var raw = localStorage.getItem(SHIPPING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function clearCartShipping() {
  localStorage.removeItem(SHIPPING_STORAGE_KEY);
}

