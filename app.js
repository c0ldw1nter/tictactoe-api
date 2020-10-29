const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3001;

var gameSquares=Array(9).fill(null);

var turn=0;
var winner=null;
var actionLog=[];

const server = http.createServer((req, res) => {
    const theUrl=url.parse(req.url, true);
    
    if(theUrl.pathname=='/move') {
        //try to do a move
        var square=theUrl.query.square;
        if(square){
            if(winner!=null) {
                //bad action
                logAction('Clicked square '+square+'. Game has ended.');
                sendGameState(res,'The game has ended. '+getWinnerText());
            }else if(gameSquares[square] != null) {
                //bad action
                logAction('Clicked square '+square+'. Invalid move.');
                sendGameState(res,'Cannot play square '+square+'.');
            }else {
                //do move
                gameSquares[square] = turn == 0 ? 'X' : 'O';
                turn = 1-turn;
                winner=calculateWinner(gameSquares);
                if(winner!=null) {
                    logAction('Clicked square '+square+'. '+getWinnerText());
                    sendGameState(res,getWinnerText());
                }else {
                    if(!gameSquares.some((val)=>val==null)) {
                        winner='draw';
                        logAction('Clicked square'+square+'. '+getWinnerText());
                        sendGameState(res,getWinnerText());
                    }else {
                        logAction('Clicked square '+square);
                        sendGameState(res,'Turn: '+(turn==0 ? 'X' : 'O'));
                    }
                }
            }
        }
    }else if(theUrl.pathname=='/reset') {
        //return new game
        logAction('Game reset.');
        turn=(Math.random() < 0.5) ? 1 : 0; //random starting player
        gameSquares=Array(9).fill(null);
        winner=null;
        sendGameState(res,'Turn: '+(turn==0 ? 'X' : 'O'));
    }else if(theUrl.pathname=='/check') {
        //return game state
        sendGameState(res,'Turn: '+(turn==0 ? 'X' : 'O'));
    }
});

function getWinnerText() {
    if(winner=='draw') {
        return "It's a draw!";
    }else if(winner=='X') {
        return 'Winner is X!';
    }else if(winner=='O') {
        return 'Winner is O!';
    }
    return null;
}

function logAction(message) {
    actionLog.push(message+' | Turn: '+(turn==0 ? 'X' : 'O'));
}

function sendGameState(res, message) {
    const state={state:gameSquares, message:message, turn:turn, log:actionLog};
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(state));
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports.calculateWinner=calculateWinner;