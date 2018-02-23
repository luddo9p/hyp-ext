export class Ticks {

  constructor () {

    this.ticksR8 = [
       this.tick('Build', 47),
       this.tick('CT', 55, 8, 6),
       this.tick('MT', 50),
       this.tick('N/A', 30),
       this.tick('Ga', 53, 6),
       this.tick('BT', 30, 2),
       this.tick('Nrg/tech', 42),
       this.tick('Planet', 0, 24, 5)
    ].sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })

    this.ticksRLF = [
       this.tick('Build', 14),
       this.tick('CT', 55, 8, 6),
       this.tick('MT', 50),
       this.tick('Tech', 42),
       this.tick('N/A', 30),
       this.tick('Ga', 53, 6),
       this.tick('BT', 54, 6)
    ].sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })

    this.ticksR9 = [
       this.tick('Build', 59),
       this.tick('CT', 55, 8, 6),
       this.tick('MT', 02),
       this.tick('Tech', 54),
       this.tick('N/A', 42),
       this.tick('Ga', 05, 6),
       this.tick('BT', 42, 2)
    ].sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })

  }

  tick(name, atMinute, everyNthHour, startHour) {
    this.name = name
    this.atMinute = atMinute
    this.everyNthHour = everyNthHour || 1
    this.startHour = startHour || 0
  }

  getNextDate (serverDate) {
    const nextDate = new Date(serverDate)
    nextDate.setUTCMilliseconds(0)
    nextDate.setUTCSeconds(0)
    nextDate.setUTCMinutes(this.atMinute)

    if (serverDate.getUTCMinutes() >= this.atMinute) {
      nextDate.setUTCHours(nextDate.getUTCHours() + 1)
    }

    const h = (nextDate.getUTCHours() + 24 - this.startHour) % this.everyNthHour
    if (this.everyNthHour > 1 && h) {
      nextDate.setUTCHours(nextDate.getUTCHours() + this.everyNthHour - h)
    }
    return nextDate
  }

}
