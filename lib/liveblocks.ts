import {Liveblocks} from '@liveblocks/node'
const key = process.env.LIVEBLOCKS_PRAIVATE_KEY;

if(!key){
    throw new Error('LIVEBLOCKS_PRAIVATE_KEY not set')
}
const liveblocks = new Liveblocks({
    secret:key
})

export default liveblocks