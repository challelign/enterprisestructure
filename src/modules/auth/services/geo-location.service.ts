export class GeoLocationService {
  async lookup(ipAddress?: string) {
    return {
      country: null,
      city: null,
    };
  }
}
