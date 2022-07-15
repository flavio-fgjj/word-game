const PRODUCTION = `${window.location.protocol}//${window.location.host}`;
const DEVELOPMENT = `${window.location.hostname}:4002`;
const WORD_VALIDATION = `${window.location.hostname}:3005/api/validate-word`;
// const DEVELOPMENT = `${window.location.protocol}//${window.location.hostname}/api/get-words`;
// const WORD_VALIDATION = `${window.location.protocol}//${window.location.hostname}/api/validate-word`;
const VERSION = `1.0.0`;

export const environment = {
  production: true,
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
