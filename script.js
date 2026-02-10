// FitForge premium interactions: hero entrance, gallery modal & flip, BMI counter, FAQ, quotes, chart animation, progress bars
document.addEventListener('DOMContentLoaded', ()=>{
  // Hero entrance animation
  const hero = document.querySelector('.hero-content');
  if(hero) setTimeout(()=>hero.classList.add('enter'),120);

  // Animate progress bars on viewport entry
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && entry.target.classList.contains('day-card')){
        const progress = entry.target.dataset.progress;
        const bar = entry.target.querySelector('.progress-bar');
        if(bar){ setTimeout(()=>{ bar.style.width = progress + '%'; }, 50); }
      }
    });
  }, {threshold:0.5});
  document.querySelectorAll('.day-card').forEach(el=>observer.observe(el));

  // Gallery modal & flip animation
  const modal = document.getElementById('mediaModal');
  const modalMedia = document.getElementById('modalMedia');
  const modalTitle = document.getElementById('modalTitle');
  const modalMuscle = document.getElementById('modalMuscle');
  const modalTip = document.getElementById('modalTip');
  const modalClose = document.getElementById('modalClose');
  
  document.querySelectorAll('.gallery-card').forEach(card=>{
    // Click to flip or open modal
    card.addEventListener('click', ()=>{
      const bg = card.querySelector('.thumb').style.backgroundImage.replace(/url\(|\)|"/g,'');
      const safe = encodeURI(bg);
      modalMedia.style.backgroundImage = `url("${safe}")`;
      modalTitle.textContent = card.dataset.title || '';
      modalMuscle.textContent = card.dataset.muscle || '';
      modalTip.textContent = card.dataset.tip || '';
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden','false');
    });
  });
  
  modalClose.addEventListener('click', ()=>{ 
    modal.classList.add('hidden'); 
    modal.setAttribute('aria-hidden','true'); 
  });
  
  modal.addEventListener('click', (e)=>{ 
    if(e.target===modal) { 
      modal.classList.add('hidden'); 
      modal.setAttribute('aria-hidden','true'); 
    } 
  });

  // BMI Calculator with counter animation
  const bmiForm = document.getElementById('bmiForm');
  const bmiValueEl = document.querySelector('.bmi-value');
  const bmiCatEl = document.querySelector('.bmi-category');
  const bmiAdviceEl = document.querySelector('.bmi-advice');
  const suggestionsDiv = document.getElementById('bmiSuggestions');
  const suggestionsGrid = document.getElementById('suggestionsGrid');

  // Suggestion data based on BMI category
  const suggestions = {
    'Underweight': [
      {title: 'Protein Shakes', image: 'images/protein shake png.jpg', desc: 'High-calorie protein drinks'},
      {title: 'Weight Gain Foods', image: 'images/Nut PNG.png', desc: 'Nuts, avocado, oils'},
      {title: 'Strength Training', image: 'images/deadlift png.png', desc: 'Build muscle mass gradually'}
    ],
    'Normal': [
      {title: 'Balanced Meals', image: 'images/salad png.jpg', desc: 'Maintain current diet'},
      {title: 'Mixed Cardio', image: 'images/running.jpeg', desc: '150 min/week moderate activity'},
      {title: 'Consistency', image: 'images/walking.png', desc: 'Keep up your routine'}
    ],
    'Overweight': [
      {title: 'Fat Loss Diet', image: 'images/salad png.jpg', desc: '300-500 kcal deficit'},
      {title: 'Cardio & HIIT', image: 'images/running.jpeg', desc: '20-30 min sessions'},
      {title: 'Strength Train', image: 'images/deadlift png.png', desc: '3-4 times per week'}
    ],
    'Obese': [
      {title: 'Low Impact Cardio', image: 'images/walking.png', desc: 'Start with walking/swimming'},
      {title: 'Medical Consult', image: 'images/meal plan.png', desc: 'Check with healthcare provider'},
      {title: 'Slow Deficit', image: 'images/meal plan.png', desc: 'Gradual calorie reduction'}
    ]
  };

  function categoryFor(bmi){ if(bmi<18.5) return 'Underweight'; if(bmi<25) return 'Normal'; if(bmi<30) return 'Overweight'; return 'Obese'; }
  function adviceFor(cat){ switch(cat){ case 'Underweight': return 'Increase calories with nutrient-dense foods and strength train.'; case 'Normal': return 'Maintain with balanced diet and mixed training.'; case 'Overweight': return 'Moderate deficit, prioritize protein and strength training.'; case 'Obese': return 'Start low-impact cardio and consult a provider.'; default: return ''; } }

  function animateCounter(el, from, to, duration=1200){ 
    const start = performance.now(); 
    function tick(now){ 
      const t = Math.min(1,(now-start)/duration); 
      const value = from + (to-from)*t; 
      el.textContent = value.toFixed(1); 
      if(t<1) requestAnimationFrame(tick); 
    } 
    requestAnimationFrame(tick); 
  }

  function displaySuggestions(category){
    const items = suggestions[category] || [];
    suggestionsGrid.innerHTML = items.map(item=>`
      <div class="suggestion-card">
        <img src="${item.image}" alt="${item.title}"/>
        <h5>${item.title}</h5>
        <p>${item.desc}</p>
      </div>
    `).join('');
    suggestionsDiv.classList.remove('hidden');
  }

  if(bmiForm){
    bmiForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const h = parseFloat(document.getElementById('height').value);
      const w = parseFloat(document.getElementById('weight').value);
      if(!h || !w){ alert('Enter valid height and weight'); return; }
      const m = h/100; const bmi = w/(m*m);
      animateCounter(bmiValueEl, 0, bmi, 1200);
      const cat = categoryFor(bmi);
      bmiCatEl.textContent = cat;
      bmiAdviceEl.textContent = adviceFor(cat);
      displaySuggestions(cat);
      try{ localStorage.setItem('lastBMI', JSON.stringify({bmi:bmi.toFixed(1),category:cat})); }catch(e){}
    });
    document.getElementById('bmiReset').addEventListener('click', ()=>{ 
      bmiForm.reset(); 
      bmiValueEl.textContent='—'; 
      bmiCatEl.textContent='Input values and press Calculate'; 
      bmiAdviceEl.textContent='';
      suggestionsDiv.classList.add('hidden');
    });
    try{ const last = JSON.parse(localStorage.getItem('lastBMI')); if(last){ bmiValueEl.textContent = last.bmi; bmiCatEl.textContent = last.category; displaySuggestions(last.category); } }catch(e){}
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item .faq-q').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.faq-item'); 
      item.classList.toggle('open');
    });
  });

  // Quotes slider
  const quotes = Array.from(document.querySelectorAll('.quote'));
  let qi=0; 
  function showQ(i){ quotes.forEach((q,idx)=>q.classList.toggle('active', idx===i)); }
  if(quotes.length){ 
    showQ(0); 
    setInterval(()=>{ qi=(qi+1)%quotes.length; showQ(qi); },5000); 
  }

  // Animate chart bars
  document.querySelectorAll('.bar-chart rect').forEach(rect=>{
    const h = parseFloat(rect.dataset.h)||0;
    const base = 100 - h; 
    rect.setAttribute('height', 0); 
    rect.setAttribute('y', 100);
    setTimeout(()=>{ rect.setAttribute('height', h); rect.setAttribute('y', base); }, 180);
  });

  // Contact form
  const contactForm = document.getElementById('contactForm'); 
  if(contactForm){ 
    contactForm.addEventListener('submit',(e)=>{ 
      e.preventDefault(); 
      alert('Thanks! We received your message.'); 
      contactForm.reset(); 
    }); 
  }
});

