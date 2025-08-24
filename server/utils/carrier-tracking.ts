// server/utils/carrier-tracking.ts
import type { ShippingProvider } from "@prisma/client"

export function getTrackingUrl(provider?: ShippingProvider | null, trackingNumber?: string | null) {
	if (!provider || !trackingNumber) return null
	switch (provider) {
		case "COLISSIMO":
			return `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(trackingNumber)}`
		case "MONDIAL_RELAY":
			return `https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${encodeURIComponent(trackingNumber)}`
		case "LA_POSTE":
			return `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(trackingNumber)}`
		case "CHRONOPOST":
			return `https://www.chronopost.fr/fr/chrono_suivi_search?listeNumerosLT=${encodeURIComponent(trackingNumber)}`
		default:
			return null
	}
}
