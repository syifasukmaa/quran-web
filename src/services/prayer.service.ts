import apiRequestSecond from "@/libs/api-request-second";

export const getProvince = () => {
  return apiRequestSecond.get('/shalat/provinsi');
};

export const postKabKota = (payload: any)=>{
    return apiRequestSecond.post('/shalat/kabkota', payload)
} 
export const createPrayerTime = (payload: any) => {
  return apiRequestSecond.post('/shalat', payload);
};

export const reverseGeocode = async (lat: number, lon: number) => {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`
  );
  const data = await res.json();
  return {
    city: data.city || data.locality || '',
    province: data.principalSubdivision || '',
  };
};