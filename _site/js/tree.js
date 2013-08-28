function lerp(a, b, p) {
	return (b - a) * p + a;
}

VerletJS.prototype.tree = function(origin, depth, branchLength, segmentCoef, theta) {

	var lineCoef = 0.7;
	this.origin = origin;
	this.base = new Particle(origin);
	this.root = new Particle(origin.add(new Vec2(0, 10)));

	var composite = new this.Composite();
	composite.particles.push(this.base);
	composite.particles.push(this.root);
	composite.pin(0);
	composite.pin(1);

	var branch = function(parent, i, nMax, coef, normal) {
		var particle = new Particle(parent.pos.add(normal.scale(branchLength * coef)));
		composite.particles.push(particle);

		var dc = new DistanceConstraint(parent, particle, lineCoef);
		dc.p = i / nMax;
		// a hint for drawing
		composite.constraints.push(dc);

		particle.leaf = !(i < nMax);

		if (i < nMax) {
			var a = branch(particle, i + 1, nMax, coef * coef, normal.rotate(new Vec2(0, 0), -theta));
			var b = branch(particle, i + 1, nMax, coef * coef, normal.rotate(new Vec2(0, 0), theta));

			var jointStrength = lerp(0.7, 0, i / nMax);
			composite.constraints.push(new AngleConstraint(parent, particle, a, jointStrength));
			composite.constraints.push(new AngleConstraint(parent, particle, b, jointStrength));
		}

		return particle;
	}
	var firstBranch = branch(this.base, 0, depth, segmentCoef, new Vec2(0, -1));

	composite.constraints.push(new AngleConstraint(this.root, this.base, firstBranch, 1));

	// animates the tree at the beginning
	var noise = 10;
	var i;
	for ( i = 0; i < composite.particles.length; ++i)
		composite.particles[i].pos.mutableAdd(new Vec2(Math.floor(Math.random() * noise, Math.floor(Math.random() * noise))));

	this.composites.push(composite);
	return composite;
}

window.onload = function() {
	var canvas = document.getElementById("scratch");

	// canvas dimensions
	var width = parseInt(canvas.style.width);
	var height = parseInt(canvas.style.height);

	// retina
	var dpr = window.devicePixelRatio || 1;
	canvas.width = width * dpr;
	canvas.height = height * dpr;
	canvas.getContext("2d").scale(dpr, dpr);

	// simulation
	var sim = new VerletJS(width, height, canvas);
	sim.gravity = new Vec2(0, 0);
	sim.friction = 0.98;

	// entities
	var tree1 = sim.tree(new Vec2(width / 2, height), 5, 60, 0.95, (Math.PI / 2) / 3 / 2);

	// animation loop
	var loop = function() {
		sim.frame(16);
		sim.draw();
		requestAnimFrame(loop);
	};

	loop();
};
