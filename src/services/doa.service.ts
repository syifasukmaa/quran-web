import apiRequest from '@/libs/api-request';

export const getPosts = () => {
  return apiRequest.get('/doa');
};

export const getPostsId = (id: number) => {
  return apiRequest.get(`/doa/${id}`);
};
