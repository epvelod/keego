
const servHost = __DEV__? 'https://ee999430-4319-4661-bc46-9488c265bc1d.mock.pstmn.io/keego' : '';
export default {
  servHost,
  login: (servHost+'/login'),
  vehiculo: (servHost+'/vehiculos'),
  respuestas: (servHost+'/respuestas'),
};
