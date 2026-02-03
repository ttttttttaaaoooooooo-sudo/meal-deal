// ==========================================
// Title: MEAL DEAL - GENERATIVE SYNTHESIS
// Logic: Select 3 Modules (Rule A + Rule B + Element 1)
// ==========================================

// 当前的“套餐”配置
let currentMeal = {
  A: null, // Rule A (Physics)
  B: null, // Rule B (Structure)
  C: null  // Element 1 (Texture)
};

// 存储实例化后的图层对象
let activeLayers = {
  A: null,
  B: null,
  C: null
};

let font;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textFont('Courier New');
  background(0);
  
  // 默认套餐 (初始状态可以为空，或者预设一组)
  // 这里我们预设一组好看的，让用户一进来不至于黑屏
  selectItem('A', 10); // Nebula
  selectItem('B', 7);  // Radial
  selectItem('C', 1);  // Harmonics
}

function draw() {
  background(0); // 每帧清空背景
  
  // 渲染顺序：
  // Rule A (最底层，物理运动) -> Rule B (中间层，结构) -> Element 1 (最顶层，装饰)
  
  // 1. Render Rule A (Base Layer)
  if (activeLayers.A) {
    push();
    activeLayers.A.update();
    activeLayers.A.display(1.0); // 100% 不透明度
    pop();
  }

  // 2. Render Rule B (Mid Layer)
  if (activeLayers.B) {
    push();
    activeLayers.B.update();
    // 稍微降低一点 Rule B 的干扰，让 A 清晰
    activeLayers.B.display(0.8); 
    pop();
  }

  // 3. Render Element 1 (Top Layer)
  if (activeLayers.C) {
    push();
    // 使用 ADD 混合模式，让装饰层发光叠加
    blendMode(ADD);
    activeLayers.C.update();
    activeLayers.C.display(0.9);
    blendMode(BLEND);
    pop();
  }
  
  drawUI();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ==========================================
// 交互逻辑 (Interaction Logic)
// ==========================================

// category: 'A', 'B', 'C'
// id: 0-10 (Module Index)
window.selectItem = function(category, id) {
  // 1. 更新数据
  currentMeal[category] = id;
  
  // 2. 实例化图层
  let newLayer = createLayerById(id);
  activeLayers[category] = newLayer;
  
  // 3. 更新 UI 视觉状态
  updateUIState(category, id, newLayer.name);
}

function updateUIState(category, id, name) {
  // 清除该列所有的 selected 样式
  // 这一步需要在 HTML 结构配合下查找，简单起见我们重新渲染按钮样式或只更新 Slot
  
  // 更新所有的 option-btn 样式
  // 这需要遍历 DOM，稍微复杂一点，但为了效果我们做一个简单的 DOM 操作
  let buttons = document.querySelectorAll('.option-btn');
  buttons.forEach(btn => {
    // 简单的检查：如果按钮的 onclick 包含这个 id，就设为 selected
    // 注意：这里需要更严谨的逻辑区分不同列的相同 ID（虽然目前没有重复 ID）
    let clickStr = btn.getAttribute('onclick');
    if (clickStr.includes(`'${category}', ${id}`)) {
      // 移除同组其他的 selected
      let parent = btn.parentElement;
      parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    }
  });

  // 更新底部的 Slot 显示
  let slot = document.getElementById(`slot-${category}`);
  slot.classList.add('filled');
  slot.querySelector('.content').innerText = name;
}

function createLayerById(id) {
  let layer;
  switch(id) {
    case 0: layer = new LayerSwarm(); break;
    case 1: layer = new LayerHarmonics(); break;
    case 2: layer = new LayerOrbital(); break;
    case 3: layer = new LayerTriMesh(); break;
    case 4: layer = new LayerBlueprint(); break;
    case 5: layer = new LayerSlitScan(); break;
    case 6: layer = new LayerGridRunner(); break;
    case 7: layer = new LayerRadial(); break;
    case 8: layer = new LayerBinary(); break;
    case 9: layer = new LayerNoise(); break;
    case 10: layer = new LayerNebula(); break;
  }
  layer.name = getModeName(id);
  return layer;
}

function getModeName(idx) {
  let names = ["SWARM", "HARMONICS", "ORBITAL", "TRI_MESH", "BLUEPRINT", "SLIT_SCAN", "GRID_RUN", "RADIAL", "BINARY", "NOISE", "NEBULA"];
  return names[idx];
}

function drawUI() {
  fill(255); noStroke(); textAlign(RIGHT, TOP); textSize(12);
  let info = "MEAL_DEAL_PROTOCOL // V1.0";
  text(info, width-20, 20);
  
  textAlign(RIGHT, BOTTOM);
  text("Tao_processing", width-20, height-20);
}

// ============================================================
// VISUAL ENGINES (ALL 11 MODES - REFINED VERSIONS)
// ============================================================

// --- RULE A (PHYSICS) ---

// 00. SWARM
class LayerSwarm {
  constructor() {
    this.particles = [];
    for(let i=0; i<800; i++) this.particles.push(this.createP());
  }
  createP() {
    return {
      pos: createVector(width/2, height/2),
      prev: createVector(width/2, height/2),
      vel: p5.Vector.random2D().mult(random(2,10)),
      acc: createVector(0,0)
    };
  }
  update() {
    for(let p of this.particles) {
      let angle = noise(p.pos.x*0.01, p.pos.y*0.01, frameCount*0.01)*TWO_PI*4;
      p.acc.add(p5.Vector.fromAngle(angle).mult(0.5));
      p.vel.add(p.acc); p.vel.mult(0.95);
      p.prev = p.pos.copy(); p.pos.add(p.vel); p.acc.mult(0);
      if(p.pos.x<0||p.pos.x>width) { p.vel.x*=-1; p.pos.x=constrain(p.pos.x,0,width); }
      if(p.pos.y<0||p.pos.y>height) { p.vel.y*=-1; p.pos.y=constrain(p.pos.y,0,height); }
    }
  }
  display(alphaMult) {
    stroke(255, 100 * alphaMult); strokeWeight(1);
    for(let p of this.particles) line(p.pos.x, p.pos.y, p.prev.x, p.prev.y);
  }
}

// 02. ORBITAL
class LayerOrbital {
  constructor() {
    this.agents = [];
    for(let i=0; i<600; i++) this.agents.push(this.create());
  }
  create() {
    let angle = floor(random(8)) * (PI/4);
    return {
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.fromAngle(angle).mult(random(1, 4)),
      hist: [], maxHist: random(20, 50)
    };
  }
  update() {
    for(let a of this.agents) {
      a.pos.add(a.vel);
      if(a.pos.x<0) { a.pos.x=width; a.hist=[]; }
      if(a.pos.x>width) { a.pos.x=0; a.hist=[]; }
      if(a.pos.y<0) { a.pos.y=height; a.hist=[]; }
      if(a.pos.y>height) { a.pos.y=0; a.hist=[]; }
      a.hist.push(a.pos.copy());
      if(a.hist.length > a.maxHist) a.hist.shift();
    }
  }
  display(alphaMult) {
    noFill(); strokeWeight(0.5);
    for(let a of this.agents) {
      if(a.hist.length < 2) continue;
      stroke(255, 150 * alphaMult);
      beginShape(); for(let v of a.hist) vertex(v.x, v.y); endShape();
      stroke(255, 200 * alphaMult); point(a.pos.x, a.pos.y);
    }
  }
}

// 06. GRID_RUN
class LayerGridRunner {
  constructor() {
    this.bots = [];
    for(let i=0; i<500; i++) this.bots.push({
      pos: createVector(floor(random(width/40))*40, floor(random(height/40))*40),
      target: createVector(0,0), speed: 0.2, moving: false
    });
  }
  update() {
    for(let b of this.bots) {
      if(!b.moving) {
        b.target = b.pos.copy();
        let dir = floor(random(4));
        if(dir===0) b.target.x+=40; else if(dir===1) b.target.x-=40;
        else if(dir===2) b.target.y+=40; else b.target.y-=40;
        b.moving = true;
      }
      b.pos.lerp(b.target, b.speed);
      if(b.pos.dist(b.target) < 1) { b.pos=b.target.copy(); b.moving=false; }
      if(b.pos.x<0) b.pos.x=width; if(b.pos.x>width) b.pos.x=0;
    }
  }
  display(alphaMult) {
    stroke(255, 200 * alphaMult); strokeWeight(2);
    for(let b of this.bots) point(b.pos.x, b.pos.y);
  }
}

// 10. NEBULA
class LayerNebula {
  constructor() {
    this.particles = [];
    for(let i=0; i<350; i++) this.particles.push({
      pos: createVector(random(width), random(height)),
      noiseOffset: createVector(random(1000), random(1000))
    });
  }
  update() {
    for(let p of this.particles) {
      let nX = noise(p.noiseOffset.x + frameCount * 0.003);
      let nY = noise(p.noiseOffset.y + frameCount * 0.003);
      let vel = createVector(map(nX, 0, 1, -1.5, 1.5), map(nY, 0, 1, -1.5, 1.5));
      p.pos.add(vel);
      if(p.pos.x < 0) p.pos.x = width; else if(p.pos.x > width) p.pos.x = 0;
      if(p.pos.y < 0) p.pos.y = height; else if(p.pos.y > height) p.pos.y = 0;
    }
  }
  display(alphaMult) {
    strokeWeight(0.5);
    for(let i=0; i<this.particles.length; i++) {
      let a = this.particles[i];
      for(let j=i+1; j<this.particles.length; j++) {
        let b = this.particles[j];
        let d = p5.Vector.dist(a.pos, b.pos);
        if(d < 60) {
          stroke(255, map(d, 0, 60, 180, 20) * alphaMult);
          line(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
        }
      }
    }
    stroke(255, 200 * alphaMult); strokeWeight(1); let size = 3;
    for(let p of this.particles) {
      line(p.pos.x - size, p.pos.y, p.pos.x + size, p.pos.y);
      line(p.pos.x, p.pos.y - size, p.pos.x, p.pos.y + size);
    }
  }
}

// --- RULE B (STRUCTURE) ---

// 05. SLIT_SCAN
class LayerSlitScan {
  constructor() {
    this.scanners = [];
    for(let i=0; i<15; i++) {
      this.scanners.push({
        y: random(height), 
        speed: random(0.5, 3) * (random(1)<0.5?1:-1),
        type: random(1)<0.5 ? 'H' : 'V', pos: random(width)
      });
    }
    this.dust = [];
  }
  update() {
    for(let s of this.scanners) {
      if(s.type === 'H') {
        s.y += s.speed;
        if(s.y > height) s.y = 0; if(s.y < 0) s.y = height;
        if(random(1)<0.2) this.dust.push({x: random(width), y: s.y + random(-10,10), life: 255});
      } else {
        s.pos += s.speed;
        if(s.pos > width) s.pos = 0; if(s.pos < 0) s.pos = width;
        if(random(1)<0.2) this.dust.push({x: s.pos + random(-10,10), y: random(height), life: 255});
      }
    }
    for(let i=this.dust.length-1; i>=0; i--) {
      this.dust[i].life -= 5;
      if(this.dust[i].life <= 0) this.dust.splice(i,1);
    }
  }
  display(alphaMult) {
    strokeWeight(1);
    for(let s of this.scanners) {
      stroke(255, 100 * alphaMult);
      if(s.type === 'H') line(0, s.y, width, s.y);
      else line(s.pos, 0, s.pos, height);
    }
    strokeWeight(1.5);
    for(let d of this.dust) {
      stroke(255, d.life * alphaMult);
      point(d.x, d.y);
    }
  }
}

// 04. BLUEPRINT
class LayerBlueprint {
  constructor() {
    this.cons = []; this.traces = [];
    for(let i=0; i<20; i++) this.cons.push(this.createC());
  }
  createC() { return { pos: createVector(random(width), random(height)), prev: createVector(0,0), vel: this.pickVel() }; }
  pickVel() { return (random(1)<0.5) ? createVector(random([-3,3]),0) : createVector(0, random([-3,3])); }
  update() {
    for(let c of this.cons) {
      c.prev = c.pos.copy(); c.pos.add(c.vel);
      if(c.pos.x<0) c.pos.x=width; if(c.pos.x>width) c.pos.x=0;
      if(c.pos.y<0) c.pos.y=height; if(c.pos.y>height) c.pos.y=0;
      if(p5.Vector.dist(c.pos, c.prev) < 10) this.traces.push({p1:c.prev.copy(), p2:c.pos.copy(), life:255});
      if(random(1)<0.05) c.vel = this.pickVel();
    }
    for(let i=this.traces.length-1; i>=0; i--) {
      this.traces[i].life -= 5;
      if(this.traces[i].life<=0) this.traces.splice(i,1);
    }
  }
  display(alphaMult) {
    strokeWeight(1);
    for(let t of this.traces) {
      stroke(255, t.life * alphaMult);
      line(t.p1.x, t.p1.y, t.p2.x, t.p2.y);
    }
  }
}

// 07. RADIAL (KINETIC SQUARES)
class LayerRadial {
  constructor() {
    this.particles = [];
    for(let i=0; i<800; i++) {
      this.particles.push({
        pos: createVector(random(width), random(height)),
        vel: p5.Vector.random2D().mult(random(1, 3)),
        len: random(5, 15), thick: random(1, 3)
      });
    }
  }
  update() {
    for(let p of this.particles) {
      p.pos.add(p.vel);
      if(p.pos.x < 0) p.pos.x = width; if(p.pos.x > width) p.pos.x = 0;
      if(p.pos.y < 0) p.pos.y = height; if(p.pos.y > height) p.pos.y = 0;
    }
  }
  display(alphaMult) {
    noStroke(); fill(255, 180 * alphaMult);
    for(let p of this.particles) {
      push(); translate(p.pos.x, p.pos.y); rotate(p.vel.heading());
      rect(0, 0, p.len, p.thick); pop();
    }
  }
}

// 08. BINARY
class LayerBinary {
  constructor() {
    this.streams = [];
    for(let i=0; i<50; i++) this.streams.push({
      x: floor(random(width/15))*15, y: random(-height, 0),
      speed: random(3,8), chars: Array(15).fill(0).map(()=>round(random(1)))
    });
  }
  update() {
    for(let s of this.streams) {
      s.y += s.speed;
      if(s.y > height) s.y = random(-500, -100);
      if(frameCount%5===0) { s.chars.pop(); s.chars.unshift(round(random(1))); }
    }
  }
  display(alphaMult) {
    fill(255, 200 * alphaMult); noStroke(); textSize(10);
    for(let s of this.streams) {
      for(let i=0; i<s.chars.length; i++) text(s.chars[i], s.x, s.y - i*12);
    }
  }
}

// --- ELEMENT 1 (TEXTURE) ---

// 01. HARMONICS (DATA SILK)
class LayerHarmonics {
  constructor() {
    this.lines = [];
    for(let i=0; i<20; i++) {
      this.lines.push({
        baseY: map(i, 0, 20, height*0.1, height*0.9),
        amp: random(30, 120), phase: random(TWO_PI),
        speed: random(0.002, 0.01), noiseScale: random(0.002, 0.005), density: 3
      });
    }
  }
  update() { }
  display(alphaMult) {
    noFill();
    for(let l of this.lines) {
      l.phase += l.speed;
      strokeWeight(1); stroke(255, 160 * alphaMult);
      beginShape(POINTS);
      for(let x = 0; x <= width; x += l.density) {
        let n = noise(x * l.noiseScale, frameCount * 0.005 + l.phase);
        let y = l.baseY + sin(x * 0.01 + l.phase) * (l.amp * n);
        let fade = 1.0;
        if(x < 100) fade = map(x, 0, 100, 0, 1);
        if(x > width-100) fade = map(x, width-100, width, 1, 0);
        stroke(255, 180 * alphaMult * fade);
        vertex(x, y);
        if (random(1) < 0.001) {
           strokeWeight(2); stroke(255, 255*alphaMult);
           point(x, y);
           strokeWeight(1); stroke(255, 160*alphaMult*fade);
        }
      }
      endShape();
    }
  }
}

// 03. TRI_MESH
class LayerTriMesh {
  constructor() {
    this.nodes = [];
    for(let i=0; i<400; i++) this.nodes.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(0.3)
    });
  }
  update() {
    for(let n of this.nodes) {
      n.pos.add(n.vel);
      if(n.pos.x<0||n.pos.x>width) n.vel.x*=-1;
      if(n.pos.y<0||n.pos.y>height) n.vel.y*=-1;
    }
  }
  display(alphaMult) {
    strokeWeight(0.2);
    for(let i=0; i<this.nodes.length; i++) {
      let a = this.nodes[i];
      for(let j=i+1; j<this.nodes.length; j++) {
        let b = this.nodes[j];
        if (abs(a.pos.x - b.pos.x) > 60 || abs(a.pos.y - b.pos.y) > 60) continue;
        let d = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
        if(d < 60) {
          stroke(255, map(d,0,60,180,0) * alphaMult);
          line(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
        }
      }
    }
    strokeWeight(1.5); stroke(255, 150 * alphaMult);
    for(let n of this.nodes) point(n.pos.x, n.pos.y);
  }
}

// 09. NOISE (STAR FIELD)
class LayerNoise {
  constructor() {
    this.dots = [];
    for(let i=0; i<3000; i++) {
      this.dots.push({ x: random(width), y: random(height), offset: random(1000) });
    }
  }
  update() { }
  display(alphaMult) {
    strokeWeight(1);
    for(let d of this.dots) {
      let flicker = noise(d.offset + frameCount * 0.05);
      stroke(255, map(flicker, 0, 1, 50, 255) * alphaMult);
      point(d.x, d.y);
    }
  }
}