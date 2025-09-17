import mongoose from "mongoose";

class MongoDB {
    constructor() {
        this.DB_HOST = process.env.DB_HOST;
        this.DB_PORT = process.env.DB_PORT;
        this.DB_NAME = process.env.DB_NAME;
        this.DB_USER = process.env.DB_USER;
        this.DB_PASS = encodeURIComponent(process.env.DB_PASS);

        this.db = null;
    }

    connect(callback) {
        const ENDPOINT = `mongodb://${this.DB_USER}:${this.DB_PASS}@${this.DB_HOST}:${this.DB_PORT}/${this.DB_NAME}`;

        mongoose.set("debug", false);
        mongoose.connect(ENDPOINT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.db = mongoose.connection;

        this.db.on("error", (err) => {
            console.error("connection error: ", err);
            process.exit(1);
        });
        this.db.once("open", callback);
    }

    disconnect(callback) {
        mongoose.disconnect(callback);
    }
}

export default new MongoDB();
