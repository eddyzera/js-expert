const { readFile } = require('fs/promises')
// const { join } = require('path')
const User = require('./user')
const { error } = require('./constants')

const DEFAULT_OPTION = {
  maxLines: 3,
  fields: ["id", "name", "profession", "age"]
}

class File {
  static async csvToJson(filePath) {
    const content = await File.getFileContent(filePath)
    const validation = File.isValid(content)
    if(!validation.valid) throw new Error(validation.error)
    const users = File.parseCSVToJson(content)
    return users
  }

  static async getFileContent(filePath) {
    /**
     * O __dirname retorno o caminho do diretório do módulo atual
     * 
     * quando usamos junto com o join ele basicamente pega o caminho do diretório
     * e junta com o caminho do arquivo que queremos acessar
     * assim ele cria um caminho normalizado
     */
    // const filename = await join(__dirname, filePath)
    return (await readFile(filePath)).toString("utf-8")
  }

  static isValid(csvString, options = DEFAULT_OPTION) {
    const [header, ...fileWithoutHeader] = csvString.split('\n')
    const isHeaderValid = header === options.fields.join(',')
    if(!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      }
    }

    const isContentLengthAccepted = (
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines
    )

    if(!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false
      }
    }

    return { valid: true }
  }

  static parseCSVToJson(csvString) {
    const lines = csvString.split('\n')
    const firstLine = lines.shift()
    const header = firstLine.split(',')
    const users = lines.map(line => {
      const columns = line.split(',')
      let user = {}
      for(const index in columns) {
        user[header[index]] = columns[index]
      }
      return new User(user)
    })
    return users
  }
}


module.exports = File