const assert = require('assert')
const { describe, it } = require('mocha')
const request = require('supertest')
const api = require('./api')

describe('API Suite test', () => {
  describe('/contact', () => {
    it('should request the contact page and return HTTP Status 200', async () => {
      const response = await request(api)
                              .get('/contact')
                              .expect(200)
      assert.deepStrictEqual(response.text, 'contact us page')
    })
  })
  describe('/hello', () => {
    it('should request an inexistent route /hi and redirect to /hello', async () => {
      const response = await request(api)
                            .get('/hi')
                            .expect(200)
      assert.deepStrictEqual(response.text, 'Hello world')
    })
  })

  describe('/login', () => {
    it('should login succesfully on the login route and return HTTP status 200', async () => {
      const response = await request(api)
                            .post('/login')
                            .send({ username: 'Edgar', password: '123' })
                            .expect(200)
      assert.deepStrictEqual(response.text, 'Logging has succeeded!')
    })

    it('should unauthorized a request when requesting it using wrong credentials and return HTTP Status 401', async () => {
      const response = await request(api)
                            .post('/login')
                            .send({ username: 'Livia', password: '123' })
                            .expect(401)
      assert.deepStrictEqual(response.text, 'Loggin failed')
    })
  })
})