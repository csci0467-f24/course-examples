const boids = [];
const NUM_BOIDS = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < NUM_BOIDS; i++) {
    boids.push(new Boid(random(width), random(height), 5, 0.3));
  }
}

function draw() {
  background(255);

  // if (mouseIsPressed) {
  //   boids[0].flee(createVector(mouseX, mouseY));
  // } else {
  //   boids[0].seek(createVector(mouseX, mouseY));
  // }

  // apply forces
  boids.forEach((boid, index) => {
    const neighbours = getNeighbours(boid, boids, 200);
    boid.flock(neighbours);
  });

  // update positions and velocities and draw
  boids.forEach((boid) => {
    boid.update();
    boid.draw();
  });
}

function getNeighbours(boid, boids, radius) {
  return boids.filter((other) => {
    let d = p5.Vector.dist(boid.position, other.position);
    if (d < radius){
      return true;
    }

    if (boid.position.x + radius > width && other.position.x < radius) {
      d = p5.Vector.dist(boid.position, createVector(other.position.x + width, other.position.y));
      if (d < radius){
        return true;
      }
    }else if (boid.position.x < radius && other.position.x + radius > width) {
      d = p5.Vector.dist(boid.position, createVector(other.position.x - width, other.position.y));
      if (d < radius){
        return true;
      }
    }else if (boid.position.y + radius > height && other.position.y < radius) {
      d = p5.Vector.dist(boid.position, createVector(other.position.x, other.position.y + height));
      if (d < radius){
        return true;
      }
    } else if (boid.position.y < radius && other.position.y + radius > height) {
      d = p5.Vector.dist(boid.position, createVector(other.position.x, other.position.y - height));
      if (d < radius){
        return true;
      }
    }
  });
}

class Boid {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxForce = maxForce;
    this.maxSpeed = maxSpeed;

    this.color = color(200);
  }

  seek(target) {
    // figure out where we want to head
    const desired = p5.Vector.sub(target, this.position);

    // correct for wrapping
    if (abs(desired.x) > width / 2) {
      desired.x += desired.x > 0 ? -width : width;
    }
    if (abs(desired.y) > height / 2) {
      desired.y += desired.y > 0 ? -height : height;
    }

    const speed = constrain(
      map(desired.magSq(), 0, 10000, 0, this.maxSpeed),
      0,
      this.maxSpeed
    );

    desired.normalize();
    desired.mult(speed);

    const steeringForce = p5.Vector.sub(desired, this.velocity);
    steeringForce.limit(this.maxForce);
    this.applyForce(steeringForce);
  }

  flee(target) {
    // figure out where we want to head
    const desired = p5.Vector.sub(this.position, target);

    // correct for wrapping
    if (abs(desired.x) > width / 2) {
      desired.x += desired.x > 0 ? -width : width;
    }
    if (abs(desired.y) > height / 2) {
      desired.y += desired.y > 0 ? -height : height;
    }

    if (desired.magSq() < 10000) {
      desired.normalize();
      desired.mult(this.maxSpeed);

      const steeringForce = p5.Vector.sub(desired, this.velocity);
      this.applyForce(steeringForce);
    }
  }


  align(neighbours) {
    const steeringForce = createVector(0, 0);
    neighbours.forEach((neighbour) => {
      steeringForce.add(neighbour.velocity);
    });

    if (neighbours.length > 0) {
      steeringForce.div(neighbours.length);
      steeringForce.setMag(this.maxSpeed);
      steeringForce.sub(this.velocity);
      steeringForce.limit(this.maxForce);
    }

    return steeringForce;
  }

  cohesion(neighbours) {
    const steeringForce = createVector(0, 0);
    neighbours.forEach((neighbour) => {
      steeringForce.add(neighbour.position);
    });

    if (neighbours.length > 0) {
      steeringForce.div(neighbours.length);
      steeringForce.sub(this.position);
      steeringForce.setMag(this.maxSpeed);
      steeringForce.sub(this.velocity);
      steeringForce.limit(this.maxForce);
    }

    return steeringForce;
  }

  separation(neighbours) {
    const steeringForce = createVector(0, 0);
    neighbours.forEach((neighbour) => {
      const diff = p5.Vector.sub(this.position, neighbour.position);
      const d = diff.mag();
      diff.div(max(d, 0.0001));
      steeringForce.add(diff);
    });

    if (neighbours.length > 0) {
      steeringForce.div(neighbours.length);
      steeringForce.setMag(this.maxSpeed);
      steeringForce.sub(this.velocity);
      steeringForce.limit(this.maxForce);
    }

    return steeringForce;
  }

  flock(neighbours) {
    const alignment = this.align(neighbours);
    const cohesion = this.cohesion(neighbours);
    const separation = this.separation(neighbours);

    this.applyForce(alignment);
    this.applyForce(cohesion);
    this.applyForce(separation);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  /**
   * Update the position and wrap around if we go off the canvas
   */
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    if (this.position.x > width) {
      this.position.x -= width;
    }
    if (this.position.x < 0) {
      this.position.x += width;
    }

    if (this.position.y > height) {
      this.position.y -= height;
    }
    if (this.position.y < 0) {
      this.position.y += height;
    }
  }

  /**
   * Draw the boid
   */
  draw() {
    stroke(0);
    fill(this.color);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    triangle(-10, -5, -10, 5, 0, 0);
    pop();
  }
}
