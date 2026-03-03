const host = location.hostname
console.log(location);
const adresse = location.origin + '/backend/public/index.php/';
const url: string = location.origin.includes('geschool.ddns.net')? 'http://geschool-backend.ddns.net/': '/';
export const environment = {
    production: true,
    urlApi: adresse,
    pusherKey: '2b34facefc03de20b0d2',
    pusherCluster:'mt1',
    pusherAppId:'2122478',
    pusherUrlApi: location.origin + "/",
};

// export const environment = {
//     production: true,
//     urlApi:"/"
// };
