import * as engine from "./engine.js";
import * as entitites from "./entities.js";
import * as cpn from "./components.js";
import {ecs} from "./engine.js";
import {collision} from "./collisionSystem.js";


const divPotion = document.getElementById("potions");
const addBall = document.getElementById("addBall");

addBall.addEventListener('click', () => {
    const ball = entitites.Ball(150, 150, 10, 10, 0.1, 0.05);
})

//hard coded scene...
function sceneSetup() {
    console.log("sceneSetup");
    const mure01 = entitites.Mur(0, 0, 5, 350);
    const mure02 = entitites.Mur(345, 0, 5, 350);
    const mure03 = entitites.Mur(0, 0, 350, 5);
    const mure04 = entitites.Mur(0, 350, 350, 5);


    const ball = entitites.Ball(150, 150, 10, 10, 0.1, 0.05);
    console.log(ecs.components.PositionComponent[ball].y)
    const raquette = entitites.Raquette(0, 300, 50, 10);
    let offsetx = 25;
    let offsety = 10;
    let deltax = 70;
    let deltay = 30;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const br = entitites.Brique(offsetx + i * deltax, offsety + j * deltay, 20, 15);
        }
    }
    for (const stateEntity of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name])) {
        for (let i = 0; i < engine.ecs.components.LifeComponent[stateEntity].maxLife; i++) {
            let potion = document.createElement("img");
            potion.style.width = "100px";
            potion.style.height = "100px";
            potion.style.display = "block";
            potion.src = './img/Potion_de_magie.webp';
            divPotion.appendChild(potion);
        }
    }

}
function initGame()
{
    let gameHUD = document.getElementById("gameHUD");
    if (gameHUD != null){
        gameHUD.parentNode.removeChild(gameHUD);
    }
    engine.init("GLCanvas");


    const gameState = entitites.GameState(3);
    sceneSetup();

    engine.ecs.eventEmitter.on( 'leftDown', handleLeftDown)
    engine.ecs.eventEmitter.on( 'leftUp', handleLeftUp)
    engine.ecs.eventEmitter.on( 'rightDown', handleRightDown)
    engine.ecs.eventEmitter.on( 'rightUp', handleRightUp)
    engine.ecs.eventEmitter.on( 'hit', handleHit)
    engine.ecs.eventEmitter.on( 'gameover', handleGameover)
    engine.ecs.eventEmitter.on( 'win', handleWin)
    engine.ecs.eventEmitter.on( 'moveBricks', moveBricks)
    engine.ecs.eventEmitter.on( 'stopBricks', stopBricks)
    stopBricks();
    engine.update();
}


function handleHit(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].hits += 1;

    }
}

function handleWin(event){
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].state = 'win';
    engine.ecs.isRunning = false;
    }

}
function handleGameover(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].state = 'gameover';
    engine.ecs.isRunning = false;    
    }
    stopBricks();
}

function handleLeftDown(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].leftControl = true;
    }

}

function handleLeftUp(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].leftControl = false;
    }

}

function handleRightUp(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].rightControl = false;
    }
}

function handleRightDown(event)
{
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name]))
    {
    engine.ecs.components.GameStateComponent[state].rightControl = true;
    }
    
}

function moveBricksLeft()
{
    for (const brick of Object.getOwnPropertySymbols(engine.ecs.components[cpn.BriqueTag.name]))
    {
        engine.ecs.components.PositionComponent[brick].x -= 10;
    }
}

function moveBricksRight()
{
    for (const brick of Object.getOwnPropertySymbols(engine.ecs.components[cpn.BriqueTag.name]))
    {
        engine.ecs.components.PositionComponent[brick].x += 10;
    }
}

let interval = null;
function moveBricks(event)
{
    console.log("bouger les briques");
    let moveRight= true;
        interval = setInterval(() => {
            if (moveRight){
                moveBricksRight();
            }
            else {
                moveBricksLeft();
            }
            moveRight = !moveRight;
        }, 1000)
}

function stopBricks(event)
{
    console.log("stop bouger les briques");
    clearInterval(interval);
}

window.onload = initGame();

export { initGame }