let tg = window.Telegram.WebApp;

let selectedItems = {
  "1": { name: "Вок 1", price: 125, quantity: 0 },
  "2": { name: "Вок 2", price: 200, quantity: 0 },
  "3": { name: "Вок 3", price: 220, quantity: 0 },
  "4": { name: "Вок 4", price: 310, quantity: 0 },
  "5": { name: "Вок 5", price: 300, quantity: 0 },
  "6": { name: "Снек 1", price: 400, quantity: 0 },
  "7": { name: "Снек 2", price: 340, quantity: 0 },
  "8": { name: "Суп 1", price: 230, quantity: 0 },
  "9": { name: "Суп 2", price: 111, quantity: 0 },
  "10": { name: "Суп 3", price: 376, quantity: 0 },
  "11": { name: "Пельмени 1", price: 321, quantity: 0 },
  "12": { name: "Пельмени 2", price: 322, quantity: 0 },
  "13": { name: "Пельмени 3", price: 625, quantity: 0 },
  "14": { name: "Роллы 1", price: 241, quantity: 0 },
  "15": { name: "Роллы 2", price: 541, quantity: 0 },
  "16": { name: "Роллы 3", price: 236, quantity: 0 },
  "17": { name: "роллы 4", price: 562, quantity: 0 },
  "18": { name: "роллы 5", price: 263, quantity: 0 },
  "18": { name: "роллы 6", price: 563, quantity: 0 },
  "19": { name: "роллы 7", price: 755, quantity: 0 },
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

  let selectedItemsArray = [];

  for (let item in selectedItems) {
    if (selectedItems[item].quantity > 0) {
      let itemCost = selectedItems[item].price * selectedItems[item].quantity;
      let imagePath = ""; // путь к изображению товара

      // Определите путь к изображению в зависимости от ID товара
      if (item <= 5) {
        imagePath = "bok.webp"; // путь к изображению для товаров вок
      } else if (item <= 9) {
        imagePath = "snek.webp"; // путь к изображению для товаров снек
      } else if (item <= 13) {
        imagePath = "syp.webp"; // путь к изображению для товаров суп
      } else if (item <= 17) {
        imagePath = "pelmen.webp"; // путь к изображению для товаров пельмени
      } else {
        imagePath = "roll.webp"; // путь к изображению для товаров роллы
      }

      popupContent.innerHTML += `
        <div class="selected-item">
          <img class="selected-item-img" src="${imagePath}" alt="${selectedItems[item].name}">
          <div class="selected-item-info">
            <p class="selected-item-name">${selectedItems[item].name}</p>
            <p class="selected-item-description">${itemDescriptions[parseInt(item) - 1]}</p>
            <p class="selected-item-price">${selectedItems[item].quantity} шт. - ${itemCost} руб.</p>
            <button class="remove-from-cart" data-item-id="${item}">Убрать из корзины</button>
          </div>
        </div>
      `;

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

// Функция для обработки клика на кнопках товара
function handleItemButtonClick(itemId, counterId, isAddButton, isMinusButton) {
  let btn = document.getElementById(`btn${itemId}`);
  let counter = document.getElementById(counterId);
  let quantity = selectedItems[itemId].quantity;

  if (isAddButton) {
    // Клик на кнопку с ценой
    if (quantity === 0) {
      updateSelectedItems(itemId, 1);
      counter.textContent = selectedItems[itemId].quantity;
      counter.style.display = "inline-block";
      btn.style.display = "none";
      document.getElementById(`btn${itemId}_minus`).style.display = "inline-block";
      document.getElementById(`btn${itemId}_plus`).style.display = "inline-block";
    }
  } else if (isMinusButton) {
      // Клик на кнопку "-"
      if (quantity > 0) {
        updateSelectedItems(itemId, quantity - 1);
        counter.textContent = selectedItems[itemId].quantity;
      }
      if (selectedItems[itemId].quantity === 0) {
        counter.style.display = "none";
        btn.style.display = "inline-block";
        document.getElementById(`btn${itemId}_minus`).style.display = "none";
        document.getElementById(`btn${itemId}_plus`).style.display = "none";
      }
    } else {
      // Клик на кнопку "+"
      updateSelectedItems(itemId, quantity + 1);
      counter.textContent = selectedItems[itemId].quantity;
    }
  
    updatePopupContent();
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
      document.getElementById(`btn${itemId}`).addEventListener("click", () => handleItemButtonClick(itemId, counterId, true, false));
      document.getElementById(`btn${itemId}_minus`).addEventListener("click", () => handleItemButtonClick(itemId, counterId, false, true));
      document.getElementById(`btn${itemId}_plus`).addEventListener("click", () => handleItemButtonClick(itemId, counterId, false, false));
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
      // Получаем элемент товара
      let item14 = document.getElementById("btn15");
      // Прокручиваем страницу к товару
      item14.scrollIntoView({ behavior: "smooth" });
    });
  
    // Проверяем видимость кнопки корзины при загрузке страницы
    updateCartButtonVisibility();
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
  
  const popup = document.querySelector('.popup');
  const cartIcon = document.getElementById('cartIcon');
  
  cartIcon.addEventListener('click', function() {
    // Проверяем, есть ли товары в корзине
    let anyItemsInCart = Object.values(selectedItems).some(item => item.quantity > 0);
  
    // Если есть товары, отображаем всплывающее окно с содержимым корзины
    if (anyItemsInCart) {
      updatePopupContent();
      popup.style.display = 'block';
    }
  });
  
 // Обработчик клика на кнопку "Убрать из корзины"
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('remove-from-cart')) {
    let itemId = event.target.getAttribute('data-item-id');
    updateSelectedItems(itemId, 0); // Устанавливаем количество товара в корзине равным 0
    updatePopupContent(); // Обновляем содержимое всплывающего окна
  }
});

// Обработчик клика на кнопку закрытия всплывающего окна
document.addEventListener('click', function(event) {
  if (event.target.id === 'closePopup') {
    closePopup();
  }
});

// Функция для закрытия всплывающего окна корзины
function closePopup() {
  popup.style.display = "none";
}

// Функция для обновления содержимого всплывающего окна элемента
function updateItemPopupContent(itemId) {
  let itemPopupContent = document.querySelector('.item-popup-content');
  itemPopupContent.innerHTML = '<span class="close-item-popup" id="closeItemPopup">&times;</span>';

  let item = selectedItems[itemId];
  let itemCost = item.price * item.quantity;

  itemPopupContent.innerHTML += `
    <img class="item-popup-img" src="path/to/your/image${itemId}.jpg" alt="${item.name}">
    <p class="item-popup-description">${itemDescriptions[parseInt(itemId) - 1]}</p>
    <p class="item-popup-price">${item.quantity} шт. - ${itemCost} руб.</p>
    <button class="remove-from-cart" data-item-id="${itemId}">Убрать из корзины</button>
  `;

  // Добавляем обработчик события для кнопки "Убрать из корзины" во всплывающем окне элемента
  document.getElementById("closeItemPopup").addEventListener("click", closeItemPopup);

  // Функция для закрытия всплывающего окна элемента
  function closeItemPopup() {
    itemPopup.style.display = "none";
  }
}

// Обработчик клика на кнопку всплывающего окна элемента
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('item-img')) {
    let itemId = event.target.getAttribute('data-item-id');
    updateItemPopupContent(itemId); // Обновляем содержимое всплывающего окна элемента
    itemPopup.style.display = 'block'; // Отображаем всплывающее окно элемента
  }
});

// Обработчик клика на кнопку закрытия всплывающего окна элемента
document.addEventListener('click', function(event) {
  if (event.target.id === 'closeItemPopup') {
    itemPopup.style.display = "none";
  }
});

// Функция для обновления внешнего вида кнопок в зависимости от количества выбранных товаров
function updateButtonAppearance(itemId) {
  let quantity = selectedItems[itemId].quantity;
  let btn = document.getElementById(`btn${itemId}`);
  let minusButton = document.getElementById(`btn${itemId}_minus`);
  let plusButton = document.getElementById(`btn${itemId}_plus`);
  
  if (quantity === 0) {
    btn.style.display = "inline-block";
    minusButton.style.display = "none";
    plusButton.style.display = "none";
  } else {
    btn.style.display = "none";
    minusButton.style.display = "inline-block";
    plusButton.style.display = "inline-block";
  }
}
// Обработчик клика на кнопку "Убрать из корзины"
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('remove-from-cart')) {
    let itemId = event.target.getAttribute('data-item-id');
    updateSelectedItems(itemId, 0); // Устанавливаем количество товара в корзине равным 0
    updatePopupContent(); // Обновляем содержимое всплывающего окна
    updateButtonAppearance(itemId); // Обновляем внешний вид кнопок
  }
});
