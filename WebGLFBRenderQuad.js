function FBRenderQuad(wglContext, framebuffer)
{	
	this.fb = framebuffer;
	this.context = wglContext;
	
	// Create data for the position of each of the vertices in the quad.
	var posBufferData = [0.0, 1.0, 0.0,		0.0, 0.0, 0.0,		1.0, 1.0, 0.0,		1.0, 0.0, 0.0];
	// Do the same for the UV coordinates.
	var uvBufferData  = [0.0, 1.0, 		0.0, 0.0, 		1.0, 1.0, 		1.0, 0.0];
	
	// Create a buffer on the graphics card to store the position data of the quad.
	this.posBuffer = wglContext.createBuffer();
	
	// Create another buffer to store the quad's UV coordinates.
	this.uvBuffer = wglContext.createBuffer();
	
	// Bind to the position buffer and feed it the position data that it has always wanted.
	wglContext.bindBuffer(wglContext.ARRAY_BUFFER, this.posBuffer);
	wglContext.bufferData(wglContext.ARRAY_BUFFER, new Float32Array(posBufferData), wglContext.STATIC_DRAW);
	
	// So that it doesn't feel left out, we do the same with the UV buffer.
	wglContext.bindBuffer(wglContext.ARRAY_BUFFER, this.uvBuffer);
	wglContext.bufferData(wglContext.ARRAY_BUFFER, new Float32Array(uvBufferData), wglContext.STATIC_DRAW);
	
	this.posBuffer.itemSize = 3;
	this.posBuffer.items = 4;
	
	this.uvBuffer.itemSize = 2;
	this.uvBuffer.items = 4;
	
}

FBRenderQuad.prototype.getPosBuffer = function()
{
	return this.posBuffer;
}

FBRenderQuad.prototype.getUVBuffer = function()
{
	return this.uvBuffer;
}

FBRenderQuad.prototype.render = function()
{
	// Give the shader program a reference to our vertex data.
	this.context.bindBuffer(this.context.ARRAY_BUFFER, this.posBuffer);
	this.context.vertexAttribPointer(this.program.vertPosAttribute, this.posBuffer.itemSize, this.context.FLOAT, false, 0, 0);
	
	// Give it too a reference to the UV data.
	this.context.bindBuffer(this.context.ARRAY_BUFFER, this.uvBuffer);
	this.context.vertexAttribPointer(this.program.vertUVAttribute, this.uvBuffer.itemSize, this.context.FLOAT, false, 0, 0);
	
	// Activate a texture unit to pass in the framebuffer texture.
	this.context.activeTexture(this.context.TEXTURE0);
	// Bind to our framebuffer's texture.
	this.context.bindTexture(this.context.TEXTURE_2D, this.fb.getTex());
	// Give the sampler uniform the ID of the texture unit that we are using.
	this.context.uniform1i(this.program.samplerUniform, 0);
	
	// Draw the quad. 
	this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, 4);
}

