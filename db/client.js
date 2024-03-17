import dotenv from 'dotenv';
dotenv.config();
import { createClient } from 'redis'

    const redis = createClient({
        password: process.env.REDIS_PWD,
        socket: {
            host: process.env.REDIS_DB,
            port: 12857
        }
    });



redis.on('error', (err) => 
{
    if(err)
    console.log('Redis Client Error', err)
    else
    console.log('Successfully connected to Redis Client')
});

await redis.connect();


export default redis;
