import axios from 'axios';

const api = axios.create({
 
  // baseURL: 'http://192.168.1.3:5000/user/api', // Reemplaza con la URL de tu backend Estive
  // baseURL: 'http://192.168.0.146:5000/user/api', // Reemplaza con la URL de tu backend Miguel
//  baseURL: 'http://192.168.0.205:5000/user/api', // Reemplaza con la URL de tu backend Miguel
  baseURL: ' https://syncronizabackup-production.up.railway.app/user/api' //! URL PARA DEPLOY PPAL
  //baseURL: 'https://appsyncroniza-production.up.railway.app/user/api' //! URL PARA DEPLOY PPAL
  // baseURL: 'https://backenapp-production.up.railway.app/user/api' //! URL PARA DEPLOY 
  
 // baseURL: 'http://192.168.1.176:5000/user/api', // Reemplaza con la URL de tu backend Miguel Chile
 // baseURL: 'http://172.20.10.12:5000/user/api', // Reemplaza con la URL de tu backend Miguel Chile
  
});

export default api;