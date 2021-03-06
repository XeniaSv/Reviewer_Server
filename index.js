const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRoute = require('./routers/authRouter');
const userRoute = require('./routers/userRouter');
const movieRoute = require('./routers/movieRouter');
const seriesRoute = require('./routers/seriesRouter');
const bookRoute = require('./routers/bookRouter');
const reviewRoute = require('./routers/reviewRouter');
require('dotenv').config()


const PORT = process.env.PORT || 8000;
const app = express();
let appServer;

app.use(express.json());
app.use(cookieParser('secret'));
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.set('trust proxy', 1);

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/movies', movieRoute);
app.use('/api/books', bookRoute);
app.use('/api/series', seriesRoute);
app.use('/api/reviews', reviewRoute);
app.use(errorMiddleware);

const start = async (url, callback) => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        },() => console.log('DB connected'));
        appServer = await app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
};

const getServer = () => {
    return appServer;
}

start();

module.exports.app = app;
module.exports.getServer = getServer;
