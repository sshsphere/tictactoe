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
        if      (board[0][0] == board[0][1] && board[0][1] == board[0][2]&&board[0][0]!="") return board[0][0]; //first row
        else if (board[1][0] == board[1][1] && board[1][1] == board[1][2]&&board[1][0]!="") return board[1][0]; //second row
        else if (board[2][0] == board[2][1] && board[2][1] == board[1][2]&&board[2][0]!="") return board[2][0]; //third row
        else if (board[0][0] == board[1][0] && board[1][0] == board[2][0]&&board[0][0]!="") return board[0][0]; //first column
        else if (board[0][1] == board[1][1] && board[1][1] == board[2][1]&&board[0][1]!="") return board[0][1]; //second column
        else if (board[0][2] == board[1][2] && board[1][2] == board[2][2]&&board[0][2]!="") return board[0][2]; //third column
        else if (board[0][0] == board[1][1] && board[1][1] == board[2][2]&&board[0][0]!="") return board[0][0]; //first diagonal
        else if (board[0][2] == board[1][1] && board[1][1] == board[2][0]&&board[0][2]!="") return board[0][2]; //second diagonal
        else if (!board.some(row => row.includes(""))) return "Tie"; 
        else return "Ongoing"; 
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

    const playerX=Player("Test1", "X");
    const playerO=Player("Test2", "O");

    const squares=document.querySelectorAll(".grid-item");
    const playerDisplay=document.querySelectorAll(".player-score-number");
    const nameDisplay=document.querySelectorAll(".player-name");

    nameDisplay[0].textContent=playerX.getName();
    nameDisplay[1].textContent=playerO.getName();
    const clearGrid=()=>{
        turn=nextstartingturn;
        nextstartingturn=!nextstartingturn;
        Gameboard.clearBoard();
        squares.forEach((square)=>{
            square.textContent="";
        });
    };
    //use prototype for cleargrid function with clear button
    const updateScoreDisplay=()=>{
        playerDisplay[0].textContent=playerX.getScore();
        playerDisplay[1].textContent=playerO.getScore();
    }
    const Move=(ind)=>{
        if(!Gameboard.isValid(ind)) return;
        const currentSquare=document.querySelector(`.grid-item[data-ind="${ind}"]`);
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
        if(Gameboard.checkWin()=="X"){
            playerX.incrementScore();
            alert("X wins");
            clearGrid();
        }
        else if(Gameboard.checkWin()=="O"){
            playerO.incrementScore();
            alert("O wins");
            clearGrid();
        }
        else if(Gameboard.checkWin()=="Tie"){
            alert("Tie");
            clearGrid();
        }
        updateScoreDisplay();        
    }
    squares.forEach((square)=>{
        square.addEventListener('click', ()=>{
            Move(square.dataset.ind);            
        });
    });
})();