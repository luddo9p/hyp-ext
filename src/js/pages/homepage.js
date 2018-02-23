export class Homepage {
  constructor (hyp, _session) {
    this.planets = []
    hyp.getOwnPlanets(_session).then(_planets => {
      this.planets = _planets
      this.planets.forEach((el, i) => {
        this.planets.push({
          id: parseInt(el.planetid),
          gov: el.gov,
          name: el.planet,
          bh: el.bhole,
          eco: el.ecomark
        })
        console.log(el)
      })
      this.displayPlanetInfos()
    })
  }

  parsePop (el) {
    const tmpGrowthStr = el.querySelector('.basedata img').getAttribute('onmouseover').replace(',', '')
    let tmpGrowth = parseInt(tmpGrowthStr.substring(tmpGrowthStr.indexOf(':') + 2, tmpGrowthStr.indexOf('/ day') - 1))
    let leechGrowth = parseInt(tmpGrowthStr.substring(tmpGrowthStr.indexOf('Leeching:') + 9, tmpGrowthStr.indexOf('/day')))
    console.log(leechGrowth)
    tmpGrowth = (tmpGrowth > 0) ? '+' + tmpGrowth : '' + tmpGrowth
    leechGrowth = (leechGrowth > 0) ? '+' + leechGrowth : '' + leechGrowth
    return {
      organic: tmpGrowth,
      leech: leechGrowth
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

      console.log(wrap.innerHTML)
      wrap.innerHTML = `
      <tr><td colspan="4">Ecomark: <span class="highlight">${planet.eco}/100</span></td></tr>
      <tr><td colspan="4">Organic: <span class="highlight">${pop.organic}/day</span></td></tr>`
      if (pop.leech) {
        wrap.innerHTML += `<tr><td colspan="4">Leech: <span class="highlight">${pop.leech}/day</span></td></tr>`
      }
      detailsTr.appendChild(wrap)
    })
    // $('.planetCard3').each(function (i, element) {
    //   element = $(element)
    //   var detailsTr = element.find('table')
    //   var planetId = parseInt(element.attr('id').replace('pc', ''), 10)

    //   var tmpGrowthStr = element.find('.basedata img').attr('onmouseover').replace(',', '')
    //   var tmpGrowth = parseInt(tmpGrowthStr.substring(tmpGrowthStr.indexOf(':') + 2, tmpGrowthStr.indexOf('/ day') - 1))
    //   var leechGrowth = parseInt(tmpGrowthStr.substring(tmpGrowthStr.indexOf('Leeching:') + 9, tmpGrowthStr.indexOf('/day')))
    //   tmpGrowth = (tmpGrowth > 0) ? '+' + tmpGrowth : '' + tmpGrowth
    //   leechGrowth = (leechGrowth > 0) ? '+' + leechGrowth : '' + leechGrowth

    //   var _planet = _.find(planets, {
    //     id: planetId
    //   })
    //   if (_planet) {
    //     detailsTr.find('.civ').append($('<tr class="eco">').append(
    //       $('<td colspan="4">').append([
    //         'Ecomark: ',
    //         $('<span class="highlight">')
    //           .text(_planet.eco + ' / 100')
    //       ])
    //     ))

    //     detailsTr.find('.civ').append($('<tr class="influ-wtr">').append(
    //       $('<td colspan="4">').append([
    //         'Organic: ',
    //         $('<span class="highlight">')
    //           .text(tmpGrowth + ' / day')
    //       ])
    //     ))
    //     if (!isNaN(leechGrowth)) {
    //       detailsTr.find('.civ').append($('<tr class="influ-wtr">').append(
    //         $('<td colspan="4">').append([
    //           'Leech: ',
    //           $('<span class="highlight">')
    //             .text(leechGrowth + ' / day')
    //         ])
    //       ))
    //     }
    //     if (_planet.governmentId == 0) {
    //       // console.log(_planet.bh);
    //       if (_planet.bhole) {
    //         if (_planet.bhole === 0) {
    //           detailsTr.find('.civ').append($('<tr class="influ-max">').append(
    //             $('<td colspan="4" class="bh-infos">').append([
    //               'BH is ready ',
    //               $('<span class="highlight bh-infos-span" style="color:red">')
    //                 .text('ready')
    //             ]).append([
    //               "&nbsp; <button syle='highlight' data-action='cancel' data-id='" + planetId + "' class='avoid-bh')'>Cancel BH</button>"
    //             ])
    //           ))
    //         } else {
    //           detailsTr.find('.civ').append($('<tr class="influ-max">').append(
    //             $('<td colspan="4" class="bh-infos">').append([
    //               'BH ready: ',
    //               $('<span class="highlight bh-infos-span" style="color:red">')
    //                 .text(_planet.bhole - 1)
    //             ]).append([
    //               "&nbsp; <button syle='highlight' data-action='cancel' data-id='" + planetId + "' class='avoid-bh')'>Cancel BH</button>"
    //             ])
    //           ))
    //         }
    //       } else {
    //         detailsTr.find('.civ').append($('<tr class="influ-max">').append(
    //           $('<td colspan="4" class="bh-infos">').append([
    //             'BH ready: ',
    //             $('<span class="highlight bh-infos-span" style="color:red">')
    //               .text('No bh prep')
    //           ]).append([
    //             "&nbsp; <button syle='highlight' data-action='prep' data-id='" + planetId + "' class='prep-bh')'>Prep BH</button>"
    //           ])
    //         ))
    //       }
    //     }
    //   }
    // })
  }
}
