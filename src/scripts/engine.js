// Initialize the game engine
const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score_points'),
  },

  cardSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type'),
  },
  fieldCards: {
    playerCard: document.getElementById('player-field-card'),
    computerCard: document.getElementById('computer-field-card'),
  },
  actions: {
  button: document.getElementById('next-duel'),
  },
};

const playerSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

const pathImages = './src/assets/icons/';

const cardContent =[
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "PAper",
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
    name: "exodia",
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

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'));
    });
  }

  cardImage.addEventListener('mouseover', () => {
    drawSelectedCard(idCard);
});

  return cardImage;

}


async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
  }
}





function initial() {
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
}

initial();