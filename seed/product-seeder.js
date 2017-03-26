const Product = require('../models/product');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/shopping');

const products = [
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Ffxboxart.jpg/250px-Ffxboxart.jpg',
    title: 'Final Fantasy X',
    description: 'Best RPG game !!!',
    price: 15,
  }),
  new Product({
    imagePath: 'http://static4.gamespot.com/uploads/scale_medium/1197/11970954/2909465-2212158-box_dmc4.jpg',
    title: 'Devil May Cry 4',
    description: 'Best Hack & Slash game !!!',
    price: 20,
  }),
  new Product({
    imagePath: 'http://media.moddb.com/images/games/1/13/12706/resident-evil3.jpg',
    title: 'Resident Evil 3',
    description: 'Best Horror Action game !!!',
    price: 10,
  }),
  new Product({
    imagePath: 'https://s-media-cache-ak0.pinimg.com/originals/84/85/da/8485da479631d20193f2b04c569d3c79.jpg',
    title: 'Sleeping Dogs',
    description: 'Best Storyline, Action game !!!',
    price: 32,
  }),
  new Product({
    imagePath: 'http://anigame.mx/wp-content/uploads/2013/03/grand-theft-auto-v1-e1364708612634.png',
    title: 'Grand Theft Auto V',
    description: 'Best Open World game !!!',
    price: 60,
  }),
  new Product({
    imagePath: 'https://cdn.jaleco.com/gen_screenshots/en-US/windows/counter-strike-global-offensive/large/image-14-430x535.jpg',
    title: 'Counter Strike - Global Offensive',
    description: 'Best Esport FPS game !!!',
    price: 14,
  }),
];

function exit() {
  mongoose.disconnect();
}

let done = 0;
products.forEach((product) => {
  product.save().then((err, res) => {
    done += 1;
    if (done === products.length) {
      exit();
    }
  }).catch((e) => {
    console.log(e);
  });
});
