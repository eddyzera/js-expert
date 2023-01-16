const { rejects, deepStrictEqual } = require('assert')
const { error } = require('./src/constants')
const File = require('./src/file')

;
(async () => {
  {
    const filePath = './mocks/emptyFile-invalid.csv'
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
    const result = File.csvToJson(filePath)
    await rejects(result, rejection)
  }
  {
    const filePath = './mocks/fourItens-invalid.csv'
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
    const result = File.csvToJson(filePath)
    await rejects(result, rejection)
  }
  {
    const filePath = './mocks/threeItens-valid.csv'
    const result = await File.csvToJson(filePath)
    const expected = [
      {
        "name": "Edgar Silva",
        "id": 123,
        "profession": "Eng de Software",
        "birthDay": 1995
      },
      {
        "name": "Livia Moreira",
        "id": 456,
        "profession": "Nutricionista",
        "birthDay": 1940
      },
      {
        "name": "Carlos Silva",
        "id": 456,
        "profession": "Dev Front",
        "birthDay": 1990
      }
    ]

    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
  }
})()