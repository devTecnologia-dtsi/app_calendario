export const environment = {
    production: true,
    // URL base del backend de la aplicación
    apiUrl: 'http://10.0.26.31:8086/',
  
    // URL de redirección del frontend (app Angular)
    baseUrl: 'http://10.0.26.31:8085',

    // Configuración de MSAL para autenticación con Azure AD
    clientId: 'd72569ba-95a4-4dd7-b0d2-f9d6d4d6a223',
    authority: 'https://login.microsoftonline.com/b1ba85eb-a253-4467-9ee8-d4f8ed4df300',
    redirectUri: 'http://10.0.26.31:8085/dashboard'
};
