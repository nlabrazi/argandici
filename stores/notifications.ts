import { defineStore } from "pinia"

export interface Toast {
	id: number
	type: "success" | "error" | "info" | "warning"
	message: string
	duration?: number
}

export const useNotificationStore = defineStore("notifications", {
	state: () => ({
		toasts: [] as Toast[],
		idCounter: 0,
	}),
	actions: {
		showToast(message: string, type: Toast["type"] = "info", duration = 3000) {
			const toast: Toast = {
				id: this.idCounter++,
				type,
				message,
				duration,
			}
			this.toasts.push(toast)
			if (duration) {
				setTimeout(() => this.removeToast(toast.id), duration)
			}
		},
		removeToast(id: number) {
			this.toasts = this.toasts.filter((t) => t.id !== id)
		},
	},
})
