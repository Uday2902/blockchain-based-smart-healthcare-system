import { createHelia } from 'helia'
import { json } from '@helia/json'

const uploadFile = async (myImmutableAddress) => {
    const helia = await createHelia();
    const j = json(helia);
    return j.get(myImmutableAddress);
}   

export default uploadFile;