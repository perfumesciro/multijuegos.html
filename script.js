
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const store={
  get(){try{return JSON.parse(localStorage.getItem('vitalia_v2'))||{}}catch{return {}}},
  save(){localStorage.setItem('vitalia_v2',JSON.stringify(data))}
};

let data=store.get();
data.profile=data.profile||null;
data.goals=data.goals||[];
data.done=data.done||[];
data.water=data.water||{};
data.events=data.events||{};
data.foods=data.foods||[];

const meals=[
{name:'Pollo con arroz y verduras',cat:'Principales',time:'Almuerzo',img:'photo-1512621776951-a57141f2eefd',desc:'Un plato completo y colorido.',ingredients:['Pechuga de pollo','Arroz','Brócoli y zanahoria','Aceite de oliva','Limón y especias'],steps:['Lavá y cortá las verduras en trozos parejos.','Cociná el arroz siguiendo las indicaciones del paquete.','Cociná el pollo en una sartén o plancha hasta que esté bien hecho en el centro.','Salteá las verduras hasta que estén tiernas pero firmes.','Serví todo junto y condimentá con limón y especias.']},
{name:'Ensalada de garbanzos',cat:'Económicos',time:'Almuerzo',img:'photo-1512621776951-a57141f2eefd',desc:'Fresca, práctica y con legumbres.',ingredients:['Garbanzos cocidos','Tomate','Pepino','Zanahoria','Limón y aceite'],steps:['Enjuagá y escurrí los garbanzos si son de lata.','Lavá y cortá las verduras en cubos pequeños.','Mezclá todo en un recipiente.','Condimentá con limón, aceite y hierbas.','Dejá reposar unos minutos en la heladera si la preferís fresca.']},
{name:'Tostadas con palta y huevo',cat:'Desayunos',time:'Desayuno',img:'photo-1525351484163-7529414344d8',desc:'Una opción sencilla para empezar el día.',ingredients:['Pan integral','Palta','Huevo','Limón','Pimienta'],steps:['Tostá el pan hasta que quede dorado.','Pisá la palta con unas gotas de limón.','Cociná el huevo a tu gusto, asegurándote de que quede bien cocido.','Untá la palta sobre el pan y agregá el huevo.','Terminá con pimienta si te gusta.']},
{name:'Pasta con salsa de tomate',cat:'Económicos',time:'Cena',img:'photo-1473093295043-cdd812d0e601',desc:'Una comida casera y fácil de adaptar.',ingredients:['Pasta','Tomates triturados','Cebolla','Ajo','Albahaca'],steps:['Poné agua a hervir y cociná la pasta según el paquete.','Picá la cebolla y el ajo.','Cocinalos en una sartén con un poco de aceite.','Agregá el tomate y cociná a fuego bajo unos minutos.','Mezclá la salsa con la pasta escurrida y sumá albahaca.']},
{name:'Avena con banana',cat:'Económicos',time:'Desayuno',img:'photo-1517673132405-a56a62b18caf',desc:'Desayuno tibio y fácil de preparar.',ingredients:['Avena','Leche o bebida vegetal','Banana','Canela'],steps:['Colocá la avena y la leche en una olla pequeña.','Calentá a fuego bajo revolviendo hasta que espese.','Pasá a un bowl.','Agregá banana en rodajas y canela.','Dejá entibiar antes de comer.']},
{name:'Tacos de porotos',cat:'Principales',time:'Cena',img:'photo-1551506807-7b0b3b7b6c9e',desc:'Una alternativa vegetal y rendidora.',ingredients:['Tortillas','Porotos cocidos','Tomate','Lechuga','Yogur natural o salsa'],steps:['Calentá los porotos en una sartén con pimentón suave.','Lavá y cortá el tomate y la lechuga.','Calentá las tortillas según el envase.','Repartí los porotos y las verduras.','Agregá un poco de yogur natural o salsa y serví.']},
{name:'Yogur con fruta y frutos secos',cat:'Desayunos',time:'Merienda',img:'photo-1488477181946-6428a0291777',desc:'Una merienda rápida y variada.',ingredients:['Yogur natural','Fruta de estación','Frutos secos picados'],steps:['Serví el yogur en un bowl.','Lavá y cortá la fruta.','Agregá la fruta sobre el yogur.','Sumá frutos secos picados por encima.','Mezclá y disfrutá.']},
{name:'Tortilla de verduras',cat:'Económicos',time:'Cena',img:'photo-1525351484163-7529414344d8',desc:'Ideal para aprovechar verduras.',ingredients:['Huevos','Zapallito','Cebolla','Morrón','Condimentos'],steps:['Lavá y cortá las verduras pequeñas.','Cocinalas en una sartén hasta que estén tiernas.','Batí los huevos en un bowl.','Mezclá los huevos con las verduras.','Volcá en sartén antiadherente y cociná de ambos lados hasta que esté bien cuajada.']},
{name:'Bowl de arroz y lentejas',cat:'Principales',time:'Almuerzo',img:'photo-1547592180-85f173990554',desc:'Legumbres y cereales en un mismo plato.',ingredients:['Arroz cocido','Lentejas cocidas','Zanahoria','Tomate','Limón'],steps:['Cociná el arroz y las lentejas por separado si no están cocidos.','Lavá y cortá las verduras.','Colocá el arroz en la base de un bowl.','Agregá lentejas y verduras.','Condimentá con limón y hierbas.']},
{name:'Sándwich de queso y tomate',cat:'Económicos',time:'Merienda',img:'photo-1528735602780-2552fd46c7af',desc:'Una opción simple para acompañar con fruta.',ingredients:['Pan','Queso','Tomate','Hojas verdes'],steps:['Lavá el tomate y las hojas verdes.','Cortá el tomate en rodajas.','Armá el sándwich con queso y vegetales.','Calentá en sartén o tostadora si lo preferís tibio.','Serví recién preparado.']},
{name:'Ensalada de pasta',cat:'Principales',time:'Almuerzo',img:'photo-1473093295043-cdd812d0e601',desc:'Se puede preparar con anticipación.',ingredients:['Pasta corta','Tomate','Choclo','Atún o garbanzos','Aceite y limón'],steps:['Cociná la pasta según el paquete y enfriá bajo agua segura.','Lavá y cortá el tomate.','Escurrí el choclo y el atún o los garbanzos.','Mezclá todos los ingredientes en un bowl.','Condimentá y conservá refrigerada hasta servir.']},
{name:'Panqueques de banana',cat:'Desayunos',time:'Desayuno',img:'photo-1528207776546-365bb710ee93',desc:'Preparación casera para compartir.',ingredients:['Banana madura','Huevo','Avena molida','Canela'],steps:['Pisá la banana con un tenedor.','Agregá el huevo y mezclá.','Incorporá avena molida y canela.','Volcá pequeñas porciones en sartén antiadherente.','Cociná de ambos lados hasta que estén firmes.']}
];

const drinks=[
{name:'Agua',desc:'La opción principal para hidratarte.',img:'photo-1548839140-29a749e1cf4d',ingredients:['Agua potable'],steps:['Serví agua fresca en un vaso o botella.','Tomala durante el día y aumentá la atención a la hidratación cuando haga calor o tengas actividad.']},
{name:'Agua con limón',desc:'Agua saborizada sin complicaciones.',img:'photo-1513558161293-cd5f2f5b8b9e',ingredients:['Agua','Rodajas de limón','Hielo opcional'],steps:['Lavá bien el limón.','Cortá algunas rodajas.','Agregalas a una jarra con agua.','Dejá reposar en frío y serví.']},
{name:'Licuado de banana',desc:'Bebida casera para acompañar una comida.',img:'photo-1509042239860-f550ce710b93',ingredients:['Banana','Leche','Canela opcional'],steps:['Pelá y cortá la banana.','Colocala en la licuadora con la leche.','Licuá hasta que quede homogéneo.','Serví en el momento.']},
{name:'Limonada casera',desc:'Una bebida fresca para compartir.',img:'photo-1513558161293-cd5f2f5b8b9e',ingredients:['Limón','Agua','Hojas de menta opcionales'],steps:['Exprimí los limones.','Mezclá el jugo con agua.','Agregá menta lavada si querés.','Enfriá y serví.']}
];

const workouts=[
{name:'Caminata',type:'Resistencia',icon:'🚶',time:'15–30 min',benefit:'Practica la resistencia y suma movimiento de bajo impacto.',steps:['Empezá a un ritmo cómodo.','Mantené una postura natural y pasos relajados.','Bajá el ritmo al final.']},
{name:'Fútbol recreativo',type:'Resistencia',icon:'⚽',time:'20–40 min',benefit:'Trabaja coordinación, agilidad y resistencia. Hacé pausas cuando las necesites.',steps:['Hacé una entrada en calor suave.','Practicá pases y conducción con control.','Alterná momentos de juego y pausas.','Terminá caminando suave.']},
{name:'Trote suave',type:'Resistencia',icon:'🏃',time:'10–20 min',benefit:'Ayuda a desarrollar resistencia de manera gradual.',steps:['Caminá unos minutos para entrar en calor.','Alterná trote cómodo y caminata.','No busques velocidad máxima.','Caminá para volver a la calma.']},
{name:'Fuerza con peso corporal',type:'Fuerza',icon:'🏋️',time:'10–20 min',benefit:'Practica control corporal y fuerza general con técnica.',steps:['Hacé movimientos lentos y controlados.','Elegí variantes fáciles que puedas hacer con buena técnica.','Descansá entre ejercicios.','Pedí supervisión para aprender la técnica.']},
{name:'Flexiones adaptadas',type:'Fuerza',icon:'💪',time:'5–10 min',benefit:'Fortalece pecho, brazos y zona media si se hacen con técnica correcta.',steps:['Apoyá las manos en una pared o superficie firme.','Mantené el cuerpo alineado.','Flexioná los codos sin forzar.','Empujá para volver.']},
{name:'Movilidad suave',type:'Movilidad',icon:'🧘‍♂️',time:'5–10 min',benefit:'Ayuda a mover articulaciones con comodidad y preparar el cuerpo.',steps:['Mové hombros suavemente.','Hacé círculos pequeños de tobillos.','Mové cadera sin rebotes.','Detenete si aparece dolor.']},
{name:'Bicicleta',type:'Resistencia',icon:'🚴',time:'15–30 min',benefit:'Trabaja resistencia y coordinación. Usá casco y un lugar seguro.',steps:['Revisá frenos y casco.','Empezá pedaleando suave.','Mantené un ritmo cómodo.','Terminá despacio.']},
{name:'Sentarse y levantarse',type:'Fuerza',icon:'🦵',time:'5–10 min',benefit:'Practica fuerza funcional de piernas.',steps:['Usá una silla estable detrás tuyo.','Separá los pies al ancho cómodo.','Bajá controladamente hasta tocar la silla.','Levantate sin impulso.']}
];

const sports=[
['Fútbol','⚽'],['Caminata','🚶'],['Correr','🏃'],['Calistenia','🤸'],
['Gimnasio supervisado','🏋️'],['Bicicleta','🚴'],['Natación','🏊'],
['Entrenamiento de fuerza','💪'],['Movilidad','🧘‍♂️'],
['Deporte en equipo','🏐'],['Actividad al aire libre','🌳'],
['Circuito funcional suave','✳']
];

let mealFilter='Todos',workFilter='Todos',calendarDate=new Date(),selectedDate=new Date();

function imgUrl(id){
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=82`;
}

function go(page){
  $$('.page').forEach(p=>p.classList.toggle('active',p.id===`page-${page}`));
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  $('#sidebar').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  if(page==='calendario')renderCalendar();
}

$$('.nav-item').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
$('#menuBtn').onclick=()=>$('#sidebar').classList.add('open');
$('#closeMenu').onclick=()=>$('#sidebar').classList.remove('open');

function openModal(id){$(id).classList.add('open')}
function closeModal(id){$(id).classList.remove('open')}

$('#openSurvey').onclick=()=>openModal('#surveyModal');
$('#editSurvey').onclick=()=>{fillSurvey();openModal('#surveyModal')};
$('#closeSurvey').onclick=()=>closeModal('#surveyModal');
$('#closeRecipe').onclick=()=>closeModal('#recipeModal');
$('#closeExercise').onclick=()=>closeModal('#exerciseModal');

$$('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{
  if(e.target===m)m.classList.remove('open');
}));

function fillSurvey(){
  if(!data.profile)return;
  let p=data.profile;
  $('#userName').value=p.name||'';
  $('#userAge').value=p.age||'';
  $('#userHeight').value=p.height||'';
  $('#userWeight').value=p.weight||'';
  $('#experience').value=p.experience||'Principiante';
  $$('#goalChoices .choice').forEach(b=>b.classList.toggle('selected',data.goals.includes(b.dataset.choice)));
}

$$('#goalChoices .choice').forEach(b=>b.onclick=()=>b.classList.toggle('selected'));

$('#surveyForm').onsubmit=e=>{
  e.preventDefault();
  let age=Number($('#userAge').value),height=Number($('#userHeight').value);
  if(age<5||age>100||height<80||height>230){
    alert('Revisá la edad y la altura ingresadas.');
    return;
  }
  data.profile={
    name:$('#userName').value.trim(),
    age,
    height,
    weight:$('#userWeight').value?Number($('#userWeight').value):null,
    experience:$('#experience').value
  };
  data.goals=$$('#goalChoices .choice.selected').map(b=>b.dataset.choice);
  store.save();
  closeModal('#surveyModal');
  renderAll();
};

function renderMeals(){
  let q=$('#mealSearch').value.toLowerCase();
  $('#mealGrid').innerHTML=meals.filter(m=>
    (mealFilter==='Todos'||m.cat===mealFilter)&&
    `${m.name} ${m.desc} ${m.ingredients.join(' ')}`.toLowerCase().includes(q)
  ).map(m=>`
    <article class="card meal-card" data-meal="${meals.indexOf(m)}">
      <img src="${imgUrl(m.img)}" alt="${m.name}" loading="lazy">
      <div class="meal-info">
        <span class="tag">${m.cat} · ${m.time}</span>
        <h3>${m.name}</h3><p class="muted">${m.desc}</p>
      </div>
    </article>
  `).join('')||'<p class="muted">No encontramos ese platillo.</p>';

  $$('[data-meal]').forEach(c=>c.onclick=()=>showRecipe(meals[+c.dataset.meal],false));
}

function renderDrinks(){
  $('#drinkGrid').innerHTML=drinks.map((d,i)=>`
    <article class="card meal-card" data-drink="${i}">
      <img src="${imgUrl(d.img)}" alt="${d.name}" loading="lazy">
      <div class="meal-info"><span class="tag">Bebida</span><h3>${d.name}</h3><p class="muted">${d.desc}</p></div>
    </article>
  `).join('');
  $$('[data-drink]').forEach(c=>c.onclick=()=>showRecipe(drinks[+c.dataset.drink],true));
}

function showRecipe(item,drink){
  $('#recipeContent').innerHTML=`
    <p class="eyebrow">${drink?'BEBIDA':'RECETA'}</p>
    <img src="${imgUrl(item.img)}" alt="${item.name}">
    <h2>${item.name}</h2><p class="muted">${item.desc}</p>
    <h3>Ingredientes</h3><ul>${item.ingredients.map(x=>`<li>${x}</li>`).join('')}</ul>
    <h3>Cómo se prepara</h3><ol>${item.steps.map(x=>`<li>${x}</li>`).join('')}</ol>
    <p class="notice">La información nutricional depende de la marca, cantidad y preparación. Esta receta no muestra valores calculados sin una fuente verificada.</p>
  `;
  openModal('#recipeModal');
}

$('#mealSearch').oninput=renderMeals;
$$('#mealFilters .filter').forEach(b=>b.onclick=()=>{
  mealFilter=b.dataset.filter;
  $$('#mealFilters .filter').forEach(x=>x.classList.toggle('active',x===b));
  renderMeals();
});

function renderWorkouts(){
  let list=workouts.filter(w=>workFilter==='Todos'||w.type===workFilter);
  $('#workoutGrid').innerHTML=list.map(w=>`
    <article class="card workout-card">
      <div class="workout-visual">${w.icon}</div>
      <span class="tag">${w.type}</span><h3>${w.name}</h3>
      <p class="muted">${w.benefit}</p>
      <p><b>Tiempo orientativo:</b> ${w.time}</p>
      <button class="secondary" data-work="${workouts.indexOf(w)}">Ver ejercicio</button>
    </article>
  `).join('');
  $$('[data-work]').forEach(b=>b.onclick=()=>showWorkout(workouts[+b.dataset.work]));
}

function showWorkout(w){
  $('#exerciseContent').innerHTML=`
    <p class="eyebrow">ENTRENAMIENTO</p><h2>${w.name}</h2>
    <p class="muted">${w.benefit}</p>
    <div class="exercise-demo">${w.icon}</div>
    <p><b>Tiempo orientativo:</b> ${w.time}</p>
    <h3>Cómo hacerlo</h3><ol>${w.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
    <div class="timer" id="timer">00:30</div>
    <div class="timer-actions">
      <button class="primary" id="timerStart">▶ Iniciar</button>
      <button class="secondary" id="timerReset">↻ Reiniciar</button>
    </div>
    <p class="notice">El temporizador es una ayuda opcional, no una obligación. Frená si sentís dolor, mareo o falta de aire inusual.</p>
  `;
  openModal('#exerciseModal');
  let sec=30,interval=null;
  const t=$('#timer');
  const paint=()=>t.textContent=`00:${String(sec).padStart(2,'0')}`;

  $('#timerStart').onclick=()=>{
    if(interval){
      clearInterval(interval);
      interval=null;
      $('#timerStart').textContent='▶ Continuar';
      return;
    }
    $('#timerStart').textContent='Ⅱ Pausar';
    interval=setInterval(()=>{
      sec--;
      paint();
      if(sec<=0){
        clearInterval(interval);
        interval=null;
        $('#timerStart').textContent='✓ Terminado';
      }
    },1000);
  };

  $('#timerReset').onclick=()=>{
    clearInterval(interval);
    interval=null;
    sec=30;
    paint();
    $('#timerStart').textContent='▶ Iniciar';
  };
}

$$('#workoutFilters .filter').forEach(b=>b.onclick=()=>{
  workFilter=b.dataset.filter;
  $$('#workoutFilters .filter').forEach(x=>x.classList.toggle('active',x===b));
  renderWorkouts();
});

function renderSports(){
  $('#sportGrid').innerHTML=sports.map(([name,icon])=>`
    <button class="sport-choice ${data.goals.includes(name)?'selected':''}" data-sport="${name}">
      <span>${icon}</span>${name}
    </button>
  `).join('');

  $$('[data-sport]').forEach(b=>b.onclick=()=>{
    let v=b.dataset.sport;
    data.goals=data.goals.includes(v)?data.goals.filter(x=>x!==v):[...data.goals,v];
    store.save();
    b.classList.toggle('selected');
    renderPlan();
  });
}

$('#editPlan').onclick=()=>{
  fillSurvey();
  openModal('#surveyModal');
};

function tasks(){
  let labels=data.goals.length?data.goals.slice(0,6):['Caminata','Hidratación','Comidas variadas'];
  return labels.map((g,i)=>({
    id:`${new Date().toISOString().slice(0,10)}-${i}`,
    name:g,
    desc:i===0?'Elegí un tiempo cómodo para vos.':'Registro flexible de hábito.'
  }));
}

function renderPlan(){
  let goals=data.goals.length?data.goals:['Todavía no elegiste actividades'];
  $('#chosenSummary').innerHTML=goals.map(g=>`<span class="chip">${g}</span>`).join('');
  $('#weeklyTasks').innerHTML=tasks().map(t=>`
    <label class="task ${data.done.includes(t.id)?'done':''}">
      <input type="checkbox" data-task="${t.id}" ${data.done.includes(t.id)?'checked':''}>
      <span><b>${t.name}</b><small>${t.desc}</small></span>
    </label>
  `).join('');

  $$('[data-task]').forEach(c=>c.onchange=()=>{
    if(c.checked)data.done.push(c.dataset.task);
    else data.done=data.done.filter(x=>x!==c.dataset.task);
    store.save();
    renderPlan();
    renderStats();
  });

  $('#todayWorkout').textContent=goals[0]||'Actividad pendiente';
}

function renderStats(){
  let count=data.done.length;
  $('#statDone').textContent=count;
  $('#progressNumber').textContent=`${Math.min(100,count*10)}%`;
  $('#ring').style.background=`conic-gradient(var(--green) ${Math.min(100,count*10)*3.6}deg,#edf2ed 0deg)`;
  $('#progressTitle').textContent=count?'¡Buen trabajo!':'Cada paso cuenta';
  let mins=count*15;
  $('#statMinutes').textContent=mins;
  let water=data.water[new Date().toDateString()]||0;
  $('#statWater').textContent=water+' ml';
  $('#waterTotal').textContent=water+' ml';

  let vals=[0,1,2,3,4,5,6].map((_,i)=>
    data.done.filter(x=>x.startsWith(new Date(Date.now()-i*86400000).toISOString().slice(0,10))).length
  );
  $('#barChart').innerHTML=vals.reverse().map((v,i)=>`
    <div class="bar" style="height:${Math.max(5,Math.min(100,v*24))}%">
      <span>${['L','M','X','J','V','S','D'][i]}</span>
    </div>
  `).join('');
}

function dateKey(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function renderCalendar(){
  let y=calendarDate.getFullYear(),m=calendarDate.getMonth();
  let first=new Date(y,m,1);
  let start=(first.getDay()+6)%7;
  let days=new Date(y,m+1,0).getDate();
  let prevDays=new Date(y,m,0).getDate();

  $('#monthTitle').textContent=new Intl.DateTimeFormat('es-AR',{month:'long',year:'numeric'}).format(first);
  let html=['L','M','X','J','V','S','D'].map(x=>`<div class="weekday">${x}</div>`).join('');

  for(let i=0;i<42;i++){
    let day,dt,other=false;
    if(i<start){day=prevDays-start+i+1;dt=new Date(y,m-1,day);other=true}
    else if(i>=start+days){day=i-start-days+1;dt=new Date(y,m+1,day);other=true}
    else{day=i-start+1;dt=new Date(y,m,day)}

    let key=dateKey(dt),today=dateKey(new Date()),sel=dateKey(selectedDate);
    html+=`<button class="day ${other?'other':''} ${key===today?'today':''} ${key===sel?'selected':''} ${data.events[key]?.length?'has-event':''}" data-date="${key}">${day}</button>`;
  }

  $('#calendarGrid').innerHTML=html;
  $$('[data-date]').forEach(b=>b.onclick=()=>{
    selectedDate=new Date(b.dataset.date+'T12:00:00');
    renderCalendar();
  });

  let k=dateKey(selectedDate);
  $('#selectedDateTitle').textContent=new Intl.DateTimeFormat('es-AR',{
    weekday:'long',day:'numeric',month:'long',year:'numeric'
  }).format(selectedDate);

  $('#selectedEvents').innerHTML=(data.events[k]||[]).map((v,i)=>`
    <div class="event-row">• ${v} <button class="text-btn danger" data-remove="${i}">Quitar</button></div>
  `).join('')||'<p class="muted small">No hay actividades guardadas para este día.</p>';

  $$('[data-remove]').forEach(b=>b.onclick=()=>{
    data.events[k].splice(+b.dataset.remove,1);
    store.save();
    renderCalendar();
  });
}

$('#prevMonth').onclick=()=>{
  calendarDate.setMonth(calendarDate.getMonth()-1);
  renderCalendar();
};
$('#nextMonth').onclick=()=>{
  calendarDate.setMonth(calendarDate.getMonth()+1);
  renderCalendar();
};
$('#addEvent').onclick=()=>{
  let v=$('#eventInput').value.trim();
  if(!v)return;
  let k=dateKey(selectedDate);
  data.events[k]=data.events[k]||[];
  data.events[k].push(v);
  $('#eventInput').value='';
  store.save();
  renderCalendar();
};

$$('[data-water]').forEach(b=>b.onclick=()=>{
  let k=new Date().toDateString();
  data.water[k]=(data.water[k]||0)+Number(b.dataset.water);
  store.save();
  renderStats();
});

$('#resetWater').onclick=()=>{
  data.water[new Date().toDateString()]=0;
  store.save();
  renderStats();
};

let stream=null;

async function startCamera(){
  try{
    stream=await navigator.mediaDevices.getUserMedia({
      video:{facingMode:{ideal:'environment'}},audio:false
    });
    $('#cameraFrame').innerHTML='<video id="cameraVideo" autoplay playsinline></video>';
    $('#cameraVideo').srcObject=stream;
    $('#capturePhoto').disabled=false;
    $('#stopCamera').disabled=false;
  }catch(e){
    alert('No se pudo abrir la cámara. Revisá los permisos del navegador o usá “Elegir foto”.');
  }
}

$('#startCamera').onclick=startCamera;

function stopCamera(){
  if(stream){
    stream.getTracks().forEach(t=>t.stop());
    stream=null;
  }
  $('#capturePhoto').disabled=true;
  $('#stopCamera').disabled=true;
}

$('#stopCamera').onclick=()=>{
  stopCamera();
  $('#cameraFrame').innerHTML=`
    <div class="camera-placeholder">
      <div class="camera-symbol">▣</div><h3>Cámara cerrada</h3>
      <button class="primary" id="startCamera">Abrir cámara</button>
    </div>`;
  $('#startCamera').onclick=startCamera;
};

$('#capturePhoto').onclick=()=>{
  let v=$('#cameraVideo'),c=document.createElement('canvas');
  c.width=v.videoWidth;
  c.height=v.videoHeight;
  c.getContext('2d').drawImage(v,0,0);
  $('#photoResult').innerHTML=`<img src="${c.toDataURL('image/jpeg',.85)}" alt="Foto de comida">`;
  stopCamera();
};

$('#photoFile').onchange=e=>{
  let f=e.target.files[0];
  if(f){
    let url=URL.createObjectURL(f);
    $('#photoResult').innerHTML=`<img src="${url}" alt="Foto elegida">`;
  }
};

$('#saveFood').onclick=()=>{
  let name=$('#foodName').value.trim();
  if(!name){alert('Escribí el nombre del platillo para guardarlo.');return}

  data.foods.push({
    name,
    moment:$('#foodMoment').value,
    calories:$('#foodCalories').value||null,
    protein:$('#foodProtein').value||null,
    carbs:$('#foodCarbs').value||null,
    fat:$('#foodFat').value||null,
    date:new Date().toISOString()
  });

  store.save();
  alert('Registro guardado.');
  $('#foodName').value='';
  ['foodCalories','foodProtein','foodCarbs','foodFat'].forEach(id=>$('#'+id).value='');
};

$('#exportData').onclick=()=>{
  let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  let a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='vitalia-registros.json';
  a.click();
  URL.revokeObjectURL(a.href);
};

$('#clearData').onclick=()=>{
  if(confirm('¿Querés borrar todos los datos guardados en este navegador?')){
    localStorage.removeItem('vitalia_v2');
    location.reload();
  }
};

function renderProfile(){
  let p=data.profile;
  $('#profileSummary').innerHTML=p
    ?`<span>Edad: ${p.age} años</span><span>Altura: ${p.height} cm</span>${p.weight?`<span>Peso registrado: ${p.weight} kg</span>`:''}<span>Experiencia: ${p.experience}</span>`
    :'<span>Completá la encuesta para personalizar la app.</span>';
  $('#helloName').textContent=p?.name?`, ${p.name}`:'';
}

function renderAll(){
  let now=new Date();
  $('#topDate').textContent=new Intl.DateTimeFormat('es-AR',{day:'numeric',month:'short'}).format(now);
  $('#todayLabel').textContent=new Intl.DateTimeFormat('es-AR',{weekday:'long',day:'numeric',month:'long'}).format(now);
  $('#todayLong').textContent=new Intl.DateTimeFormat('es-AR',{day:'numeric',month:'long',year:'numeric'}).format(now);
  renderProfile();
  renderMeals();
  renderDrinks();
  renderWorkouts();
  renderSports();
  renderPlan();
  renderStats();
  renderCalendar();
}

renderAll();
if(!data.profile)openModal('#surveyModal');
