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

class Memory
{
	constructor()
	{
		this.Data = [];
	}
}

class Chip8
{
	constructor()
	{
		this.SCREEN_WIDTH = 64;
		this.SCREEN_HEIGHT = 32;
		this.SCREEN_SCALE = 20;
		this.screen = []; // 64x32
		this.memory = []; // 4096 bytes
		/* Data Registers 0x0 to 0xe */
		/*
		let V = new Uint8Array(16);
		V[0xe] = 1;
		console.log(BYTE);
		*/
		this.V = [];
		/* Address Register*/
		this.I;
		/* Program Counter */
		this.PC;
		/* The Stack */
		this.S = [];
		/* The Delay and Sound Timer */
		this.DT;
		this.ST;
	}

	execute(cycles)
	{
		while (cycles > 0)
		{
			console.log("|----------------|\n");
			// 
			console.log("PC: 0x" + this.PC.toString(16).padStart(4, "0").toUpperCase() + "  (hex)\n");
			console.log("PC: " + this.PC + "    (dec)\n");
			let instruction = this.memory[this.PC];
			if (instruction == null)
			{
				console.log("Instruction not handled: 0x" + instruction + "\n");
			}
			else
			{
				// Convert decimal number to hex
				instruction = instruction.toString(16);
				// Pad zeroes so that it's 4 digits long
				instruction = instruction.padStart(4, "0");
				// .toUppercase() allows the memory addresses to contain either uppercase or lowercase letters
				instruction = instruction.toUpperCase();

				console.log("Instruction: 0x" + instruction + " (hex)\n");

				if (instruction[0] == "0")
				{
					// 00E0
					if (instruction == "00E0") // Clear the screen
					{
						this.screen.fill(0);
						console.log("Cleared the screen.\n");
					}
					// 00EE
					else if (instruction == "00EE") // Return from a subroutine
					{
					}
					// 0NNN
					else // Execute subroutine at address NNN
					{
					}
				}
				// 1NNN
				else if (instruction[0] == "1") // Jump to address NNN
				{
				}
				// 2NNN
				else if (instruction[0] == "2") // Execute subroutine starting at address NNN
				{
				}
				// 3XNN
				else if (instruction[0] == "3") // Skip the following instruction if the value of register VX equals NN
				{
				}
				// 4XNN
				else if (instruction[0] == "4") // Skip the following instruction if the value of register VX is not equal to NN
				{
				}
				// 5XY0
				else if (instruction[0] == "5") // Skip the following instruction if the value of register VX is equal to the value of register VY
				{
				}
				// 6XNN
				else if (instruction[0] == "6") // Store number NN in register VX
				{
				}
				// 7XNN
				else if (instruction[0] == "7") // Add the value NN to register VX
				{
				}
				// 8XY0 to 8XYE
				else if (instruction[0] == "8")
				{
					// 8XY0
					if (instruction[3] == "0") // Store the value of register VY in register VX
					{
					}
					// 8XY1
					else if (instruction[3] == "1") // Set VX to VX OR VY
					{
					}
					// 8XY2
					else if (instruction[3] == "2") // Set VX to VX AND VY
					{
					}
					// 8XY3
					else if (instruction[3] == "3") // Set VX to VX XOR VY
					{
					}
					// 8XY4
					else if (instruction[3] == "4") // Add the value of register VY to register VX. Set VF to 01 if a carry occurs.
					{								// Set VF to 00 if a carry does not occur
					}
					// 8XY5
					else if (instruction[3] == "5") // Subtract the value of register VY from register VX. Set VF to 00 if a borrow occurs.
					{								// Set VF to 01 if a borrow does not occur.
					}
					// 8XY6
					else if (instruction[3] == "6") // Store the value of register VY shifted right one bit in register VX.
					{								// Set register VF to the least significant bit prior to the shift VY is unchanged
					}
					// 8XY7
					else if (instruction[3] == "7") // Set register VX to the value of VY minus VX. Set VF to 00 if a borrow occurs.
					{								// Set VF to 01 is a borrow does not occur.
					}
					// 8XYE
					else if (instruction[3] == "E") // Store the value of register VY shifted left one bit in register VX.
					{								// Set register VF to the most significant bit prior to the shift VY is unchanged.
					}
				}
				// 9XY0
				else if (instruction[0] == "9") // Skip the following instruction if the value of register VX is not equal to the value of register VY
				{
				}
				// ANNN
				else if (instruction[0] == "A") // Store memory address NNN in register I
				{
				}
				// BNNN
				else if (instruction[0] == "B") // Jump to address NNN + V0
				{
				}
				// CXNN
				else if (instruction[0] == "C") // Set VX to a random number with a mask of NN
				{
				}
				// DXYN
				else if (instruction[0] == "D") // Draw a sprite at position VX, VY with N bytes of sprite data starting at the address stored in I.
				{								// Set VF to 01 if any set pixels are changed to unset, and 00 otherwise.
				}
				// EX9E or EXA1
				else if (instruction[0] == "E")
				{
					// EX9E
					if (instruction.slice(2, 4) == "9E") // Skip the following instruction if the key corresponding to the hex value currently stored
					{									 // in register VX is pressed.
					}
					// EXA1
					else if (instruction.slice(2, 4) == "A1") // Skip the following instruction if the key corresponding to the hex value corrently stored
					{										  // in register VX is not pressed.
					}
				}
				// FX07 to FX65
				else if (instruction[0] == "F")
				{
					let ie = instruction.slice(2, 4);
					switch (ie)
					{
						case "07": // Store the current value of the delay timer in register VX
							this.V[parseInt(instruction[1])] = this.DT;
							console.log("Set register V" + instruction[1] + " to " + this.DT + " (delay timer).\n");
							break;
						case "0A": // Wait for a keypress and store the result in register VX
							break;
						case "15": // Set the delay timer to the value of register VX
							break;
						case "18": // Set the sound timer to the value of register VX
							break;
						case "1E": // Add the value stored in register VX to register I
							break;
						case "29": // Set I to the memory address of the sprite data corresponding to the hexadecimal digit stored in register VX
							break;
						case "33": // Store the binary-coded decimal equivalent of the value stored in register VX at addresses I, I+1 and I+2
							break;
						case "55": // Store the values of registers V0 to VX inclusive in memory starting at address I. I is set to I+X+1 after operation
							break;
						case "65": // Fill registers V0 to VX inclusive with the values stored in memory starting at address I. I is set to I+X+1 after operation
							break;
						default:
							break;
					}
				}
			}
			this.PC += 1;
			cycles--;
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

	reset()
	{
		this.memory[0x200] = 0x00e0;
		this.PC = 0x200;
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
/* Start Testing */
chip8.screen[216] = 1;

chip8.DT = "0f";
chip8.memory[0x201] = "F007";

/* End Testing */

chip8.reset();
chip8.execute(2);
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