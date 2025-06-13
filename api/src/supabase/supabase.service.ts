import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient | null = null;

  private getClientInstance(): SupabaseClient {
    if (!this.client) {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key) {
        throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing');
      }
      this.client = createClient(url, key);
    }
    return this.client;
  }

  getClient(): SupabaseClient {
    return this.getClientInstance();
  }
}
