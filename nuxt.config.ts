import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
	compatibilityDate: "2025-07-11",
	css: ["~/assets/css/main.css", "~/assets/css/animations.css"],
	runtimeConfig: {
		public: {
			siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
		},
	},
	nitro: {
		preset: "netlify",
		externals: {
			external: ["@prisma/client", "prisma", ".prisma"],
			inline: [],
		},
	},
	postcss: {
		plugins: {
			"@tailwindcss/postcss": {},
			autoprefixer: {},
		},
	},
	image: {
		provider: "cloudinary",
		cloudinary: {
			baseURL: "https://res.cloudinary.com/ds9jvhokr/image/upload/",
		},
	},
	modules: [
		"@pinia/nuxt",
		"@nuxt/fonts",
		"@nuxt/icon",
		"@nuxt/image",
		"@nuxt/ui",
		"pinia-plugin-persistedstate/nuxt",
	],

	piniaPluginPersistedstate: {
		storage: "cookies",
		cookieOptions: {
			path: "/",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30,
			secure: process.env.NODE_ENV === "production",
		},
		key: "argandici_%id",
	},

	app: {
		head: {
			link: [
				{
					rel: "stylesheet",
					href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
				},
			],
		},
	},
})
