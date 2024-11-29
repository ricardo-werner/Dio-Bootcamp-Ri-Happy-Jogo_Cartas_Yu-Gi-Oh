// Variáveis globais
let isGameStarted = false;

// Seleção de elementos
const inputContainer = document.getElementById("container-input"); // Container de entrada
const user = document.getElementById("player-input"); // Input do jogador
const btnSubmit = document.getElementById("btn-submit"); // Botão enviar
const playerNameDisplay = document.getElementById("player-label"); // Exibição do nome do jogador
const gameStartMessage = document.getElementById("game-start-message"); // Mensagem inicial
const gameInterface = document.querySelector(".container__right"); // Container do duelo do jogo

// Evento do botão "Enviar"
btnSubmit.addEventListener("click", () => {
  const playerName = user.value.trim(); // Obtém o nome do jogador sem espaços extras

  if (playerName) {
    // Exibe o nome do jogador na tela
    playerNameDisplay.textContent = playerName.toUpperCase();

    // Inicia o áudio
    const bgm = document.getElementById("bgm");
    bgm.volume = 0.3;
    bgm.play().catch((error) => {
      console.error("Erro ao tentar reproduzir o áudio:", error);
    });

    // Exibe a mensagem de boas-vindas na interface, sem o uso de alert
    alert(gameStartMessage.textContent = `Bem-vindo, ${playerName}! O jogo começou!`);

    // Esconde o input-container
    inputContainer.style.display = "none";

    // Remove o id "disable" da classe container__right
    gameInterface.removeAttribute("id"); // Remove o id="disable"

    // Atualiza o estado do jogo
    isGameStarted = true;
  } else {
    alert("Por favor, insira um nome antes de iniciar o jogo.");
  }
});

// Estado do jogo
const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },

  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player1: "player-cards",
    player1Box: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

// Caminho das imagens
const pathImages = "./src/assets/icons/";

// Conteúdo das cartas
const cardContent = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    image: `${pathImages}dragon.jpg`,
    winOf: [3, 4], // Vence Tyhone e Bezaubernde Nixe
    loseOf: [1, 2, 5], // Perde para Dark Magician, Exodia, e Celtic Guardian
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    image: `${pathImages}magician.jpg`,
    winOf: [0, 4], // Vence Dragon e Bezaubernde Nixe
    loseOf: [2, 3, 5], // Perde para Exodia, Tyhone, e Celtic Guardian
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    image: `${pathImages}exodia.jpg`,
    winOf: [0, 1, 3, 4, 5], // Vence todos
    loseOf: [], // Não perde para ninguém
  },
  {
    id: 3,
    name: "Tyhone",
    type: "Wind",
    image: `${pathImages}tyhone.jpg`,
    winOf: [1, 5], // Vence Dark Magician e Celtic Guardian
    loseOf: [2, 4, 0], // Perde para Exodia, Bezaubernde Nixe, e Dragon
  },
  {
    id: 4,
    name: "Bezaubernde Nixe",
    type: "Water",
    image: `${pathImages}nixe.jpg`,
    winOf: [3, 0], // Vence Tyhone e Dragon
    loseOf: [1, 5, 2], // Perde para Dark Magician, Celtic Guardian, e Exodia
  },
  {
    id: 5,
    name: "Celtic Guardian",
    type: "Earth",
    image: `${pathImages}celtic_guardian.jpg`,
    winOf: [0, 1, 4], // Vence Dragon, Dark Magician, e Bezaubernde Nixe
    loseOf: [3, 2], // Perde para Tyhone e Exodia
  },
];

// Função para obter um ID de carta aleatório
async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardContent.length);
  return cardContent[randomIndex].id;
}

// Função para criar a imagem da carta
async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(idCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

// Função para definir as cartas no campo
async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardContent[cardId].image;
  state.fieldCards.computer.src = cardContent[computerCardId].image;

  let duelResult = await checkDuelResult(cardId, computerCardId);

  await updateScore();
  await drawButtons(duelResult);
}

// Função para desenhar os botões com o resultado do duelo
async function drawButtons(duelResult) {
  state.actions.button.innerText = duelResult.toUpperCase();
  state.actions.button.style.display = "block";
}

// Função para atualizar a pontuação
async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

// Função para verificar o resultado do duelo
async function checkDuelResult(playerCardId, computerCardId) {
  let duelResult = "draw";
  //await playAudio(duelResult);
  let playerCard = cardContent[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResult = "win";
    await playAudio(duelResult);
    state.score.playerScore++;
  }

  if (playerCard.loseOf.includes(computerCardId)) {
    duelResult = "lose";
    await playAudio(duelResult);
    state.score.computerScore++;
  }

  return duelResult;
}

// Função para remover todas as imagens das cartas
async function removeAllCardsImages() {
  let { computerBox, player1Box } = state.playerSides;
  let imageElement = computerBox.querySelectorAll("img");
  imageElement.forEach((img) => {
    img.remove();
  });

  imageElement = player1Box.querySelectorAll("img");
  imageElement.forEach((img) => {
    img.remove();
  });

  state.fieldCards.player.src = "";
  state.fieldCards.computer.src = "";
}

// Função para desenhar a carta selecionada
async function drawSelectedCard(index) {
  state.cardSprites.avatar.src = cardContent[index].image;
  state.cardSprites.name.innerHTML = cardContent[index].name;
  state.cardSprites.type.innerHTML = "Attribute : " + cardContent[index].type;
}

// Função para desenhar as cartas
async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

// Função para resetar o duelo
async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerHTML = "Selecione";
  state.cardSprites.type.innerHTML = "uma carta";
  state.actions.button.style.display = "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  initial();
}

// Função para tocar o áudio
async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}


// Função inicial
function initial() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);

}

// Chama a função inicial para iniciar o jogo
initial();
