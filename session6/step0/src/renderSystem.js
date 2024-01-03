
const webGLRenderSystem = (entities, components, gl) => {

    // Create a buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const vertexShaderCode = `
    attribute vec4 a_position;
    uniform mat4 uModelViewMatrix;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;

    void main() {
        gl_Position =  uModelViewMatrix * a_position;
        gl_PointSize = 15.0;
        v_texCoord = a_texCoord;        
    }`;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(
            "Erreur de compilation du shader: " + gl.getShaderInfoLog(vertexShader)
        );
        gl.deleteShader(vertexShader);
        return null;
    }

    const fragmentShaderCode = `
        precision mediump float;
        uniform vec4 u_color;
        uniform sampler2D uTexture; // Ajout de la déclaration de la texture
        varying vec2 v_texCoord;
        uniform sampler2D u_texture;
        uniform bool useTexture; // Variable pour décider d'utiliser la texture ou la couleur

        void main() {
            if (useTexture) {
                gl_FragColor = texture2D(u_texture, v_texCoord);
            } 
            else {
                gl_FragColor = u_color;
            }
        }`;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(
            "Erreur de compilation du shader: " + gl.getShaderInfoLog(fragmentShader)
        );
        gl.deleteShader(fragmentShader);
        return null;
    }


    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(
            "Erreur de liaison du programme: " + gl.getProgramInfoLog(shaderProgram)
        );
        gl.deleteProgram(shaderProgram);
    }


    // Bind the buffer and set attributes
    var coord = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(coord);
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);


    // Set the color uniform
    const colorLoc = gl.getUniformLocation(shaderProgram, "u_color");


    // Set the model-view matrix uniform (optional)
    const modelViewMatrix = new Float32Array([
        2 / 350, 0, 0, 0,
        0, -2 / 355, 0, 0,
        0, 0, 1, 0,
        -1, 1, 0, 1
    ]);
    const uModelViewMatrix = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);




    var texCoord = gl.getAttribLocation(shaderProgram, "a_texCoord");
    gl.enableVertexAttribArray(texCoord);
    gl.vertexAttribPointer(
        texCoord,
        2,
        gl.FLOAT,
        false,
        4 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    // Asynchronously load an image
    var texture = gl.createTexture();
    var image = new Image();
    image.src = './img/brick.png';
    image.addEventListener('load', function() {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    });

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (const entity of entities) {
        if (components.RenderableTag[entity] &&
            components.GraphicsComponent[entity] &&
            components.PositionComponent[entity]
        ) {

            if (components.GraphicsComponent[entity].shape === "cercle") {
                gl.uniform1i(gl.getUniformLocation(shaderProgram, "useTexture"), 0);
                const position = components.PositionComponent[entity];
                const grfx = components.GraphicsComponent[entity];
                drawCircle(gl, colorLoc, position.x, position.y, grfx.shapeInfo.w, grfx.shapeInfo.h, grfx.shapeInfo.color, null);
            }
            else {
                const position = components.PositionComponent[entity];
                const grfx = components.GraphicsComponent[entity];
                gl.uniform1i(gl.getUniformLocation(shaderProgram, "useTexture"), 0);
                drawEntity(gl, colorLoc, position.x, position.y, grfx.shapeInfo.w, grfx.shapeInfo.h, grfx.shapeInfo.color, null);
            }
        }
    }
};

function drawCircle(gl, colorLoc, x, y,w,h,color, texture){


    // Génère les vertices pour représenter un cercle
    const segments = 30; // Le nombre de segments pour approximer un cercle
    const vertices = [];
    for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * 2 * Math.PI;
        const xPos = x + 6 * Math.cos(theta);
        const yPos = y + 8 * Math.sin(theta);
        vertices.push(xPos, yPos);
    }
    // Met à jour le tampon avec les nouveaux vertices
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    gl.uniform4fv(colorLoc, [color.r, color.g, color.b, 1.0]);

    // Bind the texture
//    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Dessine le cercle
    gl.drawArrays(gl.TRIANGLE_FAN, 0, segments);

}

function drawEntity(gl, colorLoc, x, y,w,h,color, texture) {



    const vertices = new Float32Array([
        x, y,
        x + w, y,
        x, y + h,
        x, y + h,
        x + w, y,
        x + w, y + h
    ]);


    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    if (texture == null){
        gl.uniform4fv(colorLoc, [color.r, color.g, color.b, 1.0]);
    }else{
        gl.bindTexture(gl.TEXTURE_2D, texture);
    }


    gl.drawArrays(gl.TRIANGLES, 0, 6);


}



export {webGLRenderSystem}