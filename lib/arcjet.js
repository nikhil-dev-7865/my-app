import arcjet,{tokenBucket} from "@arcjet/next"

const aj =arcjet({
    key:process.env.ARCJET_KEY,
    characteristics: ["userId"], //track based on Clerk userId
    rules:[
        tokenBucket({
            mode:"LIVE",
            refillRate: 10,
            interval: 3600,
            capacity: 30,
        })
    ]
});
export default aj;