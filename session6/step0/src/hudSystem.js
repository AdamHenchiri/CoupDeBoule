import * as cpn from "./components.js";

const hudSystem = (entities, components, root) => {
    root.innerHTML = '';
    for (const stateEntity of Object.getOwnPropertySymbols(components[cpn.GameStateComponent.name])) {
        {
            let hits = components.GameStateComponent[stateEntity].hits ;
            let score = hits * 10 ; 
            if(components.GameStateComponent[stateEntity].state == 'running')
            {
            root.innerHTML = '<div id="gameHUD"> <div id="score"> Score:  '+ score +'</div> </div>';
            } 
            else if(components.GameStateComponent[stateEntity].state == 'gameover')
            {
            root.innerHTML = '<div id="gameHUD"> <div id="score"> Score:  '+ score +'</div> <div id="gameOver" >Game Over</div> <button id="playAgain">click here to play again</button></div>';
            }
            else if(components.GameStateComponent[stateEntity].state == 'win')
            {
                root.innerHTML = '<div id="gameHUD"> <div id="score"> Score:  '+ score +'</div> <div id="Win" >  You Won !</div> <button id="playAgain">click here to play again</button></div>';
            }

        }
    }
};


export { hudSystem }