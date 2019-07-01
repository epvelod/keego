
const servHost = 'http://62.151.180.103:8080/keego/ws/servicioKeego' ;
export default {
  servHost,
  login: (servHost+'/login'),
  vehiculo: (servHost+'/vehiculo'),
  respuestas: (servHost+'/respuestas'),
};
