export const METRICS_INPUT_EXAMPLE = {
  impressions: 1000,
  clicks: 150,
  leads: 20,
  sales: 5,
  revenue: 750.0,
  cost: 200.0,
}

export const METRICS_RESPONSE_EXAMPLE = {
  id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  offerId: '550e8400-e29b-41d4-a716-446655440000',
  ...METRICS_INPUT_EXAMPLE,
  ctr: 15.0,
  roi: 275.0,
  updatedAt: '2026-02-05T19:00:00.000Z',
}
