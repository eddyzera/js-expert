const http = require('http')
const DEFAULT_USER = { username: 'Edgar', password: '123' }

const routes = {
  '/contact:get': (request, response) => {
    response.write('contact us page')
    return response.end()
  },
  '/login:post': async (request, response) => {
    for await (const data of request) {
      const user = JSON.parse(data)
      if(
          user.username !== DEFAULT_USER.username || 
          user.password !== DEFAULT_USER.password
        ) {
          response.writeHead(401)
          response.write('Loggin failed')
          return response.end()
      }

      response.write('Logging has succeeded!')
      return response.end()
    }
  },
  default: (request, response) => {
    response.write('Hello world')
    return response.end()
  }
}

const handle = function (request, response) {
  const { url, method } = request
  const routeKey = `${url}:${method.toLowerCase()}`
  const chosen = routes[routeKey] || routes.default
  console.log('routeKey',routeKey)
  response.writeHead(200, {
    'Content-Type': 'text/html'
  })
  return chosen(request, response)
}

const app = http.createServer(handle)
                .listen(3000, () => console.log('app running at', 3000))
module.exports = app