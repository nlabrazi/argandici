// server/utils/orderEmailTemplate.ts
import { getTrackingUrl } from "~/server/utils/carrier-tracking"

export function generateOrderEmailHtml(order: any): string {
	// Évite le type 'unknown' et normalise les slashes
	const runtime = useRuntimeConfig()
	const base = String(runtime.public?.siteUrl ?? "").replace(/\/$/, "")
	const cdn = String(runtime.public?.cloudinaryBase ?? "").replace(/\/$/, "") + "/"

	const logoUrl = `${cdn}/c_fit,w_160,q_auto,f_auto/logo.png`
	const date = new Date(order.date).toLocaleDateString("fr-FR")
	const trackingUrl = getTrackingUrl(order.shippingProvider, order.trackingNumber)

	const productRows = order.items
		.map((item: any) => {
			const thumbUrl = `${cdn}/c_fill,w_120,h_120,q_auto,f_auto/${encodeURIComponent(item.product.image)}`
			const unit = Number(item.unitPrice ?? item.product.price)
			return `
      <tr style="border-bottom:1px solid #ddd;">
        <td style="padding:10px; width:120px;">
          <img src="${thumbUrl}"
               width="120"
               alt="${item.product.name}"
               style="display:block; max-width:120px; height:auto; border-radius:8px; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic;" />
        </td>
        <td style="padding:10px;">
          <strong>${item.product.name}</strong><br/>
          ${item.quantity} x ${unit.toFixed(2)} €
        </td>
        <td style="padding:10px; text-align:right;">
          ${(unit * item.quantity).toFixed(2)} €
        </td>
      </tr>
    `
		})
		.join("")

	return `
    <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
      <div style="background:#f5f5f5;padding:20px;text-align:center;">
        <img src="${logoUrl}" alt="Argan d'ici" width="120" />
        <h2 style="margin:10px 0;color:#8b5e3c;">Merci pour votre commande !</h2>
        <p style="margin:0;color:#444;">Commande #${order.id} - ${date}</p>
      </div>
      <div style="padding:20px;">
        <h3 style="margin-top:0;color:#444;">Détail de la commande :</h3>
        <table width="100%" style="border-collapse:collapse;">
          ${productRows}
          <tr>
            <td colspan="2" style="padding:15px 10px;text-align:right;font-weight:bold;border-top:1px solid #ccc;">Total</td>
            <td style="padding:15px 10px;text-align:right;font-weight:bold;border-top:1px solid #ccc;">${Number(order.total).toFixed(2)} €</td>
          </tr>
        </table>
      </div>
      <div style="padding:20px;text-align:center;">
        <a href="${base}/orders/${order.id}"
           style="background:#8b5e3c;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:5px;display:inline-block;">
          Voir ma commande
        </a>
        ${
					trackingUrl
						? `
        <a href="${trackingUrl}"
           style="background:#ccc;color:#333;padding:12px 24px;border-radius:6px;text-decoration:none;margin:5px;display:inline-block;">
          Suivre la livraison
        </a>`
						: ""
				}
      </div>
      <div style="background:#f9f9f9;padding:15px;text-align:center;font-size:12px;color:#999;">
        Argan d'ici - contact@argandici.com<br/>
        81 quater rue des Champarts, Limay, France
      </div>
    </div>`
}
