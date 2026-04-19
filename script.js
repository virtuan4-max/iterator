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

// --- Document 'n crap ---

//ids
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const intro = document.getElementById('intro');
const introclick = document.getElementById('introclick');
const settingsbutton = document.getElementById('settings');
const introyncheck = document.getElementById('introyncheck');
const audiotoggle = document.getElementById('audiotoggle');
const musictoggle = document.getElementById('musictoggle');

// classes
const settingsmodal = document.querySelector('.settingsmodal');
const maincontent = document.querySelector('.maincontent');

// events   
document.addEventListener("keydown", handlekeypress);
audiotoggle.addEventListener('input', updateVolume);
musictoggle.addEventListener('input', updateVolume);

// display
maincontent.style.display = 'none';
settingsmodal.style.display = 'none'

// audiobars
audiotoggle.min = 0;
audiotoggle.max = 100;
musictoggle.min = 0;
musictoggle.max = 100;

// state 
let settingsmodalon = false
let introPlayed = false
let allpearls = []
//{
//category: "Wisdom",
//pearls: ["Patience", "Clarity"]
//}

// localstorage & stuff for settings
let introplay = localStorage.getItem('introplay')
if (introplay == null) {
    introplay = true
} else {
    introplay = introplay === 'true';
    introyncheck.style.display = 'none';
}
if (introplay == true) {
    introyncheck.style.display = 'block';
}

let audiovol = parseFloat(localStorage.getItem('audiovol'));
if (isNaN(audiovol)) audiovol = 1;

audiotoggle.value = audiovol * 100;

let musicvol = parseFloat(localStorage.getItem('musicvol'));
if (isNaN(musicvol)) musicvol = 1;

musictoggle.value = musicvol * 100;
updateVolume()

document.addEventListener('click', (e) => {
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
        addtopearls();
    }
    if (e.target.closest('#back')) {
        settingsmodalon = false;
        maincontent.style.display = 'block';
        settingsmodal.style.display = 'none';
    }
    
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
    }

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
    }
});

function handlekeypress(event) {
    const key = event.key;
    if (key.toLowerCase() === "s") {
        rain.pause();
        entermaincontent();
    }
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
function addcategory(name, parentcategoryname = null) {
  const newcategory = {
    type: "category",
    name,
    children: []
  };

  if (!parentcategoryname) {
    allpearls.push(newcategory);
    return;
  }

  const parent = findcategory(allpearls, parentcategoryname);

  if (!parent) {
    console.error("parent category not found");
    return;
  }

  parent.children.push(newcategory);
}
function addpearl(name, categoryname = null) {
  const newpearl = {
    type: "pearl",
    name
  };
  if (!categoryname) {
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
function addtopearls() {
    //will replace with modal but this is better for rn
    let pick = prompt("New category or pearl? (enter c for category or p for pearl)")
    if (pick == "c") {
        let name = prompt("enter category name");
        addcategory(name);
    } else {
        let name = prompt("enter name");
        addpearl(name);
    }
    console.log(allpearls);
}