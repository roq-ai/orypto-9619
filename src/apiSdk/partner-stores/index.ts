import axios from 'axios';
import queryString from 'query-string';
import { PartnerStoreInterface, PartnerStoreGetQueryInterface } from 'interfaces/partner-store';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getPartnerStores = async (
  query?: PartnerStoreGetQueryInterface,
): Promise<PaginatedInterface<PartnerStoreInterface>> => {
  const response = await axios.get('/api/partner-stores', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createPartnerStore = async (partnerStore: PartnerStoreInterface) => {
  const response = await axios.post('/api/partner-stores', partnerStore);
  return response.data;
};

export const updatePartnerStoreById = async (id: string, partnerStore: PartnerStoreInterface) => {
  const response = await axios.put(`/api/partner-stores/${id}`, partnerStore);
  return response.data;
};

export const getPartnerStoreById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/partner-stores/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePartnerStoreById = async (id: string) => {
  const response = await axios.delete(`/api/partner-stores/${id}`);
  return response.data;
};
