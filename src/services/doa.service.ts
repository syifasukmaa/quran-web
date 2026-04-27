import apiRequest from '@/libs/api-request';

export const getDoas = () => {
  return apiRequest.get(`/doa`);
};

export const getDoasId = (id: number) => {
  return apiRequest.get(`/doa/${id}`);
};
