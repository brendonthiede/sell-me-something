import { cards } from "./cards.mjs";

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

const CUSTOMERS = cards.customers;
const WORDS = cards.words;

shuffle(CUSTOMERS);
let customerIndex = 0;
shuffle(WORDS);
let wordIndex = 0;

function nextCustomer() {
    const customer = CUSTOMERS[customerIndex++];
    if (customerIndex >= CUSTOMERS.length) {
        shuffle(CUSTOMERS);
        customerIndex = 0;
    }
    return customer;
}

function createCard(text) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.draggable = true;
    card.innerHTML = `<div draggable="true" class="container"><h4><b>${text}</b></h4></div>`;

    return card;
}

function selectCard(card) {
    const selected0 = document.querySelector("#selected0");
    const selected1 = document.querySelector("#selected1");
    let targetCard = selected1;

    if (selected0.innerText === card.innerText || selected1.innerText === card.innerText) {
        return;
    }

    if (selected0.innerText === "") {
        targetCard = selected0;
    }
    targetCard.querySelector(".content").innerText = card.innerText;
    targetCard.classList.remove("empty");
    targetCard.classList.add("visible");
    document.querySelectorAll('div.visible').forEach(card => {
        addDragHandlers(card);
        card.onclick = function () {
            unSelectCard(this);
        };
    });
}

function unSelectCard(card) {
    // get the id of card
    const selected1 = document.querySelector("#selected1");
    if (card.id === "selected0" && selected1.innerText !== "") {
        card.querySelector(".content").innerText = selected1.innerText;
        card = selected1;
    }

    card.classList.add("empty");
    card.classList.remove("visible");
    card.querySelector(".content").innerText = "";
    document.querySelectorAll('div.visible').forEach(addDragHandlers);
}

function setNextCustomerName() {
    const customerContainer = document.getElementById("customer");
    const customer = nextCustomer();
    customerContainer.innerHTML = "";
    const card = createCard(customer);
    customerContainer.appendChild(card);
    // const img = document.getElementById("customerImage");
    // img.src = "https://source.unsplash.com/featured/?face," + customer;
    // img.alt = customer;
    // img.title = customer;
}

function setWordCards() {
    const wordContainer = document.getElementById("words");
    wordContainer.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        const word = WORDS[wordIndex++];
        if (wordIndex >= WORDS.length) {
            shuffle(WORDS);
            wordIndex = 0;
        }
        const card = createCard(word);
        wordContainer.appendChild(card);
    }

    // Add event listeners to each card to select it on click
    document.querySelectorAll("#words>div.card").forEach(card => {
        card.onclick = function () {
            selectCard(this);
        };
    });

    // Add event listeners for drag and drop to reorder the cards
    document.querySelectorAll('#words>div.card').forEach(addDragHandlers);
}

// call this function to show a list of customers with image search links
function customerList() {
    CUSTOMERS.forEach(customer => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="https://www.bing.com/images/search?qft=+filterui:photo-clipart+filterui:license-L2_L3_L4&q=${customer}" target="_blank">${customer}</a>`;
        document.getElementById("customerList").appendChild(li);
    });
}

document.getElementById("next").onclick = setNextCustomerName;
setNextCustomerName();
document.getElementById("new").onclick = setWordCards;
setWordCards();

// customerList();

let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    // Stops some browsers from redirecting
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    // Only process the drop if the source and target are different
    if (dragSrcEl !== this) {
        // Swap the innerHTML of the dragged and target elements
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}

function handleDragEnd() {
    // Update the column styles after the drag operation is complete
    let cols = document.querySelectorAll('#words>div.card');
    cols.forEach((col) => {
        col.classList.remove('over');
    });
}

function addDragHandlers(col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragenter', () => col.classList.add('over'), false);
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('dragleave', () => col.classList.remove('over'), false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
    // disable highlighting of text, but still allow dragging
    col.addEventListener('selectstart', (e) => e.preventDefault(), false);
}
