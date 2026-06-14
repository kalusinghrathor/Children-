const lessons = {
  "Math": {
    title: "Math — Mazedaar Numbers",
    body: `<p>Chalo number game khelein! 1 + 1 = 2. Shapes: circle, square, triangle. Try to draw a triangle!</p>`
  },
  "Science": {
    title: "Science — Chhote Experiments",
    body: `<p>Plant paani se badhta hai. Try: plant a seed in a cup, and watch it sprout.</p>`
  },
  "English": {
    title: "English — Short Story",
    body: `<p>Once upon a time... A little rabbit who loved to read. Try reading a 1-page story today!</p>`
  },
  "Art": {
    title: "Art — Rang aur Drawing",
    body: `<p>Colors se picture banao. Use only 3 colors and create a simple sun.</p>`
  },
  "Geography": {
    title: "Geography — Duniya ke Fun Facts",
    body: `<p>Earth ek sphere hai. The tallest mountain is Mount Everest. Point to your city on a map!</p>`
  },
  "Fun Quiz": {
    title: "Fun Quiz — Test Your Brain",
    body: `<p>Q: What comes after 4? A: 5. Q: Which color is a banana? A: Yellow.</p>`
  }
};

const startBtns = document.querySelectorAll('.startBtn');
const modal = document.getElementById('lessonModal');
const lessonTitle = document.getElementById('lessonTitle');
const lessonBody = document.getElementById('lessonBody');
const closeBtn = document.querySelector('.modal .close');
const completeBtn = document.getElementById('completeBtn');
const nextBtn = document.getElementById('nextBtn');
const confettiRoot = document.getElementById('confetti');
const completeCountEl = document.getElementById('completeCount');
const totalCountEl = document.getElementById('totalCount');

let completed = JSON.parse(localStorage.getItem('funstudy_completed') || '[]');

function updateCounts(){
  completeCountEl.textContent = completed.length;
  totalCountEl.textContent = Object.keys(lessons).length;
}

updateCounts();

startBtns.forEach(btn => {
  btn.addEventListener('click', () => openLesson(btn.dataset.subject));
});

// keyboard focus: allow Enter on card
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') {
      const subj = card.dataset.subject;
      if(subj) openLesson(subj);
    }
  });
});

function openLesson(subject){
  const data = lessons[subject] || {title:subject, body:'Short lesson coming soon.'};
  lessonTitle.textContent = data.title;
  lessonBody.innerHTML = data.body;
  modal.hidden = false;
  modal.querySelector('.close').focus();
  modal.setAttribute('data-subject', subject);
  // trap focus simply:
  document.body.style.overflow = 'hidden';
}

function closeLesson(){
  modal.hidden = true;
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeLesson);
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && !modal.hidden) closeLesson();
});

completeBtn.addEventListener('click', ()=>{
  const subj = modal.getAttribute('data-subject');
  if(!completed.includes(subj)){
    completed.push(subj);
    localStorage.setItem('funstudy_completed', JSON.stringify(completed));
    celebrate();
    updateCounts();
  }
});

nextBtn.addEventListener('click', ()=>{
  // simple next subject rotation
  const subjects = Object.keys(lessons);
  const cur = modal.getAttribute('data-subject');
  const idx = subjects.indexOf(cur);
  const next = subjects[(idx + 1) % subjects.length];
  openLesson(next);
});

// Confetti: quick simple particles
function celebrate(){
  for (let i=0;i<30;i++){
    const el = document.createElement('div');
    el.className = 'conf';
    const size = Math.random()*12 + 6;
    el.style.position='absolute';
    el.style.left = (Math.random()*100) + '%';
    el.style.top = '-10%';
    el.style.width = size+'px';
    el.style.height = size+'px';
    el.style.background = randomColor();
    el.style.borderRadius = (Math.random()>0.5?'4px':'50%');
    el.style.opacity = 0.95;
    el.style.transform = `translateY(0) rotate(${Math.random()*360}deg)`;
    el.style.transition = `transform 2.2s cubic-bezier(.17,.67,.33,1), top 2.2s linear, opacity 0.9s`;
    confettiRoot.appendChild(el);
    // animate
    requestAnimationFrame(()=>{
      el.style.top = (60 + Math.random()*30) + '%';
      el.style.transform = `translateY(400px) rotate(${Math.random()*720}deg)`;
      el.style.opacity = 0;
    });
    setTimeout(()=> el.remove(), 2600);
  }
}
function randomColor(){
  const colors = ['#FFD166','#06D6A0','#118AB2','#EF476F','#9B5DE5','#FFB4A2'];
  return colors[Math.floor(Math.random()*colors.length)];
}

// on load: mark completed cards visually
function refreshUI(){
  document.querySelectorAll('.card').forEach(card=>{
    const subj = card.dataset.subject;
    if(completed.includes(subj)){
      card.style.opacity = 0.86;
      if(!card.querySelector('.done')){
        const d = document.createElement('div');
        d.className='done';
        d.textContent = '✓ Done';
        d.style.marginTop='8px';
        d.style.color='var(--success)';
        d.style.fontWeight='700';
        card.appendChild(d);
      }
    }
  });
}
refreshUI();
updateCounts();

// observe completed changes to update UI
window.addEventListener('storage', ()=>{
  completed = JSON.parse(localStorage.getItem('funstudy_completed') || '[]');
  updateCounts();
  refreshUI();
});
