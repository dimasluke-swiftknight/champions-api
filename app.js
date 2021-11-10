const express = require('express');
const mongoose = require('mongoose');
const morgan  = require('morgan');

const global = require('./global');


const app = express();

app.use(express.json());

app.use(morgan('combined'));

const controllers = require('./api/controllers/index.js');

app.use('/', controllers.ChampionsController);

app.use(function(err, req, res, next) {
    const message = `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;

    logger.error({
        message: message,
        correlationId: req.headers['x-knight-correlation-id'],
    });
    
    // render the error page
    res.status(err.status || 500);
    res.send({
        status: 'Error',
        message: message
    })
  });

let server;

const port = process.env.PORT || 3000;

const databaseUrl = 'mongodb://host.docker.internal:27017';

const connectDatabase = async (dbUrl) => {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (error) => {
            if (error) throw error;
            console.log(`DB connected at ${dbUrl}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log(`DB disconnected at ${dbUrl}`);
        });

        mongoose.connection.on('reconnected', () => {
            console.log(`DB reconnected at ${dbUrl}`);
        });

        // await db.connect();
    } catch (error) {
        throw error;
    }
}

const runServer = async (dbUrl, portNum) => {
    try {
        await connectDatabase(dbUrl);
		try {
			server = app.listen(portNum, () => {
				console.log(`Server is listening on port ${portNum}`);
			});
		} catch (error) {
			mongoose.disconnect();
			throw error;
		}
    } catch (error) {
        throw error;
    }
}

const closeServer = async () => {
	try {
		await mongoose.disconnect(() => {
			console.log('Disconnected from MongoDB');
		});
		server.close(() => {
			console.log('Server closed');
		});
	} catch (err) {
		logger.error(err);
	}
};

if (require.main === module) {
	runServer(databaseUrl, port).catch(err => console.log(err));
}

module.exports = { app, runServer, closeServer };