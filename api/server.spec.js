const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig');

describe('server.js', ()=> {
    it('Set environment to testing', () => {
        expect(process.env.DB_ENV).toBe('testing')
    })
    describe('GET /api/jokes', () => {
        it('returns JSON', done => {
            request(server)
                .get('/api/jokes')
                .then(res => {
                    expect(res.type).toMatch(/json/i);
                    done();
                })
        })
        it('This better require authorization', () => {
            return request(server)
                .get('/api/jokes')
                .then(res => {
                    expect(res.status).toBe(400);
                    expect(res.body.message).toBe(`There's no credentials`)
                })
        })
        it('Set environment to testing', () => {
            expect(process.env.DB_ENV).toBe('testing')
        })
    })
    describe('/api/auth/register', () => {
        beforeEach(async ()=> {
            await db('users').truncate()
        })
        it('Returns JSON', done => {
            request(server)
                .post('/api/auth/register').send({"username": 'test', "password": 'test'})
                .then(res => {
                    expect(res.type).toMatch(/json/i);
                    done();
                })
        })
        it('Returns 201', () => {
            return request(server)
                .post('/api/auth/register').send({"username": "adric", "password": "burks" })
                .then((res, err) => {
                    console.log(err)
                    expect(res.status).toBe(201);
                })
        })

    })
    describe('/api/auth/login', () => {
        it('Returns JSON', done => {
            request(server)
            .post('/api/auth/login').send({"username": "test", "password": "test"})
            .then(res => {
                expect(res.type).toMatch(/json/i);
                done();
            })

        })
        it('Registering a new user', ()=> {
            return request(server)
            .post('/api/auth/register').send({"username": "test", "password": "test"})
            .then(res => {
                expect(res.status).toBe(201)
            })          })
        it('Returns 200',() => {
              return request(server)

            .post('/api/auth/login').send({"username": "test", "password": "test"})
            .then(res => {
                expect(res.status).toBe(200)
            })

        })
    })
})
