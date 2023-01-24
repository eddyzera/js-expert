import DraftLog from 'draftlog'
import chalk from 'chalk'
import readline from 'readline'
import chalkTable from 'chalk-table'
import database from '../database.json'
import Person from './person.js'

DraftLog(console).addLineListener(process.stdin)

const options = {
  leftPad: 2,
  columns: [
    { field: "id", name: chalk.cyan("ID") },
    { field: "vehicles", name: chalk.magenta("Vehicles") },
    { field: "kmTraveled", name: chalk.red("Km Traveled") },
    { field: "from", name: chalk.green("From") },
    { field: "to", name: chalk.white("To") },
  ]
}

const table = chalkTable(options, database.map(item => new Person(item).formatted()))
const print = console.draft(table)

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

terminal.question('Qual é o seu nome ?', msg => {
  console.log(msg)
})
