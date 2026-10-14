(() => {
  'use strict';
  const KEY='masar_enhancements_v1';
  const $=id=>document.getElementById(id);
  const today=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
  const blank=()=>({theme:'light',prayers:{},screen:{},challenges:{},water:{enabled:false,interval:60},challengeOffset:{},lastWaterNotice:0});
  let data;try{data={...blank(),...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch(e){data=blank();}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){toast('تعذر حفظ بيانات العادات في المتصفح.');}};
  const toast=msg=>{const el=$('toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('show'),3000);};
  const safe=n=>Math.max(0,Math.min(1440,Number(n)||0));
  const phases=['التأسيس','الراحة الاجتماعية','المبادرة','التعبير','الحضور','الجرأة','الإقناع الأخلاقي','الارتجال','القيادة','التطبيق الواقعي'];
  const types=[
    {cat:'المبادرة الاجتماعية',title:'ابدأ أنت الكلام',task:['ابدأ محادثة قصيرة مع شخص تعرفه، بدل انتظار أن يبدأ هو.','اسأل سؤالًا مفتوحًا واحدًا، ثم استمع دون مقاطعة.','اختم الحديث بشكل طبيعي ومحترم.']},
    {cat:'الصوت والحضور',title:'تدرّب على صوت واضح',task:['اقرأ فقرة بصوت مسموع لمدة دقيقتين.','أعدها بسرعة أبطأ قليلًا مع وقفات بعد الأفكار المهمة.','سجّل ملاحظة: هل كان الكلام واضحًا أم متسرعًا؟']},
    {cat:'الثقة',title:'اطلب شيئًا بسيطًا بوضوح',task:['اطلب مساعدة أو معلومة تحتاجها فعلًا.','استخدم جملة مباشرة دون اعتذار زائد.','تقبّل الرد بهدوء سواء كان نعم أو لا.']},
    {cat:'الاستماع',title:'استمع لتفهم لا لترد',task:['تحدث مع شخص خمس دقائق.','لخّص فكرته بجملة قبل أن تعرض رأيك.','اسأله إن كنت فهمته بشكل صحيح.']},
    {cat:'خفة الظل',title:'لاحظ موقفًا طريفًا',task:['دوّن موقفًا يوميًا صغيرًا ومضحكًا دون السخرية من أحد.','احكِه في 30 ثانية لشخص ترتاح له.','راقب التوقيت؛ لا تضغط على نفسك لإضحاك الآخرين.']},
    {cat:'الإقناع',title:'اعرض فكرة في ثلاث جمل',task:['اختر فكرة مفيدة تؤمن بها.','اشرح الفائدة بدليل أو مثال ملموس.','اسأل الطرف الآخر عن اعتراضه واستمع له باحترام.']},
    {cat:'الشجاعة',title:'افعل شيئًا كنت تؤجله',task:['اختر خطوة صغيرة مؤجلة وآمنة.','ابدأها خلال عشر دقائق بدل انتظار الحماس.','سجّل ما كان أصعب جزء وما الذي ساعدك.']},
    {cat:'لغة الجسد',title:'حضور هادئ',task:['حافظ على وضعية مريحة ومستقيمة دون تصنّع.','انظر إلى وجه من يحدثك بشكل طبيعي، لا تحديقًا.','خفّف الحركات العصبية ولا تحاول التحكم في كل حركة.']},
    {cat:'الارتجال',title:'تكلّم دون نص جاهز',task:['اختر غرضًا حولك واشرح فائدته لمدة 45 ثانية.','رتّب كلامك: فكرة، مثال، خلاصة.','كرر المحاولة مرة واحدة مع موضوع مختلف.']},
    {cat:'الاستقلال',title:'اتخذ قرارًا صغيرًا بنفسك',task:['اختر قرارًا يوميًا بسيطًا لا يحتاج موافقة الآخرين.','حدّد سببًا عمليًا لاختيارك ونفّذه.','راجع النتيجة دون جلد ذات أو تبرير زائد.']},
    {cat:'الحدود والاحترام',title:'عبّر عن تفضيلك',task:['اذكر رأيًا أو تفضيلًا حقيقيًا بوضوح وهدوء.','استخدم صيغة مثل: «أنا أفضل… لأن…».','احترم اختلاف الطرف الآخر دون التنازل عن حقك في الرأي.']},
    {cat:'الحكي',title:'احكِ قصة قصيرة',task:['اختر موقفًا حصل لك بالفعل.','احكه بترتيب: بداية، نقطة تغيّر، نهاية.','احذف التفاصيل غير المهمة واجعله في دقيقة واحدة.']}
  ];
  const phasesExtra=[
    ['نفّذ التمرين مع شخص مألوف.','اكتفِ بمحاولة واحدة جيدة.'],
    ['جرّب مع شخص لا تتحدث معه كثيرًا لكن الموقف مناسب.','ابدأ خلال اليوم بدل تأجيله.'],
    ['نفّذ التمرين مرتين في موقفين مختلفين.','دوّن ما تغيّر في المحاولة الثانية.'],
    ['أضف سؤال متابعة أو مثالًا من تجربتك.','حافظ على الاستماع والاحترام.'],
    ['نفّذ التمرين في موقف اجتماعي حقيقي ومناسب.','ركّز على الوضوح بدل محاولة إبهار الناس.'],
    ['ابدأ رغم وجود توتر خفيف، دون تعريض نفسك أو غيرك للخطر.','قيّم الفعل لا رد فعل الناس فقط.'],
    ['قدّم سببين واضحين واذكر حدود معرفتك بصدق.','لا تضغط ولا تستخدم خداعًا أو إحراجًا.'],
    ['ارتجل دقيقة كاملة مع فكرة رئيسية ومثال وخاتمة.','إن تعثرت، خذ وقفة قصيرة ثم أكمل.'],
    ['نظّم مهمة صغيرة أو اقترح خطة على مجموعة متقبلة.','اسأل الآخرين عن رأيهم ووزّع مساحة الكلام.'],
    ['اجمع مهارتين من التحديات السابقة في موقف واقعي.','راجع التجربة واكتب خطوة تطوير واحدة للأسبوع المقبل.']
  ];
  const thoughts=[
    'الثقة تُبنى بالفعل الصغير المتكرر، لا بانتظار الشعور المثالي.',
    'كن واضحًا دون قسوة، وحازمًا دون إهانة.',
    'الكاريزما ليست أن تتكلم أكثر؛ بل أن تجعل الحوار أفضل.',
    'الشجاعة ليست غياب التوتر، بل اختيار خطوة آمنة رغم وجوده.',
    'الإقناع الجيد يشرح الفكرة ويترك للطرف الآخر حرية القرار.',
    'خفة الظل ليست إهانة الآخرين؛ أحيانًا أفضل نكتة هي ملاحظة ذكية عن الموقف.',
    'استمع كاملًا قبل أن تحاول أن تكون مقنعًا.',
    'الهدوء والوضوح أقوى من التظاهر بأنك لا تخطئ.'
  ];
  function planDay(){
    const base=new Date(`${today()}T12:00:00`);const start=new Date(`${(localStorage.getItem('masar_goal_tracker_v1')?JSON.parse(localStorage.getItem('masar_goal_tracker_v1')).settings?.startDate:today())||today()}T12:00:00`);
    const raw=Math.floor((base-start)/86400000);return Math.max(1,Math.min(300,raw+1));
  }
  function getChallenge(){
    const day=planDay();const phase=Math.min(9,Math.floor((day-1)/30));const typeIndex=(day-1)%types.length;const t=types[typeIndex];const custom=data.challengeOffset[today()]||0;const chosen=types[(typeIndex+custom)%types.length];
    const extra=phasesExtra[phase];return {day,phase,cat:chosen.cat,title:chosen.title,steps:[...chosen.task,...extra],level:phases[phase]};
  }
  function renderChallenge(){const c=getChallenge(),done=data.challenges[today()];$('challengeNumber').textContent=`اليوم ${c.day}/300`;$('challengeProgress').textContent=`المرحلة ${c.phase+1} من 10: ${c.level}`;$('challengeCategory').textContent=c.cat;$('challengeTitle').textContent=c.title;$('challengeText').textContent=`المطلوب اليوم: نفّذ الخطوات التالية. الصعوبة ترتفع تدريجيًا، لكن لا تتجاوز حدودك أو حدود الآخرين.`;$('challengeSteps').innerHTML=c.steps.map(s=>`<div class="challenge-step">${s}</div>`).join('');$('challengeReflection').value=done?.reflection||'';$('challengeStatus').textContent=done?.done?'تم إنجاز تحدي اليوم. يمكنك إضافة ملاحظتك أو مراجعتها.':'لم يُسجّل الإنجاز بعد.';$('completeChallenge').textContent=done?.done?'تم الإنجاز ✓':'أنجزت التحدي';$('completeChallenge').disabled=!!done?.done;$('habitDayLabel').textContent=`تحدي ${c.day} · ${c.level}`;}
  function renderPrayers(){const day=data.prayers[today()]||{};document.querySelectorAll('[data-prayer]').forEach(row=>{const v=day[row.dataset.prayer];row.querySelectorAll('input').forEach(i=>i.checked=i.value===v);});$('prayerScore').textContent=`${Object.values(day).reduce((n,v)=>n+(v==='mosque'?10:v==='home'?6:0),0)}/50`;}
  function renderScreen(){const d=data.screen[today()]||{};[['Tiktok','tiktok'],['Youtube','youtube'],['Ai','ai'],['Other','other']].forEach(([id,key])=>{if($('screen'+id))$('screen'+id).value=d[key]??'';});const total=(d.tiktok||0)+(d.youtube||0)+(d.ai||0)+(d.other||0);const weighted=(d.tiktok||0)*3+(d.youtube||0)*2+(d.ai||0)+(d.other||0);$('screenTotal').textContent=total;$('screenWeighted').textContent=weighted;if(total>=180) $('screenTotal').style.color='#b42318';else $('screenTotal').style.color='';}
  function renderThought(){const i=Math.floor(Date.now()/86400000)%thoughts.length;$('dailyThought').textContent=thoughts[i];}
  function bind(){
    $('themeToggle').addEventListener('click',()=>{data.theme=data.theme==='dark'?'light':'dark';applyTheme();save();});
    $('savePrayers').addEventListener('click',()=>{const day={};document.querySelectorAll('[data-prayer]').forEach(row=>{const chosen=row.querySelector('input:checked');if(chosen)day[row.dataset.prayer]=chosen.value;});data.prayers[today()]=day;save();renderPrayers();toast('تم حفظ سجل الصلاة لهذا اليوم.');});
    $('saveScreen').addEventListener('click',()=>{data.screen[today()]={tiktok:safe($('screenTiktok').value),youtube:safe($('screenYoutube').value),ai:safe($('screenAi').value),other:safe($('screenOther').value)};save();renderScreen();const d=data.screen[today()],w=d.tiktok*3+d.youtube*2+d.ai+d.other;toast(w>=360?'وقت الشاشة الموزون مرتفع اليوم؛ جرّب تقليل تطبيق واحد غدًا.':'تم حفظ وقت الشاشة.');});
    $('completeChallenge').addEventListener('click',()=>{data.challenges[today()]={done:true,reflection:$('challengeReflection').value.trim(),title:getChallenge().title,completedAt:new Date().toISOString()};save();renderChallenge();toast('تم تسجيل إنجاز التحدي.');});
    $('challengeReflection').addEventListener('change',()=>{if(data.challenges[today()]){data.challenges[today()].reflection=$('challengeReflection').value.trim();save();}});
    $('refreshChallenge').addEventListener('click',()=>{data.challengeOffset[today()]=((data.challengeOffset[today()]||0)+1)%types.length;save();renderChallenge();});
    $('newThought').addEventListener('click',()=>{let next=thoughts[Math.floor(Math.random()*thoughts.length)];if(next===$('dailyThought').textContent)next=thoughts[(thoughts.indexOf(next)+1)%thoughts.length];$('dailyThought').textContent=next;});
    $('enableWater').addEventListener('click',async()=>{if('Notification'in window&&Notification.permission==='default'){try{await Notification.requestPermission();}catch(e){}}data.water={enabled:true,interval:Number($('waterInterval').value)||60};save();$('waterStatus').textContent='التذكير مفعّل أثناء بقاء الصفحة مفتوحة.';toast('تم تفعيل تذكير الماء داخل الصفحة.');});
    $('disableWater').addEventListener('click',()=>{data.water={...data.water,enabled:false};save();$('waterStatus').textContent='التذكير غير مفعّل.';toast('تم إيقاف التذكير.');});
    $('waterInterval').addEventListener('change',()=>{data.water.interval=Number($('waterInterval').value)||60;save();});
    document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>{if(btn.dataset.view==='habits'){renderPrayers();renderScreen();renderChallenge();}}));
  }
  function applyTheme(){document.body.classList.toggle('theme-dark',data.theme==='dark');$('themeToggle').textContent=data.theme==='dark'?'☀ الوضع الفاتح':'◐ الوضع الداكن';}
  let waterTimer=null;
  function startWaterLoop(){if(waterTimer)clearInterval(waterTimer);if(!data.water?.enabled)return;waterTimer=setInterval(()=>{if(document.visibilityState==='visible'){const msg='حان وقت شرب الماء إذا كنت عطشانًا. خذ استراحة قصيرة.';toast(msg);if('Notification'in window&&Notification.permission==='granted'){try{new Notification('تذكير مسار',{body:msg,tag:'masar-water'});}catch(e){}}}},Math.max(15,Number(data.water.interval)||60)*60*1000);}
  function init(){applyTheme();renderPrayers();renderScreen();renderChallenge();renderThought();if(data.water?.enabled){$('waterInterval').value=String(data.water.interval||60);$('waterStatus').textContent='التذكير مفعّل أثناء بقاء الصفحة مفتوحة.';}bind();startWaterLoop();}
  window.MasarEnhancements={getData:()=>JSON.parse(JSON.stringify(data)),update:(patch)=>{data={...data,...patch};save();applyTheme();},reload:()=>{try{data={...blank(),...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch(e){data=blank();}applyTheme();renderPrayers();renderScreen();renderChallenge();startWaterLoop();}};window.addEventListener('masar:mobile-data-restored',()=>window.MasarEnhancements.reload());
  init();
})();
