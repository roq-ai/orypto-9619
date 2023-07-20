import axios from 'axios';
import queryString from 'query-string';
import { DeliveryPersonnelInterface, DeliveryPersonnelGetQueryInterface } from 'interfaces/delivery-personnel';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getDeliveryPersonnels = async (
  query?: DeliveryPersonnelGetQueryInterface,
): Promise<PaginatedInterface<DeliveryPersonnelInterface>> => {
  const response = await axios.get('/api/delivery-personnels', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createDeliveryPersonnel = async (deliveryPersonnel: DeliveryPersonnelInterface) => {
  const response = await axios.post('/api/delivery-personnels', deliveryPersonnel);
  return response.data;
};

export const updateDeliveryPersonnelById = async (id: string, deliveryPersonnel: DeliveryPersonnelInterface) => {
  const response = await axios.put(`/api/delivery-personnels/${id}`, deliveryPersonnel);
  return response.data;
};

export const getDeliveryPersonnelById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/delivery-personnels/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDeliveryPersonnelById = async (id: string) => {
  const response = await axios.delete(`/api/delivery-personnels/${id}`);
  return response.data;
};
