import { CustomerSupportRepresentativeInterface } from 'interfaces/customer-support-representative';
import { DataAnalystInterface } from 'interfaces/data-analyst';
import { DeliveryPersonnelInterface } from 'interfaces/delivery-personnel';
import { PartnerStoreInterface } from 'interfaces/partner-store';
import { TeamMemberInterface } from 'interfaces/team-member';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface StartupInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  customer_support_representative?: CustomerSupportRepresentativeInterface[];
  data_analyst?: DataAnalystInterface[];
  delivery_personnel?: DeliveryPersonnelInterface[];
  partner_store?: PartnerStoreInterface[];
  team_member?: TeamMemberInterface[];
  user?: UserInterface;
  _count?: {
    customer_support_representative?: number;
    data_analyst?: number;
    delivery_personnel?: number;
    partner_store?: number;
    team_member?: number;
  };
}

export interface StartupGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
