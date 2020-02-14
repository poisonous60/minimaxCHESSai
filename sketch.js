var __deco = false;

var history_fen_code = [];
var flags_value = {
	'n': 0, //그냥 이동
	'b': 0, //폰 2칸 전진
	'e': 1, //앙-파상!
	'c': 1, //잡았다이놈
	'p': 8, //승급
	'k': 0, //킹 캐슬링
	'q': 0, //퀸 캐슬링
	'np': 8 //시바 p면 p고 n이면 n이지
};
var pieces_value = {
	'p': 1, //폰 1점
	'n': 3, //나이트 3점
	'b': 3, //비숍 3점
	'r': 5, //룩 5점
	'q': 9, //퀸 9점
	'k': 999 //킹 가치 무한
};
var AI_color = 'b';

var board
var chess;
var AI1;
var chessboard_option = {
	  draggable: true,
	  moveSpeed: 'slow',
	  snapbackSpeed: 500,
	  snapSpeed: 100
	};

function setup() {  
	noCanvas();

	chess = new Chess();
	if(__deco) board = Chessboard('myBoard', $.extend(config, chessboard_option));
	else board = Chessboard('myBoard', chessboard_option)
	board.position(chess.fen())
	AI1 = new ChessAI(chess);
	// print(chess);
	// print(chess.moves());

}

function draw() {
	board.position(chess.fen())
	//history_fen_code[chess.turn];
}

class ChessAI {
	constructor(chess) {
		this.chess_game = chess
	}

	kill_move() {
		let moves = this.chess_game.moves();
		//let num = Math.floor(Math.random() * moves.length); //랜덤
		let select = -1
		let indexes = [];

		for(let i = 0; i < moves.length; i++) {
			let temp = move_value_calculation(chess.moves({ verbose: true })[i]);
			if(temp == select) indexes.push(i);
			else if(temp > select) {
				indexes = [];
				indexes.push(i);
				select = temp;
			}
		}
		console.log("value: "+ select);
		let move = moves[indexes[Math.floor(Math.random() * indexes.length)]];
		return move;
	}

	first_AI_thinking(su) { //(집에) 가즈아아아앙아!
		let value_arr;

		for(let i = 0; i < su; i++) { //나 한번 너 한번. 이게 1턴.
			if(i == 0) value_arr = fen_janbul(chess.fen());
			else {
				value_arr = fen_janbul(value_arr);
				console.error("su1:" + i)
				value_arr = fen_janbul(value_arr);
			}
			console.error("su2:" + i)
		}
		value_arr = DCD(value_arr);

		//console.log(value_arr);
		let indexes = selecting2(value_arr)
		console.log(indexes);

		let move = chess.moves()[indexes[Math.floor(Math.random() * indexes.length)]];
		return move;		
	}

}

function arr_arrange(arr) {
	let select = -1
	if(arr.hasOwnProperty('index')) arr = arr.value;

	//let indexes = [];
	// for(let i = 0; i < arr.length; i++) {
		// let temp = arr[i]
		// if(temp == select) indexes.push(i);
		// else if(temp > select) {
			// indexes = [];
			// indexes.push(i);
			// select = temp;
		// }
	// }
	// let result = {};
	// result['ind'] = indexes[Math.floor(Math.random() * indexes.length)];
	// result['val'] = select;
	// return result;

	for(let i = 0; i < arr.length; i++) {
		let temp = arr[i]
		if(temp > select) {
			select = temp;
		}
	}
	return result;
}



function keyPressed() {
	if(keyCode == 32) { //space
		console.log("AI thinking...");
		if(!chess.game_over()) {
			let speak = AI1.kill_move();
			console.log(speak);
			chess.move(speak);
		} else {
			console.log("game_over!");
			console.log(chess.pgn());
		}
	}
	if(keyCode == 80) { // 'p'
		print(chess.moves());
	}
	if(keyCode == 79) { // 'o'
		print(chess.moves({ verbose: true }));
	}
	if(keyCode == 72) { // 'h'
		print(chess.history());
	}
	if(keyCode == 71) { // 'g'
		print(chess.history({ verbose: true }));
	}
	if(keyCode == 84) { // 't'
		console.log("AI thinking...");
		if(!chess.game_over()) {
			let speak = AI1.first_AI_thinking(2);
			console.log(speak);
			chess.move(speak);
		} else {
			console.log("game_over!");
			console.log(chess.pgn());
		}
	}
} 