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
const listRoute = require('./routers/listRouter');
require('dotenv').config()


const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/movies', movieRoute);
app.use('/api/books', bookRoute);
app.use('/api/series', seriesRoute);
app.use('/api/review', reviewRoute);
app.use('/api/lists', listRoute);
app.use(errorMiddleware);

const start = async (url, callback) => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        },() => console.log('DB connected'));
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
    }
    catch (e) {
        console.log(e);
    }
};

start();