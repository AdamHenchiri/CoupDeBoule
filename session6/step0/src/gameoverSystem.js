import * as cpn from "./components.js";

let passeFrontiere = false;
let passeMid = true;

const divPotion = document.getElementById("potions");

const gameoverSystem = (entities, components, ecs,max) => {
    for (const ball of Object.getOwnPropertySymbols(components[cpn.BallTag.name])) {
        for (const raquette of Object.getOwnPropertySymbols(components[cpn.RaquetteTag.name])){
            if (components.PositionComponent[ball].y  > components.PositionComponent[raquette].y )
            {
                passeFrontiere = true;
                lostlife(entities, components, ecs);
                components.PositionComponent[ball].x = 150;
                components.PositionComponent[ball].y = 150;
            }
            for (const stateEntity of Object.getOwnPropertySymbols(components[cpn.GameStateComponent.name])) {
                {
                    if(components.GameStateComponent[stateEntity].hits >= max){
                        console.log("vous avez gagné");
                        ecs.eventEmitter.emit('win');
                    }
                    if(components.GameStateComponent[stateEntity].hits >= max/2 && passeMid ){
                        ecs.eventEmitter.emit('moveBricks');
                        passeMid = false;
                    }
                }
            }
        }
    }

};

const lostlife = (entities, components, ecs) => {
    for (const stateEntity of Object.getOwnPropertySymbols(components[cpn.GameStateComponent.name])) {
        if (passeFrontiere){
            components.LifeComponent[stateEntity].life -= 1;
            console.log("vous avez perdu une vie il vous en reste : " + components.LifeComponent[stateEntity].life);
            passeFrontiere= false;
            divPotion.removeChild(divPotion.lastChild);
        }
        if(components.LifeComponent[stateEntity].life <= 0){
            passeMid = true;
            passeFrontiere = false;
            ecs.eventEmitter.emit('gameover');
        }
    }
}


export { gameoverSystem }