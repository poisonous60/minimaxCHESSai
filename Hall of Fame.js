function fen_moves_for(ori_fen) {
	let result = [];
	let imagine_chess = new Chess(ori_fen);
	let imagine_moves = imagine_chess.moves({ verbose: true });
	for(let i = 0; i < imagine_moves.length; i++) {
		imagine_chess.move(imagine_moves[i]);
		
		let dic = {
			'index': i,
			'moves': imagine_chess.moves({ verbose: true }),
			'fen': imagine_chess.fen()
		};
		result.push(dic);
		
		imagine_chess.load(ori_fen);
	}
	result.push({ 
			'index': -1,
			'moves': imagine_chess.moves({ verbose: true }),
			'fen': imagine_chess.fen()
		});
		
	return result;
}

function fen_janbul(b) { //됐다아아아아아아아아!!!!
	if (typeof b == "string") { //분해한다!
		return fen_moves_for(b);
	} else if (b[0].hasOwnProperty('fen')) { //1차. 위쪽으로
		for(let i = 0; i < b.length - 1; i++) {
			b[i] = fen_janbul(b[i]['fen']);
		}
		return b;
	} else if (Array.isArray(b[0])) { //2차 이상. 빙글빙글.
		for(let i = 0; i < b.length - 1; i++) {
			b[i] = fen_janbul(b[i]);
		}
		return b;
	} else {
		console.error("하와와 에러인 것이와요");
	}
}

function move_value_calculation(a) {
	let value = 0;
	if(a.san.includes('#')) return 999;
	
	value += flags_value[a.flags];
	if(a.flags.includes('p')) value += pieces_value[a.promotion];
	if(a.flags.includes('c')) value += pieces_value[a.captured];
	return value;
		
}

function DCD(janbul) {
	let result = 0;
	
	if(typeof janbul != 'object') console.error("미1친새끼야 뭘 넣은거야");
	else {
		if(janbul[0].hasOwnProperty('moves')) { //1차
			let temparr1 = [];
			let temp1;
			for(let i = 0; i < janbul.length - 1; i++) {
				temp1 = janbul[i]
				temparr1[i] = DCD(temp1['moves']);
			}
			//temparr1.push({'index': -1, 'value': DCD(janbul[janbul.length-1]['moves'])})
			temparr1.push(DCD(janbul[janbul.length-1]['moves']))
			
			return temparr1;
			
		} else if(Array.isArray(janbul[0])) { // 2차 이상
			let temparr2 = [];
			let temp2;
			for(let i = 0; i < janbul.length - 1; i++) {
				temp2 = janbul[i]
				temparr2[i] = DCD(temp2);
			}
			//temparr2.push({'index': -1, 'value': DCD(janbul[janbul.length-1]['moves'])})
			temparr2.push(DCD(janbul[janbul.length-1]['moves']))
			
			return temparr2;
			
		} else { //moves 배열 변환
			let temparr3 = [];
			for(let i = 0; i < janbul.length; i++) {
				temparr3[i] = move_value_calculation(janbul[i])
			}
			return temparr3;
		}
	}
}


///////////////////////////////////

function selecting(arr) {
  let temp_arr = [];
  for (let i = 0; i < arr.length - 1; i++) {
    temp_arr[i] = -arr[i] + arr[arr.length - 1][i]; //B-C
	}
	let temp;
	let random = [];
	for (let i = 0; i < temp_arr.length; i++) {
		if (!temp) temp = temp_arr[i];
		if (temp < temp_arr[i]) {
			temp = temp_arr[i];
			random = [];
			random.push(i);
		}
		else if (temp == temp_arr[i]) {
			random.push(i);
		}
	}
	
	return random;
}

function selecting2(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (typeof arr[i][0] == "number") {
      arr[i] = selecting(arr[i]);
      //console.log("i : " + i + " |selecting2| arr[+" + i + "] : " + arr[i]);
    } else if (Array.isArray(arr[i])) {
      arr[i] = selecting2(arr[i]);
	  
    }
  }
  // console.log(arr);
  return selecting(arr); //A-B+C
}