export const environment = {
  production: true,
  webLink: `${window.location.origin}/app/gcclip/#/presentation/`,
  apiLink: `http://gordoncollegeccs.edu.ph:4230/${btoa('api').replace('=', '')}/`,
  imageLink: `http://gordoncollegeccs.edu.ph:4230/${btoa('api').replace('=', '')}/${btoa('uploads').replace('=', '')}/`,
  socket: `http://gordoncollegeccs.edu.ph:4231`,
};
