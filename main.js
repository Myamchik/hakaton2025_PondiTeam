document.addEventListener("DOMContentLoaded", () => {
  const arButton = document.getElementById("startAR");

  arButton.addEventListener("click", () => {
    // Пока просто показываем уведомление
    alert("🚀 Здесь будет запуск AR-сцены!");
    
    // Позже сюда добавим переход на AR-страницу или инициализацию AR.js
    // window.location.href = "ar.html";
  });
});
