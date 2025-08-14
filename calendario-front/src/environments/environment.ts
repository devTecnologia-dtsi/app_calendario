export const environment = {
    production: true,
    // URL base del backend de la aplicación
    // apiUrl: 'https://testcalendarios.uniminuto.edu/api/',
    apiUrl: 'https://10.0.26.31:8086/',
  
    // URL de redirección del frontend (app Angular)
    baseUrl: 'https://testcalendarios.uniminuto.edu',

    // Configuración de MSAL para autenticación con Azure AD
    clientId: '0ffbc27e-5a3a-4b6b-bcd3-8f06486ecf03',
    authority: 'https://login.microsoftonline.com/b1ba85eb-a253-4467-9ee8-d4f8ed4df300',
    redirectUri: 'https://testcalendarios.uniminuto.edu/login'
};
