const { describe, it, before, beforeEach, afterEach } = require('mocha')
const sinon = require('sinon')
const { expect } = require('chai')
const { join } = require('path')
const CarService = require('../../src/service/carService')

const mocks = {
  validCarCategory: require('./../mocks/valid-carCategory.json'),
  validCar: require('./../mocks/valid-cars.json'),
  validCustomer: require('./../mocks/valid-customer.json')
}

const carsDataBase = join(__dirname, './../../database', 'cars.json')
describe('CarService Suite Tests', () => {
  let carService = {}
  let sandbox = {}
  before(() => {
    carService = new CarService({
      cars: carsDataBase
    })
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should retriever a random postion from an array', () => {
    const data = [0, 1, 2, 3, 4]
    const result = carService.getRandomPositionFromArray(data)

    expect(result).to.be.lte(data.length).and.be.gte(0)
  })

  it('should choose the first id from carIds in carCategory', () => {
    const carCategory = mocks.validCarCategory
    const carIdIndex = 0

    sandbox.stub(
      carService,
      carService.getRandomPositionFromArray.name
    ).returns(carIdIndex)

    const result = carService.chooseRandomCar(carCategory)
    const expected = carCategory.carIds[carIdIndex]

    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
    expect(result).to.be.equal(expected)
  })

  it('given a carCategory it should return an available car', async () => {
    const car = mocks.validCar
    const carCategory = Object.create(mocks.validCarCategory)
    carCategory.carIds = [car.id]

    sandbox.stub(
      carService.carRepository,
      carService.carRepository.find.name
    ).resolves(car)

    sandbox.spy(
      carService,
      carService.chooseRandomCar.name
    )

    const result = await carService.getAvailableCar(carCategory)
    const expected = car
    
    expect(carService.chooseRandomCar.calledOnce).to.be.ok
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok
    expect(result).to.be.deep.equal(expected)
  })

  it('given a carCategory, customer and numberOfDays it should calculate final amount in real', async () => {
    const customer = Object.create(mocks.validCustomer)
    customer.age = 50

    const carCategory = Object.create(mocks.validCarCategory)
    carCategory.price = 37.6

    const numberOfDays = 5

    const expected = carService.currencyFormat.format(244.40)
    const result = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    )

    expect(result).to.be.deep.equal(expected)
  })
})