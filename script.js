// ---- Menu: modifica qui piatti, prezzi e allergeni ----
// Allergeni disponibili: glutine, lattosio, pesce, uova  (v:true = vegetariana)
var ALG = {glutine:"Glutine", lattosio:"Lattosio", pesce:"Pesce", uova:"Uova"};
var MENU = [
  {n:"Margherita", d:"Pomodoro pelato, fior di latte e basilico", p:8.5, c:"classiche", v:true, a:["glutine","lattosio"]},
  {n:"Marinara", d:"Pomodoro pelato, aglio, origano, olio EVO", p:7, c:"classiche", v:true, a:["glutine"]},
  {n:"Diavola", d:"Pomodoro pelato, fior di latte, salame piccante", p:9.5, c:"classiche", a:["glutine","lattosio"]},
  {n:"Napoli", d:"Pomodoro pelato, fior di latte, acciughe, capperi", p:9, c:"classiche", a:["glutine","lattosio","pesce"]},
  {n:"Verace", d:"Pomodoro pelato, mozzarella di bufala campana DOP, olio EVO", p:12, c:"speciali", v:true, a:["glutine","lattosio"]},
  {n:"Margherita del pizzaiolo", d:"Pomodoro pelato, provola affumicata, pomodorino scottato, scaglie di cacioricotta", p:11, c:"speciali", v:true, a:["glutine","lattosio"]},
  {n:"Salsiccia e friarielli", d:"Fior di latte, salsiccia, friarielli saltati", p:11, c:"speciali", a:["glutine","lattosio"]},
  {n:"Montanara", d:"Pizza fritta e passata in forno, pomodoro e basilico", p:8, c:"fritti", v:true, a:["glutine"]},
  {n:"Frittatina di pasta", d:"Bucatini, besciamella, piselli e prosciutto", p:4, c:"fritti", a:["glutine","lattosio","uova"]},
  {n:"Crocchè di patate", d:"Patate, prezzemolo e provola (3 pezzi)", p:4.5, c:"fritti", v:true, a:["glutine","lattosio","uova"]},
  {n:"Babà al rum", d:"Fatto in casa, con crema chantilly", p:5.5, c:"dolci", v:true, a:["glutine","lattosio","uova"]},
  {n:"Pastiera", d:"Grano, ricotta e fiori d’arancio", p:5.5, c:"dolci", v:true, a:["glutine","lattosio","uova"]}
];

var list = document.getElementById("items");
function fmt(n){ return n.toFixed(2).replace(".", ",") + " €"; }
MENU.forEach(function(m){
  var li = document.createElement("li");
  li.className = "item"; li.dataset.cat = m.c;
  li.innerHTML = '<div class="top"><h3></h3></div><p></p><div class="allergens"></div>' +
    '<div class="priceline"><span>Prezzo</span><span class="fill"></span><span class="price"></span></div>';
  li.querySelector("h3").textContent = m.n;
  li.querySelector("p").textContent = m.d;
  li.querySelector(".price").textContent = fmt(m.p);
  if (m.v) {
    var v = document.createElement("span");
    v.className = "veg"; v.textContent = "V"; v.setAttribute("role", "img"); v.setAttribute("aria-label", "Vegetariana");
    li.querySelector(".top").appendChild(v);
  }
  var box = li.querySelector(".allergens");
  (m.a || []).forEach(function(k){
    var s = document.createElement("span");
    s.className = "alg"; s.title = ALG[k]; s.setAttribute("role", "img"); s.setAttribute("aria-label", "Contiene " + ALG[k].toLowerCase());
    s.innerHTML = '<svg aria-hidden="true"><use href="#i-' + k + '"/></svg>';
    box.appendChild(s);
  });
  list.appendChild(li);
});

// ---- Filtri del menu ----
var filterBtns = document.querySelectorAll(".filters button");
filterBtns.forEach(function(b){
  b.addEventListener("click", function(){
    filterBtns.forEach(function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    list.querySelectorAll(".item").forEach(function(li){
      li.hidden = !(b.dataset.cat === "tutto" || li.dataset.cat === b.dataset.cat);
    });
  });
});

// ---- Menu mobile ----
var mb = document.getElementById("menuBtn"), nl = document.getElementById("navList");
mb.addEventListener("click", function(){
  var open = nl.classList.toggle("open");
  mb.setAttribute("aria-expanded", open);
});
nl.addEventListener("click", function(e){ if (e.target.tagName === "A") { nl.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); } });

// ---- Gallery: foto a schermo intero ----
var lb = document.getElementById("lb"), lbImg = lb.querySelector("img");
document.querySelectorAll(".shot").forEach(function(b){
  b.addEventListener("click", function(){
    var img = b.querySelector("img");
    lbImg.src = img.src; lbImg.alt = img.alt; lb.showModal();
  });
});
lb.addEventListener("click", function(){ lb.close(); });

// ---- Aperto adesso (si vede solo quando siamo aperti) ----
// Fasce in minuti dall'inizio del giorno (0 = domenica)
var SLOTS = {
  0:[[720,900],[1110,1410]], 1:[], 2:[[1110,1410]], 3:[[1110,1410]],
  4:[[1110,1410]], 5:[[1110,1440]], 6:[[720,900],[1110,1440]]
};
function updateStatus(){
  var now = new Date(), d = now.getDay(), m = now.getHours()*60 + now.getMinutes();
  var open = (SLOTS[d] || []).some(function(s){ return m >= s[0] && m < s[1]; });
  document.getElementById("status").hidden = !open;
  document.querySelectorAll("#hours tr").forEach(function(tr){ tr.classList.toggle("today", Number(tr.dataset.d) === d); });
}
updateStatus(); setInterval(updateStatus, 60000);

document.getElementById("year").textContent = new Date().getFullYear();
