const menu = document.getElementById("menu")// menu dos itens
const cartBtn = document.getElementById("cart-btn")// botão carrinho
const cartModal = document.getElementById("div-meu-carrinho") //carrinho
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkouatBtn = document.getElementById("checkout-btn")// botão finalizar compras
const closeModalBtn = document.getElementById("close-modal-btn")//botão fechar
const cartCounter = document.getElementById("cart-count")//veja meu carrinho
const addressInput = document.getElementById("address")//input address
const addressWarn = document.getElementById("address-warn")
const dateSpan = document.getElementById("date-span")



let cart = [];

// abri modal do carinho
cartBtn.addEventListener("click", function () {//adicionando o click ao elemento, botão
    cartModal.style.display = "flex" //dando o valor adocionado apos o click, add flex, tirando o hidden
    updateCartModal()
})

// fechar modal do carrinho
closeModalBtn.addEventListener("click", function () {//adicionando o click ao elemento, botão
    cartModal.style.display = "none" //dando o valor adocionado apos o click, valor none no hidden

})
//fechar modal quando clickar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {//target ele é um dom e pega o elemento da div no qual estou clikando
        cartModal.style.display = " none"

    }
})
menu.addEventListener("click", function (event) {
    //console.log(event.target); teste captura de elemento, qual item foi clickado
    let parentButton = event.target.closest(".add-to-cart-btn")
    //console.log(parentButton); teste valor click

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //adicionar no carrinho

        addTocart(name, price)
    }
})
function addTocart(name, price) {
    const verificaritem = cart.find(item => item.name === name)
    // verifica um por um da lista e se ele encontrar a condição ele devolve esse item

    if (verificaritem) {
        verificaritem.quantity += 1;//se o item já existe, aumenta apenas a quantidade + 1

    } else {
        cart.push({ // ele adicona OBJ para a lista
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

//atualizar carrinho

function updateCartModal() {
    cartItemsContainer.innerHTML = ""

    let total = 0;

    cart.forEach(item => {
        const cartItemElemente = document.createElement("div") //criando elemento do cartmodal
        cartItemElemente.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElemente.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="overflow-auto">
                <p class="font-bold">${item.name}</p>
                <p class="font-arial">Quantidade: ${item.quantity}</p>
                <p class="font-medium mt-1" >${item.price.toFixed(2)}</p>
            </div>
            <div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    remover
                </button>
            </div>
        </div>
    `
        total += item.price * item.quantity // soma entre item + preço  item x quantidade
        cartItemsContainer.appendChild(cartItemElemente) // mostra a estrutura html feita pelo js

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length; //mostra quantos item for

}

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        console.log(name);

        removeItemCart(name)
    }

})
function removeItemCart(name) {

    const index = cart.findIndex(item => item.name === name)
    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity = -1
            updateCartModal();
            return;
        }
        cart.splice(index, 1)
        updateCartModal();
    }

}

addressInput.addEventListener("input", function (event) {

    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

//finalizar pedido
checkouatBtn.addEventListener("click", function () {

    const isOpen = checkRestauranteOpen();

    if (!isOpen) {

        Toastify({
            text: "Ops, estamos fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "rigth", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "red",
            },

        }).showToast();

        return;
    }
    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
    //console.log(cart);
    // enviar pedido para api whats
    const cartItems = cart.map((item) => {

        return (
            `${item.name} (Quantidade; ${item.quantity}) Preço:R$${item.price} |`
        )
    }).join("")
    //console.log(cartItems);

    const msg = encodeURIComponent(cartItems)
    const phone = "13991401104"
    window.open(`https://wa.me/${phone}?text=${msg}Endereço:${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal()
})

function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 1 && hora <100;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-500")

} else {
    spanItem.classList.remove("bg-green-500")
    spanItem.classList.add("bg-red-500")

}
