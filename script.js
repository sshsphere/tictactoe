const Gameboard = (()=>{
    let board=[
        ["","",""],
        ["","",""],
        ["","",""]
    ];
    let possibleMoves=new Set([0,1,2,3,4,5,6,7,8]);
    const getBoard=()=>board;
    const isValid=(index)=>{
        return possibleMoves.has(Number(index));
    }
    const setBoardPos=(index,mark)=>{
        board[parseInt(index/3)][index%3]=mark;
        possibleMoves.delete(Number(index));
    }
    const clearBoard=()=>{
        board=[
            ["","",""],
            ["","",""],
            ["","",""]
        ];
        possibleMoves=new Set([0,1,2,3,4,5,6,7,8]);
    }
    const checkWin=()=>{
        if      (board[0][0] == board[0][1] && board[0][1] == board[0][2]&&board[0][0]!="") return {mark:"Win", symbol:board[0][0], positions:[0,1,2]}; //first row
        else if (board[1][0] == board[1][1] && board[1][1] == board[1][2]&&board[1][0]!="") return {mark:"Win", symbol:board[1][0], positions:[3,4,5]}; //second row
        else if (board[2][0] == board[2][1] && board[2][1] == board[2][2]&&board[2][0]!="") return {mark:"Win", symbol:board[2][0], positions:[6,7,8]}; //third row
        else if (board[0][0] == board[1][0] && board[1][0] == board[2][0]&&board[0][0]!="") return {mark:"Win", symbol:board[0][0], positions:[0,3,6]}; //first column
        else if (board[0][1] == board[1][1] && board[1][1] == board[2][1]&&board[0][1]!="") return {mark:"Win", symbol:board[0][1], positions:[1,4,7]}; //second column
        else if (board[0][2] == board[1][2] && board[1][2] == board[2][2]&&board[0][2]!="") return {mark:"Win", symbol:board[0][2], positions:[2,5,8]}; //third column
        else if (board[0][0] == board[1][1] && board[1][1] == board[2][2]&&board[0][0]!="") return {mark:"Win", symbol:board[0][0], positions:[0,4,8]}; //first diagonal
        else if (board[0][2] == board[1][1] && board[1][1] == board[2][0]&&board[0][2]!="") return {mark:"Win", symbol:board[0][2], positions:[2,4,6]}; //second diagonal
        else if (!board.some(row => row.includes(""))) return {mark:"Tie"}; 
        else return {mark:"Ongoing"}; 
    }
    return{getBoard, setBoardPos, clearBoard, isValid, checkWin};
})();

const Player=(name,mark)=>{
    let score=0;
    const makeMove = (index) => {
        Gameboard.setBoardPos(index,mark);
    }
    const incrementScore = ()=>{
        score++;
    }
    const resetScore = () =>{
        score=0;
    }
    const getName = () => name;
    const getScore = () => score;
    return {getName, makeMove, getScore, incrementScore, resetScore};
}

const GameState = (()=>{
    
    let turn=false;
    let nextstartingturn=true;
    let finished=false;

    const playerX=Player("Test1", "X");
    const playerO=Player("Test2", "O");

    const squares=document.querySelectorAll(".grid-item");
    const playerDisplay=document.querySelectorAll(".player-score-number");
    const nameDisplay=document.querySelectorAll(".player-name");
    const trophyDisplay=document.querySelectorAll(".fa-trophy");
    const circleDisplay=document.querySelectorAll(".fa-circle");
    const resetButton=document.querySelector("#reset");
    const newGameButton=document.querySelector('#new-game');
    
    nameDisplay[0].textContent=playerX.getName();
    nameDisplay[1].textContent=playerO.getName();
    const updateCircleDisplay=()=>{
        circleDisplay[Number(turn)].classList.add('show');
        circleDisplay[Number(!turn)].classList.remove('show');
    };
    const switchStartingTurn=()=>{
        turn=nextstartingturn;
        nextstartingturn=!nextstartingturn;
    };
    const clearGrid=()=>{
        Gameboard.clearBoard();
        squares.forEach((square)=>{
            square.textContent="";
            square.classList.remove('glow');
        });
        trophyDisplay[0].classList.remove('show');
        trophyDisplay[1].classList.remove('show');
    };
    const advanceRound=()=>{
        switchStartingTurn();
        finished=true;
        updateScoreDisplay(); 
    };
    const resetGame=()=>{
        playerX.resetScore();
        playerO.resetScore();
        updateScoreDisplay();
        clearGrid();
        turn=false;
        nextstartingturn=true;
        finished=false;
        updateCircleDisplay();
    };
    const getGridSquareByIndex=(ind)=>{
        return document.querySelector(`.grid-item[data-ind="${ind}"]`);
    }
    const updateScoreDisplay=()=>{
        playerDisplay[0].textContent=playerX.getScore();
        playerDisplay[1].textContent=playerO.getScore();
    }
    const Move=(ind)=>{
        if(finished){
            clearGrid();
            finished=false;
            return;
        }
        if(!Gameboard.isValid(ind)) return;
        new Audio('sounds/c.wav').play();
        const currentSquare=getGridSquareByIndex(ind);
        if(turn==0){
            playerX.makeMove(ind);
            currentSquare.textContent="X";
            turn=!turn;   
        }
        else{
            playerO.makeMove(ind);
            currentSquare.textContent="O";
            turn=!turn;
        }
        if(Gameboard.checkWin().mark=="Win"){
            if(Gameboard.checkWin().symbol=="X"){
                playerX.incrementScore();
                trophyDisplay[0].classList.add('show');
            }
            else if(Gameboard.checkWin().symbol=="O"){
                playerO.incrementScore();
                trophyDisplay[1].classList.add('show');
            }
            Gameboard.checkWin().positions.forEach((position)=>{
                const currentSquare=getGridSquareByIndex(position);
                currentSquare.classList.add('glow');    
            });
            advanceRound();
            new Audio('sounds/b.wav').play();
        }
        else if(Gameboard.checkWin().mark=="Tie"){
            advanceRound();
        }
        updateCircleDisplay();
    }
    squares.forEach((square)=>{
        square.addEventListener('click', ()=>{
            Move(square.dataset.ind);            
        });
    });
    resetButton.addEventListener('click',resetGame);
})();