process.env.NODE_ENV = 'test'
const request = require('supertest')

const app = require('../app')
let items = require('../fakeDb')

// Create database with one item
let list = { name: 'Mangoes', price: 5.99 }

// Do before each test
beforeEach(function () {
	items.push(list) //<-- add item to arrat before every test
})

// Do after each test
afterEach(function () {
	list.length = 0 //<-- empty array after every test
})

// TEST FOR GET ALL ITEMS FROM DB
describe('GET /items', () => {
	test('Get all items from shopping list', async () => {
		const res = await request(app).get('/items')
		expect(res.statusCode).toBe(200) //<-- check status code
		expect(res.body).toEqual([list]) //<-- check items in list
	})
})

// TEST FOR POST ITEMS INTO DB
describe('POST /items', () => {
	test('Add a single item in the shopping list', async () => {
		const res = await request(app).post('/items').send({ name: 'Bananas', price: 0.99 })
		expect(res.statusCode).toBe(201) //<-- check created status code
		expect(res.body).toEqual({ name: 'Bananas', price: 0.99 }) //<-- add item to DB
	})
})

// TEST FOR GET SINGLE ITEM BY NAME FROM DB
describe('GET /items/:name', () => {
	test('Get single item by iten name', async () => {
		const res = await request(app).get(`/items/${list.name}`)
		expect(res.statusCode).toBe(200) //<-- check status code
		expect(res.body).toEqual(list) //<-- check single item in list
	})
	test('Respond with 404 for an invalid item', async () => {
		const res = await request(app).get(`/items/Strawberries`)
		expect(res.statusCode).toBe(404) //<-- check status code
	})
})

// TEST FOR PATCH (UPDATE) SINGLE ITEM IN DB
describe('PATCH /items/:name', () => {
	test('Updated single item in shopping list', async () => {
		const res = await request(app)
			.patch(`/items/${list.name}`)
			.send({ name: 'Mangoes', price: 5.99 })
		expect(res.statusCode).toBe(200) //<-- check updated status code
		expect(res.body).toEqual({ updated: { name: 'Mangoes', price: 5.99 } })
	})
	test('Respond with 404 for an invalid item', async () => {
		const res = await request(app)
			.patch('/items/Strawberries')
			.send({ name: 'Mangoes', price: 5.99 })
		expect(res.statusCode).toBe(404) //<-- check invalid item status code
	})
})

// TEST FOR DELETE SINGLE ITEM IN DB
describe('DELETE /items/:name', () => {
	test('Delete an item from shopping list', async () => {
		const res = await request(app).delete(`/items/${list.name}`)
		expect(res.statusCode).toBe(200) //<-- check deleted status code
		expect(res.body).toEqual({ message: 'Deleted' }) //<-- show deleted msg
	})
	test('Respond with 404 for deleting an invalid item', async () => {
		const res = await request(app).delete('/items/Strawberries')
		expect(res.statusCode).toBe(404) //<-- check Invalid status code
	})
})

// TESTS FOR:
// Getting all shopping items
// Getting a single item : status code and error
// Deleting a single item: status code and error
// Adding a new item : status code, duplicate item and error
