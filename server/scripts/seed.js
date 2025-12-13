const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/Product");

const sampleProducts = [
  {
    name: "Nebula Quencher Tumbler",
    price: 1299,
    category: "Sip",
    description:
      "40oz stainless steel tumbler in a dreamy blue-purple swirl. Keeps ice frozen for 2 days.",
    images: ["/assets/products/tumbler-blue.jpg"],
    tags: ["Travel", "Viral", "Pastel"],
    stock: 15,
    isBlindBox: false,
    featured: true,
    specifications: {
      material: "Stainless Steel",
      dimensions: '4.5" x 4.5" x 11"',
      weight: "1.2 lbs",
      warranty: "1 year",
    },
  },
  {
    name: "Chibi Astronaut Desk Fan",
    price: 899,
    category: "Tech",
    description:
      "Rechargeable bladeless fan shaped like a spaceman. The helmet lights up!",
    images: ["/assets/products/astro-fan.jpg"],
    tags: ["Desk Setup", "Summer", "Kawaii"],
    stock: 40,
    isBlindBox: false,
    featured: true,
    specifications: {
      material: "ABS Plastic",
      dimensions: '6" x 4" x 8"',
      weight: "0.8 lbs",
      warranty: "6 months",
    },
  },
  {
    name: "Ruha Mystery Minion",
    price: 499,
    category: "Play",
    description: "Which Despicable Me character will you get? It's a surprise!",
    images: ["/assets/products/mystery-box.jpg"],
    tags: ["Gift", "Toy", "Collectibles"],
    stock: 100,
    isBlindBox: true,
    featured: true,
    blindBoxContents: [
      {
        name: "Stuart Minion",
        image: "/assets/blindbox/stuart.jpg",
        probability: 0.25,
      },
      {
        name: "Kevin Minion",
        image: "/assets/blindbox/kevin.jpg",
        probability: 0.25,
      },
      {
        name: "Bob Minion",
        image: "/assets/blindbox/bob.jpg",
        probability: 0.25,
      },
      {
        name: "Dave Minion",
        image: "/assets/blindbox/dave.jpg",
        probability: 0.25,
      },
    ],
  },
  {
    name: "Cloud Puffy Tote",
    price: 1599,
    category: "Carry",
    description:
      "Soft, quilted tote bag that feels like a marshmallow. Fits a 13-inch laptop.",
    images: ["/assets/products/puffy-bag-pink.jpg"],
    tags: ["Fashion", "College", "Pastel"],
    stock: 8,
    isBlindBox: false,
    featured: true,
    specifications: {
      material: "Nylon with foam padding",
      dimensions: '15" x 12" x 6"',
      weight: "0.5 lbs",
      warranty: "1 year",
    },
  },
  {
    name: "Beaded Bridal Clutch",
    price: 2499,
    category: "Glam",
    description:
      "Intricate hand-beaded clutch for special occasions. Shimmers under party lights.",
    images: ["/assets/products/clutch-gold.jpg"],
    tags: ["Party", "Luxury", "Wedding"],
    stock: 5,
    isBlindBox: false,
    featured: true,
    specifications: {
      material: "Beaded fabric with silk lining",
      dimensions: '9" x 5" x 2"',
      weight: "0.3 lbs",
      warranty: "6 months",
    },
  },
  {
    name: "Galaxy Stanley Cup Dupe",
    price: 899,
    category: "Sip",
    description:
      "Trending galaxy-themed Stanley cup with holographic lid. Keeps drinks cold for 24 hours!",
    images: ["/assets/products/galaxy-stanley.jpg"],
    tags: ["Viral", "Travel", "Gift"],
    stock: 25,
    isBlindBox: false,
    featured: true,
    variants: [
      {
        name: "Color",
        options: [
          {
            name: "Galaxy Blue",
            price: 899,
            stock: 10,
            image: "/assets/products/galaxy-stanley.jpg",
          },
          {
            name: "Rose Gold",
            price: 899,
            stock: 8,
            image: "/assets/products/rose-stanley.jpg",
          },
          {
            name: "Purple Dream",
            price: 899,
            stock: 7,
            image: "/assets/products/purple-stanley.jpg",
          },
        ],
      },
    ],
  },
  {
    name: "Kawaii Handbag Collection",
    price: 1899,
    category: "Carry",
    description:
      "Adorable anime-inspired handbags in various character themes. Perfect for cosplay or daily use.",
    images: ["/assets/products/kawaii-bag-1.jpg"],
    tags: ["Anime", "Fashion", "Cosplay"],
    stock: 20,
    isBlindBox: false,
    variants: [
      {
        name: "Character",
        options: [
          {
            name: "Sailor Moon",
            price: 1899,
            stock: 5,
            image: "/assets/products/sailor-bag.jpg",
          },
          {
            name: "Studio Ghibli",
            price: 1899,
            stock: 5,
            image: "/assets/products/ghibli-bag.jpg",
          },
          {
            name: "Pokemon",
            price: 1899,
            stock: 5,
            image: "/assets/products/pokemon-bag.jpg",
          },
          {
            name: "Naruto",
            price: 1899,
            stock: 5,
            image: "/assets/products/naruto-bag.jpg",
          },
        ],
      },
    ],
  },
  {
    name: "Random Anime Figure Blind Box",
    price: 799,
    category: "Play",
    description:
      "Mystery anime figure collection - could be any popular series!",
    images: ["/assets/products/anime-mystery.jpg"],
    tags: ["Anime", "Collectibles", "Gift"],
    stock: 50,
    isBlindBox: true,
    blindBoxContents: [
      {
        name: "Naruto Uzumaki",
        image: "/assets/blindbox/naruto.jpg",
        probability: 0.15,
      },
      {
        name: "Sasuke Uchiha",
        image: "/assets/blindbox/sasuke.jpg",
        probability: 0.15,
      },
      {
        name: "Monkey D. Luffy",
        image: "/assets/blindbox/luffy.jpg",
        probability: 0.15,
      },
      { name: "Goku", image: "/assets/blindbox/goku.jpg", probability: 0.15 },
      {
        name: "Eren Yeager",
        image: "/assets/blindbox/eren.jpg",
        probability: 0.15,
      },
      {
        name: "Levi Ackerman",
        image: "/assets/blindbox/levi.jpg",
        probability: 0.15,
      },
      { name: "Yato", image: "/assets/blindbox/yato.jpg", probability: 0.1 },
    ],
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ruha-ecommerce"
    );
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    // Display inserted products
    insertedProducts.forEach(product => {
      console.log(
        `- ${product.name} (₹${product.price}) - Stock: ${product.stock}`
      );
    });

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
