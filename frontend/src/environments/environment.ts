// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const PRODUCTION = `${window.location.protocol}//${window.location.host}`;
const DEVELOPMENT = `http://${window.location.hostname}:4002`;
const WORD_VALIDATION = `http://${window.location.hostname}:3005/api/validate-word`;
// const DEVELOPMENT = `${window.location.protocol}//${window.location.hostname}/api/get-words`;
// const WORD_VALIDATION = `${window.location.protocol}//${window.location.hostname}/api/validate-word`;
const VERSION = `1.0.0`;

export const environment = {
  production: false,
  apiEndpoint: DEVELOPMENT,
  validationEndpoint: WORD_VALIDATION,
  version: VERSION,
  socialShareOption: [
    {
        title: 'Whatsapp',
        logo: 'assets/socialShare/whatsapp.png',
        shareType: 'shareViaWhatsApp'
    },
    {
        title: 'Facebook',
        logo: 'assets/socialShare/facebook.png',
        shareType: 'shareViaFacebook'
    },
    {
        title: 'Twitter',
        logo: 'assets/socialShare/twitter.png',
        shareType: 'shareViaTwitter'
    },
    {
        title: 'Instagram',
        logo: 'assets/socialShare/instagram.png',
        shareType: 'shareViaInstagram'
    },
    {
        title: 'Email',
        logo: 'assets/socialShare/email.png',
        shareType: 'viaEmail'
    }
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
