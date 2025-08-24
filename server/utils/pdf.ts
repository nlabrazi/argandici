import PDFDocument from "pdfkit"

// Génération buffer PDF en mémoire
export async function generateOrderInvoicePdf(order: any): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const doc = new PDFDocument({ size: "A4", margin: 40 })
		const chunks: Buffer[] = []

		doc.on("data", (chunk: Buffer) => chunks.push(chunk))
		doc.on("error", reject)
		doc.on("end", () => resolve(Buffer.concat(chunks)))

		doc
			.fontSize(20)
			.text(`Facture - Argan d'ici`, { align: "center" })
			.moveDown()
			.fontSize(12)
			.text(`Commande : ${order.id}`)
			.text(`Date     : ${new Date(order.date).toLocaleDateString("fr-FR")}`)
			.text(`Client   : ${order.fullName} (${order.email})`)
			.moveDown()
			.text("Produits :", { underline: true })

		for (const item of order.items) {
			doc.text(
				`${item.quantity} x ${item.product.name} — ${(item.product.price * item.quantity).toFixed(2)} €`,
			)
		}

		doc
			.moveDown()
			.fontSize(14)
			.text(`Total : ${order.total.toFixed(2)} €`, { align: "right" })

		doc.end()
	})
}

// Upload sur Supabase
import { createClient } from "@supabase/supabase-js"

export async function uploadInvoiceToSupabase(orderId: string, pdfBuffer: Buffer): Promise<string> {
	const supabaseUrl = process.env.SUPABASE_URL!
	const supabaseKey = process.env.SUPABASE_SERVICE_KEY!
	const bucket = "invoices"
	const filename = `facture-${orderId}.pdf`

	const supabase = createClient(supabaseUrl, supabaseKey)
	const { error } = await supabase.storage.from(bucket).upload(filename, pdfBuffer, {
		contentType: "application/pdf",
		upsert: true,
	})

	if (error) {
		throw new Error(`Supabase upload error: ${error.message}`)
	}

	return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`
}
