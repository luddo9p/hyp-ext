
import localforage from 'localforage'
import {Hyp} from './vendors/Hyp.js'
import {Homepage} from './pages/homepage.js'

const hyp = new Hyp('Frigg', '36marne')
console.log('Hyp extension v:' + hyp.version)

// Boot
hyp.login().then(_session => {
  if (window.location.href.includes('Home')) {
    const home = new Homepage(hyp, _session)
  }
})
