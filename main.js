// creating canvas for the game
const canvas= document.querySelector('canvas');
const c= canvas.getContext('2d');
const scoreEl= document.querySelector('#scoreEl');
const win= document.querySelector('#win');
canvas.width= window.innerWidth
canvas.height= window.innerHeight

// Creating the map boundaries
class Boundary {
  static width= 40
  static height= 40
  constructor({position, image}){
    this.position= position
    this.width= 40
    this.height= 40
    this.image= image
  }
  draw(){
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

// creating Pac-Man character
class PacMan{
  constructor({position, velocity}){
    this.position= position
    this.velocity= velocity
    this.radius= 15
    this.radians= 0.75
    this.openRate= 0.12
    this.rotation= 0
  }
  draw(){
    c.save()
    c.translate(this.position.x, this.position.y)
    c.rotate(this.rotation)
    c.translate(-this.position.x, -this.position.y)
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
    c.lineTo(this.position.x, this.position.y)
    c.fillStyle= 'yellow';
    c.fill()
    c.closePath()
    c.restore()
  }
  update(){
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.radians < 0 || this.radians > .75) this.openRate= -this.openRate
    this.radians += this.openRate
  }
}
// Creating Pellets
class Pellet{
  constructor({position}){
    this.position= position
    this.radius= 3
  }
  draw(){
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle= 'gold';
    c.fill()
    c.closePath()
  }
}

// Empty arrays to store the pellets and boundaries
const pellets= []
const boundaries= []

const player= new PacMan({
  position: {
    x: Boundary.width + Boundary.width/2, 
    y:Boundary.height + Boundary.height/2
  },
  velocity: {
    x: 0,
    y: 0
  }




})
// Button detection
const keys= {
  ArrowUp: {
    pressed: false
  },
  ArrowDown: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}

let lastKey= ''
let score= 0

// Creating the map
const map= [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '.', '.', '[', '7', ']', '.', '.', '^', '.', '.', '[', '2', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '_', '.', '.', '.', '_', '.', '.', '.', '_', '.',  '|'],
  ['|', '.', '.', 'b', '.', '_', '.', 'b', '.', '.', '.', '.', 'b', '.', '.', '.', 'b', '.', '.', '.',  '|'],
  ['|', '^', '.', '.', '.', '.', '.', '.', '.', '.', '^', '.', '.', '.', '^', '.', '.', '.', '.', '^', '|'],
  ['|', '+', ']', '.', '.', '1', '-', ']', '.', '[', '+', ']', '.', '.', '|', '.', 'b', '.', '[', '+', '|'],
  ['|', '_', '.', '.', '.', '_', '.', '.', '.', '.', '_', '.', '.', '[', '3', '.', '.', '.', '.', '_', '|'],
  ['|', '.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '^', '.', '.', '.', '|'],
  ['|', '.', '.', '.', '.', '[', '-', '-', ']', '.', '^', '.', 'b', '.', '.', '[', '+', ']', '.', '.', '|'],
  ['|', '.', '.', '^', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '_', '.', '.', '.', '|'],
  ['|', '.', '[', '5', ']', '.', '[', ']', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '.', '^', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '.', 'b', '.', '.', '[', '3', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function createImage(src){
  const image= new Image()
  image.src= src
  return image
}

map.forEach((row, i)=> {
    row.forEach((symbol, j)=> {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeHorizontal.png')
            })
          )
          break
        case '|':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeVertical.png')
            })
          )
          break
        case '1':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner1.png')
            })
          )
          break
        case '2':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner2.png')
            })
          )
          break
        case '3':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner3.png')
            })
          )
          break
        case '4':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner4.png')
            })
          )
          break
        case 'b':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/block.png')
            })
          )
          break
        case '[':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capLeft.png')
            })
          )
          break
        case ']':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capRight.png')
            })
          )
          break
        case '_':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capBottom.png')
            })
          )
          break
        case '^':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capTop.png')
            })
          )
          break
        case '+':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/pipeCross.png')
            })
          )
          break
        case '5':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorTop.png')
            })
          )
          break
        case '6':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorRight.png')
            })
          )
          break
        case '7':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorBottom.png')
            })
          )
          break
        case '8':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/pipeConnectorLeft.png')
            })
          )
          break    
        case '.':
          pellets.push(
            new Pellet({
              position: {
                x: j * Boundary.width + Boundary.width/2,
                y: i * Boundary.height + Boundary.height/2
              },
            })
          )
          break               
       }
    })
})

// Collision detection
function pacManCollision({
  circle,
  rectangle
}){
  return (circle.position.y - circle.radius + circle.velocity.y<= rectangle.position.y + rectangle.height && 
    circle.position.x + circle.radius + circle.velocity.x>= rectangle.position.x && 
    circle.position.y + circle.radius + circle.velocity.y>= rectangle.position.y && 
    circle.position.x - circle.radius + circle.velocity.x<= rectangle.position.x + rectangle.width)
}

let animationId
function animate(){
  animationId= requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  // Win condition
  if (pellets.length === 0){
    cancelAnimationFrame(animationId)
  }

// Pac-Man and boundary collision detection 
  if (keys.ArrowUp.pressed && lastKey === 'ArrowUp'){
    for (let i=0; i<boundaries.length; i++){
      const boundary= boundaries[i]
      if (
        pacManCollision({
          circle: {...player, velocity: {
            x: 0,
            y: -5
          }},
          rectangle: boundary
        })
      ) {
        player.velocity.y= 0
        break
      } else{
        player.velocity.y= -5
      }
    }
    
    
  } else if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft'){
    for (let i=0; i<boundaries.length; i++){
      const boundary= boundaries[i]
      if (
        pacManCollision({
          circle: {...player, velocity: {
            x: -5,
            y: 0
          }},
          rectangle: boundary
        })
      ) {
        player.velocity.x= 0
        break
      } else{
        player.velocity.x= -5
      }
    }
  } else if (keys.ArrowDown.pressed && lastKey === 'ArrowDown'){
    for (let i=0; i<boundaries.length; i++){
      const boundary= boundaries[i]
      if (
        pacManCollision({
          circle: {...player, velocity: {
            x: 0,
            y: 5
          }},
          rectangle: boundary
        })
      ) {
        player.velocity.y= 0
        break
      } else{
        player.velocity.y= 5
      }
    }
  } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight'){
    for (let i=0; i<boundaries.length; i++){
      const boundary= boundaries[i]
      if (
        pacManCollision({
          circle: {...player, velocity: {
            x: 5,
            y: 0
          }},
          rectangle: boundary
        })
      ) {
        player.velocity.x= 0
        break
      } else{
        player.velocity.x= 5
      }
    }
  }

  for (let i= pellets.length-1; 0 < i; i--){
    const pellet= pellets[i]
    pellet.draw()

    if (Math.hypot(pellet.position.x - player.position.x, 
        pellet.position.y - player.position.y) < pellet.radius + player.radius){
        pellets.splice(i, 1)
        score += 10
        scoreEl.innerHTML= score
      }
  }


  boundaries.forEach((boundary)=> {
    boundary.draw()

    if (
      pacManCollision({
        circle: player,
        rectangle: boundary
      })
    ){
        player.velocity.x= 0
        player.velocity.y= 0
      }
  })
  player.update()
  
  if (player.velocity.x > 0) player.rotation= 0 
  else if (player.velocity.x < 0) player.rotation= Math.PI
  else if (player.velocity.y > 0) player.rotation= Math.PI / 2
  else if (player.velocity.y < 0) player.rotation= Math.PI * 1.5

}
animate()

// Detecting if button key is pushed down
window.addEventListener('keydown', ({key})=> {
  switch (key){
    case 'ArrowUp':
      keys.ArrowUp.pressed= true
      lastKey= 'ArrowUp'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed= true
      lastKey= 'ArrowLeft'
      break
    case 'ArrowDown':
      keys.ArrowDown.pressed= true
      lastKey= 'ArrowDown'
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed= true
      lastKey= 'ArrowRight'
      break
  }
})

// Detecting if button key is not pushed
window.addEventListener('keyup', ({key})=> {
  switch (key){
    case 'ArrowUp':
      keys.ArrowUp.pressed= false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed= false
      break
    case 'ArrowDown':
      keys.ArrowDown.pressed= false
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed= false
      break
  }
})