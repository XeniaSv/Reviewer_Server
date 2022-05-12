const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {app, getServer} = require('./index');

chai.should();
chai.use(chaiHttp);

describe('Service tests', () => {
    // Auth Service
    describe('Test auth service', () => {
        it('It should register user', async () => {
            const data = {
                email: "test@mail.ru",
                username: "test",
                password: "test"
            };

            const res = await chai.request(app)
                .post("/api/auth/register")
                .send(data);

            res.should.have.status(201);
        });

        it('It should login user', async () => {
            const data = {
                email: "test@mail.ru",
                password: "test"
            }

            const res = await chai.request(app)
                .post('/api/auth/login')
                .send(data);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('accessToken');
            res.body.should.have.property('refreshToken');
            res.body.should.have.property('user');
        });
    });

    // Movie Service
    describe('Test movie service', () => {
        let adminLoginData;
        let testMovieData;

        before(async () => {
            const data = {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            };

            const res = await chai.request(app)
                .post('/api/auth/login')
                .send(data)
            adminLoginData = res.body;
        });

        it('It should create new movie', async () => {
            const data = {
                title: 'Test',
                director: 'Test',
                duration: '3h',
                year: '2000',
                genre: ['test1', 'test2'],
                limit: '18+',
                cast: ['test1', 'test2'],
                desc: 'test, test',
                img: '',
                imgSm: ''
            };

            const res = await chai.request(app)
                .post('/api/movies')
                .send(data)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.title.should.eql(data.title);
            res.body.director.should.eql(data.director);
            res.body.duration.should.eql(data.duration);
            res.body.year.should.eql(data.year);
            res.body.genre.should.eql(data.genre);
            res.body.limit.should.eql(data.limit);
            res.body.cast.should.eql(data.cast);
            res.body.desc.should.eql(data.desc);
            res.body.img.should.eql(data.img);
            res.body.imgSm.should.eql(data.imgSm);

            testMovieData = res.body;
        });

        it('It should get test movie', async () => {
            const res = await chai.request(app)
                .get(`/api/movies/${testMovieData.id}`);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.id.should.eql(testMovieData.id);
            res.body.title.should.eql(testMovieData.title);
            res.body.director.should.eql(testMovieData.director);
            res.body.duration.should.eql(testMovieData.duration);
            res.body.year.should.eql(testMovieData.year);
            res.body.genre.should.eql(testMovieData.genre);
            res.body.limit.should.eql(testMovieData.limit);
            res.body.cast.should.eql(testMovieData.cast);
            res.body.desc.should.eql(testMovieData.desc);
            res.body.img.should.eql(testMovieData.img);
            res.body.imgSm.should.eql(testMovieData.imgSm);
        });

        it('It should get movies', async () => {
            const res = await chai.request(app)
                .get('/api/movies');

            res.should.have.status(200);
            res.body.should.be.a('array');
        });

        it('It should set user rating to test movie', async () => {
            const data = {
                user: adminLoginData.user.id,
                item: testMovieData.id,
                onItem: 'Movie',
                rate: 5
            };

            const res = await chai.request(app)
                .put(`/api/movies/rate/${testMovieData.id}`)
                .send(data)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.rate.should.eql(data.rate);
        });

        it('It should delete user rating to test movie', async () => {
            const data = {
                user: adminLoginData.user.id,
                item: testMovieData.id,
                onItem: 'Movie',
                rate: null
            };

            const res = await chai.request(app)
                .put(`/api/movies/rate/${testMovieData.id}`)
                .send(data)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(201);
            res.body.should.be.a('object');
        })

        it('It should update test movie', async () => {
            const newDirector = 'New test';
            const newYear = '2020';
            const newLimit = '16+';

            testMovieData.director = newDirector;
            testMovieData.year = newYear;
            testMovieData.limit = newLimit;

            const res = await chai.request(app)
                .put(`/api/movies/${testMovieData.id}`)
                .send(testMovieData)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.director.should.eql(newDirector);
            res.body.year.should.eql(newYear);
            res.body.limit.should.eql(newLimit);
        });

        it('It should delete movie', async () => {
            const res = await chai.request(app)
                .delete(`/api/movies/${testMovieData.id}`)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(200);
        });
    });

    // Review service
    describe('Test review service', () => {
        let adminLoginData;
        let testMovieData;
        let testReviewData;

        before(async () => {
            const loginData = {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            };

            const loginRes = await chai.request(app)
                .post('/api/auth/login')
                .send(loginData)
            adminLoginData = loginRes.body;

            const movieData = {
                title: 'Test',
                director: 'Test',
                duration: '3h',
                year: '2000',
                genre: ['test1', 'test2'],
                limit: '18+',
                cast: ['test1', 'test2'],
                desc: 'test, test',
                img: '',
                imgSm: ''
            };

            const movieRes = await chai.request(app)
                .post('/api/movies')
                .send(movieData)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);
            testMovieData = movieRes.body;
        });

        it('It should create new review for test movie', async () => {
            const data = {
                author: adminLoginData.user.id,
                item: testMovieData.id,
                onItem: 'Movie',
                title: 'Test',
                tags: ['test1', 'test2'],
                textReview: 'test test'
            };

            const res = await chai.request(app)
                .post('/api/reviews')
                .send(data)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.authorId.should.eql(data.author);
            res.body.itemId.should.eql(data.item);
            res.body.onItem.should.eql(data.onItem);
            res.body.title.should.eql(data.title);
            res.body.tags.should.eql(data.tags);
            res.body.textReview.should.eql(data.textReview);

            testReviewData = res.body;
        });

        it('It should get review by id', async () => {
            const res = await chai.request(app)
                .get(`/api/reviews/${testReviewData.id}`);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.id.should.eql(testReviewData.id);
            res.body.authorId.should.eql(testReviewData.authorId);
            res.body.itemId.should.eql(testReviewData.itemId);
            res.body.onItem.should.eql(testReviewData.onItem);
            res.body.title.should.eql(testReviewData.title);
            res.body.tags.should.eql(testReviewData.tags);
            res.body.textReview.should.eql(testReviewData.textReview);
        });

        it('It should get reviews by movie id', async() => {
            const res = await chai.request(app)
                .get(`/api/reviews/item/${testReviewData.itemId}`);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.eql(1);
        });

        it('It should get review ids for test movie', async() => {
            const res = await chai.request(app)
                .get(`/api/reviews/item/${testReviewData.itemId}/ids`);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.eql(1);
        });

        it('It should get review ids by type and tag name', async() => {
            const res = await chai.request(app)
                .get(`/api/reviews/type/${testReviewData.onItem}/tag/${testReviewData.tags[0]}/ids`);

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.eql(1);
        });

        it('It should get reviews by type and author id', async() => {
            const res = await chai.request(app)
                .get(`/api/reviews/type/${testReviewData.onItem}/author/${testReviewData.authorId}`);

            res.should.have.status(200);
            res.body.should.be.a('array');
        });

        it('It should get reviews', async() => {
            const res = await chai.request(app)
                .get(`/api/reviews`);

            res.should.have.status(200);
            res.body.should.be.a('array');
        });

        it('It should put like to review', async() => {
            const res = await chai.request(app)
                .put(`/api/reviews/like/${testReviewData.id}`)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(201);
            res.body.likes.should.eql(1);
        });

        it('It should delete like from review', async() => {
            const res = await chai.request(app)
                .put(`/api/reviews/like/${testReviewData.id}`)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(201);
            res.body.likes.should.eql(0);
        });

        it('It should get latest review ids by item type', async() => {
            const res = await chai.request(app)
                .get(`/api/reviews/latest/${testReviewData.onItem}/ids`);

            res.should.have.status(200);
            res.body.should.be.a('array');
        });

        it('It should get popular review ids by item type', async() => {
            const res = await chai.request(app)
                .get(`/api/reviews/popular/${testReviewData.onItem}/ids`);

            res.should.have.status(200);
            res.body.should.be.a('array');
        });

        it('It should update test review', async () => {
            const newTitle = 'New test';
            const newTags = ['test1', 'test2', 'test3'];
            const newTextReview = 'New test new test';

            const updateData = {
                id: testReviewData.id,
                author: testReviewData.authorId,
                item: testReviewData.itemId,
                onItem: 'Movie',
                title: newTitle,
                tags: newTags,
                textReview: newTextReview
            }

            const res = await chai.request(app)
                .put(`/api/reviews/${updateData.id}`)
                .send(updateData)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.id.should.eql(updateData.id);
            res.body.authorId.should.eql(updateData.author);
            res.body.itemId.should.eql(updateData.item);
            res.body.onItem.should.eql(updateData.onItem);
            res.body.title.should.eql(updateData.title);
            res.body.tags.should.eql(updateData.tags);
            res.body.textReview.should.eql(updateData.textReview);
        });

        it('It should delete', async () => {
            const res = await chai.request(app)
                .delete(`/api/reviews/${testReviewData.id}`)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(200);
        });

        after(async () => {
            await chai.request(app)
                .delete(`/api/movies/${testMovieData.id}`)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);
        });
    });

    // User Service
    describe('Test user service', () => {
        let userLoginData;
        let adminLoginData;

        before(async () => {
            const userData = {
                email: "test@mail.ru",
                password: "test"
            };

            const adminData = {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            };

            const loginRes = await chai.request(app)
                .post('/api/auth/login')
                .send(userData)
            userLoginData = loginRes.body;

            const adminRes = await chai.request(app)
                .post('/api/auth/login')
                .send(adminData)
            adminLoginData = adminRes.body;
        });

        it('It should get test user', async () => {
            const response = await chai.request(app)
                .get(`/api/users/${userLoginData.user.id}`)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('id');
            response.body.should.have.property('username');
            response.body.should.have.property('email');
            response.body.should.have.property('isAdmin');
            response.body.should.have.property('createdAt');
        });

        it('It should get users', async () => {
            const res = await chai.request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`);

            res.should.have.status(200);
            res.body.should.be.a('array');
        });

        it('It should delete user', async () => {
            const res = await chai.request(app)
                .delete(`/api/users/${userLoginData.user.id}`)
                .set('Authorization', `Bearer ${adminLoginData.accessToken}`)

            res.should.have.status(200);
        });
    });

    after(() => {
        mongoose.connection.close();
        getServer().close();
    });
});
