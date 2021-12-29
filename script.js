const Gameboard = (()=>{
    let board=[
        ["X","O","O"],
        ["O","X","O"],
        ["O","O","X"]
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
        if      (board[0][0] == board[0][1] && board[0][1] == board[0][2]) return board[0][0]; //first row
        else if (board[1][0] == board[1][1] && board[1][1] == board[1][2]) return board[1][0]; //second row
        else if (board[2][0] == board[2][1] && board[2][1] == board[1][2]) return board[2][0]; //third row
        else if (board[0][0] == board[1][0] && board[1][0] == board[2][0]) return board[0][0]; //first column
        else if (board[0][1] == board[1][1] && board[1][1] == board[2][1]) return board[0][1]; //second column
        else if (board[0][2] == board[1][2] && board[1][2] == board[2][2]) return board[0][2]; //third column
        else if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) return board[0][0]; //first diagonal
        else if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) return board[0][2]; //second diagonal
        else if (!board.some(row => row.includes(""))) return "Tie"; 
        else return {"Ongoing", -1}; 
    }
    return{getBoard, setBoardPos, clearBoard, isValid};
})();

const Player=(name,mark)=>{
    const makeMove = (index) => {
        Gameboard.setBoardPos(index,mark);
    }
    const getName = () => name;
    return {getName, makeMove};
}

const GameState = (()=>{
    const playername="Player";
    let turn=false;
    const playerX=Player(playername, "X");
    const playerO=Player(playername, "O");
    const boards=document.querySelectorAll(".grid-item");
    const Move=(ind)=>{
        if(!Gameboard.isValid(ind)) return;
        const currentboard=document.querySelector(`.grid-item[data-ind="${ind}"]`);
        if(turn==0){
            playerX.makeMove(ind);
            currentboard.textContent="X";
            turn=!turn;
            
        }
        else{
            playerO.makeMove(ind);
            currentboard.textContent="O";
            turn=!turn;
        }
    }
    boards.forEach((board)=>{
        board.addEventListener('click', ()=>{
            Move(board.dataset.ind);
            
        });
    });

    
})();
