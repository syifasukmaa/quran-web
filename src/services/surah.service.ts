import apiRequestSecond from '@/libs/api-request-second';

export const getPosts = () => {
  return apiRequestSecond.get('/surat');
};

export const getPostsId = (id: number) => {
  return apiRequestSecond.get(`/surat/${id}`);
};
