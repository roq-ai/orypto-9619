const mapping: Record<string, string> = {
  'customer-support-representatives': 'customer_support_representative',
  'data-analysts': 'data_analyst',
  'delivery-personnels': 'delivery_personnel',
  'end-customers': 'end_customer',
  'partner-stores': 'partner_store',
  startups: 'startup',
  'team-members': 'team_member',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
