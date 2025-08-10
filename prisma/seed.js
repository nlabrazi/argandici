import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Démarrage du script de seed...')

  // Nettoyage
  console.log('🧹 Nettoyage des données existantes...');
  await prisma.orderItem.deleteMany({});
  console.log('   🗑️ OrderItems supprimés.');
  await prisma.order.deleteMany({});
  console.log('   🗑️ Orders supprimées.');
  await prisma.product.deleteMany({});
  console.log('   🗑️ Products supprimés.');
  await prisma.user.deleteMany({});
  console.log('   🗑️ Users supprimés.');
  console.log('✅ Nettoyage terminé.');

  // Utilisateurs
  console.log('🔑 Hachage des mots de passe...');
  const adminPass = await bcrypt.hash('adminpass', 10);
  const clientPass = await bcrypt.hash('clientpass', 10);
  console.log('✅ Mots de passe hachés.');

  console.log('👤 Création de l\'utilisateur Admin...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@argandici.com',
      password: adminPass,
      role: Role.ADMIN,
    },
  })
  console.log(`✅ Utilisateur Admin créé : ${admin.email} (ID: ${admin.id})`);

  console.log("👤 Création de l'utilisateur Client...");
  const client = await prisma.user.create({
    data: {
      email: 'client@argandici.com',
      password: clientPass,
      role: Role.CLIENT,
    },
  })
  console.log(`✅ Utilisateur Client créé : ${client.email} (ID: ${client.id})`);

  // Produits
  console.log('📦 Création des produits...');
  const productsData = [
    {
      name: "Huile d'argan pure 100ml",
      price: 19.99,
      description: "Huile d'argan 100% pure, pressée à froid.",
      image: 'https://res.cloudinary.com/ds9jvhokr/image/upload/v1753480852/bottle_asset_nature.png',
      category: 'Cosmétique',
      stock: 50,
    },
    {
      name: "Huile d'argan aux huiles essentielles de Rose de Damas 100ml",
      price: 34.9,
      description: "Pour une peau douce et parfumée.",
      image: 'https://res.cloudinary.com/ds9jvhokr/image/upload/v1753404213/bottle_asset_rose.png',
      category: 'Cosmétique',
      stock: 30,
    },
    {
      name: "Huile d'argan aux huiles essentielles d'eucalyptus 100ml",
      price: 29.9,
      description: "Pour une sensation de fraîcheur et de bien-être.",
      image: 'https://res.cloudinary.com/ds9jvhokr/image/upload/v1753481213/bottle_asset_eucalyptus.png',
      category: 'Cosmétique',
      stock: 20,
    },
    {
      name: "Crème hydratant visage et cheveux à l'huile d'argan 50ml",
      price: 8.5,
      description: "Crème hydratante nourrissante pour le visage et les cheveux.",
      image: 'https://res.cloudinary.com/ds9jvhokr/image/upload/v1753405280/creme_visage.png',
      category: 'Cosmétique',
      stock: 40,
    },
  ]
  await prisma.product.createMany({ data: productsData })
  console.log(`✅ ${productsData.length} produits créés.`)
  console.log('🎉 Script de seed terminé avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Une erreur est survenue pendant le script de seed :', e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('🔌 Déconnexion de Prisma...');
    await prisma.$disconnect();
    console.log('✅ Déconnexion Prisma effectuée.');
  })
