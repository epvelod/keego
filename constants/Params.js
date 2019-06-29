
const servHost = __DEV__? 'https://e735dd31-11ae-4f6d-956c-31283f70cdb4.mock.pstmn.io/keego' : '';
export default {
  servHost,
  login: (servHost+'/login'),
  vehiculo: (servHost+'/vehiculo'),
  respuestas: (servHost+'/respuestas'),
};
