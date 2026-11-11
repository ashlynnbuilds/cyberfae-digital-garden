// CYBERFAE — Companion interactions

document.addEventListener("DOMContentLoaded", () => {
    const fairy = document.getElementById("fairy-companion");
    const fox = document.getElementById("fox-companion");
    const dialogue = document.getElementById("companion-dialogue");
  
    if (!fairy || !fox || !dialogue) return;
  
    const fairyMessages = [
      "The garden remembers your kindness. ✿",
      "Little actions create beautiful worlds.",
      "You're growing something wonderful.",
      "Even magic begins with one small step."
    ];
  
    const foxMessages = [
      "Yip! I wasn't digging, I promise.",
      "Have you seen my missing acorn?",
      "I'm supervising the garden!",
      "The fairy made me do it."
    ];
  
    let hideTimer;
  
    function speak(messages) {
      const message = messages[
        Math.floor(Math.random() * messages.length)
      ];
  
      dialogue.textContent = message;
      dialogue.classList.add("visible");
  
      clearTimeout(hideTimer);
  
      hideTimer = setTimeout(() => {
        dialogue.classList.remove("visible");
      }, 2500);
    }
  
    fairy.addEventListener("click", () => {
      speak(fairyMessages);
    });
  
    fox.addEventListener("click", () => {
      speak(foxMessages);
    });
  });