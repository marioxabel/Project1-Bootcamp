function generateRandomID() {
    return Math.floor(Math.random()*10000000)
}

document.addEventListener("DOMContentLoaded", function () {
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    const currentDate = new Date().toLocaleDateString('en-US', dateOptions);
    document.getElementById("current-date").textContent = currentDate;
  });

