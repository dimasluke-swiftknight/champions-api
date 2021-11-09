const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const controllers = require('./api/controllers/index.js');

app.use('/', controllers.ChampionsController);

let server;

const port = process.env.PORT || 3000;

const databaseUrl = 'mongodb://127.0.0.1:27017';

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