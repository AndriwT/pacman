//create board - DONE
//render to screen - DONE
//create player - DONE
//allow movement - DONE
//create board boundaries - DONE
//add dots all over the place - DONE 
//allow player to eat the dots and gain score - DONE
//display lives and score - DONE
//create ghosts - DONE
//Make ghosts move randomly - DONE - ghost puts dots back bug
//if ghost touches player loses a live - DONE
//create fruit for player to eat the ghosts - DONE
//if no lives game over - DONE
//if you eat all ghosts game over 
//create laberynth(?)
//ghost follow player smartly(?)
//-----------------------------------------------------------
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const UP_RENDERING = "\x1Bc";

const HEIGHT = 14;
const WIDTH = 14;

let xDirection = 0;
let yDirection = 0;


let ghostXDirection = 0;
let ghostYDirection = 0;


function sleep(time) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, time)
	})
}

function createBoard() {
	
	let boardArr = new Array(HEIGHT).fill(JSON.stringify(new Array(WIDTH).fill("."))).map(item => JSON.parse(item));

	boardArr[0][0] = "|"
	boardArr[1][0] = "|"
	boardArr[2][0] = "|"	
	boardArr[3][0] = "|"
	boardArr[4][0] = "|"
	boardArr[5][0] = "|"
	boardArr[6][0] = "|"
	boardArr[7][0] = "|"
	boardArr[8][0] = "|"
	boardArr[9][0] = "|"
	boardArr[10][0] = "|"
	boardArr[11][0] = "|"
	boardArr[12][0] = "|"
	boardArr[13][0] = "|"

	boardArr[0][13] = "|"
	boardArr[1][13] = "|"
	boardArr[2][13] = "|"	
	boardArr[3][13] = "|"
	boardArr[4][13] = "|"
	boardArr[5][13] = "|"
	boardArr[6][13] = "|"
	boardArr[7][13] = "|"
	boardArr[8][13] = "|"
	boardArr[9][13] = "|"
	boardArr[10][13] = "|"
	boardArr[11][13] = "|"
	boardArr[12][13] = "|"
	boardArr[13][13] = "|"

	boardArr[0][0] = "-"
	boardArr[0][1] = "-"
	boardArr[0][2] = "-"	
	boardArr[0][3] = "-"
	boardArr[0][4] = "-"
	boardArr[0][5] = "-"
	boardArr[0][6] = "-"
	boardArr[0][7] = "-"
	boardArr[0][8] = "-"
	boardArr[0][9] = "-"
	boardArr[0][10] = "-"
	boardArr[0][11] = "-"
	boardArr[0][12] = "-"
	boardArr[0][13] = "-"

	boardArr[13][0] = "-"
	boardArr[13][1] = "-"
	boardArr[13][2] = "-"	
	boardArr[13][3] = "-"
	boardArr[13][4] = "-"
	boardArr[13][5] = "-"
	boardArr[13][6] = "-"

	boardArr[13][7] = "-"
	boardArr[13][8] = "-"
	boardArr[13][9] = "-"

	boardArr[13][10] = "-"
	boardArr[13][11] = "-"
	boardArr[13][12] = "-"
	boardArr[13][13] = "-"

boardArr[12][7] = "|"
boardArr[11][7] = "|"
boardArr[12][6] = "|"
boardArr[11][6] = "|"
boardArr[10][7] = "+"
boardArr[10][6] = "+"
boardArr[10][5] = "-"
boardArr[10][4] = "+"
boardArr[10][8] = "-"
boardArr[10][9] = "-"
boardArr[10][3] = "+"
boardArr[9][3] = "|"
boardArr[8][3] = "|"
boardArr[7][3] = "+"
boardArr[7][4] = "-"
boardArr[10][4] = "-"
boardArr[10][9] = "-"
boardArr[10][10] = "+"
boardArr[9][10] = "|"
boardArr[8][10] = "|"
boardArr[7][10] = "+"
boardArr[7][9] = "-"

boardArr[3][5] = "-"
boardArr[3][4] = "-"
boardArr[3][3] = "+"
boardArr[4][3] = "|"
boardArr[5][3] = "+"
boardArr[5][4] = "-"
boardArr[5][5] = "-"
boardArr[5][6] = "-"
boardArr[5][7] = "-"
boardArr[5][8] = "-"
boardArr[5][9] = "-"
boardArr[5][10] = "+"
boardArr[4][10] = "|"
boardArr[3][10] = "+"
boardArr[3][9] = "-"
boardArr[3][8] = "-"

	return boardArr;

}



let board = createBoard();

let score = 0;


const pacMan = {
	icon: "⚉",
	lives: ["⚉","⚉","⚉"],
	x: WIDTH / 2,
	y: 6,
}

class Ghost {
	icon = "";
	x = 0;
	y = 0;

	constructor(x, y, icon) {
		this.x = x;
		this.y = y;
		this.icon = icon;
	}	
}

const pinky = new Ghost(WIDTH / 2 - 1, 4, "£");

let fruit = {
	icon: "✤",
	x: 5,
	y: 12,
}

async function renderBoard() {

	let shouldGameEnd = false;

	let str = "";
	str += UP_RENDERING;
	
	str += pacMan.lives.join("") + "\n";
	str += "Score: " + score + "\n";

	if (pacMan.lives.length < 1) {
		
		str += "GAME OVER - You Lost!" + "\n";
		shouldGameEnd = true;
		
	} else if (score === 100) {
		
		str += "GAME OVER - You Win!" + "\n";
		shouldGameEnd = true;
		
	}

	str += board.map(row => row.join("")).join("\n");
	process.stdout.write(str);

	if (shouldGameEnd) {
		process.exit(0);
	}
	
}

let movement = true;

let isKeyPressed = "Y";



function boundaryHitDetection() {
	


	if (pinky.x > WIDTH - 3) {
		pinky.x = WIDTH - 3;
	} else if (pinky.x < 2) {
		pinky.x = 2;
	} else if (pinky.y > HEIGHT - 3) {
		pinky.y = HEIGHT - 3;
	} else if (pinky.y < 2) {
		pinky.y = 2;
	}



}


function touchGhostDetection() {
	if (pinky.x === pacMan.x && pinky.y === pacMan.y && !canEatGhost) {
		
		pacMan.lives.splice(0, 1)
		pacMan.x = WIDTH / 2;
		pacMan.y = 6;
		xDirection = 0;
		yDirection = 0;
	}
}

let shouldEatDot = true;

function eatDot() {



			if (board[pacMan.y][pacMan.x] === ".") {
				board[pacMan.y][pacMan.x] = pacMan.icon;
				score++;
				
			}

			if (board[pacMan.y][pacMan.x] === " ") {
				board[pacMan.y][pacMan.x] = pacMan.icon;
			} 
			
		
		
	
	
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ghostsMovement() {

	
	if (isGhostDead === false) {
		board[pinky.y][pinky.x] = pinky.icon;
		ghostXDirection = getRndInteger(-1, 1);
		ghostYDirection = getRndInteger(-1, 1);	
		
	}
				


}

let canEatGhost = false;

let isGhostDead = false;

function eatGhost() {
	
	if (pacMan.x === fruit.x && pacMan.y === fruit.y) {
		fruit.icon = " ";
		canEatGhost = true;
		pinky.icon = "₴";
	} 

	if (pacMan.x === pinky.x && pacMan.y === pinky.y && canEatGhost) {
		isGhostDead = true;
	}

}

let VALID_GHOST_SPOTS = [
	".",
	" ",
	"⚉"
]

let VALID_PACMAN_SPOTS = [
	".",
	" ",
	"✤",
	"₴",
	"£",
]

async function main() {

	let running = true;

	while (running) {

		let beforeTile;

		if (isGhostDead !== true) {
			beforeTile = board[pinky.y][pinky.x];
		}

		boundaryHitDetection();

		eatDot();

		eatGhost();

		ghostsMovement();

		renderBoard();



		if (isGhostDead !== true) {
			board[pinky.y][pinky.x] = beforeTile;
		}

		await sleep(200);
		
		board[pacMan.y][pacMan.x] = " ";

		board[fruit.y][fruit.x] = fruit.icon;
		
		touchGhostDetection();

		if (VALID_GHOST_SPOTS.includes(board[pinky.y + ghostYDirection][pinky.x + ghostXDirection])) {
			pinky.x += ghostXDirection;
			pinky.y += ghostYDirection;
		}

		if (VALID_PACMAN_SPOTS.includes(board[pacMan.y + yDirection][pacMan.x + xDirection])) {
			pacMan.x += xDirection;
			pacMan.y += yDirection;
		}
	
	}
};


function checkCurrentTile() {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j ++) {                                                          
			if (pacMan.x === "|" && pacMan.y === "|") {
				xDirection = 0;
				yDirection = 0;
			}
		}
	}
}


process.stdin.on('keypress', (str, key) => {
	if (key.ctrl && key.name === 'c') {
		process.exit();
	} else if (isKeyPressed) {
		switch (key.name) {
			case "up":
isKeyPressed = "";
				

				xDirection = 0;
				yDirection = -1;

isKeyPressed = "Y";	
				
				break;
			case "down":
isKeyPressed = "";
				xDirection = 0;
				yDirection = 1;

isKeyPressed = "Y";	
		
				break;
			case "right":
isKeyPressed = "";
	
				xDirection = 1;
				yDirection = 0;

				
isKeyPressed = "Y";		
			
				break;
			case "left":
isKeyPressed = "";
				xDirection = -1;
				yDirection = 0;

isKeyPressed = "Y";		
			
				break;
			default:
				//DO NOTHING;
		}
	}
})

main();

