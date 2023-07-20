import axios from 'axios';
import queryString from 'query-string';
import {
  CustomerSupportRepresentativeInterface,
  CustomerSupportRepresentativeGetQueryInterface,
} from 'interfaces/customer-support-representative';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getCustomerSupportRepresentatives = async (
  query?: CustomerSupportRepresentativeGetQueryInterface,
): Promise<PaginatedInterface<CustomerSupportRepresentativeInterface>> => {
  const response = await axios.get('/api/customer-support-representatives', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createCustomerSupportRepresentative = async (
  customerSupportRepresentative: CustomerSupportRepresentativeInterface,
) => {
  const response = await axios.post('/api/customer-support-representatives', customerSupportRepresentative);
  return response.data;
};

export const updateCustomerSupportRepresentativeById = async (
  id: string,
  customerSupportRepresentative: CustomerSupportRepresentativeInterface,
) => {
  const response = await axios.put(`/api/customer-support-representatives/${id}`, customerSupportRepresentative);
  return response.data;
};

export const getCustomerSupportRepresentativeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/customer-support-representatives/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteCustomerSupportRepresentativeById = async (id: string) => {
  const response = await axios.delete(`/api/customer-support-representatives/${id}`);
  return response.data;
};
