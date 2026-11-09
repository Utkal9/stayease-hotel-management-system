export interface HealthStatus {
  service: string;
  status: "healthy";
}

export function getHealthStatus(): HealthStatus {
  return { service: "stayease-backend", status: "healthy" };
}
