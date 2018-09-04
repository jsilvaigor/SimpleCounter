const express = require('express');
const redis = require('redis');
const morgan = require('morgan');

// Configuring Redis
const redisAddress = process.env.REDIS_URI || 'redis://localhost:6379';

const redisClient = redis.createClient(redisAddress);

redisClient.on("error", function (err) {
    console.log(`Redis Error: ${err}`);
});


//Configuring WebServer
const app = express();

app.use(morgan('combined'));

app.get('/', (req, res) => {

    redisClient.get("counter", (err, result) => {
        if (err) {
            res.status(500).send(`Ooops! Something Wrong happened: ${err}`);
            return;
        }

        if (result) {
            redisClient.incr("counter", (err, incrResult) => {
                if (err) {
                    res.status(500).send(`Ooops! Something Wrong happened: ${err}`);
                    return;
                }

                res.send(`This page has been accessed ${incrResult} times`)
            })
        } else {
            redisClient.set("counter", 1, (err, setResult) => {
                if (err) {
                    res.status(500).send(`Ooops! Something Wrong happened: ${err}`);
                    return;
                }

                res.send(`This page has been accessed 1 time`)
            })
        }
    })
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Application running on port: ${port}`));