export interface SectorConfig {
  name: string;
  description: string;
  defaultDrivers: string[];
  typicalMetrics: string[];
}

export class SectorRegistry {
  private sectors: Map<string, SectorConfig> = new Map();

  /**
   * Registers a sector configuration
   */
  registerSector(sector: SectorConfig): void {
    this.sectors.set(sector.name, sector);
  }

  /**
   * Gets sector configuration
   */
  getSector(name: string): SectorConfig | undefined {
    return this.sectors.get(name);
  }

  /**
   * Lists all registered sectors
   */
  getAllSectors(): SectorConfig[] {
    return Array.from(this.sectors.values());
  }
}

export const sectorRegistry = new SectorRegistry();

// Register default sectors
sectorRegistry.registerSector({
  name: "space",
  description: "Space & Aerospace companies",
  defaultDrivers: ["subscriber_count", "arpu", "service_availability"],
  typicalMetrics: ["revenue", "marketCap"],
});

sectorRegistry.registerSector({
  name: "saas",
  description: "Software as a Service companies",
  defaultDrivers: ["arr", "retention", "expansion"],
  typicalMetrics: ["revenue", "arr", "profitability"],
});

sectorRegistry.registerSector({
  name: "fintech",
  description: "Financial Technology companies",
  defaultDrivers: ["transaction_volume", "take_rate", "user_growth"],
  typicalMetrics: ["revenue", "profitability"],
});
