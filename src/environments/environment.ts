// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  endpoint: 'https://web.zonazero.cloud/sicrefis/api/',
  
  endpointApi: 'https://pis-apiman-restfinav1.azurewebsites.net/api/',
  endpointRecinto : 'https://pis-api-recinto-qa.azurewebsites.net/api/',
  endpointCat: 'https://pis-api-catalogos-prod.azurewebsites.net/api/',
  endpointAuth: 'https://pis-autenticacion-qa.azurewebsites.net/api/',
  endpointDoc: 'https://pis-api-documentacion-qa.azurewebsites.net/api/Documentos/v1/',
  endpointEmpresas : 'https://pis-api-empresas-qa.azurewebsites.net/',
  appKey: 'c53ea43376d653a43e10711de2da2d9b6f156ead',
  googleCaptchaKey: '6LcZ7w4bAAAAAAcogck-Te91o6SPDZYuNcWBlmHX',
  santanderEndpoint: 'https://www.santander.com.mx/Supernet2007/homeMicrositio.jsp',
  santanderResponse: 'https://pis-app-finanzas-qa.azurewebsites.net/finanzas-api/pago-success',
  bbvaEndpoint: 'https://prepro.adquiracloud.mx/clb/endpoint/apimanzanillo',
  bbvaKey: '85K98s7653Ap383iMangt73iO393K0jNjs031Man93k03lo39zAks3llo33fJU3092er93ai3Lj3',
  bbvaSuccessRes: 'https://pis-apiman-restfinav1.azurewebsites.net/api/bbvav1QA',
  bbvaFailRes: 'https://pis-apiman-restfinav1.azurewebsites.net/api/bbvav1QA',
  
  catlogin: {
    usuario: "zz",
    password: "API-MAN-PIS-20!0M3d1n$4!",
    guid: "A7A87580-232A-4E38-ADFC-A78899C9CE8F"
  },
  isEmbeded: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
