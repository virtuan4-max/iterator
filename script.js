// --- Audio ---
const rain = new Audio('https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/audio/rain.wav');
const enterclick = new Audio('https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/audio/UI_UIArp.wav');
const clickhigh = new Audio('https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/audio/UI_UIMetal1.wav');
const randomgods = new Audio('https://cdn.jsdelivr.net/gh/virtuan4-max/iterator@main/assets/audio/NA_41_-_Random_Gods_(Theme_III).mp3');
const sounds = [enterclick, clickhigh];
const music = [randomgods]

rain.loop = true;
rain.volume = 0;
randomgods.loop = true;

// --- Document 'n functions ---

//ids
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const intro = document.getElementById('intro');
const introclick = document.getElementById('introclick');
const settingsbutton = document.getElementById('settings');
const introyncheck = document.getElementById('introyncheck');
const audiotoggle = document.getElementById('audiotoggle');
const musictoggle = document.getElementById('musictoggle');
const backcategory = document.getElementById('backcat');
const pearlselect = document.getElementById('selper');
const catgselect = document.getElementById('selcat');
const pearlimagecolor = document.getElementById('pearlcolorinput');
const crossimagecolor = document.getElementById('crosscolorinput');
const pearlimage = document.getElementById('pearlimage');
const nameinput = document.getElementById('pearlnameinput');
const addbutton = document.getElementById('addbutton');
const categoryimagecolor = document.getElementById('catcolorinput');
const categorypreview = document.getElementById('categorypreview');



// classes
const settingsmodal = document.querySelector('.settingsmodal');
const pearlmodal = document.querySelector('.addpearlmodal');
const maincontent = document.querySelector('.maincontent');
const selectedpearl = document.querySelector('.selectedpearl');
const selectedcat = document.querySelector('.selectedcat');



// events  for inputs
audiotoggle.addEventListener('input', updateVolume);
musictoggle.addEventListener('input', updateVolume);
nameinput.addEventListener('input', toggleaddbutton);
pearlimagecolor.addEventListener('input', updatepearlimagecolors);
crossimagecolor.addEventListener('input', updatepearlimagecolors);
categoryimagecolor.addEventListener('input', updatepearlimagecolors);


// display
maincontent.style.display = 'none';
settingsmodal.style.display = 'none';
pearlmodal.style.display = "none";
backcategory.style.display = 'none';
selectedpearl.style.display = "block"
selectedcat.style.display = "none"


// audiobars
audiotoggle.min = 0;
audiotoggle.max = 100;
musictoggle.min = 0;
musictoggle.max = 100;

// state 
let settingsmodalon = false;
let pearlmodalon = false;
let selectedadd = "pearl";
let introPlayed = false;
let allpearls = [];
let layer = "top";
let pearlcolor = pearlimagecolor.value;
let pearlcross = crossimagecolor.value;
let catglyph = categoryimagecolor.value;

//colors
let accent = '#C40039';
let backgroundcolor = '#000000';
let text = '#FFFFFF';
let idlemenu = '#A9A4B2';

// localstorage & stuff for settings
let introplay = localStorage.getItem('introplay')
if (introplay === null) {
    introplay = true
} else {
    introplay = introplay === 'true';
    introyncheck.style.display = 'none';
}
if (introplay === true) {
    introyncheck.style.display = 'block';
}

let audiovol = parseFloat(localStorage.getItem('audiovol'));
if (isNaN(audiovol)) audiovol = 1;

audiotoggle.value = audiovol * 100;

let musicvol = parseFloat(localStorage.getItem('musicvol'));
if (isNaN(musicvol)) musicvol = 1;

musictoggle.value = musicvol * 100;
updateVolume()

//clicks for buttons
document.addEventListener('click', (e) => {
    //pearls and related
    const categoryclicked = e.target.closest(".category")
    if (categoryclicked) {
        layer = categoryclicked.id
        updatepearls(layer);
    }
    if (e.target.closest('#backcat')) {
        layer = getupperlayer(layer);
        updatepearls(layer);
    }

    //buttons making clicky noises
    if (e.target.closest('.circlebutton')) {
        clickhigh.currentTime = 0;
        clickhigh.play()
    }
    if (e.target.closest('.rectbutton')) {
        clickhigh.currentTime = 0;
        clickhigh.play()
    }
    if(e.target.closest('.centerimage')) {
        clickhigh.currentTime = 0;
        clickhigh.play();         
    }

    //buttons being buttons
    if(e.target.closest('#settings')) {
        settingsmodalon = true;
        maincontent.style.display = 'none';
        settingsmodal.style.display = 'block';      
    }
    if (e.target.closest('#addpearl')) {
        pearlmodalon = true;
        selectedadd = "pearl";
        maincontent.style.display = 'none';
        pearlmodal.style.display = 'block';
        pearlselect.style.filter = "brightness(0) invert(1)";
        pearlselect.style.zIndex = "4";
    }
    if (e.target.closest('#selper')) {
        catgselect.style.removeProperty('filter');
        catgselect.style.removeProperty("z-index");
        pearlselect.style.filter = "brightness(0) invert(1)";
        pearlselect.style.zIndex = "4";
        selectedadd = "pearl";
        selectedpearl.style.display = "block"
        selectedcat.style.display = "none"
        clearaddpearl();

    }
    if (e.target.closest('#selcat')) {
        pearlselect.style.removeProperty('filter');
        pearlselect.style.removeProperty("z-index");
        catgselect.style.filter = "brightness(0) invert(1)";
        catgselect.style.zIndex = "4";
        selectedadd = "category";
        selectedpearl.style.display = "none"
        selectedcat.style.display = "block"
        clearaddpearl();
    }

    if (e.target.closest('#back')) {
        settingsmodalon = false;
        pearlmodalon = false;
        maincontent.style.display = 'block';
        settingsmodal.style.display = 'none';
        pearlmodal.style.display = 'none';
        setpearlactive();
        clearaddpearl();

    }
    
    //settigns modal
    if (e.target.closest('#introyn')) {
        if(introplay == true) {
            introplay = false
            introyncheck.style.display = 'none';
            localStorage.setItem("introplay", introplay);

        } else {
            introplay = true
            introyncheck.style.display = 'block';
            localStorage.setItem("introplay", introplay);

        }
    };

    //add pealrs modal
    if (e.target.closest('#addbutton')) {
        pearlmodalon = false;
        pearlmodal.style.display = 'none';
        maincontent.style.display = 'block';
        if (selectedadd === "pearl") {
            addpearl(nameinput.value, layer, pearlcolor, pearlcross);
            updatepearls(layer);
        } else {
            addcategory(nameinput.value, layer, catglyph);
            updatepearls(layer);

        }
        setpearlactive();
        clearaddpearl();
    };    
    

    //intro
    if (!introPlayed) {
        introPlayed = true;
        enterclick.play();
    
        introclick.classList.add('fade');
        introclick.addEventListener('transitionend', () => introclick.remove());
        rain.play()
        if (introplay == true) {
            introSequence();
        }
        else {
            entermaincontent();
        }
    };
});

//helpers or other functions
function updatepearlimagecolors() {
    pearlcolor = pearlimagecolor.value;
    pearlcross = crossimagecolor.value;
    catglyph = categoryimagecolor.value;
    pearlimage.style.setProperty('--color', pearlcolor);
    pearlimage.style.setProperty('--cross', pearlcross);
    categorypreview.style.setProperty('--color', catglyph);

}
function toggleaddbutton() {
    let input = nameinput.value;
    if (input === "") {
        addbutton.style.opacity = "0.5";
        addbutton.style.pointerEvents = "none";
        categorypreview.textContent = "D";

    } else {
        addbutton.style.opacity = "1";
        addbutton.style.pointerEvents = "auto";
        categorypreview.textContent = Array.from(input)[0].toUpperCase();

    }
}
function clearaddpearl() {
    pearlimagecolor.value = "#929292";
    crossimagecolor.value = "#FFFFFF";
    categoryimagecolor.value = accent;
    categorypreview.textContent = "D";
    addbutton.style.opacity = "0.5";
    addbutton.style.pointerEvents = "none";

    nameinput.value = "";
    updatepearlimagecolors();

}
function setpearlactive() {
    catgselect.style.removeProperty('filter');
    catgselect.style.removeProperty('z-index');
    pearlselect.style.filter = "brightness(0) invert(1)";
    pearlselect.style.zIndex = "4";
    selectedcat.style.display = "none"
    selectedpearl.style.display = "block"
}

function fadevolume(audio, from, to, duration, onDone) {
    const steps = 60;
    const interval = duration / steps;
    const delta = (to - from) / steps;
    let current = from;
    let count = 0;

    const id = setInterval(() => {
        count++;
        current += delta;
        audio.volume = Math.min(Math.max(current, 0), 1);
        if (count >= steps) {
            clearInterval(id);
            audio.volume = to;
            if (onDone) onDone();
        }

    }, interval);
}
function updateVolume() {
    let vol = audiotoggle.value / 100;
    localStorage.setItem("audiovol", vol);
    sounds.forEach(sound => {
        sound.volume = vol;
        }
    );
    vol = musictoggle.value / 100;
    localStorage.setItem("musicvol", vol);
    music.forEach(music => {
        if (music == randomgods) {
            music.volume = vol * 0.09
        } else {
            music.volume = vol
        }
    });
}


//intro
function entermaincontent() {
    intro.remove();
    if (maincontent) {
        maincontent.style.opacity = '0';
        maincontent.style.visibility = 'visible';
        maincontent.style.display = 'block';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => { 
                maincontent.style.transition = 'opacity 3s ease';
                maincontent.style.opacity = '1';
            });
        });
    }
    randomgods.volume = 0;
    randomgods.play();
    if (introplay == true) {
        fadevolume(rain, 1 * audiovol, 0, 3000, () => rain.pause());
    }
    fadevolume(randomgods, 0, 0.09 * musicvol, 3000);
}
function introSequence() {
    rain.volume= 0;  
    fadevolume(rain, 0,1 * audiovol ,2500, () => {
        title.style.transition = 'opacity 3s ease';
        title.style.opacity = '1';

        setTimeout(() => {
            subtitle.style.transition = 'opacity 3s ease';
            subtitle.style.opacity = '1';

            setTimeout(() => {
                title.style.transition = 'opacity 3s ease';
                subtitle.style.transition = 'opacity 3s ease';
                title.style.opacity = '0';
                subtitle.style.opacity = '0';

                setTimeout(entermaincontent, 3000);
            }, 6000);
        }, 3000);
    });
}

//pearls list
function findcategory(list, name) {
    for (const item of list) {
        if (item.type === "category") {
            if (item.name === name) return item;

            const found = findcategory(item.children, name);
            if (found) return found;
        }
    }
    return null;
}

function addcategory(name, categoryname = null, color = accent) {
    const newcategory = {
        type: "category",
        name,
        color,
        children: []
    };

    if (!categoryname || categoryname === 'top') {
        allpearls.push(newcategory);
        return;
    }

    const parent = findcategory(allpearls, categoryname);

    if (!parent) {
        console.error("parent category not found");
        return;
    }

    parent.children.push(newcategory);
}

function addpearl(name, categoryname = null, color = '#888', cross = '#fff') {
    const newpearl = {
        type: "pearl",
        name,
        color,
        cross,
    };

    if (!categoryname || categoryname === 'top') {
        allpearls.push(newpearl);
        return;
    }

    const category = findcategory(allpearls, categoryname);

    if (!category) {
        console.error("category not found");
        return;
    }

    category.children.push(newpearl);

}

function getupperlayer(layername) {
    if (layername === "top") return "top";

    function search(list, target, parent = null) {
        for (const item of list) {
            if (item.type === "category") {
                if (item.name === target) {
                    return parent ? parent.name : "top";
                }
                const result = search(item.children, target, item);
                if (result !== null) return result;
            }
        }
        return null;
    }

    let parent = search(allpearls, layername);
    if (parent === null) {
        return "top";
    } else {
        return parent;
    }
}



// --- Orbiting pearls ---
addcategory("rainworldpearls", null, '#fff')
addpearl("spearmasterpearl", "rainworldpearls", '#15111a', '#b80000')
addpearl("orange", "rainworldpearls", '#ff7a02', '#ffc776')
addpearl("silver", "rainworldpearls", '#b2b2b2', '#e7e7e7')
addpearl("black", "rainworldpearls", '#191919', '#727272')

//all this is in radians and i lwk prefer degrees but ig its not like that here lol
//x = centerx + cos(angle) * radius
//y = centery + sin(angle) * radius
//r = 0.085 is perfectly in the center of the rings
//pearls in like lists and functions refers to both pearls and the categories in the layer

const r = 0.15;
let angles = new Map();
let speed = 0.001


function collectpearls(categoryname = "top") {
  if (categoryname === "top") {
    return allpearls;
  }
  const category = findcategory(allpearls, categoryname);
  return category.children;
}

function renderpearls(pearlsforanimate) {
  document.querySelectorAll(".pearl, .category").forEach(pearl => {
    pearl.remove();
    angles.delete(pearl.id); 
  });
  angles.clear()

  pearlsforanimate.forEach((pearl, i) => {

    const div = document.createElement("div");

    if (pearl.type === "category") {
        div.classList.add("category");
        div.textContent = [...pearl.name].slice(0, 2).join('').toUpperCase();
        div.id = pearl.name;
        div.style.color = pearl.color;

    }
    if (pearl.type === "pearl") {
        div.classList.add("pearl");
        div.id = pearl.name;
        div.style.setProperty('--color', pearl.color);
        div.style.setProperty('--cross', pearl.cross);

    }

    maincontent.appendChild(div);
    angles.set(pearl.name, (2 * Math.PI / pearlsforanimate.length) * i); 
  });
}

function animatepearls() {
    document.querySelectorAll(".pearl, .category").forEach(pearl => {
        let angle = angles.get(pearl.id);
        if (angle === undefined) return;
        angle += speed;
        angles.set(pearl.id, angle); 

        let centerx = window.innerWidth / 2;
        let centery = window.innerHeight / 2;
        let radius = window.innerWidth * r;
        const x = centerx + Math.cos(angle) * radius; 
        const y = centery + Math.sin(angle) * radius;

        pearl.style.position = "absolute";
        pearl.style.left = x + "px";
        pearl.style.top  = y + "px";
        pearl.style.transform = "translate(-50%, -50%)";
    });

    requestAnimationFrame(animatepearls);
}

function updatepearls(layer) {
    if (layer === "top") {
        backcategory.style.display = 'none'
    } else {
        backcategory.style.display = 'block'
    };
    let pearls = collectpearls(layer); 
    renderpearls(pearls);
}



//all innitialization functions
updatepearlimagecolors();
toggleaddbutton();

updatepearls(layer);
animatepearls();
