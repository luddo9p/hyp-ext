/* global fetch, Headers, URL, URLSearchParams, XMLHttpRequest */

export class Hyp {
  constructor (_login, _password) {
    this.version = '1.0.0'

    this.loginName = _login
    this.password = _password

    // Game Data
    this.gameId = 0
    this.races = ['Human', 'Azterk', 'Xillor']
    this.products = ['Agro', 'Minero', 'Techno']
    this.governments = ['Dictatorial', 'Authoritarian', 'Democratic', 'Hyp.protect.']
    this.govs = ['Dict.', 'Auth.', 'Demo.', 'Hyp.']
    this.units = ['Factories', 'Destroyers', 'Cruisers', 'Scouts', 'Bombers', 'Starbases', 'Ground Armies', 'Carried Armies']
    this.spaceAvgP = [
      // [Human, Azterk, Xillor, H, Average]
      [0, 0, 0, 0, 0], // Factories
      [56, 73, 67, 0, 65], // Destroyers
      [319, 393, 475, 0, 396], // Cruisers
      [8, 6, 7, 0, 7], // Scouts
      [66, 85, 105, 0, 85], // Bombers
      [2583, 2583, 2583, 0, 2583], // Starbases
      [0, 0, 0, 0, 0], // Ground Armies
      [0, 0, 0, 0, 0] // Carried Armies
    ]
    this.groundAvgP = [300, 360, 240, 0, 300]
  }

  // Url helper
  url (_route) {
    if (window.location.protocol !== 'https:') {
      return 'http://hyp2.hyperiums.com/servlet/' + _route
    } else {
      return 'https://hyperiums.com/servlet/' + _route
    }
  }

  urlWithParams (urlString, params = {}) {
    const url = new URL(urlString)
    const searchParams = new URLSearchParams()
    Object.keys(params).forEach((key) => {
      searchParams.append(key, params[key])
    })
    url.search = searchParams.toString()
    return url.toString()
  }

  getSession () {
    return new Promise((resolve, reject) => {
      const cookieEnd = document.cookie.split('HypII2=')
      const chunks = cookieEnd[1].split('Z')

      if (chunks) {
        resolve({
          playerId: parseInt(chunks[0]),
          authKey: parseInt(chunks[1]),
          gameId: parseInt(chunks[2])
        })
      } else {
        reject(new Error('The cookie is not set'))
      }
    })
  }

  login () {
    return new Promise((resolve, reject) => {
      fetch(this.url('Login'), {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'text/plain'
        }),
        body: {
          login: this.loginName,
          pwd: this.password,
          weblogin: 'Login',
          lang: 0
        }})
        .then(response => {
          return response.text()
        })
        .then(htmlResponse => {
          const html = document.createElement('html')
          html.innerHTML = htmlResponse

          if (!html.querySelector('.error')) {
            this.getSession().then((session) => {
              resolve(session)
            })
          } else {
            reject(new Error('Session failed'))
          }
        })
    })
  }

  getOwnPlanets (session) {
    return new Promise((resolve, reject) => {
      const d = new Date()
      const args = {}
      args.planet = args.planet || '*'
      args.data = args.data || 'general'
      args.request = 'getplanetinfo'
      args.failsafe = d.getMinutes()
      args.gameid = args.gameid || session.gameId
      args.playerid = args.playerid || session.playerId
      args.authkey = args.authkey || session.authKey

      this.hapi(args).then(htmlResponse => {
        const pairs = {}
        const planets = []

        htmlResponse.split('&').forEach(pair => {
          const split = pair.split('=')
          if (split[0] !== 'dummy' && split[0] !== 'failsafe') { pairs[split[0]] = split[1] }
        })

        if (pairs) {
          for (var key in pairs) {
            if (pairs.hasOwnProperty(key)) {
              const value = pairs[key]
              let i = 0
              const keys = /^(.+?)_?(\d+)$/.exec(key)

              if (keys && keys.length) {
                key = keys[1]
                i = parseInt(keys[2])
                if (!planets[i]) {
                  planets[i] = {}
                }
                planets[i][key] = value
              } else {
                planets[key] = value
              }
            }
          }
          resolve(planets)
        } else {
          reject(new Error('No pairs/data'))
        }
      })
    })
  }

  prepBH (_id) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.open('POST', this.url('Floatorders'), true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          resolve()
        }
      }
      xhr.send('initblackhole=Prepare&def=0&planetid=' + _id)
    }).catch(error => {
      throw new Error(error)
    })
  }

  avoidBH (_id) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.open('POST', this.url('Floatorders'), true)
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          resolve()
        }
      }
      xhr.send('cancelbhinit=Cancel preparation&planetid=' + _id)
    }).catch(error => {
      throw new Error(error)
    })
  }

  hapi (args) {
    return new Promise((resolve, reject) => {
      const url = 'HAPI'

      fetch(this.urlWithParams(this.url(url), args)).then(response => {
        return response.text()
      }).then(htmlResponse => {
        resolve(htmlResponse)
      })
    })
  }

  getGameId () {
    return this.gameId
  }
}
