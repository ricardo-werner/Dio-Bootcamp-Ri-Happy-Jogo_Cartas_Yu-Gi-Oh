// Initialize the game engine
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

const pathImages = './src/assets/icons/';

const cardContent =[
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    image: `${pathImages}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    image: `${pathImages}magician.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    image: `${pathImages}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
]

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardContent.length);
  return cardContent[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement('img');
  cardImage.setAttribute("height", '100px');
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener('mouseover', () => {
    drawSelectedCard(idCard);
    });

    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'));
    }); 
}

  return cardImage;

}

async function setCardsField(cardId){

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

async function drawButtons(duelResult){
  state.actions.button.innerText = duelResult.toUpperCase();
  state.actions.button.style.display = "block";
};

async function updateScore(){
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResult(playerCardId, computerCardId){
  let duelResult = "draw";
  //await playAudio(duelResult);
  let playerCard = cardContent[playerCardId];

  if(playerCard.winOf.includes(computerCardId)){
    duelResult = "win";
    await playAudio(duelResult);
    state.score.playerScore++;
  }

  if(playerCard.loseOf.includes(computerCardId)){
    duelResult = "lose";
    await playAudio(duelResult);
    state.score.computerScore++;
  }

  return duelResult;
}

async function removeAllCardsImages(){
  let { computerBox, player1Box} = state.playerSides;
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


async function drawSelectedCard(index) {
  state.cardSprites.avatar.src = cardContent[index].image;
  state.cardSprites.name.innerHTML = cardContent[index].name;
  state.cardSprites.type.innerHTML = "Attribute : " + cardContent[index].type;
}


async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
  }
}


async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerHTML = "Selecione";
  state.cardSprites.type.innerHTML = "uma carta";
  state.actions.button.style.display = "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  initial();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}


function initial() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
}

initial();