
//создаем массив с объектами
const products = [
   { id: 1, title: 'Notebook', price: 2000, img: "image\item__image\item_1.jpeg" },
   { id: 2, title: 'Mouse', price: 20, img: '/image/item__image/item_2' },
   { id: 3, title: 'Keyboard', price: 200, img: '../../image/item__image/item_3' },
   { id: 4, title: 'Gamepad', price: 50, img: '../image/item__image/item_4' },
];

//Функция для формирования верстки каждого товара
const renderProduct = (product) => {
   return `<div class="product__item">
               <img scr="${product.img}" alt="картинка">
               <h3>${product.title}</h3>
               <p>${product.price}</p>
               <button class="buy__btn">Купить</button>
           </div>`
};

//функция , которая добавляет в файл html
const renderPage = list => {
   document.querySelector('.products').innerHTML = list.map(item => renderProduct(item)).join("");
};
//запускаем функцию
renderPage(products);