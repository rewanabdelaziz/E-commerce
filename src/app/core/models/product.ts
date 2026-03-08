export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
    creationAt: string;
    updatedAt: string
  };
  images: string[];
  creationAt: string;
  updatedAt: string
}



// export const mockProducts: Product[] = [
//   {
//     id: '1',
//     name: 'Premium Wireless Headphones',
//     description: 'Experience crystal-clear sound with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.',
//     price: 299.99,
//     originalPrice: 399.99,
//     category: 'Electronics',
//     images: [
//       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
//       'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
//     ],
//     rating: 4.8,
//     reviews: 256,
//     inStock: true,
//     colors: ['Black', 'Silver', 'Rose Gold'],
//     tags: ['featured', 'new'],
//     featured: true,
//   },
//   {
//     id: '2',
//     name: 'Smart Watch Pro',
//     description: 'Stay connected with our latest smartwatch featuring health tracking, GPS, and seamless smartphone integration.',
//     price: 399.99,
//     originalPrice: 499.99,
//     category: 'Electronics',
//     images: [
//       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
//       'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
//     ],
//     rating: 4.6,
//     reviews: 189,
//     inStock: true,
//     colors: ['Black', 'Silver', 'Gold'],
//     tags: ['featured'],
//     featured: true,
//   },
//   {
//     id: '3',
//     name: 'Designer Leather Backpack',
//     description: 'Handcrafted leather backpack perfect for work and travel. Features multiple compartments and padded laptop sleeve.',
//     price: 249.99,
//     category: 'Fashion',
//     images: [
//       'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
//       'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
//     ],
//     rating: 4.9,
//     reviews: 412,
//     inStock: true,
//     colors: ['Brown', 'Black', 'Tan'],
//     tags: ['new'],
//     featured: true,
//   },
//   {
//     id: '4',
//     name: 'Ultra HD 4K Camera',
//     description: 'Professional-grade camera with 4K video recording, optical image stabilization, and wireless connectivity.',
//     price: 1299.99,
//     originalPrice: 1599.99,
//     category: 'Electronics',
//     images: [
//       'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
//       'https://images.unsplash.com/photo-1606980707346-df8cc2379de3?w=800&q=80',
//     ],
//     rating: 4.7,
//     reviews: 98,
//     inStock: true,
//     tags: ['featured'],
//     featured: true,
//   },
//   {
//     id: '5',
//     name: 'Minimalist Desk Lamp',
//     description: 'Modern LED desk lamp with adjustable brightness, touch controls, and USB charging port.',
//     price: 79.99,
//     category: 'Home',
//     images: [
//       'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
//       'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
//     ],
//     rating: 4.5,
//     reviews: 234,
//     inStock: true,
//     colors: ['White', 'Black', 'Silver'],
//   },
//   {
//     id: '6',
//     name: 'Ergonomic Office Chair',
//     description: 'Premium office chair with lumbar support, adjustable armrests, and breathable mesh back.',
//     price: 449.99,
//     category: 'Home',
//     images: [
//       'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
//       'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
//     ],
//     rating: 4.8,
//     reviews: 567,
//     inStock: true,
//     colors: ['Black', 'Gray'],
//   },
//   {
//     id: '7',
//     name: 'Wireless Gaming Mouse',
//     description: 'High-performance gaming mouse with customizable RGB lighting, 16000 DPI sensor, and programmable buttons.',
//     price: 89.99,
//     category: 'Electronics',
//     images: [
//       'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
//       'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
//     ],
//     rating: 4.6,
//     reviews: 432,
//     inStock: true,
//     colors: ['Black', 'White'],
//     tags: ['new'],
//   },
//   {
//     id: '8',
//     name: 'Luxury Sunglasses',
//     description: 'Designer sunglasses with UV400 protection, polarized lenses, and lightweight titanium frame.',
//     price: 199.99,
//     originalPrice: 299.99,
//     category: 'Fashion',
//     images: [
//       'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
//       'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
//     ],
//     rating: 4.7,
//     reviews: 178,
//     inStock: true,
//     colors: ['Black', 'Tortoise', 'Blue'],
//   },
//   {
//     id: '9',
//     name: 'Portable Bluetooth Speaker',
//     description: '360-degree sound, waterproof design, and 24-hour battery life. Perfect for outdoor adventures.',
//     price: 149.99,
//     category: 'Electronics',
//     images: [
//       'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
//       'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
//     ],
//     rating: 4.5,
//     reviews: 291,
//     inStock: true,
//     colors: ['Black', 'Blue', 'Red', 'Green'],
//   },
//   {
//     id: '10',
//     name: 'Premium Yoga Mat',
//     description: 'Extra-thick yoga mat with non-slip surface, eco-friendly materials, and carrying strap.',
//     price: 59.99,
//     category: 'Sports',
//     images: [
//       'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
//       'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&q=80',
//     ],
//     rating: 4.8,
//     reviews: 345,
//     inStock: true,
//     colors: ['Purple', 'Blue', 'Pink', 'Black'],
//   },
//   {
//     id: '11',
//     name: 'Mechanical Keyboard',
//     description: 'RGB backlit mechanical keyboard with blue switches, aluminum frame, and programmable macros.',
//     price: 159.99,
//     category: 'Electronics',
//     images: [
//       'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
//       'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
//     ],
//     rating: 4.7,
//     reviews: 523,
//     inStock: true,
//     colors: ['Black', 'White'],
//     tags: ['new'],
//   },
//   {
//     id: '12',
//     name: 'Stainless Steel Water Bottle',
//     description: 'Double-wall insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof.',
//     price: 34.99,
//     category: 'Sports',
//     images: [
//       'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
//       'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80',
//     ],
//     rating: 4.6,
//     reviews: 678,
//     inStock: true,
//     colors: ['Silver', 'Black', 'Blue', 'Rose Gold'],
//   },
// ];

// export const categories = [
//   { name: 'Electronics', icon: '🎧', count: 45 },
//   { name: 'Fashion', icon: '👕', count: 32 },
//   { name: 'Home', icon: '🏠', count: 28 },
//   { name: 'Sports', icon: '⚽', count: 19 },
//   { name: 'Books', icon: '📚', count: 15 },
//   { name: 'Beauty', icon: '💄', count: 24 },
// ];

