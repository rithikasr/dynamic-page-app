import { API_ENDPOINTS, getAuthHeaders, getAuthHeadersWithoutContentType } from '../constants/apiConstants';

export const fetchProducts = async () => {
  const res = await fetch(API_ENDPOINTS.PRODUCTS.BASE, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  return data.products || [];
};

export const createProduct = async (payload: any) => {
  const isFormData = payload instanceof FormData;
  const headers = isFormData ? getAuthHeadersWithoutContentType() : getAuthHeaders();
  const body = isFormData ? payload : JSON.stringify(payload);

  const res = await fetch(API_ENDPOINTS.PRODUCTS.BASE, {
    method: "POST",
    headers,
    body,
  });

  return res.json();
};

export const updateProduct = async (id: string, payload: any) => {
  const isFormData = payload instanceof FormData;
  const headers = isFormData ? getAuthHeadersWithoutContentType() : getAuthHeaders();
  const body = isFormData ? payload : JSON.stringify(payload);

  const res = await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
    method: "PUT",
    headers,
    body,
  });

  return res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await fetch(API_ENDPOINTS.PRODUCTS.BY_ID(id), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return res.json();
};

