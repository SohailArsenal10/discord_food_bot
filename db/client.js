import dotenv from 'dotenv';
dotenv.config();
import { createClient } from 'redis'

    const redis = createClient({
        password: process.env.REDIS_PWD,
        socket: {
            host: process.env.REDIS_DB,
            port: process.env.REDIS_PORT
        }
    });



redis.on('error', (err) => 
{
    if(err)
    console.log('Redis Client Error', err)
});

await redis.connect();


export default redis;
