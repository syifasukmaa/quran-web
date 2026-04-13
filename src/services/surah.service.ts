import apiRequest from '@/libs/api-request';

export const getPosts = () => {
  return apiRequest.get('/surat');
};

export const getPostsId = (id: number) => {
  return apiRequest.get(`/surat/${id}`);
};
