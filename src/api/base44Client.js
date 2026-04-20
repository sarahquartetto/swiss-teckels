// API client
// MongoDB Atlas is accessed through our local API (/api). No JSON fallback.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

class Base44Entity {
  constructor(entityName) {
    this.entityName = entityName;
  }

  async list() {
    const response = await fetch(`${API_BASE_URL}/api/${this.entityName.toLowerCase()}s`);
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`API error (${response.status}): ${text || response.statusText}`);
    }
    return await response.json();
  }
}

export const base44 = {
  entities: {
    get Teckel() {
      return new Base44Entity('Teckel');
    },
  },
};

