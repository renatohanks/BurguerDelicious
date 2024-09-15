const menu = document.getElementById("menu");
const menuBebidas = document.getElementById("menuBebidas");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const payment = document.getElementById("payment");
const nameUser = document.getElementById("nameuser");
const paymentSelector = document.getElementById("paymentselector");

let cart = [];

cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

menuBebidas.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-semibold">${item.name}</p>
                <p class="text-sm">Qtd: ${item.quantity}</p>
                <p class="font-medium text-sm">R$: ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-cart-btn bg-red-800 text-white rounded-full px-2 hover:bg-red-500" data-name="${
              item.name
            }">
                x
            </button>
        </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name == name);
  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, Infelizmente estamos fechado...",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();

    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const paymentOption = payment.options[payment.selectedIndex].value;

  if (paymentOption === "select") {
    paymentSelector.classList.remove("hidden");
    paymentSelector.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => {
      return `
*${item.name}* 
*Qtd:* ${item.quantity} 
*Preço:* R$${item.price.toFixed(2)}
      `;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "+5581986068744";
  const url =
    "https://wa.me/" +
    phone +
    "?text=" +
    "*Pedido:* " +
    "%0a" +
    message +
    "%0a" +
    "*Total:* " +
    cartTotal.textContent +
    "%0a" +
    "%0a" +
    "*Nome:* " +
    nameUser.value +
    "%0a" +
    "*Endreço:* " +
    addressInput.value +
    "%0a" +
    "*Pagamento:* " +
    paymentOption +
    "%0a";
  window.open(url, "_blank").focus();

  cart = [];
  updateCartModal();
});

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-800");
} else {
  spanItem.classList.remove("bg-green-800");
  spanItem.classList.add("bg-red-500");
  spanItem.innerText = "Fechado Agora";
  spanItem.classList.add("font-semibold");
  spanItem.classList.add("text-white");
}
