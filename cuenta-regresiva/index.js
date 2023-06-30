
function updateTime() {
  const currentTime = new Date()
  const currentYear = currentTime.getFullYear()
  const nextYear = currentYear + 1
  const newYearTime = new Date(`${nextYear}-01-01 00:00:00`)
  const diff = newYearTime - currentTime;

  const daysCount = Math.floor(diff/1000/60/60/24);
  const hoursCount = Math.floor(diff/1000/60/60 - daysCount*24);
  const minutesCount = Math.floor(diff/1000/60 - daysCount * 24 * 60 - hoursCount * 60);
  const secondsCount = Math.floor(diff/1000 - daysCount * 24 * 60*60 - hoursCount * 60*60 - minutesCount*60)
  
  const formatedDiff = `${daysCount} días, ${hoursCount}h ${minutesCount}m ${secondsCount}s`;

  document.querySelector('#left-time').textContent = formatedDiff;
}

updateTime();

setInterval(updateTime , 1000);