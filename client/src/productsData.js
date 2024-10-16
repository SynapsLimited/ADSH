// src/productsData.js

const productsData = [
    // Dairy Products
    {
      id: 1,
      name: 'Whole Milk',
      category: 'dairy',
      variations: ['1L', '500ml'],
      images: [
        '/assets/Contact - Hero.jpg',
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Fresh whole milk from grass-fed cows.',
    },
    {
      id: 2,
      name: 'Greek Yogurt',
      category: 'dairy',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Thick and creamy Greek yogurt, perfect for breakfast.',
    },
    {
      id: 3,
      name: 'Cheddar Cheese',
      category: 'dairy',
      variations: ['Mild', 'Sharp'],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Aged cheddar cheese with a rich and bold flavor.',
    },
    {
      id: 4,
      name: 'Butter',
      category: 'dairy',
      variations: ['Salted', 'Unsalted'],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Creamy butter made from organic milk.',
    },
    {
      id: 5,
      name: 'Cream Cheese',
      category: 'dairy',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Smooth and spreadable cream cheese.',
    },
    {
      id: 21,
      name: 'Goat Cheese',
      category: 'dairy',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Creamy goat cheese with a tangy flavor.',
    },
    {
      id: 25,
      name: 'Brie Cheese',
      category: 'dairy',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Soft cheese with an edible white rind.',
    },
    // Ice Cream Products
    {
      id: 6,
      name: 'Vanilla Ice Cream',
      category: 'ice-cream',
      variations: ['500ml', '1L'],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Classic vanilla ice cream made with real vanilla beans.',
    },
    {
      id: 7,
      name: 'Chocolate Fudge Ice Cream',
      category: 'ice-cream',
      variations: ['500ml'],
      images: [
        '/assets/Contact - Hero.jpg',
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Rich chocolate ice cream with fudge swirls.',
    },
    {
      id: 8,
      name: 'Strawberry Sorbet',
      category: 'ice-cream',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Refreshing sorbet made from fresh strawberries.',
    },
    {
      id: 9,
      name: 'Mint Chocolate Chip Ice Cream',
      category: 'ice-cream',
      variations: ['500ml', '1L'],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Mint ice cream loaded with chocolate chips.',
    },
    {
      id: 10,
      name: 'Mango Gelato',
      category: 'ice-cream',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Smooth and creamy mango-flavored gelato.',
    },
    {
      id: 24,
      name: 'Pistachio Ice Cream',
      category: 'ice-cream',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Creamy ice cream flavored with real pistachios.',
    },
    // Pastry Products
    {
      id: 11,
      name: 'Croissant',
      category: 'pastry',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Flaky and buttery French croissant.',
    },
    {
      id: 12,
      name: 'Chocolate Éclair',
      category: 'pastry',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Pastry filled with cream and topped with chocolate.',
    },
    {
      id: 13,
      name: 'Blueberry Muffin',
      category: 'pastry',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Soft muffin loaded with fresh blueberries.',
    },
    {
      id: 14,
      name: 'Apple Turnover',
      category: 'pastry',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Pastry filled with sweet apple filling.',
    },
    {
      id: 15,
      name: 'Cinnamon Roll',
      category: 'pastry',
      variations: ['With Icing', 'Without Icing'],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Warm cinnamon roll with a sweet glaze.',
    },
    {
      id: 23,
      name: 'Lemon Tart',
      category: 'pastry',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Tangy lemon tart with a buttery crust.',
    },
    // Bakery Products
    {
      id: 16,
      name: 'Sourdough Bread',
      category: 'bakery',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Artisan sourdough bread with a crispy crust.',
    },
    {
      id: 17,
      name: 'Bagel',
      category: 'bakery',
      variations: ['Plain', 'Sesame', 'Everything'],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Chewy bagels baked fresh daily.',
    },
    {
      id: 18,
      name: 'Baguette',
      category: 'bakery',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Classic French baguette with a golden crust.',
    },
    {
      id: 19,
      name: 'Multigrain Bread',
      category: 'bakery',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Healthy multigrain bread packed with seeds.',
    },
    {
      id: 20,
      name: 'Focaccia',
      category: 'bakery',
      variations: ['Rosemary', 'Olive'],
      images: [
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Italian flatbread seasoned with herbs and olive oil.',
    },
    {
      id: 22,
      name: 'Chocolate Chip Cookie',
      category: 'bakery',
      variations: [],
      images: [
        '/assets/Contact - Hero.jpg',
        '/assets/Contact - Hero.jpg',
      ],
      description: 'Classic cookies loaded with chocolate chips.',
    },
  ];
  
  export default productsData;
