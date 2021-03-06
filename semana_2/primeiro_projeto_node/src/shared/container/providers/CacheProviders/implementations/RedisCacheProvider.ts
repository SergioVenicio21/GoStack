import Redis, { Redis as Client } from 'ioredis';
import ICacheProvider from '../models/ICacheProvider';

import cacheConfig from '@config/cache';

export default class RedisCacheProvider implements ICacheProvider {
  private client: Client;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save<T>(key: string, value: T): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }
  public async recover<T>(key: string): Promise<T | null> {
    const cacheData = await this.client.get(key);
    if (!cacheData) {
      return null;
    }

    return JSON.parse(cacheData) as T;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);
    const pipeline = this.client.pipeline();

    keys.forEach((key) => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
