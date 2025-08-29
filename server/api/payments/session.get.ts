import Stripe from "stripe"
import { defineEventHandler, getQuery, createError } from "h3"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: process.env.STRIPE_API_VERSION as any,
})

export default defineEventHandler(async (event) => {
	const { id } = getQuery(event) as { id?: string }
	if (!id) {
		throw createError({ statusCode: 400, statusMessage: "session_id manquant" })
	}

	const session = await stripe.checkout.sessions.retrieve(id, {
		expand: ["line_items", "payment_intent", "customer", "customer_details"],
	})

	return {
		payment_status: session.payment_status,
		amount_total: session.amount_total,
		currency: session.currency,
		email:
			session.customer_details?.email ?? session.customer_email ?? session.metadata?.email ?? null,
		orderId: session.metadata?.orderId ?? session.client_reference_id ?? null,
		line_items:
			session.line_items?.data?.map((li) => ({
				description: li.description,
				quantity: li.quantity,
				amount_subtotal: li.amount_subtotal,
				amount_total: li.amount_total,
			})) ?? [],
	}
})
