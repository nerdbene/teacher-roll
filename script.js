// 🎲 Let's get this party rolling! (pun intended)
document.addEventListener('DOMContentLoaded', () => {
    initializeDie();
});

// 🎯 The secret sauce of our magical die
let currentDieType = 6;
let currentStyle = 'text';
let dieContent = {
    text: Array(20).fill('').map((_, i) => (i + 1).toString()),
    color: Array(20).fill('#ffffff'),
    image: Array(20).fill('')
};

// 🔧 The tools of our trade (aka DOM Elements)
const die = document.getElementById('dice');
const rollButton = document.getElementById('rollButton');
const dieTypeSelect = document.getElementById('diceType');
const sideCustomization = document.getElementById('sideCustomization');
const styleButtons = document.querySelectorAll('.style-btn');

// 🚀 Houston, we're ready for launch!
function initializeDie() {
    currentDieType = parseInt(dieTypeSelect.value);
    createDieFaces();
    updateSideCustomization();
}

// 🎨 Time to give our die a makeover
function createDieFaces() {
    die.innerHTML = '';
    for (let i = 0; i < currentDieType; i++) {
        const face = document.createElement('div');
        face.className = `face face-${i + 1}`;
        updateFaceContent(face, i);
        die.appendChild(face);
    }
}

// 🎭 Dress up each face with style
function updateFaceContent(face, index) {
    face.innerHTML = '';
    switch (currentStyle) {
        case 'text':
            face.textContent = dieContent.text[index];
            break;
        case 'color':
            face.style.backgroundColor = dieContent.color[index];
            break;
        case 'image':
            if (dieContent.image[index]) {
                const img = document.createElement('img');
                img.src = dieContent.image[index];
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                face.appendChild(img);
            }
            break;
    }
}

// 🎪 Setting up the customization circus
function updateSideCustomization() {
    sideCustomization.innerHTML = '';
    for (let i = 0; i < currentDieType; i++) {
        const sideDiv = document.createElement('div');
        sideDiv.className = 'side-input';
        
        const label = document.createElement('label');
        label.textContent = `Side ${i + 1}:`;
        sideDiv.appendChild(label);
        
        switch (currentStyle) {
            case 'text':
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.value = dieContent.text[i];
                textInput.addEventListener('change', (e) => {
                    dieContent.text[i] = e.target.value;
                    updateDie();
                });
                sideDiv.appendChild(textInput);
                break;
                
            case 'color':
                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = dieContent.color[i];
                colorInput.addEventListener('change', (e) => {
                    dieContent.color[i] = e.target.value;
                    updateDie();
                });
                sideDiv.appendChild(colorInput);
                break;
                
            case 'image':
                const imageButton = document.createElement('button');
                imageButton.className = 'image-upload-btn';
                imageButton.textContent = dieContent.image[i] ? 'Change Image' : 'Upload Image';
                
                const imageInput = document.createElement('input');
                imageInput.type = 'file';
                imageInput.accept = 'image/*';
                imageInput.style.display = 'none';
                imageInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            dieContent.image[i] = event.target.result;
                            imageButton.textContent = 'Change Image';
                            updateDie();
                        };
                        reader.readAsDataURL(file);
                    }
                });
                
                imageButton.addEventListener('click', () => imageInput.click());
                sideDiv.appendChild(imageButton);
                sideDiv.appendChild(imageInput);
                break;
        }
        
        sideCustomization.appendChild(sideDiv);
    }
}

// 🎰 The moment of truth - let it roll!
function rollDie() {
    die.className = 'dice'; // Reset animations
    
    // Calculate result first
    const result = Math.floor(Math.random() * currentDieType) + 1;
    
    // Calculate final rotation based on the result
    const finalRotations = {
        1: { x: 0, y: 0, z: 0 },        // Front face
        2: { x: 0, y: 90, z: 0 },       // Right face
        3: { x: 0, y: 180, z: 0 },      // Back face
        4: { x: 0, y: -90, z: 0 },      // Left face
        5: { x: -90, y: 0, z: 0 },      // Top face
        6: { x: 90, y: 0, z: 0 }        // Bottom face
    };

    const finalRotation = finalRotations[result] || finalRotations[1];
    
    // Apply animation
    requestAnimationFrame(() => {
        // Add extra rotations for spinning effect
        const extraSpins = {
            x: Math.floor(Math.random() * 2) * 360,
            y: Math.floor(Math.random() * 2) * 360,
            z: 0
        };
        
        // Initial random position
        die.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
        
        // Trigger reflow
        die.offsetHeight;
        
        // Add animation class and set final transform
        die.classList.add('spin-animation');
        die.style.transform = `rotateX(${finalRotation.x + extraSpins.x}deg) 
                             rotateY(${finalRotation.y + extraSpins.y}deg) 
                             rotateZ(${finalRotation.z + extraSpins.z}deg)`;
    });
}

// 👂 Keeping our ears open for any action
dieTypeSelect.addEventListener('change', initializeDie);

styleButtons.forEach(button => {
    button.addEventListener('click', () => {
        styleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentStyle = button.dataset.style;
        updateSideCustomization();
        updateDie();
    });
});

rollButton.addEventListener('click', rollDie);

// 🔄 Quick refresh of our die's appearance
// I like some girl that I know
// I don't know if she likes me tho.
// weird way to finish this app.
function updateDie() {
    const faces = die.querySelectorAll('.face');
    faces.forEach((face, index) => {
        updateFaceContent(face, index);
    });
}