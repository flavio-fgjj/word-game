const PRODUCTION = `${window.location.protocol}//${window.location.host}`;
const DEVELOPMENT = `http://${window.location.hostname}:4000`;
const WORD_VALIDATION = `http://${window.location.hostname}:3005/api/validate-word`;

export const environment = {
  production: true,
  apiEndpoint: DEVELOPMENT,
  validationEndpoint: WORD_VALIDATION,
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
