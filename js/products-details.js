// Base de dados e funcoes compartilhadas do sistema.
(function () {
  var STORAGE_KEYS = {
    products: "jsmp_products",
    cart: "jsmp_cart",
    session: "jsmp_session",
    users: "jsmp_users",
    orders: "jsmp_orders",
    expenses: "jsmp_expenses"
  };

  function buildImage(brand, product, accent) {
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="920" viewBox="0 0 800 920">',
      '<defs>',
      '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">',
      '<stop offset="0%" stop-color="#111111"/>',
      '<stop offset="100%" stop-color="#2a2a2a"/>',
      "</linearGradient>",
      '</defs>',
      '<rect width="800" height="920" rx="42" fill="url(#bg)"/>',
      '<circle cx="620" cy="170" r="170" fill="' + accent + '" fill-opacity="0.28"/>',
      '<circle cx="160" cy="760" r="210" fill="#000000" fill-opacity="0.24"/>',
      '<text x="80" y="160" fill="#f1cf6c" font-family="Segoe UI, Arial" font-weight="700" font-size="56">' + brand + "</text>",
      '<text x="80" y="250" fill="#ffffff" font-family="Segoe UI, Arial" font-weight="700" font-size="72">' + product + "</text>",
      '<rect x="80" y="340" width="640" height="420" rx="36" fill="#0e0e0e" stroke="#d4af37" stroke-opacity="0.55"/>',
      '<path d="M250 650 C320 510, 490 500, 560 650" stroke="#f1cf6c" stroke-width="18" fill="none" stroke-linecap="round"/>',
      '<path d="M300 610 C360 450, 470 430, 520 610" stroke="#ffffff" stroke-opacity="0.86" stroke-width="14" fill="none" stroke-linecap="round"/>',
      '<rect x="300" y="600" width="220" height="44" rx="18" fill="#d4af37" fill-opacity="0.88"/>',
      '<text x="80" y="830" fill="#d8cfbc" font-family="Segoe UI, Arial" font-size="34">JS Multimarcas Premium</text>',
      "</svg>"
    ].join("");

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  var defaultProducts = [
    { id: 1, brand: "Nike", name: "Jaqueta Urban Gold", description: "Jaqueta premium com acabamento estruturado, forro confortavel e visual urbano para compor looks de destaque.", price: 429.9, cost: 248.5, sizes: ["P", "M", "G", "GG"], numbers: ["38", "40", "42", "44"], image: buildImage("NIKE", "Urban Gold", "#d4af37"), featured: true },
    { id: 2, brand: "Nike", name: "Tênis Air Premium", description: "Tenis com proposta esportiva sofisticada, solado macio e design pensado para uso diario com presenca premium.", price: 699.9, cost: 421.3, sizes: ["P", "M", "G"], numbers: ["38", "39", "40", "41", "42", "43"], image: buildImage("NIKE", "Air Premium", "#9f7a15"), featured: true },
    { id: 3, brand: "Adidas", name: "Conjunto Black Edition", description: "Conjunto premium de pegada contemporanea, ideal para quem quer conforto e visual refinado no mesmo look.", price: 389.9, cost: 222.4, sizes: ["P", "M", "G", "GG"], numbers: ["38", "40", "42", "44"], image: buildImage("ADIDAS", "Black Edition", "#b8921f"), featured: true },
    { id: 4, brand: "Adidas", name: "Sneaker Elite Runner", description: "Sneaker com perfil esportivo moderno, detalhes elegantes e excelente versatilidade para a rotina.", price: 649.9, cost: 390.2, sizes: ["M", "G", "GG"], numbers: ["39", "40", "41", "42", "43"], image: buildImage("ADIDAS", "Elite Runner", "#e2c15c"), featured: false },
    { id: 5, brand: "Lacoste", name: "Polo Signature Luxe", description: "Polo sofisticada com corte premium, tecido encorpado e acabamento discreto para looks casuais elegantes.", price: 319.9, cost: 174.8, sizes: ["P", "M", "G", "GG"], numbers: ["38", "40", "42", "44"], image: buildImage("LACOSTE", "Signature Luxe", "#c6a136"), featured: true },
    { id: 6, brand: "Lacoste", name: "Tênis Club Premium", description: "Modelo casual com identidade clean, conforto para o dia todo e leitura de luxo discreto.", price: 579.9, cost: 331.7, sizes: ["P", "M", "G"], numbers: ["38", "39", "40", "41", "42"], image: buildImage("LACOSTE", "Club Premium", "#8f6e16"), featured: false },
    { id: 7, brand: "Armani", name: "Camisa Executive Fit", description: "Camisa de alfaiataria moderna com caimento premium e proposta versatil para ocasioes executivas e sociais.", price: 559.9, cost: 318.6, sizes: ["P", "M", "G", "GG"], numbers: ["38", "40", "42", "44"], image: buildImage("ARMANI", "Executive Fit", "#f1cf6c"), featured: true },
    { id: 8, brand: "Armani", name: "Blazer Milano Noir", description: "Blazer com corte elegante, estrutura refinada e visual de alto impacto para compor a vitrine premium.", price: 899.9, cost: 521.4, sizes: ["M", "G", "GG"], numbers: ["40", "42", "44"], image: buildImage("ARMANI", "Milano Noir", "#cda73c"), featured: false },
    { id: 9, brand: "Hugo Boss", name: "Polo Metropolitan", description: "Polo de visual marcante e sofisticado, pensada para quem busca elegancia sem perder conforto.", price: 349.9, cost: 196.4, sizes: ["P", "M", "G", "GG"], numbers: ["38", "40", "42", "44"], image: buildImage("HUGO BOSS", "Metropolitan", "#d4af37"), featured: true },
    { id: 10, brand: "Hugo Boss", name: "Tênis Urban Tailor", description: "Tenis com linhas premium e acabamento urbano, criado para destacar o visual com conforto.", price: 629.9, cost: 372.1, sizes: ["P", "M", "G"], numbers: ["39", "40", "41", "42", "43", "44"], image: buildImage("HUGO BOSS", "Urban Tailor", "#99761b"), featured: false }
  ];

  var defaultUsers = [
    { id: 1, name: "Administrador", email: "admin@jsmultimarcas.com", password: "admin123", role: "admin" }
  ];

  var defaultOrders = [
    {
      id: 1001,
      customerName: "Cliente Premium",
      customerEmail: "cliente@exemplo.com",
      paymentMethod: "credito",
      status: "paid",
      createdAt: "2026-04-18T14:15:00.000Z",
      subtotal: 1369.7,
      shipping: 29.9,
      total: 1399.6,
      items: [
        { productId: 2, name: "Tênis Air Premium", brand: "Nike", quantity: 1, price: 699.9, subtotal: 699.9 },
        { productId: 5, name: "Polo Signature Luxe", brand: "Lacoste", quantity: 1, price: 319.9, subtotal: 319.9 },
        { productId: 9, name: "Polo Metropolitan", brand: "Hugo Boss", quantity: 1, price: 349.9, subtotal: 349.9 }
      ]
    },
    {
      id: 1002,
      customerName: "Marina Souza",
      customerEmail: "marina@exemplo.com",
      paymentMethod: "pix",
      status: "paid",
      createdAt: "2026-04-21T18:40:00.000Z",
      subtotal: 899.9,
      shipping: 29.9,
      total: 929.8,
      items: [
        { productId: 8, name: "Blazer Milano Noir", brand: "Armani", quantity: 1, price: 899.9, subtotal: 899.9 }
      ]
    }
  ];

  var defaultExpenses = [
    { id: 2001, description: "Campanha premium de anuncios", category: "Marketing", amount: 320, createdAt: "2026-04-17T10:00:00.000Z" },
    { id: 2002, description: "Embalagens personalizadas", category: "Operacional", amount: 180, createdAt: "2026-04-20T15:00:00.000Z" }
  ];

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeProduct(product) {
    var fallback = defaultProducts.find(function (item) {
      return item.id === product.id;
    }) || {};

    return {
      id: product.id,
      brand: product.brand || fallback.brand || "Premium",
      name: product.name || fallback.name || "Produto",
      description: product.description || fallback.description || "Produto premium da JS Multimarcas Premium.",
      price: Number(product.price || fallback.price || 0),
      cost: Number(product.cost || fallback.cost || 0),
      sizes: product.sizes || fallback.sizes || ["P", "M", "G"],
      numbers: product.numbers || fallback.numbers || ["38", "40", "42"],
      images: normalizeImages(product, fallback),
      image: (product.images && product.images[0]) || product.image || (fallback.images && fallback.images[0]) || fallback.image || buildImage("PREMIUM", "Produto", "#d4af37"),
      featured: Boolean(typeof product.featured === "boolean" ? product.featured : fallback.featured)
    };
  }

  function normalizeImages(product, fallback) {
    var images = [];

    if (Array.isArray(product.images) && product.images.length) {
      images = product.images.slice();
    } else if (product.image) {
      images = [product.image];
    } else if (Array.isArray(fallback.images) && fallback.images.length) {
      images = fallback.images.slice();
    } else if (fallback.image) {
      images = [fallback.image];
    } else {
      images = [buildImage("PREMIUM", "Produto", "#d4af37")];
    }

    return images;
  }

  function seedData() {
    if (!localStorage.getItem(STORAGE_KEYS.products)) {
      writeJSON(STORAGE_KEYS.products, defaultProducts);
    }

    if (!localStorage.getItem(STORAGE_KEYS.users)) {
      writeJSON(STORAGE_KEYS.users, defaultUsers);
    }

    if (!localStorage.getItem(STORAGE_KEYS.cart)) {
      writeJSON(STORAGE_KEYS.cart, []);
    }

    if (!localStorage.getItem(STORAGE_KEYS.orders)) {
      writeJSON(STORAGE_KEYS.orders, defaultOrders);
    }

    if (!localStorage.getItem(STORAGE_KEYS.expenses)) {
      writeJSON(STORAGE_KEYS.expenses, defaultExpenses);
    }
  }

  function getProducts() {
    return readJSON(STORAGE_KEYS.products, defaultProducts).map(normalizeProduct);
  }

  function saveProducts(products) {
    writeJSON(STORAGE_KEYS.products, products);
  }

  function getUsers() {
    return readJSON(STORAGE_KEYS.users, defaultUsers);
  }

  function saveUsers(users) {
    writeJSON(STORAGE_KEYS.users, users);
  }

  function getSession() {
    return readJSON(STORAGE_KEYS.session, null);
  }

  function saveSession(user) {
    writeJSON(STORAGE_KEYS.session, user);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.session);
  }

  function register(payload) {
    var users = getUsers();
    var exists = users.some(function (user) {
      return user.email.toLowerCase() === payload.email.toLowerCase();
    });

    if (exists) {
      return { ok: false, message: "Este email ja esta cadastrado." };
    }

    var user = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: "customer"
    };

    users.push(user);
    saveUsers(users);
    saveSession(user);
    return { ok: true, user: user };
  }

  function login(email, password) {
    var user = getUsers().find(function (item) {
      return item.email.toLowerCase() === email.toLowerCase() && item.password === password;
    });

    if (!user) {
      return { ok: false, message: "Email ou senha invalidos." };
    }

    saveSession(user);
    return { ok: true, user: user };
  }

  function getCart() {
    return readJSON(STORAGE_KEYS.cart, []);
  }

  function saveCart(cart) {
    writeJSON(STORAGE_KEYS.cart, cart);
  }

  function getProductById(productId) {
    return getProducts().find(function (item) {
      return item.id === productId;
    }) || null;
  }

  function addToCart(productId, options) {
    var cart = getCart();
    var payload = options || {};
    var key = [
      productId,
      payload.size || "",
      payload.number || ""
    ].join("|");

    var item = cart.find(function (entry) {
      return (entry.key || "legacy|" + entry.productId) === key;
    });

    if (item) {
      item.quantity += 1;
    } else {
      cart.push({
        key: key,
        productId: productId,
        quantity: 1,
        size: payload.size || "",
        number: payload.number || ""
      });
    }

    saveCart(cart);
  }

  function updateCartItem(itemKey, quantity) {
    var cart = getCart()
      .map(function (item) {
        var currentKey = item.key || "legacy|" + item.productId;
        if (currentKey === itemKey) {
          item.quantity = quantity;
        }
        return item;
      })
      .filter(function (item) {
        return item.quantity > 0;
      });

    saveCart(cart);
  }

  function removeCartItem(itemKey) {
    saveCart(
      getCart().filter(function (item) {
        return (item.key || "legacy|" + item.productId) !== itemKey;
      })
    );
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartDetails() {
    var products = getProducts();
    return getCart()
      .map(function (item) {
        var product = products.find(function (entry) {
          return entry.id === item.productId;
        });

        if (!product) {
          return null;
        }

        return {
          itemKey: item.key || "legacy|" + item.productId,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
          size: item.size || "",
          number: item.number || "",
          subtotal: product.price * item.quantity
        };
      })
      .filter(Boolean);
  }

  function getBrands() {
    return ["Nike", "Adidas", "Lacoste", "Armani", "Hugo Boss"];
  }

  function getOrders() {
    return readJSON(STORAGE_KEYS.orders, defaultOrders);
  }

  function saveOrders(orders) {
    writeJSON(STORAGE_KEYS.orders, orders);
  }

  // Registra uma venda finalizada para alimentar a tela de faturamento.
  function createOrder(payload) {
    var orders = getOrders();
    var order = {
      id: Date.now(),
      customerName: payload.customerName || "Cliente",
      customerEmail: payload.customerEmail || "",
      paymentMethod: payload.paymentMethod,
      status: "paid",
      createdAt: new Date().toISOString(),
      subtotal: payload.subtotal,
      shipping: payload.shipping,
      total: payload.total,
      items: payload.items
    };

    orders.unshift(order);
    saveOrders(orders);
    return order;
  }

  function getExpenses() {
    return readJSON(STORAGE_KEYS.expenses, defaultExpenses);
  }

  function saveExpenses(expenses) {
    writeJSON(STORAGE_KEYS.expenses, expenses);
  }

  function addExpense(payload) {
    var expenses = getExpenses();
    var expense = {
      id: Date.now(),
      description: payload.description,
      category: payload.category,
      amount: payload.amount,
      createdAt: new Date().toISOString()
    };

    expenses.unshift(expense);
    saveExpenses(expenses);
    return expense;
  }

  function removeExpense(expenseId) {
    saveExpenses(
      getExpenses().filter(function (item) {
        return item.id !== expenseId;
      })
    );
  }

  window.JSMP = {
    seedData: seedData,
    getProducts: getProducts,
    getProductById: getProductById,
    saveProducts: saveProducts,
    getUsers: getUsers,
    register: register,
    login: login,
    getSession: getSession,
    logout: logout,
    getCart: getCart,
    addToCart: addToCart,
    updateCartItem: updateCartItem,
    removeCartItem: removeCartItem,
    clearCart: clearCart,
    getCartDetails: getCartDetails,
    getBrands: getBrands,
    getOrders: getOrders,
    createOrder: createOrder,
    getExpenses: getExpenses,
    addExpense: addExpense,
    removeExpense: removeExpense
  };
})();
