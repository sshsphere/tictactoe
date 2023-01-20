const Gameboard = (() => {
    const m_winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    let m_board = Array(9).fill("");
    let m_possibleMoves = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    const getBoard = () => m_board;
    const isValid = (index) => {
        return m_possibleMoves.has(Number(index));
    }
    const setBoardPos = (index, mark) => {
        m_board[index] = mark;
        m_possibleMoves.delete(Number(index));
    }
    const clearBoard = () => {
        m_board = Array(9).fill("");
        m_possibleMoves = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    }
    const checkWin = (m_boardpos = getBoard()) => {
        let index = m_winningCombinations.findIndex(combination => {
            return m_winningCombinations.every(index => {
                return m_boardpos[combination[0]] === m_boardpos[index];
            })
        });
        if (index != -1) {
            return { mark: "Win", symbol: m_boardpos[m_winningCombinations[index][0]], positions: m_winningCombinations[index] };
        }

        else if (!m_boardpos.some(row => row.includes(""))) return { mark: "Tie" };
        else return { mark: "Ongoing" };
    }
    const getRandomPos = () => {
        let pos = Array.from(m_possibleMoves);
        return pos[Math.floor(Math.random() * pos.length)];
    }
    const minimax = (boardpos = getBoard(), depth = 0, ismaximizing = 0, maxDepth = Infinity) => {
        const mark = (ismaximizing) ? "X" : "O";
        let bestScore = (ismaximizing) ? Number.MIN_VALUE : Number.MAX_VALUE;
        let result = checkWin(boardpos);
        let moves = [];
        if (result.mark !== "Ongoing") {
            if (result.mark === "Tie") result = 0;
            else if (result.symbol === "X") result = 1;
            else result = -1;
            return result;
        }
        if (depth > maxDepth) {
            return 0;
        }
        for (let i = 0; i < 9; i++) {
            if (boardpos[i] === "") {
                boardpos[i] = mark;
                let score = minimax(boardpos, depth + 1, !ismaximizing, maxDepth);
                boardpos[i] = "";
                if (score < bestScore && depth === 0) {
                    moves = [];
                }
                bestScore = (ismaximizing) ? Math.max(score, bestScore) : Math.min(score, bestScore);
                if (score === bestScore && depth === 0) {
                    moves.push(i);
                }
            }
        }
        if (depth === 0) {
            const movepos = moves[Math.floor(Math.random() * moves.length)];
            return movepos;
        }
        else {
            return bestScore;
        }
    }
    return { getBoard, setBoardPos, clearBoard, isValid, checkWin, getRandomPos, minimax };
})();

const GameSettings = (() => {
    let numOfRounds = -1;
    let AIDifficulty = -1;
    let playerCount = 2;
    let playerNames = ["Player 1", "Player 2"];
    const menuOverlay = document.querySelector(".setup-overlay");
    const form = document.querySelector(".player-form");
    const onePlayerButton = document.querySelector(".one-player-button");
    const twoPlayerButton = document.querySelector(".two-player-button");
    const versusText = document.querySelector(".versus-text");
    const gameLengthText = document.querySelector(".game-length-text");
    const AIDescriptionText = document.querySelector(".ai-description-text");
    const startButton = document.querySelector(".start");
    const radioContainer = document.querySelector(".radio-container");
    const gameLength = form.elements['game-length'];
    const playerNameFields = form.elements['player-name'];
    const AIDifficultyField = form.elements['ai-difficulty'];
    const getSettings = () => {
        return { numOfRounds, AIDifficulty, playerNames };
    };
    const openMenu = () => {
        menuOverlay.style.display = "block";
        menuOverlay.style.overflow = "auto";
        document.body.style.overflow = "hidden";
        document.body.parentNode.style.overflow = "hidden";
    };
    const closeMenu = () => {
        menuOverlay.style.display = "none";
    };
    onePlayerButton.addEventListener('click', () => {

        playerCount = 1;
        Array.from(radioContainer.children).forEach((item) => { item.style.display = "flex" });
        gameLengthText.style.display = "block";
        AIDescriptionText.style.display = "block";
        versusText.style.display = "none";
        playerNameFields[1].style.display = "none";
        playerNameFields[0].style.display = "block";
        startButton.style.display = "block";
        AIDifficultyField.style.display = "block";
    });
    twoPlayerButton.addEventListener('click', () => {
        playerCount = 2;
        Array.from(radioContainer.children).forEach((item) => { item.style.display = "flex" });
        gameLengthText.style.display = "block";
        AIDescriptionText.style.display = "none";
        versusText.style.display = "block";
        playerNameFields[1].style.display = "block";
        playerNameFields[0].style.display = "block";
        startButton.style.display = "block";
        AIDifficultyField.style.display = "none";
    });
    const setValuesOnSubmit = () => {
        if (playerNameFields[0].value.trim().length !== 0) {
            playerNames[0] = playerNameFields[0].value.trim();
        }
        else {
            playerNames[0] = "Player 1";
        }
        if (playerNameFields[1].value.trim().length !== 0) {
            playerNames[1] = playerNameFields[1].value.trim();
        }
        else {
            playerNames[1] = "Player 2";
        }
        if (playerCount === 1) {

            AIDifficulty = AIDifficultyField.value;
            playerNames[1] = ` ${AIDifficulty.charAt(0).toUpperCase() + AIDifficulty.slice(1)} AI`;
        }
        else {
            AIDifficulty = -1;
        }
        if (gameLength.value === "endless") {
            numOfRounds = -1;
        }
        else if (gameLength.value === "single") {
            numOfRounds = 1;
        }
        else if (gameLength.value === "short") {
            numOfRounds = 3;
        }
        else if (gameLength.value === "medium") {
            numOfRounds = 7;
        }
        else if (gameLength.value === "long") {
            numOfRounds = 13;
        }
        closeMenu();
    };
    openMenu();
    return { openMenu, getSettings, setValuesOnSubmit };
})();
const Player = (mark) => {
    let score, name = "undefined", AILevel = -1;
    const resetInfo = () => {
        score = 0;
        if (mark === "X") {
            name = GameSettings.getSettings().playerNames[0];
        }
        else {
            AILevel = GameSettings.getSettings().AIDifficulty;
            name = GameSettings.getSettings().playerNames[1];
        }
    }
    resetInfo();
    const makeMove = (index) => {
        Gameboard.setBoardPos(index, mark);
    }
    const incrementScore = () => {
        score++;
    }
    const getAIMove = () => {

        if (AILevel === -1) return;
        if (AILevel === "easy") {
            return Gameboard.getRandomPos();
        }
        else if (AILevel === "medium") {
            return Gameboard.minimax(undefined, undefined, undefined, 2);
        }
        else if (AILevel === "impossible") {
            return Gameboard.minimax();
        }
    }
    const getName = () => name;
    const getScore = () => score;
    const getAILevel = () => AILevel;
    return { getName, makeMove, getScore, incrementScore, resetInfo, getAILevel, getAIMove };
}

const GameState = (() => {
    let turn = false;
    let nextstartingturn = true;
    let finished = false;
    const playerX = Player("X");
    const playerO = Player("O");
    const form = document.querySelector(".player-form");
    const squares = document.querySelectorAll(".grid-item");
    const playerDisplay = document.querySelectorAll(".player-score-number");
    const nameDisplay = document.querySelectorAll(".player-name");
    const trophyDisplay = document.querySelectorAll(".fa-trophy");
    const circleDisplay = document.querySelectorAll(".fa-circle");
    const muteButton = document.querySelector(".fa-volume-up");
    const resetButton = document.querySelector("#reset");
    const newGameButton = document.querySelector('#new-game');
    const winScreen = document.querySelector('.win-overlay');
    const winText = document.querySelector('#win-text');
    const winSound = new Audio('sounds/b.wav');
    const moveSound = new Audio('sounds/c.wav');
    let canMove = true;
    let x;
    const checkWin = () => {
        if (GameSettings.getSettings().numOfRounds === -1) {
            return;
        }
        if (playerX.getScore() > (GameSettings.getSettings().numOfRounds) / 2) {
            winText.textContent = `${playerX.getName()} wins!`;
            winScreen.style.setProperty("display", "flex");
            confetti();
        }
        else if (playerO.getScore() > (GameSettings.getSettings().numOfRounds) / 2) {
            winText.textContent = `${playerO.getName()} wins!`;
            winScreen.style.setProperty("display", "flex");
            confetti();
        }
    };
    const updateCircleDisplay = () => {
        circleDisplay[Number(turn)].classList.add('show');
        circleDisplay[Number(!turn)].classList.remove('show');
    };
    const switchStartingTurn = () => {
        turn = nextstartingturn;
        nextstartingturn = !nextstartingturn;
    };
    const clearGrid = () => {
        Gameboard.clearBoard();
        squares.forEach((square) => {
            square.textContent = "";
            square.classList.remove('glow');
        });
        trophyDisplay[0].classList.remove('show');
        trophyDisplay[1].classList.remove('show');
    };
    const advanceRound = () => {
        switchStartingTurn();
        finished = true;
        updateScoreDisplay();
    };
    const resetGame = () => {
        clearTimeout(x);
        canMove = true;
        playerX.resetInfo();
        playerO.resetInfo();
        updateScoreDisplay();
        clearGrid();
        turn = false;
        nextstartingturn = true;
        finished = false;
        updateCircleDisplay();
        nameDisplay[0].childNodes[1].textContent = playerX.getName();
        nameDisplay[1].childNodes[1].textContent = playerO.getName();
        if (GameSettings.getSettings().AIDifficulty === -1) {
            nameDisplay[1].childNodes[0].style.setProperty("display", "none", "important");
        }
        else {
            nameDisplay[1].childNodes[0].style.setProperty("display", "inline-block");
        }
    };
    const getGridSquareByIndex = (ind) => {
        return document.querySelector(`.grid-item[data-ind="${ind}"]`);
    }
    const updateScoreDisplay = () => {
        playerDisplay[0].textContent = playerX.getScore();
        playerDisplay[1].textContent = playerO.getScore();
    }
    resetGame();
    const Move = (ind) => {
        if (finished) {
            clearGrid();
            finished = false;
            if (turn == 1 && playerO.getAILevel() !== -1) {
                canMove = false;
                (() => {
                    x = setTimeout(() => {
                        Move(playerO.getAIMove());
                        canMove = true;
                    }, 400);
                })();
            }
            return;
        }
        if (!Gameboard.isValid(ind)) return;

        moveSound.play();

        const currentSquare = getGridSquareByIndex(ind);
        if (turn == 0) {
            playerX.makeMove(ind);
            currentSquare.textContent = "X";
            turn = !turn;
        }
        else {
            playerO.makeMove(ind);
            currentSquare.textContent = "O";
            turn = !turn;
        }
        if (Gameboard.checkWin().mark == "Win") {
            if (Gameboard.checkWin().symbol == "X") {
                playerX.incrementScore();
                trophyDisplay[0].classList.add('show');
            }
            else if (Gameboard.checkWin().symbol == "O") {
                playerO.incrementScore();
                trophyDisplay[1].classList.add('show');
            }
            Gameboard.checkWin().positions.forEach((position) => {
                const currentSquare = getGridSquareByIndex(position);
                currentSquare.classList.add('glow');
            });
            advanceRound();
            winSound.play();
        }
        else if (Gameboard.checkWin().mark == "Tie") {
            advanceRound();
        }
        updateCircleDisplay();
        checkWin();
        if (!finished) {
            if (turn == 1 && playerO.getAILevel() !== -1) {
                canMove = false;
                (() => {
                    x = setTimeout(() => {
                        Move(playerO.getAIMove());
                        canMove = true;
                    }, 400);
                })();
            }
        }
    }
    squares.forEach((square) => {
        square.addEventListener('click', () => {
            if (canMove) {
                Move(square.dataset.ind);
            }
        });
    });
    resetButton.addEventListener('click', resetGame);
    newGameButton.addEventListener('click', GameSettings.openMenu);
    form.addEventListener('submit', (e) => {
        winScreen.style.setProperty("display", "none");
        document.querySelector(".setup-overlay").style.overflow = "hidden";
        document.body.style.overflow = "auto";
        document.body.parentNode.style.overflow = "auto";

        GameSettings.setValuesOnSubmit();
        resetGame();
        e.preventDefault();
    });
    muteButton.addEventListener('click', () => {
        winSound.muted = !winSound.muted;
        moveSound.muted = !moveSound.muted;
        muteButton.classList.toggle("fa-volume-up");
        muteButton.classList.toggle("fa-volume-mute");
    });
})();
