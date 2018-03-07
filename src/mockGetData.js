
const rand = range => Math.round(Math.random()*(range-1)) + 1
const letters = 'abc def ghi jkl mno pqr stu vwx yz'
const dataPoints = 50000
const loadNr = 100
const maxTimesLoaded = dataPoints / loadNr

let timesLoaded = 0

const getData = () => {
  const randomData = () => {
    let data = []
    for (let i=1; i<=100; i++) {
      data.push({
        date: `${1990 + rand(30)}-${String(rand(12)).padStart(2, 0)}-${String(rand(28)).padStart(2, 0)}`,
        group: ['a', 'b', 'c', 'd', 'e'][rand(5)-1],
        text: letters.split('').filter(() => rand(2)-1).join('')
      })
    }
    timesLoaded++
    return timesLoaded >= maxTimesLoaded ? [] : data
  }

  return randomData()
}

export default getData
