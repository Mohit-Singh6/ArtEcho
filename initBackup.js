const express = require("express");
const app = express();
const Listing = require('./models/listing.js');

const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ArtEcho');
}

main()
  .then(() => {
    console.log("Connection -><- Made!");
  })
  .catch(err => console.log(err));

Listing.deleteMany({})
  .then((res) => {
    console.log("Deleted everything");
  });

let data = [
  {
    title: 'Photograph',
    artist: 'Elena Veyra',
    Type: 'Photograph',
    price: 2500,
    image: {
      url: 'https://images.unsplash.com/photo-1655064404062-c7978bc7b5c7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U3RhcmZhbGwlMjBPdmVyJTIwQXJjdHVydXMlMjBwYWludGluZ3xlbnwwfHwwfHx8MA%3D%3D',
      filename: 'Starfall Over Arcturus'
    },
    yearCreated: 2025,
    medium: 'Digital Painting',
    description: 'No description provided.',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: 'Whispering Pines',
    artist: 'Rajat Malhotra',
    Type: 'Paintings',
    price: 1800,
    image: {
      url: 'https://plus.unsplash.com/premium_photo-1671101505937-9589a428f9cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8V2hpc3BlcmluZyUyMFBpbmVzJTIwcGFpbnRpbmd8ZW58MHx8MHx8fDA%3D',
      filename: 'Whispering Pines'
    },
    yearCreated: 2025,
    medium: 'Oil on Canvas',
    description: 'No description provided.',
    reviews: [ ObjectId('694a659ed82fb8de729ad0c4') ],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: 'Echoes of Silence',
    artist: 'Marco DeLuca',
    Type: 'Mixed Media',
    price: 2100,
    image: {
      url: 'https://images.unsplash.com/photo-1751730740172-3398667ea5f3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RWNob2VzJTIwb2YlMjBTaWxlbmNlJTIwcGFpbnRpbmd8ZW58MHx8MHx8fDA%3D',
      filename: 'Echoes of Silence'
    },
    yearCreated: 2025,
    medium: 'Mixed Media',
    description: 'No description provided.',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: 'Crimson Horizon',
    artist: 'Aisha Rahman',
    Type: 'Sculpture',
    price: 1400,
    image: {
      url: 'https://images.unsplash.com/photo-1633604912043-85dafa12aa01?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fENyaW1zb24lMjBIb3Jpem9uJTIwcGFpbnRpbmd8ZW58MHx8MHx8fDA%3D',
      filename: 'Crimson Horizon'
    },
    yearCreated: 2025,
    medium: 'Oil on Wood',
    description: 'No description provided.',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: 'The Forgotten Harbor',
    artist: 'Daniel Sørensen',
    Type: 'Paintings',
    price: 1700,
    image: {
      url: 'https://images.unsplash.com/photo-1705599773290-05b988d20dd6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VGhlJTIwRm9yZ290dGVuJTIwSGFyYm9yJTIwcGFpbnRpbmd8ZW58MHx8MHx8fDA%3D',
      filename: 'The Forgotten Harbor'
    },
    yearCreated: 2025,
    medium: 'Watercolor',
    description: 'No description provided.',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: 'City of Glass',
    artist: 'Mei Ling Zhao',
    Type: 'Digital Art',
    price: 2800,
    image: {
      url: 'https://plus.unsplash.com/premium_photo-1697730007755-86770b6cd276?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q2l0eSUyMG9mJTIwR2xhc3MlMjBwYWludGluZ3xlbnwwfHwwfHx8MA%3D%3D',
      filename: 'City of Glass'
    },
    yearCreated: 2025,
    medium: 'Digital Collage',
    description: 'No description provided.',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: 'Desert Reverie',
    artist: 'Carlos Ortega',
    Type: 'Paintings',
    price: 2300,
    image: {
      url: 'https://images.unsplash.com/photo-1695842585219-c59d73519571?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RGVzZXJ0JTIwUmV2ZXJpZSUyMHBhaW50aW5nfGVufDB8fDB8fHww',
      filename: 'Desert Reverie'
    },
    yearCreated: 2025,
    medium: 'Oil on Canvas',
    description: 'No description provided.',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: "Ocean's Memory",
    artist: 'Sofia Dimitrova',
    Type: 'Paintings',
    price: 1900,
    image: {
      url: 'https://images.unsplash.com/photo-1643749290194-e12f495a6a28?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8T2NlYW4lRTIlODAlOTlzJTIwTWVtb3J5JTIwcGFpbnRpbmd8ZW58MHx8MHx8fDA%3D',
      filename: "Ocean's Memory"
    },
    yearCreated: 2025,
    medium: 'Acrylic on Canvas',
    description: 'No description provided.',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: 'Fragments of Tomorrow',
    artist: 'Noah Klein',
    Type: 'Digital Art',
    price: 1100,
    image: {
      url: 'https://images.unsplash.com/photo-1691775109593-fdf6a80970bc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEZyYWdtZW50cyUyMG9mJTIwVG9tb3Jyb3clMjBwYWludGluZ3xlbnwwfHwwfHx8MA%3D%3D',
      filename: 'Fragments of Tomorrow'
    },
    yearCreated: 2025,
    medium: 'Ink on Paper',
    description: 'No description provided.',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: 'Herd in the village',
    artist: 'Pablo',
    Type: 'Other',
    price: 4000,
    image: {
      url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGFpbnRpbmd8ZW58MHx8MHx8fDA%3D',
      filename: 'Herd in the village'
    },
    yearCreated: 2025,
    medium: 'Canvas',
    description: 'No description provided.',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: 'Geralt of Rivia',
    artist: 'Jaskier',
    Type: 'Mixed Media',
    price: 9999,
    image: {
      url: 'https://res.cloudinary.com/dfrzovgup/image/upload/v1766426746/ArtEcho_Images_dev/z4mmyv6jdybl8tv8sx8n.jpg',
      filename: 'ArtEcho_Images_dev/z4mmyv6jdybl8tv8sx8n'
    },
    yearCreated: 2025,
    medium: 'Canvas',
    description: '',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  },
  {
    title: 'filetest3',
    artist: 'mohit',
    Type: 'Sculpture',
    price: 4444,
    image: {
      url: 'https://res.cloudinary.com/dfrzovgup/image/upload/v1761059304/ArtEcho_Images_dev/wz1aolyptkqyzkkxawpm.jpg',
      filename: 'ArtEcho_Images_dev/wz1aolyptkqyzkkxawpm'
    },
    yearCreated: 2025,
    medium: 'mohit',
    description: '',
    reviews: [],
    owner: ObjectId('68f4c46f6414834b8f31b051'),
  }
];


const initialize = async () => {
  data = data.map((object) => ({ ...object, owner: '68f4c46f6414834b8f31b051' })); // map/replace each object in the data array with object itself but with owner key:value too! and reassign that to data as map function doesnot make changes in the original but rather creates a new one with changes. 
  await Listing.insertMany(data);
  console.log(data);
};

initialize();
