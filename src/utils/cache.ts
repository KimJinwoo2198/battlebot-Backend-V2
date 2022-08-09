import NodeCache from "node-cache"

export const premiumCache = new NodeCache({
    stdTTL: 1000
})