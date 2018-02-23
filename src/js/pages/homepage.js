export class Homepage {
  constructor (hyp, _session) {
    this.planets = []
    this.hyp = hyp
    this.hyp.getOwnPlanets(_session).then(_planets => {
      this.planets = _planets
      this.planets.forEach((el, i) => {
        this.planets.push({
          id: parseInt(el.planetid),
          gov: el.gov,
          name: el.planet,
          bh: el.bhole,
          eco: el.ecomark
        })
        // console.log(el)
      })
      this.displayPlanetInfos()
      Array.from(document.querySelectorAll('.avoid-bh')).forEach(el => {
        el.addEventListener('click', this.avoidBH.bind(this))
      })
      Array.from(document.querySelectorAll('.prep-bh')).forEach(el => {
        el.addEventListener('click', this.prepBH.bind(this))
      })
    })
  }

  avoidBH (e) {
    const _this = e.target
    const _id = parseInt(_this.getAttribute('data-id'))

    this.hyp.avoidBH(_id).then(resp => {
      // console.log(resp)
      _this.parentElement.querySelector('.bh-infos-span').innerHTML = 'No Bh'
      _this.setAttribute('action', 'prep')
      _this.innerHTML = 'Prep BH'
      _this.classList.remove('avoid-bh')
      _this.classList.add('prep-bh')
    })
  }

  prepBH (e) {
    const _this = e.target
    const _id = parseInt(_this.getAttribute('data-id'))

    this.hyp.prepBH(_id).then(resp => {
      _this.parentElement.querySelector('.bh-infos-span').innerHTML = '48'
      _this.setAttribute('action', 'cancel')
      _this.innerHTML = 'Cancel BH'
      _this.classList.remove('prep-bh')
      _this.classList.add('avoid-bh')
    })
  }

  parsePop (el) {
    const tmpGrowthStr = el.querySelector('.basedata img').getAttribute('onmouseover').replace(',', '')
    let tmpGrowth = parseInt(tmpGrowthStr.substring(tmpGrowthStr.indexOf(':') + 2, tmpGrowthStr.indexOf('/ day') - 1))
    tmpGrowth = (tmpGrowth > 0) ? '+' + tmpGrowth : '' + tmpGrowth
    return {
      organic: tmpGrowth
    }
  }

  displayPlanetInfos () {
    const planetCards = [...document.querySelectorAll('.planetCard3')]
    planetCards.forEach((el, i) => {
      const planetId = parseInt(el.id.replace('pc', ''))
      const planet = this.planets.find(k => k.id === planetId)
      const pop = this.parsePop(el)
      const detailsTr = el.querySelector('table .bars')
      var wrap = document.createElement('tbody')
      wrap.classList.add('extra')
      wrap.innerHTML = `
      <tr><td colspan="4">Ecomark: <span class="highlight">${planet.eco}/100</span></td></tr>
      <tr><td colspan="4">Organic: <span class="highlight">${pop.organic}/day</span></td></tr>`
      detailsTr.appendChild(wrap)

      if (parseInt(planet.gov) === 0) {
        var wrapBh = document.createElement('tbody')
        wrapBh.classList.add('bh')

        if (parseInt(planet.bh)) {
          if (parseInt(planet.bh) === 0) {
            wrapBh.innerHTML = `<tr><td colspan="4">Bh: <span class="highlight red bh-infos-span"><button syle='highlight' data-action='cancel' data-id='${planetId}' class='avoid-bh')'>Cancel BH</button></span></td></tr>`
          } else {
            wrapBh.innerHTML = `<tr><td colspan="4">Bh: <span class="highlight red bh-infos-span">${planet.bh - 1}</span>&nbsp; <button syle='highlight' data-action='cancel' data-id='${planetId}' class='avoid-bh')'>Cancel BH</button></td></tr>`
          }
        } else {
          wrapBh.innerHTML = `<tr><td colspan="4">Bh: <span class="highlight red bh-infos-span">No Bh</span>&nbsp; <button syle='highlight' data-action='prep' data-id='${planetId}' class='prep-bh')'>Prep BH</button></td></tr>`
        }
        detailsTr.appendChild(wrapBh)
      }
    })
  }
}
