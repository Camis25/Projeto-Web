document.addEventListener("DOMContentLoaded", () => {
  const carrossel = document.getElementById("carrosselCards");
  const botao1 = document.getElementById("botao1");
  const botao2 = document.getElementById("botao2");

  const scrollAmount = 300;

  botao1.addEventListener("click", () => {
    carrossel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  botao2.addEventListener("click", () => {
    carrossel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
});
