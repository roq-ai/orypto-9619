import axios from 'axios';
import queryString from 'query-string';
import { DataAnalystInterface, DataAnalystGetQueryInterface } from 'interfaces/data-analyst';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getDataAnalysts = async (
  query?: DataAnalystGetQueryInterface,
): Promise<PaginatedInterface<DataAnalystInterface>> => {
  const response = await axios.get('/api/data-analysts', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createDataAnalyst = async (dataAnalyst: DataAnalystInterface) => {
  const response = await axios.post('/api/data-analysts', dataAnalyst);
  return response.data;
};

export const updateDataAnalystById = async (id: string, dataAnalyst: DataAnalystInterface) => {
  const response = await axios.put(`/api/data-analysts/${id}`, dataAnalyst);
  return response.data;
};

export const getDataAnalystById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/data-analysts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDataAnalystById = async (id: string) => {
  const response = await axios.delete(`/api/data-analysts/${id}`);
  return response.data;
};
