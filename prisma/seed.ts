import 'dotenv/config';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');

  const cakes = [
    {
      id: 'seed-classic-red-velvet',
      name: 'Classic Red Velvet',
      description: 'A timeless red velvet cake with cream cheese frosting, moist layers, and a hint of cocoa. Perfect for celebrations.',
      price: 65.00,
      imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&h=600&fit=crop',
      flavors: ['Original', 'Chocolate', 'Vanilla'],
      sizes: ['6 inch', '8 inch', '10 inch'],
      rating: 4.9,
      isVisible: true,
    },
    {
      id: 'seed-strawberry-dream',
      name: 'Strawberry Dream',
      description: 'Light and airy vanilla sponge layered with fresh strawberries and whipped cream. A summer delight.',
      price: 58.00,
      imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
      flavors: ['Strawberry', 'Mixed Berry', 'Vanilla'],
      sizes: ['6 inch', '8 inch', '10 inch'],
      rating: 4.8,
      isVisible: true,
    },
    {
      id: 'seed-dark-chocolate-ganache',
      name: 'Dark Chocolate Ganache',
      description: 'Rich and decadent dark chocolate cake with silky ganache frosting. For the true chocolate lover.',
      price: 72.00,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
      flavors: ['Dark Chocolate', 'Milk Chocolate', 'White Chocolate'],
      sizes: ['6 inch', '8 inch', '10 inch', '12 inch'],
      rating: 5.0,
      isVisible: true,
    },
    {
      id: 'seed-lemon-lavender-bliss',
      name: 'Lemon Lavender Bliss',
      description: 'Zesty lemon cake with lavender buttercream and candied lemon peel. Elegant and refreshing.',
      price: 62.00,
      imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop',
      flavors: ['Lemon', 'Lemon Lavender', 'Citrus Mix'],
      sizes: ['6 inch', '8 inch', '10 inch'],
      rating: 4.7,
      isVisible: true,
    },
    {
      id: 'seed-matcha-cloud-cake',
      name: 'Matcha Cloud Cake',
      description: 'Japanese-inspired matcha chiffon cake with light cream and red bean paste. A unique flavor experience.',
      price: 68.00,
      imageUrl: 'https://images.unsplash.com/photo-1551404973-761c83cd8339?w=800&h=600&fit=crop',
      flavors: ['Matcha', 'Matcha Milk', 'Hojicha'],
      sizes: ['6 inch', '8 inch', '10 inch'],
      rating: 4.8,
      isVisible: true,
    },
  ];

  for (const cake of cakes) {
    await prisma.cake.upsert({
      where: { id: cake.id },
      update: {},
      create: cake,
    });
  }
  console.log(`✅ Seeded ${cakes.length} cakes`);

  // Seed admin user
  const passwordHash = await bcrypt.hash('jkjbjm090805', 12);
  await prisma.adminUser.upsert({
    where: { email: 'jmlim159@gmail.com' },
    update: {},
    create: { email: 'jmlim159@gmail.com', passwordHash },
  });
  console.log('✅ Seeded admin user: jmlim159@gmail.com / jkjbjm090805');

  // Seed default settings
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        businessName: 'Corazón Cakes',
        address: '123 Sweet Lane, Bakery District, CA 90210',
        phone: '+1 (555) 123-4567',
        email: 'hello@corazoncakes.com',
        instagram: 'https://instagram.com/corazoncakes',
        facebook: 'https://facebook.com/corazoncakes',
        aboutText: 'We pour love into every cake we bake. From custom wedding cakes to everyday treats, Corazón Cakes is your go-to bakery for unforgettable moments.',
      },
    });
    console.log('✅ Seeded default settings');
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
