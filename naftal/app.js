document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Mobile Nav ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!primaryNav.contains(e.target) && !menuToggle.contains(e.target)) {
        primaryNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        primaryNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Modal ---------- */
  const modal = document.getElementById('naftal-modal');
  const openModalBtn = document.getElementById('open-modal');
  const closeModalBtn = document.querySelector('.close-btn');

  openModalBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    // Focus trap basic
    closeModalBtn?.focus();
  });

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    openModalBtn?.focus();
  }

  closeModalBtn?.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
  });

  /* ---------- Services Carousel ---------- */
  (function initServicesCarousel(){
    const list = document.getElementById('services-list');
    const prevBtn = document.getElementById('services-prev');
    const nextBtn = document.getElementById('services-next');
    if (!list || !prevBtn || !nextBtn) return;

    let position = 0;

    function cardWidth(){
      const gap = parseFloat(getComputedStyle(list).gap) || 0;
      const firstCard = list.querySelector('.service-card');
      return (firstCard ? firstCard.getBoundingClientRect().width : 280) + gap;
    }

    function visibleCount(){
      const w = window.innerWidth;
      if (w <= 768) return 1;
      if (w <= 1024) return 2;
      return 4;
    }

    function maxPosition(){
      const total = list.children.length;
      const visible = visibleCount();
      return Math.max(0, total - visible);
    }

    function updateButtons(){
      prevBtn.disabled = position <= 0;
      nextBtn.disabled = position >= maxPosition();
    }

    function applyTransform(){
      list.style.transform = `translateX(-${position * cardWidth()}px)`;
      updateButtons();
    }

    nextBtn.addEventListener('click', () => {
      if (position < maxPosition()) {
        position++;
        applyTransform();
      }
    });
    prevBtn.addEventListener('click', () => {
      if (position > 0) {
        position--;
        applyTransform();
      }
    });

    // Reset on resize
    window.addEventListener('resize', () => {
      position = Math.min(position, maxPosition());
      applyTransform();
    });

    // Init state
    updateButtons();
  })();

  /* ---------- Testimonials ---------- */
  (function initTestimonials(){
    const testimonials = [
      {
        text: "Grâce à l’application Naftal Khadamat, trouver une station est devenu si simple ! J’adore les mises à jour des services en temps réel.",
        img:  "img/ali-benali.jpg",
        name: "Ali Benali",
        role: "Client, Algérie"
      },
      {
        text: "L'interface est claire et la géolocalisation très précise. Bravo Naftal Khadamat !",
        img:  "img/sara-cheriet.jpg",
        name: "Sara Cheriet",
        role: "Cliente, Oran"
      },
      {
        text: "Les promotions s'affichent en temps réel, pratique pour économiser à chaque plein.",
        img:  "img/karim-t.jpg",
        name: "Karim T.",
        role: "Client, Alger"
      }
    ];

    const textEl  = document.getElementById('testimonial-text');
    const photoEl = document.querySelector('.testimonial-photo img');
    const nameEl  = document.querySelector('.testimonial-name');
    const roleEl  = document.querySelector('.testimonial-role');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');

    let current = 0;

    function render(i){
      const t = testimonials[i];
      if (!t) return;
      textEl.textContent  = `"${t.text}"`;
      photoEl.src         = t.img;
      photoEl.alt         = t.name;
      nameEl.textContent  = t.name;
      roleEl.textContent  = t.role;
    }

    prevBtn?.addEventListener('click', () => {
      current = (current - 1 + testimonials.length) % testimonials.length;
      render(current);
    });
    nextBtn?.addEventListener('click', () => {
      current = (current + 1) % testimonials.length;
      render(current);
    });

    render(0);
  })();

  /* ---------- Find Station (UX Hook) ---------- */
  const findBtn = document.getElementById('findStationBtn');
  findBtn?.addEventListener('click', async () => {
    // Simple UX feedback
    const original = findBtn.innerHTML;
    findBtn.disabled = true;
    findBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Recherche...';

    // Attempt geolocation (graceful fallback)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Replace with your station search logic or redirect:
          window.location.href = `https://www.google.com/maps/search/Naftal+station/@${latitude},${longitude},14z`;
        },
        () => {
          // Fallback: open general map search
          window.open('https://www.google.com/maps/search/Naftal+station/', '_blank');
          findBtn.disabled = false;
          findBtn.innerHTML = original;
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      window.open('https://www.google.com/maps/search/Naftal+station/', '_blank');
      findBtn.disabled = false;
      findBtn.innerHTML = original;
    }
  });
});


/* ===== FAQ chat INSIDE card (with 4 categories) ===== */
(function initFaqChatInsideCard(){
  const startBtn  = document.getElementById('faqStartBtn');
  const card      = document.getElementById('faqCard');
  const cardChat  = document.getElementById('faqCardChat');
  const thread    = document.getElementById('faqThread');
  if (!startBtn || !card || !cardChat || !thread) return;

  // --- DATA ---
  const CATEGORIES = [
    {
      id:'gplc', label:'Centre de conversion GPLc',
      intro:'Choisissez une question à propos du centre de conversion GPLc :',
      questions:[
        { id:'odeur', label:'Que faire s’il y a une odeur de GPLc ?',
          answer:`-Arrêter votre moteur.<br>
          -Ouvrir manuellement le coffre, le capot et les portes du véhicule pour aérer. Éviter l’usage du système de verrouillage centralisé qui est une source d’étincelle.<br>
          -Fermer le robinet manuel de la poly–vanne montée sur le réservoir GPL.<br>
          -Une fois l’odeur du GPL n’est plus sentie, par mesure de sécurité, ne rouler pas au GPL. Mettez le commutateur en mode essence, puis redémarrer votre véhicule.<br>
          -Rapprochez-vous du centre de conversion le plus près pour contrôle d’éventuelle fuite.` },
        { id:'accident', label:'En cas d’accident',
          answer:`-Arrêter votre moteur<br>
          -Fermer le robinet manuel de la poly–vanne montée sur le réservoir GPL<br>
          -Si le véhicule est toujours conduisable, ne rouler pas au GPL, il faut se rapprocher du centre de conversion le plus près pour un contrôle.` },
        { id:'feu', label:'En cas de feu',
          answer:`-Si la situation est dangereuse il faut évacuer les lieux et s’éloigner du véhicule.<br>
          -Dans le cas contraire, fermer le robinet manuel de la poly–vanne montée sur le réservoir GPL<br>
          -Utiliser votre extincteur à poudre sèche pour éteindre le feu<br>
          -Si vous n’êtes pas capable d’éteindre le feu vous appeler la protection civile en leur indiquant le lieu, la nature et l’ampleur.` },
        
      ]
    },
    {
      id:'pneus', label:'Pneumatique',
      intro:'Choisissez une question sur les pneumatiques :',
      questions:[
        { id:'produit', label:'Que se produit-il si je ne conduis pas avec la bonne pression des pneus ?',
          answer:`Une pression trop faible ou trop élevée a des conséquences négatives sur les performances des pneus (usure excessive / distance de freinage) et peut même compromettre gravement votre sécurité sur la route.<br>

         Une pression de pneus trop faible entraîne également une consommation accrue de carburant.` },

        { id:'gonflet', label:'Comment puis-je savoir à quelle pression gonfler mes pneus ?',
          answer:`Se référer au tableau de pression des pneus. Si vous avez déjà parcouru quelques kilomètres, tenir compte alors du fait qu’une différence positive d’au moins 0,3 bar est nécessaire par rapport à la pression recommandée.<br>
          Pour les pneus d’hiver, nous vous recommandons d’augmenter la valeur du tableau de 0,2 bar.<br>
          Lors du contrôle de la pression, n’oubliez pas de vérifier votre roue de secours.` },

        { id:'pression', label:'A quelle pression dois-je gonfler mes pneus ?',
          answer:`La pression s’exprime en bar manomètre.<br>
          Une bonne pression se situe généralement entre 2 et 3 bars.<br>
          Un bar équivaut à 1 kilogramme par cm3.` },

        { id:'remplacement', label:'Conseils pour le remplacement d’un pneu crevé',
          answer:`Ayez toujours une paire de gants à portée de main.<br>
          Pensez toujours à avoir un sac en plastique dans votre coffre. Vous pourrez ainsi y mettre le pneu crevé. Cela s’avérera particulièrement pratique si le pneu a roulé dans la boue.<br>
          Évitez de conduire avec un pneu sans pression. Vous risqueriez de l’endommager définitivement.<br>
          Allumez les feux de détresse, enclenchez une vitesse et tirez le frein à main.<br>
          Placez le triangle de signalisation à environ 30 mètres derrière le véhicule, et portez un gilet de sécurité.<br>
          Si le sol est trop mou, le cric risque de s’y enfoncer. Veillez donc à le disposer sur une planchette.<br>
          Remplacez le pneu crevé par le pneu de secours. Vous trouverez l’emplacement de ce dernier en consultant le manuel d’utilisation de votre véhicule.<br>
          Si vous ne placez pas correctement les écrous, les disques de frein risquent de se plier et d’endommager le système de suspension.<br>
          Pour placer les écrous correctement et de manière identique, nous vous conseillons d’utiliser une clé à écrou dynamométrique. Grâce à cet outil, vous pourrez doser la puissance utilisée pour serrer les écrous.<br>
          Si vous ne disposez pas d’une telle clé, se rapprocher le plus vite possible du spécialiste en pneus le plus proche afin de faire contrôler vos roues.<br>
          Lorsque vous venez de placer la roue de secours, vous ne devez pas rouler trop vite. Il est possible en effet que la pression des pneus ne soit pas correcte.` },

          { id:'sculptures', label:'Quelle est la profondeur minimale légale des sculptures d’un pneu ?',
          answer:`La profondeur minimale légale des sculptures d’un pneu ne doit pas être inférieure à 1,6 mm pour ce qui est des pneus de tourisme, et 2,4 mm pour les pneus de camionnette.<br>
          Naftal vous conseille de remplacer vos pneus à une profondeur de sculpture inférieure à 3 mm. Ainsi, votre sécurité sera garantie.<br>
          Le plus grand danger est la combinaison de pneus usés et de routes glissantes/humides. La distance de freinage augmente alors rapidement et le risque d’aquaplanage est accru.` },

           { id:'pression', label:'A Quelle fréquence doit-je vérifier la pression de mes pneus ?',
          answer:`Les spécialistes recommandent de contrôler la pression des pneus au minimum une fois (01) par mois. La pression de vos pneus doit être contrôlée à froid Pensez également à vérifier celle de votre roue de secours !` },

          { id:'acheter', label:'Peut-on acheter et rouler avec un pneu fabriqué il y a plus de 3 ans ?',
          answer:`La gomme des pneumatiques s’est considérablement améliorée et ne subit plus le poids du temps comme les précédentes gommes. Le pneu en lui-même ne sera pas moins performant à condition qu’il soit stocké dans des conditions optimales.` },

           { id:'installer', label:'Puis je installer mes pneus (acheté auprès de tiers) au niveau des points de vente NAFTAL ?',
          answer:`NAFTAL procède au montage des pneus achetés au niveau de ses points de vente gratuitement, le prix du montage d’un pneu acheté chez un tiers est de 150 DA, (uniquement au niveau des points de vente dotés du service « vulcanisation »).` },

          { id:'vitesse', label:'Pourquoi je ressens des vibrations à certaines vitesses ?',
          answer:`Les vibrations ressenties en roulant sont généralement liées à un problème d’équilibrage.<br>
          Si vous ressentez les vibrations dans le volant aux environs de 90km/h, c’est sans doute dû à l’équilibrage avant qui doit être contrôlé. Si vous ressentez les vibrations dans le siège conducteur aux environs de 110km/h, c’est sans doute dû à l’équilibrage des roues arrière qui doit être contrôlé.` }
      ]
    },
    {
      id:'securite', label:'Consignes de sécurité',
      intro:'Choisissez une consigne de sécurité :',
      questions:[
        { id:'interdit', label:'Gestes interdits',
          answer:`-Ne jamais porter la bouteille par le détendeur.<br>
          -Ne jamais ouvrir la bouteille sans détendeur et flexible connectés à l’appareil.<br>
          -Ne jamais utiliser une clé à molette ou un marteau pour ouvrir ou fermer le robinet.<br>
          -Ne jamais fumer ni manipuler toute autre source de feu lorsque vous raccordez la bouteille.<br>
          -Ne jamais vérifier une fuite de gaz avec une flamme : (briquet, allumette…).<br>
          -Ne jamais utiliser la bouteille en position renversée ou horizontale.<br>
          -Ne jamais purger la bouteille de gaz (si l’appareil connecté à la bouteille ne s’allume pas : écoulement liquide ou absence de gaz, changer-la).<br>
          -Ne jamais laisser le flexible en caoutchouc en contact avec la table de cuisson.<br>
          -(Maximum 2 mètres de longueur).<br>
          -Ne jamais transvaser le gaz d’une bouteille à une autre.<br>
          -Ne jamais laisser les enfants jouer ni avec les bouteilles, ni avec les appareils d’utilisation.` },

        { id:'faire', label:'Gestes à faire',
          answer:`-Pensez toujours à l’aération pendant l’utilisation de la bouteille (même en temps de froid).<br>
          -Raccordez le détendeur au robinet, vissez et serrez bien à la main dans le sens inverse des aiguilles d’une monte.<br>
          -Contrôlez l’étanchéité à chaque nouveau raccordement à l’aide d’une solution savonneuse (ouvrez le robinet de la bouteille et appliquez la solution savonneuse), si vous constatez la formation de petites bulles, il y a fuite de gaz, ferler le robinet.<br>
          -Fermez les robinets des appareils connectés puis le robinet de votre bouteille après chaque usage. Une fois vide, échanger-la uniquement chez votre distributeur NAFTAL.<br>
          -Retournez la bouteille au point de vente si vous rencontrez la moindre difficulté.` },

        { id:'accessoires', label:'Accessoires à vérifier',
          answer:`-Vérifiez la présence d’une capsule en plastique au niveau du robinet, Les bouteilles de -- Gaz sont remplies, sécurisées et scellées dans les centres NAFTAL/GPL.<br>
          -Utilisez un détendeur de gaz butane conforme et conseillé par NAFTAL : le classique et celui doté d’un dispositif de sécurité, attention aux détendeurs de gaz butane contrefaits.<br>
          -Vérifiez la présence et le bon état des deux joints en caoutchouc : le joint auto-serreur (du robinet) et le joint plat (du détendeur de gaz).<br>
          -Remplacez-les si nécessaire.<br>
          -Utiliser toujours un tuyau de raccordement (flexible) conforme et conçu spécialement pour le gaz butane.<br>
          -Vérifiez le flexible, s’il présente des fissures ou autres détériorations (celui-ci s’abîme plus vite que vous ne le pensez) changer-le et respectez la date limite d’utilisation indiquée sur le tuyau même s’il vous paraît en bon état.` },

          { id:'stockage', label:'Transport et Stockage',
          answer:`-Préservez votre bouteille et évitez de la rouler ou de la jeter par terre.<br>
          -Maintenez la bouteille en position verticale, pendant son transport, afin de minimiser les risques en cas de fuite.<br>
          -Stockez les bouteilles pleines ou vides (toujours en position verticale) dans un endroit comportant des orifices d’aération mais jamais dans un emplacement clos ou en contrebas : (cave, placard…).<br>
          -Stockez votre bouteille dans un endroit approprié loin de la chaleur et du froid, ne la laissez ni exposée aux rayons du soleil ni au grand froid.` },

          { id:'carbone', label:'Attention au « tueur silencieux » Le monoxyde de carbone',
          answer:`-Lorsqu’un appareil de chauffage ou de cuisson est défectueux, la combustion est incomplète, il libère ce gaz toxique incolore et inodore, Si on le respire, il prend la place de l’oxygène, cela engendrera l’évanouissement ou même la mort.<br>
          -Si vous remarquez que la couleur de la flamme vire vers le jaune ou l’orange, ou bien la présence d’une fumée : il y a peut-être du monoxyde de carbone.<br>
          -Si vous avez mal à la tête, des nausées, des vertiges ou une fatigue subite : il y a peut-être du monoxyde de carbone.<br>
          -En cas de doute, ouvrez les fenêtres et les portes arrêtez les appareils de chauffage et de cuisson, si vous ne maîtrisez pas la situation, sortez et appelez les pompiers au « 14 » ou « 1021 ».<br>
          -N’hésitez pas à demander des renseignements ou des conseils à votre fidèle distributeur.` },

          { id:'bons', label:'Les bons gestes face à une fuite de gaz',
          answer:`-Fermez le robinet de la bouteille et aérez s’il y a une odeur de gaz, et faites un important courant d’air en ouvrant largement plusieurs fenêtres.<br>
          -Évitez tout risque d’étincelle (qui suffirait à provoquer une explosion). Ne touchez à aucun interrupteur électrique ou toute autre source de chaleur.<br>
          -Retournez, au besoin, la bouteille à votre distributeur NAFTAL et consultez-le.` }
      ]
    },
    {
      id:'detendeur', label:'Utiliser le détendeur',
      intro:'Choisissez une question sur le détendeur (butane) :',
      questions:[
        { id:'securite', label:'Les Consignes de sécurité avant raccordement',
          answer:`-Vérifier qu’il n’existe ni flamme, ni foyer en combustion dans la pièce<br>
          -Vérifier que le détendeur est bien muni de son joint plat en caoutchouc et qu’il n’est pas détérioré : remplacez-le si nécessaire<br>
          -Vérifier que le flexible est en bon état<br>
          -Vérifier que tous les raccordements sont étanches à l’aide d’une solution savonneuse.` },

        { id:'int', label:'Gestes interdits',
          answer:`-Il ne faut Jamais ouvrir la bouteille sans détendeur.<br>
          -Il ne faut Jamais porter la bouteille par son détendeur.<br>
          -Il ne faut Jamais forcer l’écrou du détendeur, visser et serrer-le à la main sur le robinet de la bouteille, et dans le sens inverse des aiguilles d’une montre.<br>
          -Il ne faut Jamais chercher à déceler des fuites de gaz à l’aide d’une flamme.` }
        
      ]
    }
  ];

  // helpers
  function addBot(htmlOrNode){
    const b = document.createElement('div');
    b.className = 'faq-msg bot';
    if (typeof htmlOrNode === 'string') b.innerHTML = htmlOrNode; else b.appendChild(htmlOrNode);
    thread.appendChild(b);
    // keep scroll inside the card
    cardChat.scrollTo({ top: cardChat.scrollHeight, behavior: 'smooth' });
    return b;
  }
  function addUser(text){
    const u = document.createElement('div');
    u.className = 'faq-msg user';
    u.textContent = text;
    thread.appendChild(u);
    cardChat.scrollTo({ top: cardChat.scrollHeight, behavior: 'smooth' });
    return u;
  }
  function chips(items, { addBack=false, backLabel='← Retour', onClick } = {}){
    const wrap = document.createElement('div');
    wrap.className = 'faq-choices';
    if (addBack){
      const back = document.createElement('button');
      back.type='button'; back.className='faq-choice faq-back'; back.textContent=backLabel;
      back.addEventListener('click',()=>onClick && onClick({back:true}));
      wrap.appendChild(back);
    }
    items.forEach(it=>{
      const btn=document.createElement('button');
      btn.type='button'; btn.className='faq-choice'; btn.textContent=it.label;
      btn.addEventListener('click',()=>onClick && onClick(it));
      wrap.appendChild(btn);
    });
    return wrap;
  }
  function crumbTrail(cat, q){
    const bar=document.createElement('div'); bar.className='faq-crumbs';
    const c1=document.createElement('span'); c1.className='faq-crumb'; c1.textContent=cat; bar.appendChild(c1);
    if(q){ const sep=document.createElement('span'); sep.textContent='›'; sep.style.opacity='.6'; sep.style.padding='0 .25rem'; bar.appendChild(sep);
      const c2=document.createElement('span'); c2.className='faq-crumb'; c2.textContent=q; bar.appendChild(c2);}
    return bar;
  }

  function showCategories(prefaceHtml){
    const bot = addBot(prefaceHtml || `Bonjour  Choisissez une <strong>catégorie</strong> :`);
    bot.appendChild(chips(CATEGORIES,{
      onClick:(cat)=>{ if(cat.back) return; addUser(cat.label); setTimeout(()=>showQuestions(cat),160); }
    }));
  }
  function showQuestions(cat){
    const bot=addBot(`<strong>${cat.label}</strong><br>${cat.intro}`);
    bot.appendChild(crumbTrail(cat.label));
    bot.appendChild(chips(cat.questions,{
      addBack:true, backLabel:'← Retour aux catégories',
      onClick:(sel)=>{
        if(sel.back){ addUser('Retour aux catégories'); return setTimeout(()=>showCategories(),160); }
        addUser(sel.label); setTimeout(()=>showAnswer(cat,sel),160);
      }
    }));
  }
  function showAnswer(cat, q){
    const a=addBot(`<strong>Réponse</strong>`); a.appendChild(crumbTrail(cat.label,q.label));
    const d=document.createElement('div'); d.style.marginTop='.35rem'; d.innerHTML=q.answer; a.appendChild(d);
    setTimeout(()=>{
      const follow=addBot(`Vous avez une autre question dans <strong>${cat.label}</strong> ?`);
      follow.appendChild(chips(cat.questions,{
        addBack:true, backLabel:'← Changer de catégorie',
        onClick:(sel)=>{
          if(sel.back){ addUser('Changer de catégorie'); return setTimeout(()=>showCategories(),140); }
          addUser(sel.label); setTimeout(()=>showAnswer(cat,sel),140);
        }
      }));
    },180);
  }

  // Start → hide intro body, show chat area inside the same card
  startBtn.addEventListener('click',()=>{
    card.classList.add('is-running');
    document.querySelector('.faq-intro-body')?.setAttribute('hidden','true');
    cardChat.hidden=false;

    const introMsg =
      `<strong>Naftal Khadamat</strong><br>
       Choisissez une <strong>catégorie</strong> , puis votre question :`;
    showCategories(introMsg);
  });

  // Optional: auto-open
  // if (location.hash === '#faq') startBtn.click();
})();
