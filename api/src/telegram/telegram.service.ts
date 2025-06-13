import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private token: string | null = null;
  private chatId: string | null = null;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private config: ConfigService) { }

  private ensureInit() {
    if (!this.token || !this.chatId) {
      const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
      const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');

      if (!token || !chatId) {
        throw new Error(
          'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in env vars',
        );
      }

      this.token = token;
      this.chatId = chatId;
      console.log('[TelegramService] Initialised');
    }
  }

  async sendPhotoWithCaption(caption: string, imageUrl?: string) {
    this.ensureInit();

    const photo =
      imageUrl ??
      'https://www.lasavonneriebourbonnaise.fr/815-large_default/huile-argan-flacon-verre-100ml.jpg';
    const url = `https://api.telegram.org/bot${this.token}/sendPhoto`;

    try {
      await axios.post(url, {
        chat_id: this.chatId,
        photo,
        caption,
        parse_mode: 'HTML',
      });
    } catch (error: any) {
      this.logger.error('❌ Erreur envoi Telegram : ' + error.message);
    }
  }
}
