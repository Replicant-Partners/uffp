import { ForecastDriver } from "../types/universal";

export class DriverRegistry {
  private drivers: Map<string, ForecastDriver[]> = new Map();

  /**
   * Registers drivers for a specific sector
   */
  registerDrivers(sector: string, drivers: ForecastDriver[]): void {
    this.drivers.set(sector, drivers);
  }

  /**
   * Gets drivers for a sector
   */
  getDrivers(sector: string): ForecastDriver[] {
    return this.drivers.get(sector) || [];
  }

  /**
   * Lists all registered sectors
   */
  getSectors(): string[] {
    return Array.from(this.drivers.keys());
  }
}

export const driverRegistry = new DriverRegistry();
