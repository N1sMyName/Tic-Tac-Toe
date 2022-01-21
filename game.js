const readline = require('readline')

// debug values

function renderField(field = new Array(9).fill(0)) {
    let output = '';
    // filter field
       const game = field.map((sign) => {
    if(sign === 0 ) {
          return sign = " "
        } else if(sign === -1){
           return sign = '0'
        } else {
           return sign = 'x'
        }    
    })
    // render
    const top = " " + game.slice(0,3).join(' | ')
    const middle = " " + game.slice(3,6).join(' | ')
    const bottom = " " + game.slice(6,9).join(' | ')
    const gap = '---+---+---'

    output = `${top}\n${gap}\n${middle}\n${gap}\n${bottom}`;
    return output

}
// isWIN?

function gameStatus(field) {
    const winCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],
                           [1,4,7],[2,5,8],[6,4,2],[0,4,8]];

    

    // zero count on board
    function zeroPositions  ()  {
        let accumulator = []
        field.map((sign,index) =>{
           if(sign === -1 ) {
               accumulator.push(index)
           }    
    })
    return accumulator
    }

    
    // x count on board
    function xPositions  ()  {
        let accumulator = []
        field.map((sign,index) =>{
           if(sign === 1 ) {
               accumulator.push(index)
           }    
        })
        return accumulator
    }
    // chose winner
    function calculateWinner(marksCount,markType){
        const combos = [...winCombinations]
        let result = []
        // LOOP #1 (ITERATE THROUGH 2 DIM ARRAY OF POSIBLE COMBINATIONS)
        for (winCombo of combos) {
        // console.log(` LVL1LOOP: iteratating ${winCombo}`);
        if(JSON.stringify(result) !== JSON.stringify(winCombo)){
           // console.log(`1 lOOP JSON-RESULT IS ${JSON.stringify(result)}`);
           // console.log(`1 lOOP JSON-CURRENT-COMBO IS ${JSON.stringify(winCombo)}`);
           result = []
        }
            // LOOP #2 (ITERATE THROUGH GIVEN COUNT OF SIGNS) 
            for(sign of marksCount()) {
               // console.log(`lvl2Loop: iterate throw ${sign}`);
               // FILTER ALL ELEMENT THAT MATCH CONDITION AND PUT THEM INTO ARRAY
               let lvl2Result = winCombo.filter(comboSign => comboSign === sign)
               result.push(...lvl2Result)    
               // console.log(`current result ${result}`);
                   //CHECK IF ACCUMULATED RESULT MATCH GIVEN COUNT OF SIGNS 
               if(JSON.stringify(result) === JSON.stringify(winCombo)){
                //    console.log(`result: ${JSON.stringify(result)} combo: ${JSON.stringify(winCombo)}`);
                //    console.log(`CONTAINER IS ${JSON.stringify(result)}`);
                //    console.log(`COMBO IS ${JSON.stringify(winCombo)}`);
                   return markType
               } else {
                // console.log(`CONTAINER IS ${JSON.stringify(result)}`);
                // console.log(`COMBO IS ${JSON.stringify(winCombo)}`);
               }
            }     
        }
    }
    // isDraw?
    const isFull = cell => cell !== 0;
    const end = field.every(isFull)

    // CONDITIONAL CHECK WINNER(IF NO ONE WIN RETURN *TURN*)
    const result = () => {
        if(calculateWinner(xPositions,'x')) {
            return calculateWinner(xPositions,'x')
        } else if(calculateWinner(zeroPositions,'0')){
            return (calculateWinner(zeroPositions,'0'))
        } else if(end){
            return 'end'
        } else {
            return 'turn'
    }
    }

    return  result()

}

// MAKE TURN FUNCTION

function makeTurn(field, playerMark, index) {
    // validate index
    
    console.log(`player mark ${playerMark}`);


    const startValue = field[index]
    if(startValue !== 1 && startValue !== -1) {
        
        field.find((s,i,arr)=>{
            if( i === index) {
            arr[i] = playerMark
            }
        })
        return true    
    } else {
    return false;
    }
}


function start () {
    let grid = new Array(9).fill(0)
    let turn = 0
    function isPlayer() {
        if(turn % 2 === 0) {
            
            return 'x'
        } else {
            
            return '0'
        }
    }
    
    
    
    // READLLINE 
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
        });
        // again
        function tryAgain () {
            rl.question('\nTo start new game type /start-new\n or\ntype /q to quit\n> ',(line)=>{
                if(line === '/start-new') {
                    console.clear()
                    grid = new Array(9).fill(0);
                    turn = 0;
                    console.log(renderField(grid));
                    play()
                } else if(line === '/q') {
                    console.clear()
                    rl.close()
                } 
                else {
                    tryAgain()
                }
            })
        }
          
        // play
        const play = () => rl.question(`Player ${isPlayer().toUpperCase()} move \n Enter index(1-9)\n> `,(index)=>{
            
         if(index < 1 || Number.isNaN(Number(index)) ){
            console.clear()
            console.log(renderField(grid)); 
            console.log('not a number')
            play()
        } else if(index.length >1){
            console.clear()
            console.log(renderField(grid)); 
            console.log('out of range')
            play()
        } else if (!makeTurn(
                grid,
                isPlayer() === "x" ? 1 : -1 ,
                index-1)) {
                    console.clear()
                    console.log(renderField(grid)); 
                    console.log('Field was already chosen by another player')
                    play()
                } else {
                    turn++
                
            
            console.clear()
            if(gameStatus(grid) === 'x'){
                console.log(renderField(grid));
                console.log('x win');
                tryAgain()

            } else if(gameStatus(grid) === '0'){

                console.log('0 win');
                tryAgain()

            } else if(gameStatus(grid) === 'turn') {
                
                console.log( renderField(grid))
                play()
            } else {
                console.log('Draw');
                console.log(renderField(grid))
                tryAgain()
            }
        }
        })
        // start
        const start = () =>  rl.question(`X & 0\nFor start type /start\n`,(line)=>{
            if(line !== '/start') {
                
                console.clear()
                start()
                
            } else {
                console.clear()
                console.log( renderField(grid))
                play()
            }
            
        
            
        })
        start() 
    

        rl.on('close', function () {
            console.clear()
          console.log('bye-bye');
          process.exit(0);
        });

}
start()













