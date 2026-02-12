import { test, describe } from 'node:test'
import supertest from 'supertest'
import app from '../app'

const api = supertest(app)


describe('when user does not comply with the request specification', () => {
  test('it should respond with an error message (At least one item must be provided)', async () => {
    await api
      .post('/api/orders')
      .send()
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        const order = response.body
        return order.message === 'At least one item must be provided'
      })
  })

  test('it should respond with an error message (Customer name and email are required)', async () => {
    await api
      .post('/api/orders')
      .send({
        "items": [
          {
            "id": "ITEM-001",
            "quantity": 1
          }
        ]
      }
      )
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        const order = response.body
        return order.message === 'Customer name and email are required'
      })
  })
});

describe('when user complies to the request specification', () => {
  const newOrder = {
    "items": [
      {
        "id": "ITEM-001",
        "quantity": 1
      }
    ],
    "customer": {
      "name": "James",
      "email": "james@gmail.com"
    }
  }

  test('it should create a new confirmed order', async () => {
    await api
      .post('/api/orders')
      .send(newOrder)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        const order = response.body
        return order.status === 'CONFIRMED'
      })

  })

  test('but tries to repeat same order, it should reject the order', async () => {
    await api
      .post('/api/orders')
      .send(newOrder)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        const order = response.body
        console.log(order)
        return order.status === 'REJECTED'
      })

  })

  test('it should compute the correct calculated total price', async () => {
    const newOrder = {
      "items": [
        {
          "id": "ITEM-001",
          "quantity": 2
        },
        {
          "id": "ITEM-002",
          "quantity": 5
        }
      ],
      "customer": {
        "name": "John",
        "email": "john@gmail.com"
      }
    }
    await api
      .post('/api/orders')
      .send(newOrder)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        const order = response.body
        return order.total === 49250
      })

  })

  test('it should reject order if item is out of stock', async () => {
    const newOrder = {
      "items": [
        {
          "id": "ITEM-001",
          "quantity": 1
        }
      ],
      "customer": {
        "name": "Ana",
        "email": "ana@gmail.com"
      }
    }
    await api
      .post('/api/orders')
      .send(newOrder)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        const order = response.body
        return order.status === 'REJECTED'
      })

  })
});


