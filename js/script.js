//создаем ссылку на API к серверу , которую будем использовать для скачивания и распаковки массивов с товарами
const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

//создаем массив с объектами
class ProductsList { //создаем поля класса(переменные)
   constructor(container = '.products') {//в какой блок верстки будем добавлять
      this.container = container;
      this.goods = []; //массив товаров
      this.allProducts = []; //массив объектов
      this._fetchProducts()//создаем массив объектов из json, преобразуя строку в массив 
         .then(data => {// data - объект js, полученный из json и содержащий массив объектов товара
            this.goods = [...data];//с помощью команды sprad распаковываем массив объектов и передаем в goods
            this.render()//созданные блоки товаров передаем в верстку
         });
   }


   //на уроке изучали промисы(запросы на сервер), и теперь вместо ручного ввода данных в массив, использем их
   // _fetchProducts() {
   //    this.goods = [
   //       { id: 1, title: 'Notebook', price: 2000 },
   //       { id: 2, title: 'Mouse', price: 20 },
   //       { id: 3, title: 'Keyboard', price: 200 },
   //       { id: 4, title: 'Gamepad', price: 50 },
   //    ];


   _fetchProducts() {//метод , делающий ajax запрос на сервер, в интересующую нас директорию, и возвращающий промис с файлом json
      return fetch(`${API}/catalogData.json`)//запрос и промис
         .then(result => result.json())//then - это положительный ответ с сервера, с функцией возвращающей json
         .catch(error => {//catch - отсутствие ответа с сервера, возвращающая ошибку
            console.log(error);
         })
   }

   render() {//метод создания блоков для верстки
      const block = document.querySelector(this.container);//создаем переменную, находящую первый нужный класс
      for (let product of this.goods) {//в цикле обходим массив 
         const productObj = new ProductItem(product);//создаем объект, по каждому пройденномму эл-ту массива
         this.allProducts.push(productObj);//записываем каждый объект в другой массив 
         block.insertAdjacentHTML('beforeend', productObj.render())//добавляем в конец нужного нам блока верстку каждой карточки товара
      }
   }
   getSum() {
      /*let sum = 0;
      for(let product of this.goods){
          sum += product.price;
      }*/
      //reduce используется для последовательной обработки каждого элемента массива с сохранением промежуточного результата.

      let sum = 0;
      this.goods.forEach(function (item) {
         sum += item.price;
      });
      alert(sum);

      // let res = this.allProducts.reduce((sum, item) => sum += item.price, 0);
      // alert(res);
   }
}

//создание каждого элемента товара , который мы проходим в цикле массива
class ProductItem { //создаем объект товара 
   constructor(product, img = 'https://placehold.it/200x150') {//поля класса товара
      this.title = product.product_name;//записываем в title имя товара
      this.price = product.price;//цену
      this.id = product.id_product;//уникальный id
      this.img = img;//картинку

   }
   //создние верстки каждой отдельной карточки товара
   render() {
      return `<div class="product-item" data-id="${this.id}">
              <img src="${this.img}" alt="Some img">
              <h3>${this.title}</h3>
              <p>${this.price}</p>
              <button class="buy-btn">Купить</button>
          </div>`
   }
}


//запускаем функцию создания страницы с товарами
let list = new ProductsList();
list.render();
// list.getSum();



//создаем класс Cart, для добавления товаров в корзину. Делаю по шаблону с ProductList

class Cart {
   constructor(container = '.cart') {//в какой блок верстки будем добавлять
      this.container = container;
      this.cartGoods = []; //массив товаров
      this.cartAllProducts = []; //массив объектов
      this._fetchCart()//создаем массив объектов из json, преобразуя строку в массив 
         .then(data => {// data - объект js, полученный из json и содержащий массив объектов товара
            this.cartGoods = [...data.contents];//с помощью команды sprad распаковываем массив объектов и передаем в goods
            this.render()//созданные блоки товаров передаем в верстку
         });
   }

   _fetchCart() {//метод , делающий ajax запрос на сервер, в интересующую нас директорию, и возвращающий промис с файлом json
      return fetch(`${API}/getBasket.json`)//запрос и промис
         .then(result => result.json())//then - это положительный ответ с сервера, с функцией возвращающей json
         .catch(error => {//catch - отсутствие ответа с сервера, возвращающая ошибку
            console.log(error);
         })
   }

   render() {//метод создания блоков для верстки
      const block = document.querySelector(this.container);//создаем переменную, находящую первый нужный класс
      for (let product of this.cartGoods) {//в цикле обходим массив 
         const productObj = new ItemCart(product);//создаем объект, по каждому пройденномму эл-ту массива
         this.cartAllProducts.push(productObj);//записываем каждый объект в другой массив 
         block.insertAdjacentHTML('beforeend', productObj.render())//добавляем в конец нужного нам блока верстку каждой карточки товара
      }

      // addGoods(){ }

      // deleteGoods() { }

      // payGoods() { }


   }
}

class ItemCart {   //создаем объект товара в корзину
   constructor(product, img = 'https://placehold.it/200x150') {
      this.title = product.product_name;
      this.price = product.price;
      this.id = product.id_product;
      this.img = img;
      this.quantity = product.quantity;
   }

   render() { //метод вывода объекта в файл 
      return `<div class="cart__item" data-id="${this.id}">
              <img src="${this.img}" alt="Some img">
              <h3>${this.title}</h3>
              <p>${this.price}</p>
              <p>Количество ${this.quantity}</p>
              <button class="buy-btn">Купить</button>
          </div>`
   }
}

//функция вывода окошка корзины
let buttonOpen = document.querySelector('.cart__button');//находим селектор c которого будем делать вызов
let cart = document.querySelector('.cart');//селектор, на который будем вешать вызов
//по собитию клик с помощью метода тогл классу cart добавляем класс open/close , для которых прописали в стилях видимость
buttonOpen.onclick = function () {
   cart.classList.toggle('open');
   cart.classList.toggle('close');
};


//запускаем вызов создания корзины
let basket = new Cart();
basket.render();
