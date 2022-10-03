var compression = require('compression')

export default async function handler(req, res) {
    let uploaded_url = '';
    const fileStr = req.body.data;

    if(req.method === 'POST') {
        console.log(fileStr);
    }
}