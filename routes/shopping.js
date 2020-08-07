const express = require('express')
const router = new express.Router()
const ExpressError = require('../expressError')
const items = require('../fakeDB')

// GET ROUTE
router.get('/', (req, res) => {
	res.json(items)
})

// POST ROUTE
router.post('/', (req, res, next) => {
	try {
		if (!req.body.name) throw new ExpressError('Name is required', 400)
		const newItem = { name: req.body.name, price: req.body.price }
		items.push(newItem)
		return res.status(201).json(newItem)
	} catch (e) {
		return next(e)
	}
})

// GET NAME ROUTE
router.get('/:name', (req, res) => {
	const foundItem = items.find((item) => item.name === req.params.name)
	if (foundItem === undefined) {
		throw new ExpressError('Item not found', 404)
	}
	return res.json(foundItem)
})

// PATCH ROUTE
router.patch('/:name', (req, res) => {
	const foundItem = items.find((item) => item.name === req.params.name)
	foundItem.name = req.body.name
	foundItem.price = req.body.price
	if (foundItem === undefined) {
		throw new ExpressError('Item not found', 404)
	}
	return res.json({ updated: { name: foundItem.name, price: foundItem.price } })
})

// DELETE ROUTE
router.delete('/:name', (req, res) => {
	const foundItem = items.findIndex((item) => item.name === req.params.name)
	if (foundItem === -1) {
		throw new ExpressError('Item not found', 404)
	}
	items.splice(foundItem, 1)
	res.json({ message: 'Deleted' })
})

module.exports = router
