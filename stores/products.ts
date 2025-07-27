import { defineStore } from 'pinia'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  images?: string[]
  stock: number
  details?: string
  benefits?: string[]
  usage?: string
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
  }),
  actions: {
    async fetchProducts() {
      // Chargement simulé (mock) — tu mettras ici ton appel API si besoin
      if (this.products.length) return

      this.products = [
        {
          id: 'argan-cosmetique',
          name: "Huile d'argan cosmétique",
          description: "Huile pure pour soins visage, corps et cheveux.",
          price: 24,
          category: 'Cosmétique',
          image: 'https://res.cloudinary.com/ds9jvhokr/image/upload/v1753480852/bottle_asset_nature.png',
          images: ['https://res.cloudinary.com/ds9jvhokr/image/upload/v1753480852/bottle_asset_nature.png'],
          stock: 5,
          details: "Bouteille en verre 100ml. Issue de l’agriculture biologique. Pressée à froid.",
          benefits: ["Hydratation intense", "Nourrit la peau", "Protège les cheveux"],
          usage: "Appliquez sur la peau ou les cheveux selon besoin.",
        },
        {
          id: 'argan-alimentaire',
          name: "Huile d'argan alimentaire",
          description: "Idéale pour la cuisine, goût subtil de noisette.",
          price: 19,
          category: 'Alimentaire',
          image: 'https://res.cloudinary.com/ds9jvhokr/image/upload/v1753480852/argan-alimentaire.png',
          images: ['https://res.cloudinary.com/ds9jvhokr/image/upload/v1753480852/argan-alimentaire.png'],
          stock: 0,
          details: "Flacon 250ml. Goût typique, pression à froid.",
          benefits: ["Riche en antioxydants", "Favorise la digestion"],
          usage: "Utilisez en assaisonnement sur salades, crudités, ou pain.",
        },
        {
          id: 'argan-eucalyptus',
          name: "Huile d'argan eucalyptus",
          description: "Huile enrichie en eucalyptus pour massage.",
          price: 26,
          category: 'Soins',
          image: 'https://res.cloudinary.com/ds9jvhokr/image/upload/v1753481213/bottle_asset_eucalyptus.png',
          images: ['https://res.cloudinary.com/ds9jvhokr/image/upload/v1753481213/bottle_asset_eucalyptus.png'],
          stock: 12,
          details: "Flacon 100ml. Association argan + eucalyptus.",
          benefits: ["Effet relaxant", "Sensation de fraîcheur"],
          usage: "Appliquez en massage local.",
        },
        {
          id: 'argan-rose',
          name: "Huile d'argan rose",
          description: "Huile enrichie en rose pour massage.",
          price: 26,
          category: 'Soins',
          image: 'https://res.cloudinary.com/ds9jvhokr/image/upload/v1753404213/bottle_asset_rose.png',
          images: ['https://res.cloudinary.com/ds9jvhokr/image/upload/v1753404213/bottle_asset_rose.png'],
          stock: 12,
          details: "Flacon 100ml. Association argan + rose.",
          benefits: ["Effet relaxant", "Sensation de fraîcheur"],
          usage: "Appliquez en massage local.",
        }
      ]
    }
  }
})
