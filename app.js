let tg = window.Telegram.WebApp;

let selectedItems = {
  "1": { name: "Вок 1", price: 5, quantity: 0 },
  "2": { name: "Вок 2", price: 4, quantity: 0 },
  "3": { name: "Вок 3", price: 6, quantity: 0 },
  "4": { name: "Вок 4", price: 2, quantity: 0 },
  "5": { name: "Вок 5", price: 1, quantity: 0 },
  "6": { name: "Снек 1", price: 3, quantity: 0 },
  "7": { name: "Снек 2", price: 2, quantity: 0 },
  "8": { name: "Суп 1", price: 3, quantity: 0 },
  "9": { name: "Суп 2", price: 4, quantity: 0 },
  "10": { name: "Суп 3", price: 3, quantity: 0 },
  "11": { name: "Пельмени 1", price: 5, quantity: 0 },
  "12": { name: "Пельмени 2", price: 2, quantity: 0 },
  "13": { name: "Пельмени 3", price: 3, quantity: 0 },
  "14": { name: "Роллы 1", price: 4, quantity: 0 },
  "15": { name: "Роллы 2", price: 3, quantity: 0 },
  "16": { name: "Роллы 3", price: 5, quantity: 0 },
  "17": { name: "роллы 4", price: 2, quantity: 0 },
  "18": { name: "роллы 5", price: 1, quantity: 0 },
  "18": { name: "роллы 6", price: 3, quantity: 0 },
  "19": { name: "роллы 7", price: 5, quantity: 0 },
};

// Массив с описаниями товаров
const itemDescriptions = [
    "Описание товара вок 1",
    "Описание товара вок 2",
    "Описание товара вок 3",
    "Описание товара вок 4",
    "Описание товара вок 5",
    "Описание товара снек 1",
    "Описание товара снек 2",
    "Описание товара суп 1",
    "Описание товара суп 2",
    "Описание товара суп 3",
    "Описание товара пельмени 1",
    "Описание товара пельмени 2",
    "Описание товара пельмени 3",
    "Описание товара роллы 1",
    "Описание товара роллы 2",
    "Описание товара роллы 3",
    "Описание товара роллы 4",
    "Описание товара роллы 5",
    "Описание товара роллы 6",
    "Описание товара роллы 7",
];

// Функция для обновления информации о количестве выбранных товаров
function updateSelectedItems(itemId, quantity) {
  selectedItems[itemId].quantity = quantity;
  let counter = document.getElementById(`counter${itemId}`);
  if (quantity === 0) {
    counter.style.display = "none";
  } else {
    counter.style.display = "inline-block";
  }
}

// Функция для получения общей стоимости выбранных товаров
function getTotalCost() {
  let totalCost = 0;
  for (let item in selectedItems) {
    totalCost += selectedItems[item].price * selectedItems[item].quantity;
  }
  return totalCost;
}

// Функция для обновления содержимого всплывающего окна
function updatePopupContent() {
  let popupContent = document.querySelector('.popup-content');
  popupContent.innerHTML = '<span class="close" id="closePopup">&times;</span>';

  for (let item in selectedItems) {
    if (selectedItems[item].quantity > 0) {
      let itemCost = selectedItems[item].price * selectedItems[item].quantity;
      popupContent.innerHTML += `<p>${selectedItems[item].name}: ${selectedItems[item].quantity} шт. - ${itemCost} руб.</p>`;
    }
  }

  let totalCost = getTotalCost();
  popupContent.innerHTML += `<p>Итого: ${totalCost} руб.</p>`;
}

// Функция для обработки клика на кнопке товара
function handleItemClick(itemId, counterId) {
  let btn = document.getElementById(`btn${itemId}`);
  let counter = document.getElementById(counterId);

  btn.addEventListener("click", function(){
    if (tg.MainButton.isVisible) {
        tg.MainButton.hide();
    }
    else {
        tg.MainButton.setText(`Вы выбрали товар ${itemId}!`);
        item = itemId;
        tg.MainButton.show();
        updateSelectedItems(itemId, 1);
        counter.textContent = selectedItems[itemId].quantity;
        counter.style.display = "inline-block";
        btn.style.display = "none";
        document.getElementById(`btn${itemId}_minus`).style.display = "inline-block";
        document.getElementById(`btn${itemId}_plus`).style.display = "inline-block";
        updatePopupContent();
    }
  });
}

function handleCounterClick(itemId, action) {
  document.getElementById(`btn${itemId}_${action}`).addEventListener("click", function() {
    let quantity = selectedItems[itemId].quantity;
    if (action === "plus") {
      updateSelectedItems(itemId, quantity + 1);
    } else if (action === "minus" && quantity > 0) {
      updateSelectedItems(itemId, quantity - 1);
    }
    let counter = document.getElementById(`counter${itemId}`);
    
    if (selectedItems[itemId].quantity === 0) {
      counter.style.display = "none"; // Скрыть счетчик, когда количество товара становится равным 0
      document.getElementById(`btn${itemId}`).style.display = "inline-block"; // Вернуть кнопку "Add"
      document.getElementById(`btn${itemId}_minus`).style.display = "none"; // Скрыть кнопку "Minus"
      document.getElementById(`btn${itemId}_plus`).style.display = "none"; // Скрыть кнопку "Plus"
    } else {
      counter.textContent = selectedItems[itemId].quantity;
      document.getElementById(`btn${itemId}`).textContent = "Update"; // Изменить текст кнопки на "Update", если количество товара больше 0
    }
    
    updatePopupContent();
  });
}

// Функция для обновления видимости кнопки корзины
function updateCartButtonVisibility() {
  let anyItemsInCart = Object.values(selectedItems).some(item => item.quantity > 0);
  let cartIcon = document.getElementById('cartIcon');

  if (anyItemsInCart) {
      cartIcon.style.display = 'block';
  } else {
      cartIcon.style.display = 'none';
  }
}

// Обработчик события загрузки контента
document.addEventListener('DOMContentLoaded', function () {
  let counters = document.querySelectorAll('.counter');
  let cartBtn = document.getElementById('cartBtn');

  counters.forEach(counter => {
    counter.addEventListener('DOMSubtreeModified', function () {
      let anyCounterGreaterThanZero = Array.from(counters).some(counter => parseInt(counter.textContent) > 0);

      if (anyCounterGreaterThanZero) {
        cartBtn.style.display = 'inline-block';
      } else {
        cartBtn.style.display = 'none';
      }
    });
  });

  // Устанавливаем обработчики для кнопок товаров и их счетчиков
  for (let itemId in selectedItems) {
    let counterId = `counter${itemId}`;
    handleItemClick(itemId, counterId);
    handleCounterClick(itemId, "plus");
    handleCounterClick(itemId, "minus");
  }
 // Проверяем видимость кнопки корзины при загрузке страницы
  updateCartButtonVisibility();
});

// Функция для обновления содержимого корзины и её видимости
function updateCart() {
  updatePopupContent();
  updateCartButtonVisibility(); // Добавляем вызов этой функции для обновления видимости кнопки корзины
}

// Обработчик события клика на кнопку "Корзина"
let cartIcon = document.getElementById('cartIcon');
let popup = document.getElementById('popup');

cartIcon.addEventListener('click', function() {
  // Проверяем, есть ли товары в корзине
  let anyItemsInCart = Object.values(selectedItems).some(item => item.quantity > 0);

  // Если есть товары, отображаем всплывающее окно с содержимым корзины
  if (anyItemsInCart) {
      updatePopupContent();
      popup.style.display = 'block';

      // Обработчик события клика на кнопку закрытия всплывающего окна
      function closePopup() {
          popup.style.display = "none";
      }

      // Удаляем существующий обработчик клика на кнопку закрытия перед добавлением нового
      document.getElementById("closePopup").removeEventListener("click", closePopup);

      // Добавляем новый обработчик клика на кнопку закрытия
      document.getElementById("closePopup").addEventListener("click", closePopup);
  }
});

// Функция для обновления видимости кнопки корзины
function updateCartButtonVisibility() {
  let anyItemsInCart = Object.values(selectedItems).some(item => item.quantity > 0);
  let cartIcon = document.getElementById('cartIcon');

  if (anyItemsInCart) {
    cartIcon.style.display = 'block';
  } else {
    cartIcon.style.display = 'none';
  }
}

// Функция для обновления содержимого всплывающего окна
function updatePopupContent() {
  let popupContent = document.querySelector('.popup-content');
  popupContent.innerHTML = '<span class="close" id="closePopup">&times;</span>';

  let selectedItemsArray = [];

  for (let item in selectedItems) {
    if (selectedItems[item].quantity > 0) {
      let itemCost = selectedItems[item].price * selectedItems[item].quantity;
      popupContent.innerHTML += `<p>${selectedItems[item].name}: ${selectedItems[item].quantity} шт. - ${itemCost} руб.</p>`;

      // Добавляем номер товара в массив столько раз, сколько он был выбран
      for (let i = 0; i < selectedItems[item].quantity; i++) {
        selectedItemsArray.push(item);
      }
    }
  }

  let totalCost = getTotalCost();
  popupContent.innerHTML += `<p>Итого: ${totalCost} руб.</p>`;

  // Создаем кнопку для отправки данных в Telegram
  popupContent.innerHTML += `<button id="sendToTelegram">Оформить заказ</button>`;

  const sendToTelegram = document.getElementById('sendToTelegram');
  sendToTelegram.addEventListener('click', () => {
    const selectedItemsString = selectedItemsArray.join(',');
    tg.sendData(selectedItemsString);
  });
}

// Обработчик события загрузки контента
document.addEventListener('DOMContentLoaded', function () {
  let counters = document.querySelectorAll('.counter');
  let cartIcon = document.getElementById('cartIcon');

  counters.forEach(counter => {
    counter.addEventListener('DOMSubtreeModified', function () {
      let anyCounterGreaterThanZero = Array.from(counters).some(counter => parseInt(counter.textContent) > 0);

      if (anyCounterGreaterThanZero) {
        cartIcon.style.display = 'block';
      } else {
        cartIcon.style.display = 'none';
      }
    });
  });

  // Устанавливаем обработчики для кнопок товаров и их счетчиков
  for (let itemId in selectedItems) {
    let counterId = `counter${itemId}`;
    handleItemClick(itemId, counterId);
    handleCounterClick(itemId, "plus");
    handleCounterClick(itemId, "minus");
  }

  // Обработчик для кнопки "Вок", чтобы прокрутить страницу к самому верху экрана
document.getElementById("btnBok").addEventListener("click", function() {
  // Прокручиваем страницу к самому верху экрана
  window.scrollTo({ top: 0, behavior: "smooth" });
});

  // Обработчик для кнопки "Снеки", чтобы прокрутить страницу к товару 
  document.getElementById("btnSnek").addEventListener("click", function() {
    // Получаем элемент товара 
    let item10 = document.getElementById("btn5");
    // Прокручиваем страницу к товару 
    item10.scrollIntoView({ behavior: "smooth" });
  });
});

// Обработчик для кнопки "Супы", чтобы прокрутить страницу к товару 
document.getElementById("btnSyp").addEventListener("click", function() {
  // Получаем элемент товара 
  let item10 = document.getElementById("btn7");
  // Прокручиваем страницу к товару 
  item10.scrollIntoView({ behavior: "smooth" });
});

// Обработчик для кнопки "Пельмени", чтобы прокрутить страницу к товару 
document.getElementById("btnPelmen").addEventListener("click", function() {
  // Получаем элемент товара 
  let item14 = document.getElementById("btn10");
  // Прокручиваем страницу к товару 
  item14.scrollIntoView({ behavior: "smooth" });
});

// Обработчик для кнопки "Роллы", чтобы прокрутить страницу к товару 
document.getElementById("btnRoll").addEventListener("click", function() {
  // Получаем элемент товара №
  let item14 = document.getElementById("btn15");
  // Прокручиваем страницу к товару 
  item14.scrollIntoView({ behavior: "smooth" });
});


// Получаем все элементы с фото товаров
const itemImages = document.querySelectorAll(".img");

// Получаем элементы всплывающего окна для описания товара
const itemPopup = document.getElementById("itemPopup");
const itemPopupImg = document.getElementById("itemPopupImg");
const itemPopupDescription = document.getElementById("itemPopupDescription");
const closeItemPopup = document.getElementById("closeItemPopup");

// Обработчик нажатия на фото товара
itemImages.forEach((img, index) => {
    img.addEventListener("click", () => {
        // Отображаем всплывающее окно
        itemPopup.style.display = "block";

        // Устанавливаем фото и описание товара
        itemPopupImg.src = img.src;
        itemPopupDescription.textContent = itemDescriptions[index];
    });
});

// Обработчик закрытия всплывающего окна
closeItemPopup.addEventListener("click", () => {
    itemPopup.style.display = "none";
});

// Закрытие всплывающего окна при клике вне его области
window.addEventListener("click", (event) => {
    if (event.target === itemPopup) {
        itemPopup.style.display = "none";
    }
});