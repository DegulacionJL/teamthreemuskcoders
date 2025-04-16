import api from 'utils/api';

const calculateAddition = async (data) => {
  const response = await api.post('/add', data);
  return response;
};

const calculateSubtraction = async (data) => {
  const response = await api.post('/sub', data);
  return response;
};

const calculateDivision = async (data) => {
  const response = await api.post('/div', data);
  return response;
};

const calculateMultiplication = async (data) => {
  const response = await api.post('/mul', data);
  return response;
};

export { calculateAddition, calculateSubtraction, calculateMultiplication, calculateDivision };
