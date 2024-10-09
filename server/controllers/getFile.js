import { createHelia } from 'helia'
import { json } from '@helia/json'

const getFile = async (cid) => {
    const helia = await createHelia();
    const j = json(helia);
    const file = await j.get(cid);
    console.log('Retrieved file:', file);

    return file;
}

module.exports = {getFile};