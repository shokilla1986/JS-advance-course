//константа с адресом сервера 
const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// let getRequest = (url) => {
//     return new Promise((resolve, reject) => {
//         let xhr = new XMLHttpRequest();
//         // window.ActiveXObject -> xhr = new ActiveXObject()
//         xhr.open("GET", url, true);
//         xhr.onreadystatechange = () => {
//             if(xhr.readyState === 4){
//                 if(xhr.status !== 200){
//                     reject('Error');
//                 } else {
//                     resolve(xhr.responseText);
//                 }
//             }
//         };
//         xhr.send();
//     })
// };
//
// getRequest('tel.json').then(data => {
//
// })

class List { //класс для создания списка товаров
    constructor(url, container, list = list2) {//принимаем адрес , блок товара(каталог или товары), имя объекта, с которого создаем
        this.container = container;//блок товара
        this.list = list;//имя объекта
        this.url = url;//адрес товаров на сервере
        this.goods = [];//массив товаров
        this.allProducts = [];//массив объектов
        this.filtered = [];//массив товаров найденных с помощью поиска
        this._init();//запускающий метод
    }
    getJson(url) {//метод возвращающий промис в виде объекта json
        return fetch(url ? url : `${API + this.url}`)//делаем запрос на сервер по указанной ссылке или исп-я API
            .then(result => result.json())//при + ответе получаем json файл с массивм объектов
            .catch(error => {//при - выводим ошибку
                console.log(error);
            })
    }
    handleData(data) { //метод, в котором полученный массив распаковываем и добавляем в массив товаров
        this.goods = [...data];//исп-ем команду sprad(...), для распаковки 
        this.render();//выводим полученный массив товаров в верстку
    }
    calcSum() {//метод подсчета общей стоимости товаров в массиве
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);//reduse - метод, кот обходит все эл-ы массива 
    }
    render() {//этим методом выводим объекты массива товаров в верстку
        const block = document.querySelector(this.container);//по селектору находим нужный блок
        for (let product of this.goods) {//в цикле создаем переменную каждого товара и обходим массив
            const productObj = new this.list[this.constructor.name](product);//создаем объект по каждому пройденному товару
            console.log(productObj);
            this.allProducts.push(productObj);//добавляем полученный объект в массив товаров
            block.insertAdjacentHTML('beforeend', productObj.render());//выводив в верстку , перед концом блока
        }
    }
    filter(value) {//метод для поиска товара
        const regexp = new RegExp(value, 'i');//создаем переменную, в кот передаем то, что ввели в строке поиска
        this.filtered = this.allProducts.filter(product => regexp.test(product.product_name));//создаем свойство filtered по полученным данным
        this.allProducts.forEach(el => {//обходим массив объектов 
            const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);//находим совпадения по id среди товаров
            if (!this.filtered.includes(el)) {//если не совпадает совпадает с поиском
                block.classList.add('invisible');//даем товару класс с display: none
            } else {
                block.classList.remove('invisible');//убираем невидимость и выводим на экран найденные товары
            }
        })
    }
    _init() {//изначально false, меняется при запуске ниже
        return false
    }
}

class Item {//класс создания единицы товара
    constructor(el, img = 'https://placehold.it/200x150') {//принимаем ЭЛ, который хотим создать и адрес картинки
        this.product_name = el.product_name;//товару даем имя полученного с сервера
        this.price = el.price;//цена
        this.id_product = el.id_product;//идентефикатор
        this.img = img;//картинка(пока единая)
    }
    render() {//метод создания отдельной карточки товара для вывода в верстку
        return `<div class="product-item" data-id="${this.id_product}"> 
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.product_name}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn"
                    data-id="${this.id_product}"
                    data-name="${this.product_name}"
                    data-price="${this.price}">Купить</button>
                </div>
            </div>`
    }
}

class ProductsList extends List {//создаем класс Каталога товаров, наследуясь от базового класса Список
    constructor(cart, container = '.products', url = "/catalogData.json") {//передаем с помощью cart методы, и блок куда и откуда 
        super(url, container);//берем поля базового класса
        this.cart = cart;//берем методы корзины
        this.getJson()//делаем запрос и получаем промис
            .then(data => this.handleData(data));//полученный json передаем в метода распаковки массива
    }
    _init() {//запускаем методы вывода
        document.querySelector(this.container).addEventListener('click', e => {//вешаем собитие по клику на блоки
            if (e.target.classList.contains('buy-btn')) {//если полученный евент содержит данный класс 
                this.cart.addProduct(e.target);//используем метод из cart и добавляем товар, на кот сделали клик
            }
        });
        document.querySelector('.search-form').addEventListener('submit', e => {//вешаем собитие на поиск и по собитию отправка(submit)
            e.preventDefault();//использем метод , который не дает перезагрузится странице
            this.filter(document.querySelector('.search-field').value)//в метод для поиска передаем полученное в поле ввода значение
        })
    }
}


class ProductItem extends Item { }//класс создания карточки товара каталога полностью копирует базовый класс Item

class Cart extends List {//создаем класс корзины наследуясь от базового класса Список
    constructor(container = ".cart-block", url = "/getBasket.json") {//даем на вход куда вставляем и откуда берем объекты
        super(url, container);//наследуем методы
        this.getJson()//используем метод для получения товаров с сервера, получаем промис
            .then(data => {//используем полученный промис и отправляем в метод распаковки
                this.handleData(data.contents);//используем св-во объекта для получения товаров
            });
    }
    addProduct(element) {//метод добавления товара в корзину, на вход получаем товар, на кот был клик
        this.getJson(`${API}/addToBasket.json`)//делаем запрос на сервер для проверки доступа
            .then(data => {//получаем объект
                if (data.result === 1) {//если есть полное соовпадение - доступ есть
                    let productId = +element.dataset['id'];//из массива dataset, в кот хранятся все data- значения берем id клика
                    let find = this.allProducts.find(product => product.id_product === productId);//создаем переменную, в кот передаем найденную с помощью метода массива find(поиск) 
                    if (find) {//если находим то увеличиваем количество и используем метод updateCart
                        find.quantity++;
                        this._updateCart(find);
                    } else {//если не находим то создаем карточку товара корзины, передавая на вход параметры, привязанные к кнопке
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['name'],
                            quantity: 1
                        };
                        this.goods = [product];
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            })
    }
    removeProduct(element) {//метод удаления товара из корзины
        this.getJson(`${API}/deleteFromBasket.json`)//делаем проверку на связь с сервером
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);//ищем товар в массиве
                    if (find.quantity > 1) {//если количество больше 1 - уменьшаем количество и делаем пересчет стоимости
                        find.quantity--;
                        this._updateCart(find);
                    } else {//удаляем товар из массива по полученному индексу
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove();//используем метод по работе с классами и удаляем 
                    }
                } else {
                    alert('Error');
                }
            })
    }
    _updateCart(product) {//метод изменения параметров корзины товаров
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);//находим товар по селектору
        block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`;//изменяем количество товара
        block.querySelector('.product-price').textContent = `$${product.quantity * product.price}`;//пересчитываем цену за все количество товара
    }
    _init() {//инициируем собитие, кот делает список корзины видимым по клику на корзину и наоборот
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
        document.querySelector(this.container).addEventListener('click', e => {//иницируем собитие на кнопку удаления товара из корзины
            if (e.target.classList.contains('del-btn')) {
                this.removeProduct(e.target);
            }
        })
    }

}

class CartItem extends Item {//класс единицы товара корзины
    constructor(el, img = 'https://placehold.it/50x100') {//получаем на вход елемент массива и картинку
        super(el, img);//наследуем методы 
        this.quantity = el.quantity;//добавляем свойство объекта - количество
    }
    render() {//метод создания карточки товара корзины
        return `<div class="cart-item" data-id="${this.id_product}">
            <div class="product-bio">
            <img src="${this.img}" alt="Some image">
            <div class="product-desc">
            <p class="product-title">${this.product_name}</p>
            <p class="product-quantity">Quantity: ${this.quantity}</p>
        <p class="product-single-price">$${this.price} each</p>
        </div>
        </div>
        <div class="right-block">
            <p class="product-price">$${this.quantity * this.price}</p>
            <button class="del-btn" data-id="${this.id_product}">&times;</button>
        </div>
        </div>`
    }
}
const list2 = {//создаем объект с помощью которого будем связывать методы
    ProductsList: ProductItem,
    Cart: CartItem
};

let cart = new Cart();//создаем объект корзина, методы которого будем использовать
let products = new ProductsList(cart);//передаем все методы корзины в объект каталог и запускаем страницу
products.getJson(`getProducts.json`).then(data => products.handleData(data));//делаем запрос на удаленный сервер

