import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🟢 Démarrage du seed...')

    // Utilisateurs à créer
    const usersData = [
        {
            email: 'admin@argandici.com',
            password: await bcrypt.hash('superpassword', 10),
            role: Role.ADMIN
        },
        {
            email: 'client@argandici.com',
            password: await bcrypt.hash('clientpassword', 10),
            role: Role.CLIENT
        }
    ]

    console.log('Création des utilisateurs...')
    for (const userData of usersData) {
        try {
            const user = await prisma.user.upsert({
                where: { email: userData.email },
                update: {},
                create: userData
            })
            console.log(`👤 Utilisateur seedé : ${user.email}`)
        } catch (err) {
            console.error(`❌ Erreur lors du seed user ${userData.email}`, err)
        }
    }

    // Produits à créer
    const productsData = [
        {
            id: 'argan-cosmetique',
            name: "Huile d'argan cosmétique",
            description: "Huile pure pour soins visage, corps et cheveux.",
            price: 24,
            category: 'Cosmétique',
            image: 'bottle_asset.png',
            stock: 5,
        },
        {
            id: 'argan-alimentaire',
            name: "Huile d'argan alimentaire",
            description: "Idéale pour la cuisine, goût subtil de noisette.",
            price: 19,
            category: 'Alimentaire',
            image: 'argan-alimentaire.png',
            stock: 0,
        },
        {
            id: 'argan-eucalyptus',
            name: "Huile d'argan eucalyptus",
            description: "Huile enrichie en eucalyptus pour massage.",
            price: 26,
            category: 'Soins',
            image: 'bottle_asset_eucalyptus.png',
            stock: 12,
        },
        {
            id: 'argan-rose',
            name: "Huile d'argan rose",
            description: "Huile enrichie en rose pour massage.",
            price: 26,
            category: 'Soins',
            image: 'bottle_asset_rose.png',
            stock: 12,
        }
    ]

    console.log('Création des produits...')
    for (const productData of productsData) {
        const product = await prisma.product.upsert({
            where: { id: productData.id },
            update: {},
            create: productData
        })
        console.log(`🛒 Produit seedé : ${product.name}`)
    }

    console.log('✅ SEED TERMINÉ !')
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors du seed :', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
