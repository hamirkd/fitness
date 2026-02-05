const host = location.hostname
console.log(location);
const adresse = location.origin + '/backend/public/index.php/';
const url: string = location.origin.includes('geschool.ddns.net')? 'http://geschool-backend.ddns.net/': '/';
export const environment = {
    production: true,
    urlApi: adresse
};

// export const environment = {
//     production: true,
//     urlApi:"/"
// };
