interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Business Owner'],
  customerRoles: ['End Customer'],
  tenantRoles: [
    'Business Owner',
    'Team Member',
    'Data Analyst',
    'Customer Support Representative',
    'Delivery Personnels',
    'Partner Stores',
  ],
  tenantName: 'Startup',
  applicationName: 'Orypto',
  addOns: ['file', 'notifications', 'chat'],
};
