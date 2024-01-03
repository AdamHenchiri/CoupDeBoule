import * as engine from "./engine.js";

//Ball : Position,Velocity, BallTag,PhysicsTag, CollisionTag.
function Ball(x, y, w, h, dx = 0, dy = 0) {
    const ballEntity = engine.ecs.createEntity();
    engine.ecs.addComponent(ballEntity, engine.components.BallTag())
    engine.ecs.addComponent(ballEntity, engine.components.PhysicsTag());
    engine.ecs.addComponent(ballEntity, engine.components.PositionComponent(x, y, 1));
    engine.ecs.addComponent(ballEntity, engine.components.VelocityComponent(dx, dy));//TODO
    engine.ecs.addComponent(ballEntity, engine.components.RenderableTag());
    engine.ecs.addComponent(ballEntity, engine.components.GraphicsComponent("cercle", { w: w, h: h, color:{ r: 0.52, g: 0.52, b: 0.52 }}));
    engine.ecs.addComponent(ballEntity, engine.components.CollisionTag());
    engine.ecs.addComponent(ballEntity, engine.components.CollisionBoxComponent(w*.9, h*.9));
    return ballEntity;
}


function Raquette(x, y, w, h) {
    const requetteEntity = engine.ecs.createEntity();
    engine.ecs.addComponent(requetteEntity, engine.components.RaquetteTag())
    engine.ecs.addComponent(requetteEntity, engine.components.PhysicsTag());
    engine.ecs.addComponent(requetteEntity, engine.components.PositionComponent(x, y, 0));
    engine.ecs.addComponent(requetteEntity, engine.components.RenderableTag());
    engine.ecs.addComponent(requetteEntity, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: { r: 0.0, g: 0.0, b: 1.0, } }));
    engine.ecs.addComponent(requetteEntity, engine.components.CollisionTag());
    engine.ecs.addComponent(requetteEntity, engine.components.CollisionBoxComponent(w, h));
    return requetteEntity;

}

function Brique(x, y, w, h) {
    const briqueEntity = engine.ecs.createEntity();
    engine.ecs.addComponent(briqueEntity, engine.components.BriqueTag())
    engine.ecs.addComponent(briqueEntity, engine.components.PositionComponent(x, y, 0));
    engine.ecs.addComponent(briqueEntity, engine.components.RenderableTag());
    engine.ecs.addComponent(briqueEntity, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: { r: 0.8, g: 0.3, b: 0.0, } }));
    engine.ecs.addComponent(briqueEntity, engine.components.CollisionTag());
    engine.ecs.addComponent(briqueEntity, engine.components.CollisionBoxComponent(w, h));
    return briqueEntity;

}

function Mur(x, y, w, h) {
    const murEntity = engine.ecs.createEntity();
    engine.ecs.addComponent(murEntity, engine.components.MurTag())
    engine.ecs.addComponent(murEntity, engine.components.PositionComponent(x, y, 0));
    engine.ecs.addComponent(murEntity, engine.components.RenderableTag());
    engine.ecs.addComponent(murEntity, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: { r: 0.88, g: 0.88, b: 0.88 } }));
    engine.ecs.addComponent(murEntity, engine.components.CollisionTag());
    engine.ecs.addComponent(murEntity, engine.components.CollisionBoxComponent(w, h));
    return murEntity;

}


function GameState(maxLifes) {
    const gameEntity = engine.ecs.createEntity();
    engine.ecs.addComponent(gameEntity, engine.components.GameStateComponent());
    engine.ecs.addComponent(gameEntity, engine.components.LifeComponent(maxLifes));
    engine.ecs.addComponent(gameEntity, engine.components.ScoreComponent());
    return gameEntity;

}


export { Ball, Raquette, Brique, Mur , GameState}