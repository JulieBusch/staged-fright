const request = require('supertest')
const {expect} = require('chai')

const app = require('../src/app')


describe('server', () => {
  it('serves the html page', () =>
    request(app)
      .get(`/`)
      .expect(200)
  )
})

//needs more work - does not fail when it should

