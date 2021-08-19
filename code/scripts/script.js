/* Program: script.js
 * Programmer: Leonard Michel
 * Start Date: 11.08.2021
 * Last Change:
 * End Date: /
 * License: /
 * Version: 0.0.0.0
*/

/**** INITIALIZATION ****/

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;

let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

ctx.save();

let radians = Math.PI / 180;

/* Audio Object Definitions */
let audioButtonPressed = new Audio("audio/audioButtonPressed.mp3");
let audioButtonPressedIsReady = false;
audioButtonPressed.addEventListener("canplaythrough", function () { audioButtonPressedIsReady = true; });

/* Mouse Input */
let mouseX = 0;
let mouseY = 0;
let mouseLeftPressed = false,
    mouseRightPressed = false;

let mouseLeftPressedBefore = false,
    mouseRightPressedBefore = false;

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);

function mouseMoveHandler(e)
{
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function mouseDownHandler(e)
{
    if (e.button == 0) { mouseLeftPressed = true; };
    if (e.button == 2) { mouseRightPressed = true; };
}

function mouseUpHandler(e)
{
    if (e.button == 0) { mouseLeftPressed = false; };
    if (e.button == 2) { mouseRightPressed = false; };
}

/* Key Presses */
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let wPressed = false,
    aPressed = false,
    sPressed = false,
    dPressed = false,
    jPressed = false,
    kPressed = false,
    lPressed = false;

let wPressedBefore = false,
    aPressedBefore = false,
    sPressedBefore = false,
    dPressedBefore = false,
    jPressedBefore = false,
    kPressedBefore = false,
    lPressedBefore = false;

function keyDownHandler(e)
{
    if (e.code == "KeyW") { wPressed = true; }
    if (e.code == "KeyA") { aPressed = true; }
    if (e.code == "KeyS") { sPressed = true; }
    if (e.code == "KeyD") { dPressed = true; }

    if (e.code == "KeyJ") { jPressed = true; }
    if (e.code == "KeyK") { kPressed = true; }
    if (e.code == "KeyL") { lPressed = true; }
}

function keyUpHandler(e)
{
    if (e.code == "KeyW") { wPressed = false; }
    if (e.code == "KeyA") { aPressed = false; }
    if (e.code == "KeyS") { sPressed = false; }
    if (e.code == "KeyD") { dPressed = false; }

    if (e.code == "KeyJ") { jPressed = false; }
    if (e.code == "KeyK") { kPressed = false; }
    if (e.code == "KeyL") { lPressed = false; }
}

/* Class Definitions */
class Button
{
	constructor()
	{
        this.x = 0;
        this.y = 0;
        this.width = 150;
        this.height = 50;
        // Colors
        this.colEdgeNeutral = "#888888";
        this.colFaceNeutral = "#00000044";
        this.colEdgeHover = "#bbbbbb";
        this.colFaceHover = "#00000088";
        this.colEdgePressed = "#ffffff";
        this.colFacePressed = "#000000bb";
        this.colTextFill = "#000000";
        this.colTextShadow = "#ffffff";
        // Color assignment
        this.edgeColor = this.colEdgeNeutral;
        this.faceColor = this.colFaceNeutral;

        this.text = "Button";
        this.isPressed = false;
        this.isVisible = true;
		this.playSound = true;
        // How often can the user click the button.
        this.clickSpeed = 50;
        this.clickTick = Date.now();
	}

    update()
    {
        this.collisionDetection();
		this.draw();
		this.playAudio();
    }

    collisionDetection()
    {
        // Only let the user click the button if the wait time has been passed
        if (tp1 - this.clickTick >= this.clickSpeed)
        {
            // If mouse is within button bounds.
            if (mouseX >= this.x && mouseX < this.x + this.width && mouseY >= this.y && mouseY < this.y + this.height)
            {
                // If mouse clicked on button
                if (mouseLeftPressed)
                {
                    if (mouseLeftPressedBefore == false)
                    {
                        this.edgeColor = this.colEdgePressed;
                        this.faceColor = this.colFacePressed;

                        this.isPressed = true;
                        mouseLeftPressedBefore = true;
                    }
                }
                // If mouse is hovering on button
                if (!mouseLeftPressed)
                {
                    this.edgeColor = this.colEdgeHover;
                    this.faceColor = this.colFaceHover;

                    this.isPressed = false;
                    mouseLeftPressedBefore = false;
                }
            }
            // If mouse is out of button bounds.
            else
            {
                this.edgeColor = this.colEdgeNeutral;
                this.faceColor = this.colFaceNeutral;

                this.isPressed = false;
            }

            this.clickTick = Date.now();
        }
    }

    draw()
    {
		if (this.isVisible)
		{
			// Draw fill
			ctx.fillStyle = this.faceColor;
			ctx.fillRect(this.x, this.y, this.width, this.height);

			// Draw border
			ctx.strokeStyle = this.edgeColor;
			ctx.strokeRect(this.x, this.y, this.width, this.height);

			// Draw text
			let textPosX = this.x + (this.width / 2),
				textPosY = this.y + (this.height / 1.5),
				textSize = this.height/1.5;

			ctx.textAlign = "center";
			ctx.font = this.height / 2 + "px sans-serif";

			// Text shadow
			ctx.fillStyle = this.colTextShadow;
			ctx.fillText(this.text, textPosX + textSize/128, textPosY + textSize/128);

			// Actual text
			ctx.fillStyle = this.colTextFill;
			ctx.fillText(this.text, textPosX, textPosY);
		}

    }

	playAudio()
	{
		if (this.playSound)
		{
			if (this.isPressed)
			{
				if (audioButtonPressedIsReady) { audioButtonPressed.play(); };
			}
		}
	}
}

class Chip8
{
	constructor()
	{
		/* Developer mode which logs info to the console. */
		this.dev = true;
		/* Screen resolution in device pixels */
		this.SCREEN_WIDTH = 64;
		this.SCREEN_HEIGHT = 32;
		this.SCREEN_SCALE = 20;
		/* An array of 0's and 1's for displaying graphics */
		this.screen = new Array(this.SCREEN_WIDTH*this.SCREEN_HEIGHT); // 64x32
		this.memory = new Array(4096); // 4096 bytes
		/* Data Registers 0x0 to 0xe */
		this.V = new Array(16);
		/* Address Register*/
		this.I;
		/* Program Counter */
		this.PC;
		/* The Stack */
		this.S = new Array(16);
		/* The Delay and Sound Timer */
		this.DT;
		this.ST;
		/* In which cycle is the chip in. This number increments with each call to execute and gets reset upon calling said function. */
		this.ticks = 0;
		// The lowest address that is allowed to be used by programs. safe address low
		this.saLow = 0x200;
		// The highest address that is allowed to be used by programs.
		this.saHigh = 0xe8f;
		this.warnColor = "#ff8800";
	}

	execute(cycles)
	{
		while (cycles > 0)
		{
			/* Display developer information */
			if (this.dev)
			{
				console.log("\n");
				console.log("%c|--  Tick " + this.ticks.toString().padStart(3, " ") + "  --|", "background: #444444; color: #ffffff");
				// PC in hex
				console.log("  PC: 0x" + this.PC.toString(16).padStart(4, "0").toUpperCase() + " (hex)\n");
				// PC in dec
				console.log("  PC: " + this.PC.toString(10).padStart(6, " ") + " (dec)\n");
			}

			let instruction = this.memory[this.PC];
			if (instruction == null)
			{
				if (this.dev) {console.log("Instruction not handled: 0x" + instruction + "\n"); };
			}
			else
			{
				// Convert decimal number to hex
				instruction = instruction.toString(16);
				// Pad zeroes so that it's 4 digits long
				instruction = instruction.padStart(4, "0");
				// .toUppercase() allows the memory addresses to contain either uppercase or lowercase letters
				instruction = instruction.toUpperCase();

				if (this.dev) { console.log("  Instruction: 0x" + instruction + " (hex)\n"); };
				let i0 = instruction[0];
				switch (i0)
				{
					case "0":
						switch (instruction)
						{
							case "00E0": // Clear the screen
								this.screen.fill(0, 0, this.SCREEN_WIDTH*this.SCREEN_HEIGHT);
								if (this.dev) { console.log("  > Cleared the screen.\n"); };
								this.incrementPC(1);
								break;
							case "00EE": // Return from a subroutine
								if (this.S.length > 0)
								{
									this.PC = this.S[this.S.length-1];
									this.S.pop();

									if (this.dev)
									{
										console.log("  > Return from subroutine to 0x" + this.PC.toString(16) + "\n");
									}
								}
								else
								{
									if (this.dev)
									{
										console.log("  ! Unable to return from subroutine to 0x" + this.S[this.S.length-1] + "\n");
										console.log("  ! S has no values.\n");
									}
								}
								this.incrementPC(1);
								break;
							// 0NNN
							default:     // Execute machine language subroutine at address NNN
								break;
						}
						break;
					// 1NNN
					case "1": // Jump to address NNN
						// This turns the instruction slice into a hex number which gets converted automatically to decimal during assignment to this.PC
						this.PC = parseInt(instruction.slice(1, 4), 16);
						if (this.dev) { console.log("  > Jumped to address " + this.PC + ".\n"); };
						break;
					// 2NNN
					case "2": // Execute subroutine starting at address NNN
						this.S.push(this.PC);
						this.PC = parseInt(instruction.slice(1, 4), 16);
						if (this.dev)
						{
							console.log("  > Execute subroutine starting at address 0x" + this.PC.toString(16) + ".\n")
							let s = "  S = ";
							for (let i = 0; i < this.S.length; i++)
							{
								if (this.S[i] != null)
								{
									s += this.S[i].toString(16);
									if (i < this.S.length-1) { s+= ", " };
								}
							}
							s += "\n";
							console.log(s);
						};
						break;
					// 3XNN
					case "3": // Skip the following instruction if the value of register VX equals NN
						{
							let iVX = parseInt(instruction.slice(1, 2), 16);
							let vVX = this.V[iVX];
							let vNN = parseInt(instruction.slice(2, 4), 16);
							if (vVX == vNN)
							{
								this.incrementPC(2);
								if (this.dev)
								{
									console.log("  > Skipped the following instruction as V"+ iVX.toString(16) + " == 0x" + vNN.toString(16).padStart(2, "0") + ".\n");
								}
							}
							else
							{
								this.incrementPC(1);
							}
						}
						break;
					// 4XNN
					case "4": // Skip the following instruction if the value of register VX is not equal to NN
						{	// Removing these brackets leads to iVX errors, as it has been declared above already.
							let iVX = parseInt(instruction.slice(1, 2), 16);
							let vVX = this.V[iVX];
							let vNN = parseInt(instruction.slice(2, 4), 16);
							if (vVX != vNN)
							{
								this.incrementPC(2);
								if (this.dev)
								{
									console.log("  > Skipped the following instruction as V"+ iVX.toString(16) + " != 0x" + vNN.toString(16).padStart(2, "0") + ".\n");
								}
							}
							else
							{
								this.incrementPC(1);
							}
						}
						break;
					// 5XY0
					case "5": // Skip the following instruction if the value of register VX is equal to the value of register VY
						{	// Removing these brackets leads to iVX errors, as it has been declared above already.
							let iVX = parseInt(instruction.slice(1, 2), 16);
							let vVX = this.V[iVX];
							let iVY = parseInt(instruction.slice(2, 3), 16);
							let vVY = this.V[iVY];
							if (vVX == vVY)
							{
								this.incrementPC(2);
								if (this.dev)
								{
									console.log("  > Skipped the following instruction as V"+ iVX.toString(16) + " == V" + iVY.toString(16) + ".\n");
								}
							}
							else
							{
								this.incrementPC(1);
							}
						}
						break;
					// 6XNN
					case "6": // Store number NN in register VX
						{
							let iVX = parseInt(instruction.slice(1, 2), 16);
							let vVX = this.V[iVX];
							let vNN = parseInt(instruction.slice(2, 4), 16);

							this.V[iVX] = vNN;
							this.incrementPC(1);
							if (this.dev)
							{
								console.log("  > Stored the value 0x" + vNN.toString(16) + " in register V" + iVX.toString(16) + ".\n");
							}
						}
						break;
					// 7XNN
					case "7": // Add the value NN to register VX
						{
							let iVX = parseInt(instruction.slice(1, 2), 16);
							let vVX = parseInt(this.V[iVX]);
							let vNN = parseInt(instruction.slice(2, 4), 16);

							//console.log("Start: " + vVX + "\n");
							this.V[iVX] = vVX + vNN;
							//console.log("Add: " + this.V[iVX] + "\n");
							// If the stored value exceeds 255 it will "wraparound". So 256 becomes 0, 257 becomes 1 and so on.
							this.V[iVX] = this.V[iVX] % 256;
							//console.log("Modulo: " + this.V[iVX] + "\n");

							this.incrementPC(1);
							if (this.dev)
							{
								console.log("  > Added the value 0x" + vNN.toString(16) + " to register V" + iVX.toString(16) + ".\n");
								console.log("  Value of register V" + iVX.toString(16) + " is 0x" + this.V[iVX].toString(16) + ".\n");
							}
						}
						break;
					// 8XY0 to 8XYE
					case "8":
						let i3 = instruction[3];
						switch (i3)
						{
							// 8XY_
							case "0": // Store the value of register VY in register VX
								{
									let iVX = parseInt(instruction.slice(1, 2), 16);
									let vVX = parseInt(this.V[iVX]);
									let iVY = parseInt(instruction.slice(2, 3), 16);
									let vVY = parseInt(this.V[iVY]);

									this.V[iVX] = vVY;
									// If the stored value exceeds 255 it will "wraparound". So 256 becomes 0, 257 becomes 1 and so on.
									this.V[iVX] = this.V[iVX] % 256;

									this.incrementPC(1);
									if (this.dev)
									{
										console.log("  > Stored the value of register V" + iVY.toString(16) + " in register V" + iVX.toString(16) + ".\n");
										console.log("  > Value of register V" + iVX.toString(16) + " is 0x" + this.V[iVX].toString(16) + ".\n");
									}
								}
								break;
							case "1": // Set VX to VX OR VY
								{
									// Not completely certain if this is the way it's supposed to work.
									// VX gets value of VX if it is not 0x0. If value of VX is 0x0, the VX gets assigned the value of VY.
									let iVX = parseInt(instruction.slice(1, 2), 16);
									let vVX = parseInt(this.V[iVX]);
									let iVY = parseInt(instruction.slice(2, 3), 16);
									let vVY = parseInt(this.V[iVY]);

									// If the stored value exceeds 255 it will "wraparound". So 256 becomes 0, 257 becomes 1 and so on.
									this.V[iVX] = (vVX % 256) | (vVY % 256);

									this.incrementPC(1);
									if (this.dev)
									{
										if (this.V[iVX] == vVX % 256)
										{
											console.log("  > Set the value of register V" + iVX.toString(16) + " to the value of register V" + iVX.toString(16) + ".\n");
											console.log("  > Value of register V" + iVX.toString(16) + " is 0x" + this.V[iVX].toString(16) + ".\n");
										}
										else if (this.V[iVX] == vVY % 256)
										{
											console.log("  > Set the value of register V" + iVX.toString(16) + " to the value of register V" + iVY.toString(16) + ".\n");
											console.log("  > Value of register V" + iVX.toString(16) + " is 0x" + this.V[iVX].toString(16) + ".\n");
										}
										else
										{
											console.log("  > Value of register V" + iVX.toString(16) + " not changed.\n");
										}
									}
								}
								break;
							case "2": // Set VX to VX AND VY
								{
									// Not completely certain if this is the way it's supposed to work.
									let iVX = parseInt(instruction.slice(1, 2), 16);
									let vVX = parseInt(this.V[iVX]);
									let iVY = parseInt(instruction.slice(2, 3), 16);
									let vVY = parseInt(this.V[iVY]);

									// If the stored value exceeds 255 it will "wraparound". So 256 becomes 0, 257 becomes 1 and so on.
									this.V[iVX] = (vVX & vVY) % 256;

									this.incrementPC(1);
									if (this.dev)
									{
										console.log("  > Set the value of register V" + iVX.toString(16) + " to V" + iVX.toString(16) + " and V" + iVY.toString(16) + ".\n");
										console.log("  > Value of register V" + iVX.toString(16) + " is 0x" + this.V[iVX].toString(16) + ".\n");
									}
								}
								break;
							case "3": // Set VX to VX XOR VY
								{
									// Not completely certain if this is the way it's supposed to work.
									// VX gets value of VX if it is not 0x0. If value of VX is 0x0, the VX gets assigned the value of VY.
									let iVX = parseInt(instruction.slice(1, 2), 16);
									let vVX = parseInt(this.V[iVX]);
									let iVY = parseInt(instruction.slice(2, 3), 16);
									let vVY = parseInt(this.V[iVY]);

									// If the stored value exceeds 255 it will "wraparound". So 256 becomes 0, 257 becomes 1 and so on.
									//this.V[iVX] = (vVX % 256) ^ (vVY % 256);
									this.V[iVX] = vVX ^ vVY;

									this.incrementPC(1);
									if (this.dev)
									{
										console.log("  > Set the value of register V" + iVX.toString(16) + " to the value of register V" + iVX.toString(16) + " XOR register V" + iVY.toString(16) + ".\n");
										console.log("  > Value of register V" + iVX.toString(16) + " is 0x" + this.V[iVX].toString(16) + ".\n");
									}
								}
								break;
							case "4": // Add the value of register VY to register VX. Set VF to 01 if a carry occurs.
									  // Set VF to 00 if a carry does not occur
								break;
							case "5": // Subtract the value of register VY from register VX. Set VF to 00 if a borrow occurs.
									  // Set VF to 01 if a borrow does not occur.
								break;
							case "6": // Store the value of register VY shifted right one bit in register VX.
									  // Set register VF to the least significant bit prior to the shift VY is unchanged
								break;
							case "7": // Set register VX to the value of VY minus VX. Set VF to 00 if a borrow occurs.
									  // Set VF to 01 if a borrow does not occur.
								break;
							case "E": // Store the value of register VY shifted left one bit in register VX.
									  // Set register VF to the most significant bit prior to the shift VY is unchanged.
								break;
							default:
								break;
						}
						break;
					// 9XY0
					case "9": // Skip the following instruction if the value of register VX is not equal to the value of register VY
						{	// Removing these brackets leads to iVX errors, as it has been declared above already.
							let iVX = parseInt(instruction.slice(1, 2), 16);
							let vVX = this.V[iVX];
							let iVY = parseInt(instruction.slice(2, 3), 16);
							let vVY = this.V[iVY];
							if (vVX != vVY)
							{
								this.incrementPC(2);
								if (this.dev)
								{
									console.log("  > Skipped the following instruction as V"+ iVX.toString(16) + " != V" + iVY.toString(16) + ".\n");
								}
							}
							else
							{
								this.incrementPC(1);
							}
						}
						break;
					// ANNN
					case "A": // Store memory address NNN in register I
						{
							let a = parseInt(instruction.slice(1, 4), 16);
							// Only 
							if (a >= this.saLow && a <= this.saHigh)
							{
								this.I = a;
								if (this.dev)
								{
									console.log("  > Stored memory address 0x"+ this.I.toString(16) + " in register I.\n");
								}
							}
							else
							{
								console.log("  ! Unable to store memory address 0x" + a.toString(16) + " in register I.\n");
								console.log("  ! Memory address out of bounds.\n");
								console.log("  ! Lowest address is 0x200, highest is 0xe8f.\n");
							}

							this.incrementPC(1);
						}
						break;
					// BNNN
					case "B": // Jump to address NNN + V0
						{
							let a = parseInt(instruction.slice(1, 4), 16) + parseInt(this.V[0]);

							if (a >= this.saLow && a <= this.saHigh)
							{
								this.PC = a;
								if (this.dev)
								{
									console.log("  > Jumped to address 0x"+ this.PC.toString(16) + ".\n");
								}
							}
							else
							{
								console.log("  ! Unable to jump to address 0x"+ a.toString(16) + ".\n");
								console.log("  ! Memory address out of bounds.\n");
								console.log("  ! Lowest address is 0x200, highest is 0xe8f.\n");
							}
						}
						break;
					// CXNN
					case "C": // Set VX to a random number with a mask of NN
						break;
					// DXYN
					case "D": // Draw a sprite at position VX, VY with N bytes of sprite data starting at the address stored in I.
							  // Set VF to 01 if any set pixels are changed to unset, and 00 otherwise.
						break;
					// EX9E or EXA1
					case "E":
						// ie contains the two rightmost digits of the hex number, as in "end of instruction"
						let ie = instruction.slice(2, 4);
						switch (ie)
						{
							//  EX__
							case "9E": // Skip the following instruction if the key corresponding to the hex value currently stored
									   // in register VX is pressed.
								if (this.dev) { console.log("Skip the following instruction if the key corresponding to the hex value currently stored...\n"); };
								break;
							case "A1": // Skip the following instruction if the key corresponding to the hex value corrently stored
									   // in register VX is not pressed.
								break;
							default:
								break;
						}
						break;
					// FX07 to FX65
					case "F":
						// ie contains the two rightmost digits of the hex number, as in "end of instruction"
						let i23 = instruction.slice(2, 4);
						switch (i23)
						{
							//  FX__
							case "07": // Store the current value of the delay timer in register VX
								{	// Removing these brackets leads to iVX errors, as it has been declared above already.
									let iV = parseInt(instruction[1], 16);
									if (iV >= 0 && iV < 16)
									{
										this.V[iV] = this.DT;
										if (this.dev)
										{
											console.log("  > Stored the value of DT in register V" + iV.toString(16) + ".\n");
										}
									}
									this.incrementPC(1);
								}
								break;
							case "0A": // Wait for a keypress and store the result in register VX
								break;
							case "15": // Set the delay timer to the value of register VX
								{
									let iVX = parseInt(instruction.slice(1, 2), 16);
									let vVX = parseInt(this.V[iVX]);

									this.DT = vVX % 256;

									this.incrementPC(1);
									if (this.dev)
									{
										console.log("  > Set DT to the value of register V" + iVX.toString(16) + ".\n");
										console.log("  > Value of DT is 0x" + this.DT.toString(16) + ".\n");
									}
								}
								break;
							case "18": // Set the sound timer to the value of register VX
								{
									let iVX = parseInt(instruction.slice(1, 2), 16);
									let vVX = parseInt(this.V[iVX]);

									this.ST = vVX % 256;

									this.incrementPC(1);
									if (this.dev)
									{
										console.log("  > Set ST to the value of register V" + iVX.toString(16) + ".\n");
										console.log("  > Value of ST is 0x" + this.ST.toString(16) + ".\n");
									}
								}
								break;
							case "1E": // Add the value stored in register VX to register I
								{
									let iVX = parseInt(instruction.slice(1, 2), 16);
									let vVX = parseInt(this.V[iVX]);

									// The I register can store memory address 0x000 to 0xfff
									this.I = (this.I + vVX) % 4096;

									this.incrementPC(1);
									if (this.dev)
									{
										console.log("  > Added the value of register V" + iVX.toString(16) + " to I.\n");
										console.log("  > Value of I is 0x" + this.I.toString(16) + ".\n");
									}
								}
								break;
							case "29": // Set I to the memory address of the sprite data corresponding to the hexadecimal digit stored in register VX
								break;
							case "33": // Store the binary-coded decimal equivalent of the value stored in register VX at addresses I, I+1 and I+2
								break;
							case "55": // Store the values of registers V0 to VX inclusive in memory starting at address I. I is set to I+X+1 after operation
								{
									let iVX = parseInt(instruction.slice(1, 2), 16);
									let vVX = parseInt(this.V[iVX]);
									let a = parseInt(this.I, 16);

									for (let i = 0; i <= iVX; i++)
									{
										this.memory[a+i] = this.V[i];
									}

									this.I = this.I + iVX + 1;

									this.incrementPC(1);
									if (this.dev)
									{
										console.log("  > Stored the values of register V0 to V" + iVX.toString(16) + " in memory starting at 0x" + a.toString(16) + ".\n");
										console.log("  > Set I to 0x" + this.I.toString(16) + ".\n");
										let t = this.memory.slice(a, a+iVX+1);
										console.log("Memory Address" + " " + "Instruction\n");
										for (let i = 0; i <= iVX; i++)
										{
											console.log(("0x" + (a+i).toString(16).padStart(3, "0")).padStart(14, " ") + " " + t[i].toString(16).padStart(4, "0").toUpperCase() + "\n");
											//console.log(("0x" + i.toString(16)).padStart(14, " ") + " " + chip8.memory[i].toString(16).padStart(4, "0").toUpperCase() + "\n");
										}
									}
								}
								break;
							case "65": // Fill registers V0 to VX inclusive with the values stored in memory starting at address I. I is set to I+X+1 after operation
								{
									let iVX = parseInt(instruction.slice(1, 2), 16);
									let vVX = parseInt(this.V[iVX]);
									let a = this.I;

									for (let i = 0; i <= iVX; i++)
									{
										this.V[i] = this.memory[a+i];
									}

									this.I = this.I + iVX + 1;

									this.incrementPC(1);
									if (this.dev)
									{
										console.log("  > Filled registers V0 to V" + iVX.toString(16) + " with the values in memory starting at 0x" + a.toString(16) + ".\n");
										console.log("  > Set I to 0x" + this.I.toString(16) + ".\n");
										let t = this.V.slice(0, iVX+1);

										console.log("V Register" + " " + "Instruction\n");
										for (let i = 0; i <= iVX; i++)
										{
											console.log(("0x" + (i).toString(16)).padStart(10, " ") + " " + this.V[i].toString(16).padStart(4, "0").toUpperCase() + "\n");
											//console.log(("0x" + i.toString(16)).padStart(14, " ") + " " + chip8.memory[i].toString(16).padStart(4, "0").toUpperCase() + "\n");
										}
									}
								}
								break;
							default:
								break;
						}
						break;
					default:
						break;
				}
			}
			// This is done inside the statements.
			// this.PC += 1;
			cycles--;
			this.ticks += 1;
		}
	}

	draw()
	{
		ctx.fillStyle = "#ffffff";
		for (let y = 0; y < this.SCREEN_HEIGHT; y++)
		{
			for (let x = 0; x < this.SCREEN_WIDTH; x++)
			{
				if (this.screen[x + y*this.SCREEN_WIDTH] == 1)
				{
					ctx.fillRect(x*this.SCREEN_SCALE, y*this.SCREEN_SCALE, this.SCREEN_SCALE, this.SCREEN_SCALE);
				}
			}
		}
	}

	incrementPC(n)
	{
		if (this.PC+n <= this.saHigh)
		{
			this.PC += n;
		}
		else
		{
			console.warn("  > Reached end of memory.\n");
		}
	}

	reset()
	{
		if (this.dev)
		{
			console.log("Developer mode enabled.\n");
			console.log("|----------------|\n");
			console.log("> Chip-8 reset.\n");
		}

		this.screen.fill(0);
		this.memory.fill(0);
		this.V.fill(0);
		this.I = 0x0;
		this.PC = 0x200;
		this.DT = 0x0;
		this.ST = 0x0;
		this.ticks = 0;
	}
}

/* Function definitions */
function getRandomIntInclusive(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum and minimum are inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Chip-8 */
let chip8 = new Chip8;
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, chip8.SCREEN_WIDTH*chip8.SCREEN_SCALE, chip8.SCREEN_HEIGHT*chip8.SCREEN_SCALE);

chip8.reset();
/* Start Testing */
chip8.screen[216] = 1;

chip8.DT = "0f";
chip8.V[0] = 0x01;
chip8.V[1] = 0x05;
chip8.V[4] = 0x0;
chip8.memory[0xff] = 0x00ee;
chip8.I = 0x200;
chip8.memory[0x200] = 0x8013;
chip8.memory[0x201] = 0x2204; // Goto subroutine at 204
chip8.memory[0x202] = 0x00e0;
chip8.memory[0x203] = 0x00e0;
chip8.memory[0x204] = 0x00e0; // Start of subroutine. Jump to address 201
chip8.memory[0x205] = 0x00ee; // End of subroutine
chip8.memory[0x206] = 0x00e0;
chip8.memory[0xe8f] = 0x00e0;

console.log("Memory Address" + " " + "Instruction\n");
for (let i = 0; i < chip8.memory.length; i++)
{
	if (chip8.memory[i] != null)
	{
		if (chip8.memory[i] != 0)
		{
			//console.log("Chip-8 Memory at 0x" + i.toString(16) + " " + chip8.memory[i].toString(16).padStart(4, "0").toUpperCase() + "\n");
			console.log(("0x" + i.toString(16).padStart(3, "0").toUpperCase()).padStart(14, " ") + " " + chip8.memory[i].toString(16).padStart(4, "0").toUpperCase() + "\n");
		}
	}
}
/* End Testing */

chip8.execute(5);
chip8.draw();

// Time variables
let tp1 = Date.now();
let tp2 = Date.now();
let elapsedTime = 0;

/*
// The game loop
window.main = function ()
{
    window.requestAnimationFrame(main);
    // Get elapsed time for last tick.
    tp2 = Date.now();
    elapsedTime = tp2 - tp1;
    //console.log("elapsedTime:" + elapsedTime + "\n");
    tp1 = tp2;

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	chip8.execute(2);
}

// Start the game loop
main();
*/