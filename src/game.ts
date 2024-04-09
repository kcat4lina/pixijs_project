import * as PIXI from "pixi.js"
import fishImage from "./images/fish.png"
import gsap from "gsap"

// Pixi app creation
const pixi = new PIXI.Application({ width: 800, height: 450 })
document.body.appendChild(pixi.view)

// Pixi loader creation with image and callback function
const loader = new PIXI.Loader()
loader.add('fishTexture', fishImage)
loader.load(() => loadCompleted())

// Store fish sprites
let fishes: PIXI.Sprite[] = []
// Create start again button
let startAgainButton: PIXI.Text

// Helper functions: random number
function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper functions: check overlap
function checkOverlap(sprite: PIXI.Sprite) {
    for (let fish of fishes) {
        if (sprite !== fish && sprite.getBounds().intersects(fish.getBounds())) {
            return true // Return true if overlap
        }
    }
    return false // Return false if no overlap
}

// Helper functions: on click
function handleClickfish(fish: PIXI.Sprite) {
    gsap.to(fish, {
        duration: 2,
        alpha: 0, // dissolve
        tint: 0xFF0000, // change the color of the fish
        onComplete: () => {
            pixi.stage.removeChild(fish);
            fishes = fishes.filter(f => f !== fish);
    
            if (fishes.length === 0) {
                pixi.stage.addChild(startAgainButton);
            }
        }
    })
}

// Main function: generate fishes
function generatefishes() {
    const numfishes = getRandomNumber(5, 10)
    for (let i = 0; i < numfishes; i++) {
        let fish = new PIXI.Sprite(loader.resources["fishTexture"].texture)
        fish.x = getRandomNumber(0, pixi.screen.width - fish.width)
        fish.y = getRandomNumber(0, pixi.screen.height - fish.height)

        while (checkOverlap(fish)) {
            fish.x = getRandomNumber(0, pixi.screen.width - fish.width)
            fish.y = getRandomNumber(0, pixi.screen.height - fish.height)
        }

        fish.interactive = true
        fish.buttonMode = true
        fish.on('pointerdown', () => handleClickfish(fish))

        pixi.stage.addChild(fish)
        fishes.push(fish)
    }
}

// Helper functions: start again
function handleStartAgain() {
    for (let fish of fishes) {
        pixi.stage.removeChild(fish)
    }
    fishes = []
    
    pixi.stage.removeChild(startAgainButton)

    generatefishes()
}

generatefishes()


// Start (again) button
startAgainButton = new PIXI.Text('Start game')
startAgainButton.style = new PIXI.TextStyle({ fill: 0xffffff, align: 'center', fontSize: 24, fontWeight: 'bold'})
startAgainButton.x = pixi.screen.width / 2 - startAgainButton.width / 2
startAgainButton.y = pixi.screen.height / 2 - startAgainButton.height / 2
startAgainButton.interactive = true
startAgainButton.buttonMode = true
startAgainButton.style.fill = 0x00FF00  // Green background color
startAgainButton.style.padding = 10

startAgainButton.addListener('pointerdown', handleStartAgain)

pixi.stage.addChild(startAgainButton)

// Helper functions: load completed
function loadCompleted(): void {
    throw new Error('Function not implemented.')
}
