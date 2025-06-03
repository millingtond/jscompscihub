document.addEventListener('DOMContentLoaded', function () {
    // Common worksheet functionalities
    if (typeof setupReadCheckboxes === 'function') setupReadCheckboxes();
    if (typeof updateFooterYear === 'function') updateFooterYear();
    if (typeof setupResetAllTasks === 'function') setupResetAllTasks();
    if (typeof setupPdfExport === 'function') setupPdfExport();

    // --- Conditional Mark Scheme Buttons & Reveal Impact Buttons ---
    const examTextareas = document.querySelectorAll('.exam-answer-textarea');
    const minCharsForReveal = 40; 

    examTextareas.forEach(textarea => {
        // For Mark Scheme buttons
        const qIdParts = textarea.id.split('-');
        if (qIdParts[0] === 'exam' && qIdParts.length > 1) { // exam-qX
            const qId = qIdParts[1]; 
            const buttonId = `ms-button-${qId}`;
            const button = document.getElementById(buttonId);
            if (button) {
                textarea.addEventListener('input', function() {
                    if (this.value.trim().length >= minCharsForReveal) {
                        button.disabled = false;
                        button.title = "Show Mark Scheme";
                    } else {
                        button.disabled = true;
                        button.title = `Type at least ${minCharsForReveal} characters to enable.`;
                    }
                });
                button.disabled = true; 
                button.title = `Type at least ${minCharsForReveal} characters to enable.`;
            }
        }

        // For Reveal Suggested Impacts buttons (e.g., virus-impact-student -> reveal-virus-impact-btn)
        if (textarea.id.includes('-impact-student')) {
            const impactType = textarea.id.substring(0, textarea.id.indexOf('-impact-student'));
            const revealButtonId = `reveal-${impactType}-impact-btn`;
            const revealButton = document.getElementById(revealButtonId);
            if (revealButton) {
                 textarea.addEventListener('input', function() {
                    if (this.value.trim().length >= minCharsForReveal) {
                        revealButton.disabled = false;
                        revealButton.title = "Reveal Suggested Impacts";
                    } else {
                        revealButton.disabled = true;
                        revealButton.title = `Type at least ${minCharsForReveal} characters to enable.`;
                    }
                });
                revealButton.disabled = true; // Initial state
                revealButton.title = `Type at least ${minCharsForReveal} characters to enable.`;
            }
        }
    });
    
    // --- Keylogger Demo ---
    const fakePasswordInput = document.getElementById('fake-password');
    const keyloggerOutput = document.getElementById('keylogger-output');
    const hackerServerLog = document.getElementById('hacker-server-log');
    const transmissionIndicator = document.getElementById('transmission-indicator');

    if (fakePasswordInput && keyloggerOutput && hackerServerLog && transmissionIndicator) {
        fakePasswordInput.addEventListener('input', function() {
            keyloggerOutput.textContent = this.value;
            hackerServerLog.textContent = this.value; 
            if (this.value.length > 0) {
                transmissionIndicator.classList.remove('hidden');
            } else {
                transmissionIndicator.classList.add('hidden');
            }
        });
    }

    // --- Drag and Drop ---
    setupDragAndDrop();

    // --- Initialize Network Virus Sim (for Virus Section) ---
    if (typeof netVirus_initSimulation === 'function') {
        netVirus_initSimulation();
    }
    // --- Initialize Advanced Worm Sim (for Worm Section) ---
    if (typeof advWormSim_initSimulation === 'function') { 
        advWormSim_initSimulation();
    }
    // --- Initialize NEW Brute Force Sim ---
    if (typeof bruteForceAdv_init === 'function') {
        bruteForceAdv_init();
    }
    
    resetVirusSim(); // Call reset to set initial state for local file virus sim

}); // End DOMContentLoaded


// --- Task 1: Identify the Threat! ---
function checkThreatQuestion(selectId, correctAnswer, feedbackId) {
    const selectElement = document.getElementById(selectId);
    const feedbackElement = document.getElementById(feedbackId);
    const userAnswer = selectElement.value;
    const quizItem = selectElement.closest('.quiz-item');

    if (!selectElement || !feedbackElement || !quizItem) return;

    if (userAnswer === correctAnswer) {
        feedbackElement.innerHTML = '<span class="text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i>Correct!</span> Well done.';
        feedbackElement.className = 'feedback-area-inline text-green-700 show';
        quizItem.dataset.answeredCorrectly = "true";
    } else if (userAnswer === "") {
        feedbackElement.innerHTML = '<span class="text-yellow-600 font-semibold"><i class="fas fa-exclamation-triangle mr-1"></i>Please select an answer.</span>';
        feedbackElement.className = 'feedback-area-inline text-yellow-700 show';
        quizItem.dataset.answeredCorrectly = "false";
    } else {
        feedbackElement.innerHTML = `<span class="text-red-600 font-semibold"><i class="fas fa-times-circle mr-1"></i>Incorrect.</span> The correct answer is <strong>${correctAnswer}</strong>.`;
        feedbackElement.className = 'feedback-area-inline text-red-700 show';
        quizItem.dataset.answeredCorrectly = "false";
    }
}

// --- Fill in the Blanks Functionality ---
function checkFillBlanks(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const inputs = container.querySelectorAll('.fill-in-blank');
    const feedbackDiv = container.querySelector('.feedback-area');
    let allCorrect = true;
    let answeredCount = 0;

    inputs.forEach(input => {
        const userAnswerRaw = input.value.trim();
        const userAnswers = userAnswerRaw.toLowerCase().split(/\s*(?:,|\/|or)\s*/).map(s => s.trim()).filter(s => s.length > 0);
        const correctAnswersRaw = input.dataset.answer;
        const correctAnswersArray = correctAnswersRaw.toLowerCase().split('|').map(s => s.trim());
        
        let isThisBlankCorrect = false;
        if (userAnswerRaw !== "") {
            answeredCount++;
            isThisBlankCorrect = userAnswers.some(ua => correctAnswersArray.includes(ua));
        }

        if (userAnswerRaw === "") {
            input.classList.remove('correct', 'incorrect');
            allCorrect = false; 
        } else if (isThisBlankCorrect) {
            input.classList.remove('incorrect');
            input.classList.add('correct');
        } else {
            input.classList.remove('correct');
            input.classList.add('incorrect');
            allCorrect = false;
        }
    });

    if (feedbackDiv) {
        if (answeredCount === 0) {
            feedbackDiv.innerHTML = '<span class="text-yellow-600">Please attempt to fill in some blanks.</span>';
        } else if (allCorrect && answeredCount === inputs.length) {
            feedbackDiv.innerHTML = '<span class="text-green-600 font-semibold">All correct! Great job!</span>';
        } else if (!allCorrect && answeredCount === inputs.length) {
            feedbackDiv.innerHTML = '<span class="text-red-600 font-semibold">Some answers are incorrect or missing. Please review.</span>';
        } else { 
             feedbackDiv.innerHTML = '<span class="text-blue-600">Keep going! Check the highlighted boxes.</span>';
        }
        feedbackDiv.className = 'feedback-area mt-2 show';
    }
}

function resetFillBlanks(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const inputs = container.querySelectorAll('.fill-in-blank');
    const feedbackDiv = container.querySelector('.feedback-area');

    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
    });
    if (feedbackDiv) {
        feedbackDiv.innerHTML = '';
        feedbackDiv.classList.remove('show');
    }
}


// --- Simulation Functions & Resets ---
let virusSimIntervals = []; // For local virus sim
let ransomwareSimIntervals = [];
// bruteForceSimIntervals is now handled by the new bruteForceAdv_ logic

// For Networked Virus Simulation (under Virus section)
let netVirus_computers_state = []; 
let netVirus_simulationActive_state = false;
let netVirus_fileCorruptionIntervals = {}; 
let netVirus_scanTimeouts = {};
let netVirus_blockedMessageTimeouts = {};
let netVirus_propagationTimeouts_list = []; 

// For Advanced Worm Simulation (under Worm section)
let advWormSim_computers_state = []; 
let advWormSim_simulationActive_state = false; 
let advWormSim_impactIntervals = {};
let advWormSim_scanTimeouts = {};
let advWormSim_blockedMessageTimeouts = {};
let advWormSim_propagationTimeouts_list = []; 


function clearSimIntervals(intervalArray) {
    intervalArray.forEach(id => clearInterval(id)); 
    intervalArray.length = 0; 
}
function clearSimTimeouts(timeoutArray) {
    timeoutArray.forEach(id => clearTimeout(id));
    timeoutArray.length = 0;
}


function resetVirusSim() { // This is for the LOCAL virus sim
    clearSimIntervals(virusSimIntervals);
    const simArea = document.getElementById('virus-sim-area');
    if (simArea) {
        simArea.innerHTML = `
            <div id="clean-file-1" class="sim-file"><i class="fas fa-file-alt sim-icon"></i> CleanFile1.exe</div>
            <div id="infected-file-user-click" class="sim-file cursor-pointer"><i class="fas fa-file-virus sim-icon text-red-500"></i> RiskyApp.exe</div>
            <div id="clean-file-2" class="sim-file"><i class="fas fa-file-alt sim-icon"></i> MyDocument.doc</div>
        `;
    }
    const statusP = document.getElementById('virus-sim-status');
    if (statusP) statusP.textContent = "";
}

function simulateVirusSpread() { // This is for the LOCAL virus sim
    resetVirusSim(); 
    const cleanFile1 = document.getElementById('clean-file-1');
    const cleanFile2 = document.getElementById('clean-file-2');
    const infectedIconHTML = '<i class="fas fa-file-virus sim-icon text-red-500"></i>';
    const statusP = document.getElementById('virus-sim-status');

    if (!statusP || !cleanFile1 || !cleanFile2) return;
    statusP.textContent = "RiskyApp.exe is running...";

    virusSimIntervals.push(setTimeout(() => {
        if(cleanFile1) {
            cleanFile1.classList.add('infected');
            cleanFile1.innerHTML = `${infectedIconHTML} Infected_File1.exe`;
        }
        statusP.textContent = "Virus is attaching to CleanFile1.exe...";
    }, 2500)); 
    virusSimIntervals.push(setTimeout(() => {
        if(cleanFile2) {
            cleanFile2.classList.add('infected');
            cleanFile2.innerHTML = `${infectedIconHTML} Infected_File2.doc`;
        }
        statusP.textContent = "Virus spread to MyDocument.doc! System compromised.";
    }, 5000)); 
}


function resetTrojanSim() {
    const statusP = document.getElementById('trojan-game-status');
    const alertMsg = document.getElementById('trojan-alert-message');
    const dataTransfer = document.getElementById('trojan-data-transfer');
    const appsArea = document.getElementById('trojan-apps-area');

    if (statusP) statusP.textContent = "";
    if (alertMsg) alertMsg.classList.add('hidden');
    if (dataTransfer) dataTransfer.classList.add('hidden');
    if (appsArea) { 
        appsArea.querySelectorAll('button').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('ring-4', 'ring-red-500', 'ring-green-500', 'opacity-50');
        });
    }
}

function checkTrojan(type, buttonId) {
    const statusP = document.getElementById('trojan-game-status');
    const alertMsg = document.getElementById('trojan-alert-message');
    const dataTransfer = document.getElementById('trojan-data-transfer');
    const clickedButton = document.getElementById(buttonId);
    const allButtons = document.querySelectorAll('#trojan-apps-area button');

    if (!statusP || !alertMsg || !dataTransfer || !clickedButton) return;

    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50');
    }); 
    clickedButton.classList.remove('opacity-50');


    if (type === 'trojan') {
        statusP.innerHTML = '<span class="text-red-600 font-semibold"><i class="fas fa-biohazard mr-1"></i>Trojan Activated!</span> It looked safe, but it\'s malicious!';
        alertMsg.classList.remove('hidden');
        dataTransfer.classList.remove('hidden');
        clickedButton.classList.add('ring-4', 'ring-red-500');
    } else {
        statusP.innerHTML = '<span class="text-green-600 font-semibold"><i class="fas fa-check-circle mr-1"></i>Safe Choice!</span> That app seems legitimate.';
        alertMsg.classList.add('hidden');
        dataTransfer.classList.add('hidden');
        clickedButton.classList.add('ring-4', 'ring-green-500');
    }
}


function resetKeyloggerSim() {
    const fakePasswordInput = document.getElementById('fake-password');
    const keyloggerOutput = document.getElementById('keylogger-output');
    const hackerServerLog = document.getElementById('hacker-server-log');
    const transmissionIndicator = document.getElementById('transmission-indicator');
    if (fakePasswordInput) fakePasswordInput.value = "";
    if (keyloggerOutput) keyloggerOutput.textContent = "";
    if (hackerServerLog) hackerServerLog.textContent = "";
    if (transmissionIndicator) transmissionIndicator.classList.add('hidden');
}


function resetRansomwareSim() {
    clearSimIntervals(ransomwareSimIntervals);
    const filesArea = document.getElementById('ransomware-files-area');
    if (filesArea) {
         filesArea.innerHTML = `
            <div id="doc1-ransom" class="sim-file"><i class="fas fa-file-word sim-icon"></i> MyDoc1.docx</div>
            <div id="pic1-ransom" class="sim-file"><i class="fas fa-file-image sim-icon"></i> Holiday.jpg</div>
            <div id="sheet1-ransom" class="sim-file"><i class="fas fa-file-excel sim-icon"></i> Budget.xlsx</div>
        `;
    }
    const ransomDemandDiv = document.getElementById('ransom-demand');
    if (ransomDemandDiv) ransomDemandDiv.classList.add('hidden');
}

function simulateRansomware() {
    resetRansomwareSim();
    const files = [
        { id: 'doc1-ransom', name: 'MyDoc1.docx', icon: 'fa-file-word' },
        { id: 'pic1-ransom', name: 'Holiday.jpg', icon: 'fa-file-image' },
        { id: 'sheet1-ransom', name: 'Budget.xlsx', icon: 'fa-file-excel' }
    ];
    const ransomDemandDiv = document.getElementById('ransom-demand');

    files.forEach((fileData, index) => {
        ransomwareSimIntervals.push(setTimeout(() => {
            const fileDiv = document.getElementById(fileData.id);
            if (fileDiv) {
                fileDiv.classList.add('locked'); 
                fileDiv.innerHTML = `<i class="fas fa-lock sim-icon text-orange-700"></i> ${fileData.name}`;
            }
        }, (index + 1) * 1800)); 
    });

    ransomwareSimIntervals.push(setTimeout(() => {
        if(ransomDemandDiv) ransomDemandDiv.classList.remove('hidden');
    }, (files.length + 1) * 1800)); 
}

// Old BruteForce functions are removed. New ones are prefixed bruteForceAdv_ and are below.


// --- Drag and Drop Functionality ---
function setupDragAndDrop() {
    const draggables = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const checkButton = document.getElementById('check-drag-drop');
    const feedbackP = document.getElementById('drag-drop-feedback');

    if (!draggables.length || !dropZones.length || !checkButton || !feedbackP) return;

    let draggedItem = null;

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
            setTimeout(() => e.target.classList.add('opacity-50'), 0);
        });
        draggable.addEventListener('dragend', (e) => {
            setTimeout(() => {
                e.target.classList.remove('opacity-50');
                draggedItem = null;
            }, 0);
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('bg-blue-100', 'border-blue-400');
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('bg-blue-100', 'border-blue-400');
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('bg-blue-100', 'border-blue-400');
            if (draggedItem) {
                const existingDraggableChild = zone.querySelector('.drag-item');
                if (existingDraggableChild && existingDraggableChild !== draggedItem) {
                    document.getElementById('draggable-threats').appendChild(existingDraggableChild);
                }
                if (draggedItem.parentElement !== zone) {
                    zone.appendChild(draggedItem);
                }
                draggedItem.classList.remove('opacity-50');
            }
        });
    });

    checkButton.addEventListener('click', () => {
        let correctMatches = 0;
        let totalDroppedInZones = 0;
        
        dropZones.forEach(zone => {
            const droppedItem = zone.querySelector('.drag-item');
            zone.classList.remove('border-green-500', 'border-red-500', 'border-2', 'border-dashed');
            zone.classList.add('border-2', 'border-dashed', 'border-gray-300'); 

            if (droppedItem) {
                totalDroppedInZones++;
                if (droppedItem.id === zone.dataset.match) {
                    correctMatches++;
                    zone.classList.remove('border-gray-300', 'border-dashed');
                    zone.classList.add('border-green-500'); 
                } else {
                    zone.classList.remove('border-gray-300', 'border-dashed');
                    zone.classList.add('border-red-500'); 
                }
            }
        });

        if (totalDroppedInZones < dropZones.length) {
             feedbackP.textContent = `Please drag all threat types to a description. You've matched ${totalDroppedInZones} out of ${dropZones.length}.`;
             feedbackP.className = 'text-sm mt-2 text-yellow-700 h-6';
        } else if (correctMatches === dropZones.length) {
            feedbackP.textContent = `All ${correctMatches} matches are correct! Well done!`;
            feedbackP.className = 'text-sm mt-2 text-green-700 h-6';
        } else {
            feedbackP.textContent = `You got ${correctMatches} out of ${dropZones.length} correct. (Green border = correct, Red border = incorrect)`;
            feedbackP.className = 'text-sm mt-2 text-red-700 h-6';
        }
    });
}

// --- NETVIRUS SIMULATION LOGIC (for Virus Section) ---
const NETVIRUS_NUM_COMPUTERS = 4; 
const NETVIRUS_INITIAL_FILES = 100; 
const NETVIRUS_SPREAD_DELAY = 2800; 
const NETVIRUS_FILE_CORRUPTION_DELAY = 1800; 
const NETVIRUS_FILE_CORRUPTION_AMOUNT = 10;

const netVirus_connections_map = { 0: [1, 2], 1: [0, 3], 2: [0], 3: [1] }; 

function netVirus_logEvent(message, type = 'info') {
    const logContainer = document.getElementById('netVirus_eventLog');
    if (!logContainer) return;
    const logEntry = document.createElement('p');
    logEntry.textContent = `[${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})}] ${message}`;
    logEntry.classList.add('network-simulation-log-entry'); 
    if (type === 'warning') logEntry.classList.add('text-yellow-300');
    else if (type === 'critical') logEntry.classList.add('text-red-400'); 
    else if (type === 'success') logEntry.classList.add('text-green-300');
    else if (type === 'blocked') logEntry.classList.add('text-cyan-300');
    else logEntry.classList.add('text-gray-300');
    
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    if (logContainer.children.length > 50) logContainer.removeChild(logContainer.lastChild);
}

function netVirus_createComputerElement(computer) {
    const container = document.getElementById('netVirus_networkArea');
    if (!container) return null;

    const computerDiv = document.createElement('div');
    computerDiv.id = `netVirus_computer-${computer.id}`;
    computerDiv.className = 'network-simulation-computer p-2 md:p-3 rounded-md border-2 shadow-md flex flex-col items-center justify-between text-center bg-gray-600'; 
    
    const computerName = document.createElement('p');
    computerName.className = 'text-xs font-semibold mb-1 text-blue-300'; 
    computerName.textContent = `PC #${computer.id + 1}`;

    const screenDiv = document.createElement('div');
    screenDiv.className = 'network-simulation-computer-screen w-full h-12 md:h-16 bg-gray-900 rounded mb-1 flex flex-col items-center justify-center p-1 text-xs';
    
    const statusText = document.createElement('p');
    statusText.id = `netVirus_status-${computer.id}`;
    statusText.className = 'font-medium';

    const filesText = document.createElement('p'); 
    filesText.id = `netVirus_files-${computer.id}`;
    filesText.className = 'text-gray-400 text-xs';

    const defenseDiv = document.createElement('div'); 
    defenseDiv.id = `netVirus_defenses-${computer.id}`;
    defenseDiv.className = 'network-simulation-defense-icons flex justify-center mt-1';


    screenDiv.appendChild(statusText);
    screenDiv.appendChild(filesText); 
    computerDiv.appendChild(computerName);
    computerDiv.appendChild(screenDiv);
    computerDiv.appendChild(defenseDiv);
    
    container.appendChild(computerDiv);
    return computerDiv;
}

function netVirus_updateComputerVisual(computer, temporaryStatus = null, temporaryStatusType = 'scan') {
    const computerEl = computer.element;
    if(!computerEl) return;
    const statusEl = document.getElementById(`netVirus_status-${computer.id}`);
    const filesEl = document.getElementById(`netVirus_files-${computer.id}`); 
    const screenEl = computerEl.querySelector('.network-simulation-computer-screen');
    const nameEl = computerEl.querySelector('p:first-child');
    const defenseEl = document.getElementById(`netVirus_defenses-${computer.id}`);

    if(!statusEl || !filesEl || !screenEl || !nameEl || !defenseEl) return;

    computerEl.classList.remove('network-simulation-status-blocked-flash'); 

    let defenseHTML = ''; 
    defenseHTML += `<i class="fas fa-desktop ${computer.osUpToDate ? 'netvirus-defense-on' : 'netvirus-defense-off'}" title="OS ${computer.osUpToDate ? 'Up-to-Date' : 'Outdated'}"></i>`;
    defenseHTML += `<i class="fas fa-shield-alt ${computer.antivirusActive ? 'netvirus-defense-on' : 'netvirus-defense-off'}" title="Antivirus ${computer.antivirusActive ? 'Active' : 'Inactive'}"></i>`;
    let firewallClass = 'netvirus-defense-off';
    let firewallTitle = 'Firewall Off';
    if (computer.firewallStrength === 'basic') { firewallClass = 'netvirus-defense-weak'; firewallTitle = 'Firewall Basic';}
    else if (computer.firewallStrength === 'strong') { firewallClass = 'netvirus-defense-on'; firewallTitle = 'Firewall Strong';}
    defenseHTML += `<i class="fas fa-fire-alt ${firewallClass}" title="${firewallTitle}"></i>`;
    defenseEl.innerHTML = defenseHTML;


    if (temporaryStatus) {
        statusEl.textContent = temporaryStatus;
        statusEl.classList.remove('text-red-300', 'text-sky-400', 'text-green-300'); 
        if (temporaryStatusType === 'scan') statusEl.classList.add('text-yellow-300');
        else if (temporaryStatusType === 'blocked') {
            statusEl.classList.add('text-cyan-300');
            computerEl.classList.add('network-simulation-status-blocked-flash');
        }
    } else if (computer.infected) { 
        computerEl.classList.remove('border-sky-500', 'bg-gray-600'); 
        computerEl.classList.add('border-red-500', 'bg-red-800', 'bg-opacity-40', 'network-simulation-status-infected'); 
        screenEl.classList.remove('bg-gray-900'); screenEl.classList.add('bg-red-700');
        statusEl.textContent = 'INFECTED (Virus)';
        statusEl.classList.remove('text-sky-400', 'text-yellow-300', 'text-cyan-300', 'text-green-300');
        statusEl.classList.add('text-red-200'); 
        nameEl.classList.remove('text-blue-300'); nameEl.classList.add('text-red-300');
    } else {
        computerEl.classList.remove('border-red-500', 'bg-red-800', 'bg-opacity-40', 'network-simulation-status-infected');
        computerEl.classList.add('border-sky-500', 'bg-gray-600'); 
        screenEl.classList.remove('bg-red-700'); screenEl.classList.add('bg-gray-900');
        statusEl.textContent = 'Healthy';
        statusEl.classList.remove('text-red-200', 'text-yellow-300', 'text-cyan-300');
        statusEl.classList.add('text-green-300'); 
        nameEl.classList.remove('text-red-300'); nameEl.classList.add('text-blue-300');
    }
    filesEl.textContent = `Files: ${computer.files}%`; 
}

function netVirus_startFileCorruption(computerId) {
    if (netVirus_fileCorruptionIntervals[computerId]) {
        clearInterval(netVirus_fileCorruptionIntervals[computerId]);
    }
    netVirus_fileCorruptionIntervals[computerId] = setInterval(() => {
        if (computerId >= netVirus_computers_state.length || !netVirus_computers_state[computerId]) { // Boundary check
            clearInterval(netVirus_fileCorruptionIntervals[computerId]);
            delete netVirus_fileCorruptionIntervals[computerId];
            return;
        }
        const computer = netVirus_computers_state[computerId];
        if (computer.infected && computer.files > 0) {
            computer.files = Math.max(0, computer.files - NETVIRUS_FILE_CORRUPTION_AMOUNT);
            netVirus_updateComputerVisual(computer);
            if (computer.files === 0) {
                netVirus_logEvent(`All files corrupted on Network PC #${computer.id + 1}!`, 'critical');
                clearInterval(netVirus_fileCorruptionIntervals[computerId]);
                delete netVirus_fileCorruptionIntervals[computerId];
            } else if (computer.files % (NETVIRUS_FILE_CORRUPTION_AMOUNT * 2) === 0) {
                 netVirus_logEvent(`Virus corrupting files on Network PC #${computer.id + 1}. Files: ${computer.files}%`, 'warning');
            }
        } else {
            clearInterval(netVirus_fileCorruptionIntervals[computerId]);
            delete netVirus_fileCorruptionIntervals[computerId];
        }
    }, NETVIRUS_FILE_CORRUPTION_DELAY);
}

function netVirus_infectComputer(computerId, isInitialInfection = false) {
    if (computerId < 0 || computerId >= NETVIRUS_NUM_COMPUTERS) return;
    const sourceComputer = netVirus_computers_state[computerId];
    if (!sourceComputer || (sourceComputer.infected && !isInitialInfection) ) return;

    if(isInitialInfection) {
        sourceComputer.infected = true;
        netVirus_updateComputerVisual(sourceComputer);
        netVirus_logEvent(`Virus introduced by user to Network PC #${sourceComputer.id + 1}.`, 'critical');
        netVirus_logEvent(`Network PC #${sourceComputer.id + 1} has been INFECTED! (Initial Infection)`, 'critical');
        netVirus_startFileCorruption(sourceComputer.id);
    } else {
        sourceComputer.infected = true;
        netVirus_updateComputerVisual(sourceComputer);
        netVirus_logEvent(`Network PC #${sourceComputer.id + 1} has been INFECTED by the virus!`, 'critical');
        netVirus_startFileCorruption(sourceComputer.id);
    }
    
    if (netVirus_connections_map[sourceComputer.id]) {
        netVirus_connections_map[sourceComputer.id].forEach(targetId => {
            if (targetId < 0 || targetId >= NETVIRUS_NUM_COMPUTERS) return;
            const targetComputer = netVirus_computers_state[targetId];
            if (!targetComputer || targetComputer.infected) return;

            if (netVirus_scanTimeouts[sourceComputer.id]) clearTimeout(netVirus_scanTimeouts[sourceComputer.id]); 
            
            netVirus_logEvent(`Virus on Network PC #${sourceComputer.id + 1} scanning connections...`, 'info');
            netVirus_updateComputerVisual(sourceComputer, "Scanning Network...", 'scan'); 

            const timeoutId = setTimeout(() => {
                 if (sourceComputer.id < netVirus_computers_state.length && netVirus_computers_state[sourceComputer.id] && netVirus_computers_state[sourceComputer.id].infected) { // Check if sourceComputer still exists and is infected
                    netVirus_updateComputerVisual(netVirus_computers_state[sourceComputer.id]); 
                }


                netVirus_logEvent(`Virus on Network PC #${sourceComputer.id + 1} attempting OS exploit on PC #${targetComputer.id + 1}...`, 'info');
                
                const exploitTimeoutId = setTimeout(() => { 
                    if (targetId >= netVirus_computers_state.length || !netVirus_computers_state[targetId] || netVirus_computers_state[targetId].infected) return;


                    if (!targetComputer.osUpToDate) { 
                        netVirus_logEvent(`Virus from PC #${sourceComputer.id + 1} exploited OUTDATED OS on PC #${targetComputer.id + 1}!`, 'warning');
                        netVirus_infectComputer(targetComputer.id, false); 
                    } else { 
                        netVirus_logEvent(`OS exploit FAILED on PC #${targetComputer.id + 1} (OS Up-to-Date).`, 'blocked');
                        
                        netVirus_logEvent(`Virus on PC #${sourceComputer.id + 1} attempting secondary exploit (AV/Firewall) on PC #${targetComputer.id + 1}...`, 'info');
                        const secondaryExploitTimeoutId = setTimeout(() => { 
                            if (targetId >= netVirus_computers_state.length || !netVirus_computers_state[targetId] || netVirus_computers_state[targetId].infected) return;

                            if (!targetComputer.antivirusActive && (targetComputer.firewallStrength === 'basic' || targetComputer.firewallStrength === 'none')) {
                                netVirus_logEvent(`Virus from PC #${sourceComputer.id + 1} exploited INACTIVE AV & WEAK FIREWALL on PC #${targetComputer.id + 1}!`, 'warning');
                                netVirus_infectComputer(targetComputer.id, false); 
                            } else {
                                let blockReason = "Defenses Held";
                                if (targetComputer.osUpToDate && targetComputer.antivirusActive && targetComputer.firewallStrength === 'strong') blockReason = "All Defenses Strong";
                                else if (targetComputer.antivirusActive) blockReason = "Antivirus Active";
                                else if (targetComputer.firewallStrength === 'strong') blockReason = "Firewall Strong";
                                
                                netVirus_logEvent(`Secondary exploit FAILED on PC #${targetComputer.id + 1}. Reason: ${blockReason}.`, 'blocked');
                                netVirus_updateComputerVisual(targetComputer, `Blocked: ${blockReason}`, 'blocked');
                                
                                if (netVirus_blockedMessageTimeouts[targetComputer.id]) clearTimeout(netVirus_blockedMessageTimeouts[targetComputer.id]);
                                netVirus_blockedMessageTimeouts[targetComputer.id] = setTimeout(() => {
                                    if (targetId < netVirus_computers_state.length && netVirus_computers_state[targetComputer.id] && !netVirus_computers_state[targetComputer.id].infected) {
                                        netVirus_updateComputerVisual(netVirus_computers_state[targetComputer.id]); 
                                    }
                                }, ADVWORM_BLOCKED_MESSAGE_DURATION); 
                            }
                        }, ADVWORM_EXPLOIT_ATTEMPT_DELAY); 
                        netVirus_propagationTimeouts_list.push(secondaryExploitTimeoutId);
                    }
                }, ADVWORM_EXPLOIT_ATTEMPT_DELAY); 
                netVirus_propagationTimeouts_list.push(exploitTimeoutId);

            }, ADVWORM_SCAN_DURATION + NETVIRUS_SPREAD_DELAY * (Math.random() * 0.2 + 0.8));
            netVirus_propagationTimeouts_list.push(timeoutId);
        });
    }
}

function netVirus_initSimulation() {
    netVirus_simulationActive_state = false;
    const introBtn = document.getElementById('netVirus_introduceVirusBtn');
    const resetBtn = document.getElementById('netVirus_resetSimulationBtn');
    const simArea = document.getElementById('netVirus_networkArea');
    const logContainer = document.getElementById('netVirus_eventLog');

    if (!introBtn || !resetBtn || !simArea || !logContainer) return;

    introBtn.disabled = false;
    introBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    introBtn.classList.add('hover:bg-red-700');

    clearSimTimeouts(netVirus_propagationTimeouts_list);
    Object.values(netVirus_fileCorruptionIntervals).forEach(clearInterval);
    netVirus_fileCorruptionIntervals = {};
    Object.values(netVirus_scanTimeouts).forEach(clearTimeout); netVirus_scanTimeouts = {};
    Object.values(netVirus_blockedMessageTimeouts).forEach(clearTimeout); netVirus_blockedMessageTimeouts = {};


    simArea.innerHTML = '';
    logContainer.innerHTML = '';
    netVirus_computers_state = [];

    const defenseSettings = [ 
        { osUpToDate: false, antivirusActive: false, firewallStrength: 'none' },
        { osUpToDate: false, antivirusActive: true,  firewallStrength: 'basic' },
        { osUpToDate: true,  antivirusActive: false, firewallStrength: 'basic' },
        { osUpToDate: true,  antivirusActive: true,  firewallStrength: 'strong' }
    ];

    for (let i = 0; i < NETVIRUS_NUM_COMPUTERS; i++) {
        const computerState = {
            id: i, element: null, infected: false, files: NETVIRUS_INITIAL_FILES,
            osUpToDate: defenseSettings[i].osUpToDate,
            antivirusActive: defenseSettings[i].antivirusActive,
            firewallStrength: defenseSettings[i].firewallStrength,
        };
        computerState.element = netVirus_createComputerElement(computerState);
        netVirus_computers_state.push(computerState);
        netVirus_updateComputerVisual(computerState);
    }
    netVirus_logEvent('Network Virus Sim Initialized. System Healthy.', 'success');

    introBtn.onclick = () => { 
        if (netVirus_simulationActive_state) return;
        netVirus_simulationActive_state = true;
        introBtn.disabled = true;
        introBtn.classList.add('opacity-50', 'cursor-not-allowed');
        introBtn.classList.remove('hover:bg-red-700');
        if (netVirus_computers_state.length > 0) {
            netVirus_infectComputer(0, true);
        } else {
            netVirus_logEvent('Error: No computers to infect.', 'critical');
            netVirus_simulationActive_state = false; introBtn.disabled = false;
            introBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    };
    resetBtn.onclick = () => {
        netVirus_logEvent('Network Virus Sim Reset by User.', 'info');
        netVirus_initSimulation(); 
    };
}


// --- ADVANCED WORM SIMULATION LOGIC (advWormSim_ prefix) ---
const ADVWORMSIM_NUM_COMPUTERS = 4; 
const ADVWORMSIM_INITIAL_HEALTH = 100;
const ADVWORMSIM_PROPAGATION_DELAY_BASE = 2200; 
const ADVWORMSIM_SCAN_DURATION = 1200; 
const ADVWORMSIM_EXPLOIT_ATTEMPT_DELAY = 1000; 
const ADVWORMSIM_BLOCKED_MESSAGE_DURATION = 2200; 
const ADVWORMSIM_IMPACT_DELAY = 1500;
const ADVWORMSIM_IMPACT_AMOUNT = 8;

const advWormSim_connections_map = { 0: [1, 2], 1: [0, 3], 2: [0], 3: [1] };

function advWormSim_logEvent(message, type = 'info') {
    const logContainer = document.getElementById('advWormSim_eventLog');
    if (!logContainer) return;
    const logEntry = document.createElement('p');
    logEntry.textContent = `[${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})}] ${message}`;
    logEntry.classList.add('adv-worm-log-entry'); 
    if (type === 'warning') logEntry.classList.add('text-yellow-300');
    else if (type === 'critical') logEntry.classList.add('text-orange-400');
    else if (type === 'success') logEntry.classList.add('text-green-400');
    else if (type === 'blocked') logEntry.classList.add('text-cyan-400');
    else logEntry.classList.add('text-gray-300');
    
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    if (logContainer.children.length > 120) logContainer.removeChild(logContainer.lastChild);
}

function advWormSim_createComputerElement(computer) {
    const container = document.getElementById('advWormSim_networkArea');
    if (!container) return null;

    const computerDiv = document.createElement('div');
    computerDiv.id = `advWormSim_computer-${computer.id}`;
    computerDiv.className = 'adv-worm-computer p-3 md:p-4 rounded-lg border-2 shadow-lg flex flex-col items-center justify-between text-center bg-gray-700';
    
    const computerName = document.createElement('p');
    computerName.className = 'text-sm font-semibold mb-1 text-orange-300'; 
    computerName.textContent = `PC #${computer.id + 1}`;

    const screenDiv = document.createElement('div');
    screenDiv.className = 'adv-worm-computer-screen w-full bg-gray-800 rounded mb-2 flex flex-col items-center justify-center p-1 text-xs md:text-sm transition-colors duration-300';
    
    const statusText = document.createElement('p');
    statusText.id = `advWormSim_status-${computer.id}`;
    statusText.className = 'font-medium';

    const healthText = document.createElement('p');
    healthText.id = `advWormSim_health-${computer.id}`;
    healthText.className = 'text-gray-400';

    const defenseDiv = document.createElement('div');
    defenseDiv.id = `advWormSim_defenses-${computer.id}`;
    defenseDiv.className = 'adv-worm-defense-icons flex justify-center mt-1';

    screenDiv.appendChild(statusText);
    screenDiv.appendChild(healthText);
    computerDiv.appendChild(computerName);
    computerDiv.appendChild(screenDiv);
    computerDiv.appendChild(defenseDiv);
    
    container.appendChild(computerDiv);
    return computerDiv;
}

function advWormSim_updateComputerVisual(computer, temporaryStatus = null, temporaryStatusType = 'scan') {
    const computerEl = computer.element;
    if(!computerEl) return;
    const statusEl = document.getElementById(`advWormSim_status-${computer.id}`);
    const healthEl = document.getElementById(`advWormSim_health-${computer.id}`);
    const screenEl = computerEl.querySelector('.adv-worm-computer-screen');
    const nameEl = computerEl.querySelector('p:first-child');
    const defenseEl = document.getElementById(`advWormSim_defenses-${computer.id}`);

    if(!statusEl || !healthEl || !screenEl || !nameEl || !defenseEl) return;

    computerEl.classList.remove('adv-worm-status-blocked-flash');

    let defenseHTML = '';
    defenseHTML += `<i class="fas fa-desktop ${computer.osUpToDate ? 'advworm-defense-on' : 'advworm-defense-off'}" title="OS ${computer.osUpToDate ? 'Up-to-Date' : 'Outdated'}"></i>`;
    defenseHTML += `<i class="fas fa-shield-alt ${computer.antivirusActive ? 'advworm-defense-on' : 'advworm-defense-off'}" title="Antivirus ${computer.antivirusActive ? 'Active' : 'Inactive'}"></i>`;
    let firewallClass = 'advworm-defense-off';
    let firewallTitle = 'Firewall Off';
    if (computer.firewallStrength === 'basic') { firewallClass = 'advworm-defense-weak'; firewallTitle = 'Firewall Basic';}
    else if (computer.firewallStrength === 'strong') { firewallClass = 'advworm-defense-on'; firewallTitle = 'Firewall Strong';}
    defenseHTML += `<i class="fas fa-fire-alt ${firewallClass}" title="${firewallTitle}"></i>`;
    defenseEl.innerHTML = defenseHTML;

    if (temporaryStatus) {
        statusEl.textContent = temporaryStatus;
        statusEl.classList.remove('text-orange-300', 'text-sky-400', 'text-green-400');
        if (temporaryStatusType === 'scan') statusEl.classList.add('text-yellow-300');
        else if (temporaryStatusType === 'blocked') {
            statusEl.classList.add('text-cyan-300');
            computerEl.classList.add('adv-worm-status-blocked-flash');
        }
    } else if (computer.infectedByWorm) {
        computerEl.classList.remove('border-sky-500', 'bg-gray-700');
        computerEl.classList.add('border-orange-500', 'bg-orange-900', 'bg-opacity-40', 'advworm-status-infected'); 
        screenEl.classList.remove('bg-gray-800'); screenEl.classList.add('bg-orange-800');
        statusEl.textContent = 'INFECTED (Worm)';
        statusEl.classList.remove('text-sky-400', 'text-yellow-300', 'text-cyan-300', 'text-green-400');
        statusEl.classList.add('text-orange-300');
        nameEl.classList.remove('text-sky-300'); nameEl.classList.add('text-orange-300');
    } else {
        computerEl.classList.remove('border-orange-500', 'bg-orange-900', 'bg-opacity-40', 'advworm-status-infected');
        computerEl.classList.add('border-sky-500', 'bg-gray-700');
        screenEl.classList.remove('bg-orange-800'); screenEl.classList.add('bg-gray-800');
        statusEl.textContent = 'Clean';
        statusEl.classList.remove('text-orange-300', 'text-yellow-300', 'text-cyan-300');
        statusEl.classList.add('text-sky-400');
        nameEl.classList.remove('text-orange-300'); nameEl.classList.add('text-sky-300');
    }
    healthEl.textContent = `Health: ${computer.health}%`;
}

function advWormSim_startImpact(computerId) {
    if (advWormSim_impactIntervals[computerId]) { clearInterval(advWormSim_impactIntervals[computerId]); }
    advWormSim_impactIntervals[computerId] = setInterval(() => {
        if (computerId >= advWormSim_computers_state.length || !advWormSim_computers_state[computerId]) {
            clearInterval(advWormSim_impactIntervals[computerId]);
            delete advWormSim_impactIntervals[computerId];
            return;
        }
        const computer = advWormSim_computers_state[computerId];
        if (computer.infectedByWorm && computer.health > 0) {
            computer.health = Math.max(0, computer.health - ADVWORMSIM_IMPACT_AMOUNT);
            advWormSim_updateComputerVisual(computer);
            if (computer.health === 0) {
                advWormSim_logEvent(`PC #${computer.id + 1} system critical! Health: ${computer.health}%`, 'critical');
                clearInterval(advWormSim_impactIntervals[computerId]); delete advWormSim_impactIntervals[computerId];
            } else if (computer.health % (ADVWORMSIM_IMPACT_AMOUNT * 3) === 0 || computer.health < ADVWORMSIM_IMPACT_AMOUNT * 2) {
                advWormSim_logEvent(`Worm impacting PC #${computer.id + 1}. Health: ${computer.health}%`, 'warning');
            }
        } else { clearInterval(advWormSim_impactIntervals[computerId]); delete advWormSim_impactIntervals[computerId]; }
    }, ADVWORMSIM_IMPACT_DELAY);
}

function advWormSim_infectComputer(computerId, isInitialRelease = false) {
    if (computerId < 0 || computerId >= ADVWORMSIM_NUM_COMPUTERS) return;
    const sourceComputer = advWormSim_computers_state[computerId];
    if (!sourceComputer || (sourceComputer.infectedByWorm && !isInitialRelease) ) return;

    if(isInitialRelease) {
        sourceComputer.infectedByWorm = true;
        advWormSim_updateComputerVisual(sourceComputer);
        advWormSim_logEvent(`Worm released by user onto PC #${sourceComputer.id + 1}.`, 'critical');
        advWormSim_logEvent(`PC #${sourceComputer.id + 1} has been INFECTED by the worm! (Initial Release)`, 'critical');
        advWormSim_startImpact(sourceComputer.id);
    } else {
        sourceComputer.infectedByWorm = true;
        advWormSim_updateComputerVisual(sourceComputer);
        advWormSim_logEvent(`PC #${sourceComputer.id + 1} has been INFECTED by the worm!`, 'critical');
        advWormSim_startImpact(sourceComputer.id);
    }
    
    if (advWormSim_connections_map[sourceComputer.id]) {
        advWormSim_connections_map[sourceComputer.id].forEach(targetId => {
            if (targetId < 0 || targetId >= ADVWORMSIM_NUM_COMPUTERS) return;
            const targetComputer = advWormSim_computers_state[targetId];
            if (!targetComputer || targetComputer.infectedByWorm) return;

            if (advWormSim_scanTimeouts[sourceComputer.id]) clearTimeout(advWormSim_scanTimeouts[sourceComputer.id]); 
            
            advWormSim_logEvent(`Worm on PC #${sourceComputer.id + 1} autonomously scanning for vulnerable connections...`, 'info');
            advWormSim_updateComputerVisual(sourceComputer, "Scanning Network...", 'scan'); 

            const timeoutId = setTimeout(() => {
                if (sourceComputer.id < advWormSim_computers_state.length && advWormSim_computers_state[sourceComputer.id] && advWormSim_computers_state[sourceComputer.id].infectedByWorm) {
                    advWormSim_updateComputerVisual(advWormSim_computers_state[sourceComputer.id]); 
                }

                advWormSim_logEvent(`Worm on PC #${sourceComputer.id + 1} attempting to exploit OS vulnerability on PC #${targetComputer.id + 1}...`, 'info');
                
                const exploitTimeoutId = setTimeout(() => { 
                    if (targetId >= advWormSim_computers_state.length || !advWormSim_computers_state[targetId] || advWormSim_computers_state[targetId].infectedByWorm) return;


                    if (!targetComputer.osUpToDate) { 
                        advWormSim_logEvent(`Worm from PC #${sourceComputer.id + 1} successfully exploited OUTDATED OS on PC #${targetComputer.id + 1}!`, 'warning');
                        advWormSim_infectComputer(targetComputer.id, false); 
                    } else { 
                        advWormSim_logEvent(`OS exploit FAILED on PC #${targetComputer.id + 1} (OS is Up-to-Date).`, 'blocked');
                        
                        advWormSim_logEvent(`Worm on PC #${sourceComputer.id + 1} attempting secondary exploit (AV/Firewall) on PC #${targetComputer.id + 1}...`, 'info');
                        const secondaryExploitTimeoutId = setTimeout(() => { 
                            if (targetId >= advWormSim_computers_state.length || !advWormSim_computers_state[targetId] || advWormSim_computers_state[targetId].infectedByWorm) return;

                            if (!targetComputer.antivirusActive && (targetComputer.firewallStrength === 'basic' || targetComputer.firewallStrength === 'none')) {
                                advWormSim_logEvent(`Worm from PC #${sourceComputer.id + 1} successfully exploited INACTIVE AV & WEAK FIREWALL on PC #${targetComputer.id + 1}!`, 'warning');
                                advWormSim_infectComputer(targetComputer.id, false); 
                            } else {
                                let blockReason = "Defenses Held";
                                if (targetComputer.osUpToDate && targetComputer.antivirusActive && targetComputer.firewallStrength === 'strong') blockReason = "All Defenses Strong";
                                else if (targetComputer.antivirusActive) blockReason = "Antivirus Active";
                                else if (targetComputer.firewallStrength === 'strong') blockReason = "Firewall Strong";
                                
                                advWormSim_logEvent(`Secondary exploit FAILED on PC #${targetComputer.id + 1}. Reason: ${blockReason}.`, 'blocked');
                                advWormSim_updateComputerVisual(targetComputer, `Blocked: ${blockReason}`, 'blocked');
                                
                                if (advWormSim_blockedMessageTimeouts[targetComputer.id]) clearTimeout(advWormSim_blockedMessageTimeouts[targetComputer.id]);
                                advWormSim_blockedMessageTimeouts[targetComputer.id] = setTimeout(() => {
                                     if (targetId < advWormSim_computers_state.length && advWormSim_computers_state[targetComputer.id] && !advWormSim_computers_state[targetComputer.id].infectedByWorm) {
                                        advWormSim_updateComputerVisual(advWormSim_computers_state[targetComputer.id]); 
                                    }
                                }, ADVWORMSIM_BLOCKED_MESSAGE_DURATION);
                            }
                        }, ADVWORMSIM_EXPLOIT_ATTEMPT_DELAY);
                        advWormSim_propagationTimeouts_list.push(secondaryExploitTimeoutId);
                    }
                }, ADVWORMSIM_EXPLOIT_ATTEMPT_DELAY);
                advWormSim_propagationTimeouts_list.push(exploitTimeoutId);

            }, ADVWORMSIM_SCAN_DURATION + ADVWORMSIM_PROPAGATION_DELAY_BASE * (Math.random() * 0.2 + 0.8));
            advWormSim_propagationTimeouts_list.push(timeoutId);
        });
    }
}

function advWormSim_initSimulation() {
    advWormSim_simulationActive_state = false;
    const releaseBtn = document.getElementById('advWormSim_releaseWormBtn');
    const resetBtn = document.getElementById('advWormSim_resetSimulationBtn');
    const networkAreaEl = document.getElementById('advWormSim_networkArea');
    const eventLogEl = document.getElementById('advWormSim_eventLog');

    if(!releaseBtn || !resetBtn || !networkAreaEl || !eventLogEl) return;

    releaseBtn.disabled = false;
    releaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    releaseBtn.classList.add('hover:bg-orange-700');

    clearSimTimeouts(advWormSim_propagationTimeouts_list);
    Object.values(advWormSim_impactIntervals).forEach(clearInterval); advWormSim_impactIntervals = {};
    Object.values(advWormSim_scanTimeouts).forEach(clearTimeout); advWormSim_scanTimeouts = {};
    Object.values(advWormSim_blockedMessageTimeouts).forEach(clearTimeout); advWormSim_blockedMessageTimeouts = {};


    networkAreaEl.innerHTML = '';
    eventLogEl.innerHTML = '';
    advWormSim_computers_state = [];

    const defenseSettings = [
        { osUpToDate: false, antivirusActive: false, firewallStrength: 'none' },
        { osUpToDate: false, antivirusActive: true,  firewallStrength: 'basic' },
        { osUpToDate: true,  antivirusActive: false, firewallStrength: 'basic' },
        { osUpToDate: true,  antivirusActive: true,  firewallStrength: 'strong' }
    ];

    for (let i = 0; i < ADVWORMSIM_NUM_COMPUTERS; i++) {
        const computerState = {
            id: i, element: null, infectedByWorm: false, health: ADVWORMSIM_INITIAL_HEALTH,
            osUpToDate: defenseSettings[i].osUpToDate,
            antivirusActive: defenseSettings[i].antivirusActive,
            firewallStrength: defenseSettings[i].firewallStrength,
        };
        computerState.element = advWormSim_createComputerElement(computerState);
        advWormSim_computers_state.push(computerState);
        advWormSim_updateComputerVisual(computerState);
    }
    advWormSim_logEvent('Advanced Worm Simulation Initialized. Network clean.', 'success');

    releaseBtn.onclick = () => { 
        if (advWormSim_simulationActive_state) return;
        advWormSim_simulationActive_state = true;
        releaseBtn.disabled = true;
        releaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
        releaseBtn.classList.remove('hover:bg-orange-700');
        if (advWormSim_computers_state.length > 0) advWormSim_infectComputer(0, true);
        else {
            advWormSim_logEvent('Error: No computers to release worm onto.', 'critical');
            advWormSim_simulationActive_state = false; releaseBtn.disabled = false;
            releaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    };
    resetBtn.onclick = () => {
        advWormSim_logEvent('Advanced Worm Simulation Reset by User.', 'info');
        advWormSim_initSimulation(); 
    };
}

// --- BRUTE FORCE ADVANCED SIMULATOR (bruteForceAdv_ prefix) ---
let bruteForceAdv_TARGET_PASSWORD = ""; 
let bruteForceAdv_CURRENT_CHARSET_STRING = "";
const bruteForceAdv_BASE_CHARSETS = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-=_+[]{}|;:',.<>/?" 
};
let bruteForceAdv_PASSWORD_LENGTH = 3; 
let bruteForceAdv_SIMULATION_MODE = 'simple'; 
let bruteForceAdv_CURRENT_ATTACK_SPEED = 'normal';
let bruteForceAdv_accountLockoutEnabled = false;
let bruteForceAdv_lockoutAfterAttempts = 100; 
let bruteForceAdv_currentGeneratedPassword = "";
let bruteForceAdv_attemptsCount = 0;
let bruteForceAdv_isAttackRunning = false;
let bruteForceAdv_passwordFound = false;
let bruteForceAdv_attackLoopId = null; 
let bruteForceAdv_lastLogTime = 0;
let bruteForceAdv_isPasswordSet = false;

function bruteForceAdv_logEvent(message, type = 'info') {
    const eventLog = document.getElementById('bruteForceAdv_eventLog');
    if (!eventLog) return;
    const logEntry = document.createElement('p');
    logEntry.textContent = `[${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})}] ${message}`;
    logEntry.classList.add('brute-force-sim-log-entry'); // Use specific class for this sim's log
    if (type === 'success') logEntry.classList.add('text-green-400');
    else if (type === 'failure') logEntry.classList.add('text-red-400');
    else if (type === 'emphasis') logEntry.classList.add('text-amber-300', 'font-semibold');
    else if (type === 'lockout') logEntry.classList.add('text-orange-400', 'font-semibold');
    else logEntry.classList.add('text-gray-400');
    
    eventLog.insertBefore(logEntry, eventLog.firstChild);
    if (eventLog.children.length > 150) { // MAX_LOG_ENTRIES
        eventLog.removeChild(eventLog.lastChild);
    }
}

function bruteForceAdv_updateSystemVisualState() {
    const targetSystemDiv = document.querySelector('#bruteForceAdv_simulatorInterface .brute-force-target-system');
    const lockIcon = document.getElementById('bruteForceAdv_lockIcon');
    const systemStatus = document.getElementById('bruteForceAdv_systemStatus');
    if (!targetSystemDiv || !lockIcon || !systemStatus) return;

    if (bruteForceAdv_passwordFound) {
        targetSystemDiv.classList.remove('brute-force-target-locked', 'brute-force-target-lockout');
        targetSystemDiv.classList.add('brute-force-target-unlocked');
        lockIcon.className = 'fas fa-lock-open text-6xl text-green-400 mb-4 transition-colors duration-500';
        systemStatus.textContent = "SYSTEM UNLOCKED";
        systemStatus.classList.remove('text-red-400', 'text-orange-400');
        systemStatus.classList.add('text-green-400');
    } else if (bruteForceAdv_accountLockoutEnabled && bruteForceAdv_attemptsCount >= bruteForceAdv_lockoutAfterAttempts && bruteForceAdv_isAttackRunning) { 
        targetSystemDiv.classList.remove('brute-force-target-locked', 'brute-force-target-unlocked');
        targetSystemDiv.classList.add('brute-force-target-lockout');
        lockIcon.className = 'fas fa-user-lock text-6xl text-orange-400 mb-4 transition-colors duration-500';
        systemStatus.textContent = "ACCOUNT LOCKED";
        systemStatus.classList.remove('text-red-400', 'text-green-400');
        systemStatus.classList.add('text-orange-400');
    } else { 
        targetSystemDiv.classList.remove('brute-force-target-unlocked', 'brute-force-target-lockout');
        targetSystemDiv.classList.add('brute-force-target-locked');
        lockIcon.className = 'fas fa-lock text-6xl text-red-400 mb-4 transition-colors duration-500';
        systemStatus.textContent = "SYSTEM LOCKED";
        systemStatus.classList.remove('text-green-400', 'text-orange-400');
        systemStatus.classList.add('text-red-400');
    }
}

function bruteForceAdv_updateAttackMonitorDisplay() {
    const currentAttemptText = document.getElementById('bruteForceAdv_currentAttemptText');
    const attemptsCountText = document.getElementById('bruteForceAdv_attemptsCountText');
    if (currentAttemptText) currentAttemptText.textContent = bruteForceAdv_currentGeneratedPassword || "-";
    if (attemptsCountText) attemptsCountText.textContent = bruteForceAdv_attemptsCount.toLocaleString();
}

function bruteForceAdv_generateNextPasswordAdvanced(current) {
    if (bruteForceAdv_CURRENT_CHARSET_STRING.length === 0) return null; 

    if (current === "") { 
        return bruteForceAdv_CURRENT_CHARSET_STRING[0].repeat(bruteForceAdv_PASSWORD_LENGTH);
    }

    let passArray = current.split('');
    let i = bruteForceAdv_PASSWORD_LENGTH - 1; 

    while (i >= 0) {
        const charIndex = bruteForceAdv_CURRENT_CHARSET_STRING.indexOf(passArray[i]);
        if (charIndex === bruteForceAdv_CURRENT_CHARSET_STRING.length - 1) { 
            passArray[i] = bruteForceAdv_CURRENT_CHARSET_STRING[0]; 
            i--; 
        } else {
            passArray[i] = bruteForceAdv_CURRENT_CHARSET_STRING[charIndex + 1]; 
            return passArray.join(''); 
        }
    }
    return null; 
}

function bruteForceAdv_getBatchSize() {
    if (bruteForceAdv_SIMULATION_MODE === 'simple') return 100;
    switch (bruteForceAdv_CURRENT_ATTACK_SPEED) {
        case 'fast': return 1000;
        case 'very_fast': return 5000;
        case 'normal':
        default: return 300;
    }
}

function bruteForceAdv_attackStep() {
    const startAttackBtn = document.getElementById('bruteForceAdv_startAttackBtn');
    const resetSimulationBtn = document.getElementById('bruteForceAdv_resetSimulationBtn');

    if (!bruteForceAdv_isAttackRunning || bruteForceAdv_passwordFound) {
        if (bruteForceAdv_attackLoopId) cancelAnimationFrame(bruteForceAdv_attackLoopId);
        bruteForceAdv_isAttackRunning = false;
        if(startAttackBtn) startAttackBtn.disabled = bruteForceAdv_passwordFound || (bruteForceAdv_accountLockoutEnabled && bruteForceAdv_attemptsCount >= bruteForceAdv_lockoutAfterAttempts);
        if(resetSimulationBtn) resetSimulationBtn.disabled = false;
        return;
    }

    if (bruteForceAdv_accountLockoutEnabled && bruteForceAdv_attemptsCount >= bruteForceAdv_lockoutAfterAttempts) {
        bruteForceAdv_isAttackRunning = false;
        // bruteForceAdv_passwordFound = false; // Not found if locked out
        bruteForceAdv_logEvent(`ACCOUNT LOCKED OUT after ${bruteForceAdv_attemptsCount.toLocaleString()} failed attempts.`, 'lockout');
        bruteForceAdv_updateSystemVisualState();
        bruteForceAdv_updateAttackMonitorDisplay();
        if (bruteForceAdv_attackLoopId) cancelAnimationFrame(bruteForceAdv_attackLoopId);
        if(startAttackBtn) startAttackBtn.disabled = true;
        if(resetSimulationBtn) resetSimulationBtn.disabled = false;
        return;
    }

    const batchSize = bruteForceAdv_getBatchSize();
    for(let j=0; j<batchSize; j++) {
        if (bruteForceAdv_passwordFound || (bruteForceAdv_accountLockoutEnabled && bruteForceAdv_attemptsCount >= bruteForceAdv_lockoutAfterAttempts)) break;

        bruteForceAdv_currentGeneratedPassword = bruteForceAdv_generateNextPasswordAdvanced(bruteForceAdv_currentGeneratedPassword);
        
        if (bruteForceAdv_currentGeneratedPassword === null) {
            bruteForceAdv_logEvent(`Attack stopped: All ${bruteForceAdv_PASSWORD_LENGTH}-character combinations tried. Password not found.`, 'failure');
            // bruteForceAdv_passwordFound = false; // Already false
            bruteForceAdv_isAttackRunning = false;
            if (bruteForceAdv_attackLoopId) cancelAnimationFrame(bruteForceAdv_attackLoopId);
            if(startAttackBtn) startAttackBtn.disabled = true; 
            if(resetSimulationBtn) resetSimulationBtn.disabled = false;
            break; 
        }
        bruteForceAdv_attemptsCount++;

        if (bruteForceAdv_currentGeneratedPassword === bruteForceAdv_TARGET_PASSWORD) {
            bruteForceAdv_passwordFound = true;
            bruteForceAdv_isAttackRunning = false; 
            bruteForceAdv_logEvent(`SUCCESS! Password '${bruteForceAdv_TARGET_PASSWORD}' found after ${bruteForceAdv_attemptsCount.toLocaleString()} attempts.`, 'success');
            if (bruteForceAdv_attackLoopId) cancelAnimationFrame(bruteForceAdv_attackLoopId);
            if(startAttackBtn) startAttackBtn.disabled = true;
            if(resetSimulationBtn) resetSimulationBtn.disabled = false;
            break; 
        }
    }
    
    bruteForceAdv_updateAttackMonitorDisplay();
    bruteForceAdv_updateSystemVisualState();

    const now = performance.now();
    if (now - bruteForceAdv_lastLogTime > 100 && !bruteForceAdv_passwordFound && bruteForceAdv_isAttackRunning) { 
        bruteForceAdv_logEvent(`Attempt #${bruteForceAdv_attemptsCount.toLocaleString()}: Trying '${bruteForceAdv_currentGeneratedPassword}'`);
        bruteForceAdv_lastLogTime = now;
    }
    
    if(bruteForceAdv_isAttackRunning) {
        bruteForceAdv_attackLoopId = requestAnimationFrame(bruteForceAdv_attackStep);
    }
}

function bruteForceAdv_calculateEstimatedTime() {
    const estimatedTimeText = document.getElementById('bruteForceAdv_estimatedTimeText');
    const advPasswordLength = document.getElementById('bruteForceAdv_advPasswordLength');
    const attackSpeedSelect = document.getElementById('bruteForceAdv_attackSpeed');
    const advConfigError = document.getElementById('bruteForceAdv_advConfigError');

    if (bruteForceAdv_SIMULATION_MODE !== 'advanced' || !estimatedTimeText || !advPasswordLength || !attackSpeedSelect || !advConfigError) {
        if(estimatedTimeText) estimatedTimeText.textContent = "- (Simple mode)";
        return;
    }
    advConfigError.textContent = "";
    bruteForceAdv_buildCharset(); 
    const currentLength = parseInt(advPasswordLength.value) || 0;
    const selectedSpeed = attackSpeedSelect.value;

    if (bruteForceAdv_CURRENT_CHARSET_STRING.length === 0) {
        estimatedTimeText.textContent = "Select character sets."; return;
    }
    if (currentLength <= 0) {
        estimatedTimeText.textContent = "Set password length > 0."; return;
    }
    
    const combinations = Math.pow(bruteForceAdv_CURRENT_CHARSET_STRING.length, currentLength);
    
    let tempBatchSize;
    switch (selectedSpeed) {
        case 'fast': tempBatchSize = 1000; break;
        case 'very_fast': tempBatchSize = 5000; break;
        case 'normal': default: tempBatchSize = 300; break;
    }
    const estimatedBatchesPerSecond = 30; 
    const attacksPerSecond = estimatedBatchesPerSecond * tempBatchSize;
    
    if (combinations === Infinity || isNaN(combinations) || combinations > Number.MAX_SAFE_INTEGER) {
           estimatedTimeText.textContent = "Extremely vast (effectively infinite for demo)."; return;
    }

    const seconds = combinations / attacksPerSecond;

    if (seconds < 0.001) estimatedTimeText.textContent = "< 0.001 seconds";
    else if (seconds < 60) estimatedTimeText.textContent = `~${seconds.toFixed(3)} seconds`;
    else if (seconds < 3600) estimatedTimeText.textContent = `~${(seconds / 60).toFixed(2)} minutes`;
    else if (seconds < 86400) estimatedTimeText.textContent = `~${(seconds / 3600).toFixed(2)} hours`;
    else if (seconds < 31536000) estimatedTimeText.textContent = `~${(seconds / 86400).toFixed(2)} days`;
    else estimatedTimeText.textContent = `~${(seconds / 31536000).toFixed(2)} years`;
}

function bruteForceAdv_buildCharset() {
    const charLowercase = document.getElementById('bruteForceAdv_charLowercase');
    const charUppercase = document.getElementById('bruteForceAdv_charUppercase');
    const charNumbers = document.getElementById('bruteForceAdv_charNumbers');
    const charSymbols = document.getElementById('bruteForceAdv_charSymbols');
    if(!charLowercase || !charUppercase || !charNumbers || !charSymbols) return;

    bruteForceAdv_CURRENT_CHARSET_STRING = "";
    if (charLowercase.checked) bruteForceAdv_CURRENT_CHARSET_STRING += bruteForceAdv_BASE_CHARSETS.lowercase;
    if (charUppercase.checked) bruteForceAdv_CURRENT_CHARSET_STRING += bruteForceAdv_BASE_CHARSETS.uppercase;
    if (charNumbers.checked) bruteForceAdv_CURRENT_CHARSET_STRING += bruteForceAdv_BASE_CHARSETS.numbers;
    if (charSymbols.checked) bruteForceAdv_CURRENT_CHARSET_STRING += bruteForceAdv_BASE_CHARSETS.symbols;
}

function bruteForceAdv_validateAdvancedConfig() {
    const advConfigError = document.getElementById('bruteForceAdv_advConfigError');
    const advPasswordInput = document.getElementById('bruteForceAdv_advPasswordInput');
    const advPasswordLength = document.getElementById('bruteForceAdv_advPasswordLength');
    if(!advConfigError || !advPasswordInput || !advPasswordLength) return false;

    advConfigError.textContent = "";
    let targetPasswordValue = advPasswordInput.value; 
    let chosenLength = parseInt(advPasswordLength.value);

    if (isNaN(chosenLength) || chosenLength < 1 || chosenLength > 6) {
        advConfigError.textContent = "Password length must be between 1 and 6."; return false;
    }
    if (!targetPasswordValue) {
        advConfigError.textContent = "Target password cannot be empty."; return false;
    }
    if (targetPasswordValue.length !== chosenLength) {
        advConfigError.textContent = `Target password must be exactly ${chosenLength} characters long.`; return false;
    }
    
    bruteForceAdv_buildCharset(); 
    if (bruteForceAdv_CURRENT_CHARSET_STRING.length === 0) {
        advConfigError.textContent = "At least one character set must be selected."; return false;
    }
    for(let char of targetPasswordValue) {
        if(bruteForceAdv_CURRENT_CHARSET_STRING.indexOf(char) === -1) {
            advConfigError.textContent = `Target password contains character '${char}' not in the selected charsets.`; return false;
        }
    }
    
    bruteForceAdv_TARGET_PASSWORD = targetPasswordValue; 
    bruteForceAdv_PASSWORD_LENGTH = chosenLength; 
    return true;
}

function bruteForceAdv_prepareAttackAdvanced() {
    const targetPasswordDisplay = document.getElementById('bruteForceAdv_targetPasswordDisplay');
    const attackSpeedSelect = document.getElementById('bruteForceAdv_attackSpeed');
    const enableAccountLockout = document.getElementById('bruteForceAdv_enableAccountLockout');
    const lockoutAttemptsInput = document.getElementById('bruteForceAdv_lockoutAttemptsInput');
    const advSetupAttackBtn = document.getElementById('bruteForceAdv_advSetupAttackBtn');
    const advPasswordInput = document.getElementById('bruteForceAdv_advPasswordInput');
    const advPasswordLength = document.getElementById('bruteForceAdv_advPasswordLength');
    const charLowercase = document.getElementById('bruteForceAdv_charLowercase');
    const charUppercase = document.getElementById('bruteForceAdv_charUppercase');
    const charNumbers = document.getElementById('bruteForceAdv_charNumbers');
    const charSymbols = document.getElementById('bruteForceAdv_charSymbols');
    const startAttackBtn = document.getElementById('bruteForceAdv_startAttackBtn');
    const resetSimulationBtn = document.getElementById('bruteForceAdv_resetSimulationBtn');


    if (!validateAdvancedConfig() || !targetPasswordDisplay || !attackSpeedSelect || !enableAccountLockout || !lockoutAttemptsInput || !advSetupAttackBtn) return;

    targetPasswordDisplay.textContent = bruteForceAdv_TARGET_PASSWORD;
    bruteForceAdv_logEvent(`Target password set to '${bruteForceAdv_TARGET_PASSWORD}'. Length: ${bruteForceAdv_PASSWORD_LENGTH}. Charset size: ${bruteForceAdv_CURRENT_CHARSET_STRING.length}.`, "emphasis");
    
    bruteForceAdv_CURRENT_ATTACK_SPEED = attackSpeedSelect.value;
    bruteForceAdv_logEvent(`Attack speed set to: ${bruteForceAdv_CURRENT_ATTACK_SPEED}.`, "emphasis");

    bruteForceAdv_accountLockoutEnabled = enableAccountLockout.checked;
    if(bruteForceAdv_accountLockoutEnabled) {
        bruteForceAdv_lockoutAfterAttempts = parseInt(lockoutAttemptsInput.value);
        if (isNaN(bruteForceAdv_lockoutAfterAttempts) || bruteForceAdv_lockoutAfterAttempts < 1) {
            document.getElementById('bruteForceAdv_advConfigError').textContent = "Lockout attempts must be a positive number.";
            return;
        }
        bruteForceAdv_logEvent(`Account lockout enabled after ${bruteForceAdv_lockoutAfterAttempts.toLocaleString()} attempts.`, "emphasis");
    } else {
        bruteForceAdv_logEvent(`Account lockout disabled.`, "emphasis");
    }

    bruteForceAdv_isPasswordSet = true;
    startAttackBtn.disabled = false;
    resetSimulationBtn.disabled = false;
    
    advPasswordInput.disabled = true;
    advPasswordLength.disabled = true;
    attackSpeedSelect.disabled = true;
    [charLowercase, charUppercase, charNumbers, charSymbols, enableAccountLockout, lockoutAttemptsInput, advSetupAttackBtn].forEach(el => { if(el) el.disabled = true; });
}

function bruteForceAdv_handleSimpleSetPassword() {
    const simpleUserPasswordInput = document.getElementById('bruteForceAdv_simpleUserPasswordInput');
    const simplePasswordValidationError = document.getElementById('bruteForceAdv_simplePasswordValidationError');
    const simpleSetPasswordBtn = document.getElementById('bruteForceAdv_simpleSetPasswordBtn');
    const targetPasswordDisplay = document.getElementById('bruteForceAdv_targetPasswordDisplay');
    const startAttackBtn = document.getElementById('bruteForceAdv_startAttackBtn');
    const resetSimulationBtn = document.getElementById('bruteForceAdv_resetSimulationBtn');


    if(!simpleUserPasswordInput || !simplePasswordValidationError || !simpleSetPasswordBtn || !targetPasswordDisplay || !startAttackBtn || !resetSimulationBtn) return;

    simplePasswordValidationError.textContent = ""; 
    const userInput = simpleUserPasswordInput.value.trim().toLowerCase();

    if (userInput.length !== 3) {
        simplePasswordValidationError.textContent = `Password must be exactly 3 letters.`; return;
    }
    for (let char of userInput) {
        if (bruteForceAdv_BASE_CHARSETS.lowercase.indexOf(char) === -1) {
            simplePasswordValidationError.textContent = "Password must contain only lowercase letters (a-z)."; return;
        }
    }
    bruteForceAdv_TARGET_PASSWORD = userInput;
    bruteForceAdv_PASSWORD_LENGTH = 3;
    bruteForceAdv_CURRENT_CHARSET_STRING = bruteForceAdv_BASE_CHARSETS.lowercase;
    bruteForceAdv_CURRENT_ATTACK_SPEED = 'normal'; 
    targetPasswordDisplay.textContent = bruteForceAdv_TARGET_PASSWORD;
    bruteForceAdv_logEvent(`Target password set to '${bruteForceAdv_TARGET_PASSWORD}'. Ready to attack.`, "emphasis");
    
    simpleUserPasswordInput.disabled = true;
    simpleSetPasswordBtn.disabled = true;
    bruteForceAdv_isPasswordSet = true;
    startAttackBtn.disabled = false;
    resetSimulationBtn.disabled = false;
}

function bruteForceAdv_startAttack() {
    const startAttackBtn = document.getElementById('bruteForceAdv_startAttackBtn');
    const resetSimulationBtn = document.getElementById('bruteForceAdv_resetSimulationBtn');
    const simpleUserPasswordInput = document.getElementById('bruteForceAdv_simpleUserPasswordInput');
    const simpleSetPasswordBtn = document.getElementById('bruteForceAdv_simpleSetPasswordBtn');
    const advPasswordInput = document.getElementById('bruteForceAdv_advPasswordInput');
    const advPasswordLength = document.getElementById('bruteForceAdv_advPasswordLength');
    const attackSpeedSelect = document.getElementById('bruteForceAdv_attackSpeed');
    const charLowercase = document.getElementById('bruteForceAdv_charLowercase');
    const charUppercase = document.getElementById('bruteForceAdv_charUppercase');
    const charNumbers = document.getElementById('bruteForceAdv_charNumbers');
    const charSymbols = document.getElementById('bruteForceAdv_charSymbols');
    const enableAccountLockout = document.getElementById('bruteForceAdv_enableAccountLockout');
    const lockoutAttemptsInput = document.getElementById('bruteForceAdv_lockoutAttemptsInput');
    const advSetupAttackBtn = document.getElementById('bruteForceAdv_advSetupAttackBtn');


    if (bruteForceAdv_isAttackRunning || !bruteForceAdv_isPasswordSet) return;

    bruteForceAdv_currentGeneratedPassword = ""; 
    bruteForceAdv_attemptsCount = 0;
    bruteForceAdv_passwordFound = false;
    bruteForceAdv_isAttackRunning = true;
    bruteForceAdv_lastLogTime = performance.now();

    bruteForceAdv_logEvent(`Brute force attack started. Target: '${bruteForceAdv_TARGET_PASSWORD}'.`, 'emphasis');
    bruteForceAdv_updateSystemVisualState(); 
    bruteForceAdv_updateAttackMonitorDisplay();

    startAttackBtn.disabled = true;
    resetSimulationBtn.disabled = false; 
    if (bruteForceAdv_SIMULATION_MODE === 'simple') {
        if(simpleUserPasswordInput) simpleUserPasswordInput.disabled = true;
        if(simpleSetPasswordBtn) simpleSetPasswordBtn.disabled = true;
    } else {
        if(advPasswordInput) advPasswordInput.disabled = true;
        if(advPasswordLength) advPasswordLength.disabled = true;
        if(attackSpeedSelect) attackSpeedSelect.disabled = true;
        [charLowercase, charUppercase, charNumbers, charSymbols, enableAccountLockout, lockoutAttemptsInput, advSetupAttackBtn].forEach(el => { if(el) el.disabled = true; });
    }
    
    if (bruteForceAdv_attackLoopId) cancelAnimationFrame(bruteForceAdv_attackLoopId);
    bruteForceAdv_attackLoopId = requestAnimationFrame(bruteForceAdv_attackStep);
}

function bruteForceAdv_resetSimulation() {
    const startAttackBtn = document.getElementById('bruteForceAdv_startAttackBtn');
    const resetSimulationBtn = document.getElementById('bruteForceAdv_resetSimulationBtn');
    const eventLog = document.getElementById('bruteForceAdv_eventLog');
    const targetPasswordDisplay = document.getElementById('bruteForceAdv_targetPasswordDisplay');
    const simplePasswordValidationError = document.getElementById('bruteForceAdv_simplePasswordValidationError');
    const simpleUserPasswordInput = document.getElementById('bruteForceAdv_simpleUserPasswordInput');
    const simpleSetPasswordBtn = document.getElementById('bruteForceAdv_simpleSetPasswordBtn');
    const advConfigError = document.getElementById('bruteForceAdv_advConfigError');
    const advPasswordInput = document.getElementById('bruteForceAdv_advPasswordInput');
    const advPasswordLength = document.getElementById('bruteForceAdv_advPasswordLength');
    const attackSpeedSelect = document.getElementById('bruteForceAdv_attackSpeed');
    const charLowercase = document.getElementById('bruteForceAdv_charLowercase');
    const charUppercase = document.getElementById('bruteForceAdv_charUppercase');
    const charNumbers = document.getElementById('bruteForceAdv_charNumbers');
    const charSymbols = document.getElementById('bruteForceAdv_charSymbols');
    const enableAccountLockout = document.getElementById('bruteForceAdv_enableAccountLockout');
    const accountLockoutOptions = document.getElementById('bruteForceAdv_accountLockoutOptions');
    const lockoutAttemptsInput = document.getElementById('bruteForceAdv_lockoutAttemptsInput');
    const estimatedTimeText = document.getElementById('bruteForceAdv_estimatedTimeText');
    const advSetupAttackBtn = document.getElementById('bruteForceAdv_advSetupAttackBtn');


    bruteForceAdv_isAttackRunning = false;
    if (bruteForceAdv_attackLoopId) {
        cancelAnimationFrame(bruteForceAdv_attackLoopId);
        bruteForceAdv_attackLoopId = null;
    }
    
    bruteForceAdv_TARGET_PASSWORD = "";
    bruteForceAdv_currentGeneratedPassword = "";
    bruteForceAdv_attemptsCount = 0;
    bruteForceAdv_passwordFound = false;
    bruteForceAdv_isPasswordSet = false;
    
    if(eventLog) eventLog.innerHTML = ''; 
    bruteForceAdv_logEvent("Simulation Reset.", "emphasis");
    if(targetPasswordDisplay) targetPasswordDisplay.textContent = "***";
    
    bruteForceAdv_updateSystemVisualState();
    bruteForceAdv_updateAttackMonitorDisplay();

    if(startAttackBtn) startAttackBtn.disabled = true; 
    if(resetSimulationBtn) resetSimulationBtn.disabled = true;

    if (bruteForceAdv_SIMULATION_MODE === 'simple') {
        if(simplePasswordValidationError) simplePasswordValidationError.textContent = "";
        if(simpleUserPasswordInput) simpleUserPasswordInput.value = "";
        if(simpleUserPasswordInput) simpleUserPasswordInput.disabled = false;
        if(simpleSetPasswordBtn) simpleSetPasswordBtn.disabled = false;
        bruteForceAdv_logEvent("Set a 3-letter lowercase password.", "emphasis");
    } else {
        if(advConfigError) advConfigError.textContent = "";
        if(advPasswordInput) advPasswordInput.value = "";
        if(advPasswordLength) advPasswordLength.value = "3";
        if(advPasswordInput) advPasswordInput.maxLength = 3; 
        if(attackSpeedSelect) attackSpeedSelect.value = "normal";
        if(charLowercase) charLowercase.checked = true;
        if(charUppercase) charUppercase.checked = false;
        if(charNumbers) charNumbers.checked = false;
        if(charSymbols) charSymbols.checked = false;
        if(enableAccountLockout) enableAccountLockout.checked = false;
        if(accountLockoutOptions) accountLockoutOptions.classList.add('hidden');
        if(lockoutAttemptsInput) lockoutAttemptsInput.value = "100";
        if(estimatedTimeText) estimatedTimeText.textContent = "-";
        [advPasswordInput, advPasswordLength, attackSpeedSelect, charLowercase, charUppercase, charNumbers, charSymbols, enableAccountLockout, lockoutAttemptsInput, advSetupAttackBtn].forEach(el => {if(el) el.disabled = false;});
        bruteForceAdv_logEvent("Configure advanced attack parameters.", "emphasis");
        bruteForceAdv_calculateEstimatedTime(); 
    }
}

function bruteForceAdv_switchToMode(mode) {
    const modeSelectionScreen = document.getElementById('bruteForceAdv_modeSelectionScreen');
    const simulatorInterface = document.getElementById('bruteForceAdv_simulatorInterface');
    const simpleModeConfigDiv = document.getElementById('bruteForceAdv_simpleModeConfig');
    const advancedModeConfigDiv = document.getElementById('bruteForceAdv_advancedModeConfig');
    const modeDisplay = document.getElementById('bruteForceAdv_modeDisplay');
    const infoBoxText = document.getElementById('bruteForceAdv_infoBoxText');
    const advPasswordInput = document.getElementById('bruteForceAdv_advPasswordInput');
    const advPasswordLength = document.getElementById('bruteForceAdv_advPasswordLength');

    if(!modeSelectionScreen || !simulatorInterface || !simpleModeConfigDiv || !advancedModeConfigDiv || !modeDisplay || !infoBoxText) return;

    bruteForceAdv_SIMULATION_MODE = mode;
    modeSelectionScreen.classList.add('hidden');
    simulatorInterface.classList.remove('hidden');
    bruteForceAdv_resetSimulation(); 

    if (mode === 'simple') {
        modeDisplay.textContent = "Simple Mode Activated";
        simpleModeConfigDiv.classList.remove('hidden');
        advancedModeConfigDiv.classList.add('hidden');
        infoBoxText.innerHTML = `A <strong class="text-amber-300">brute-force attack</strong> tries many passwords. This mode uses a 3-letter lowercase password.`;
    } else { 
        modeDisplay.textContent = "Advanced Mode Activated";
        simpleModeConfigDiv.classList.add('hidden');
        advancedModeConfigDiv.classList.remove('hidden');
        infoBoxText.innerHTML = `A <strong class="text-amber-300">brute-force attack</strong> tries password combinations. Configure length, character sets, and defenses.`;
        if(advPasswordInput && advPasswordLength) advPasswordInput.maxLength = parseInt(advPasswordLength.value); 
        bruteForceAdv_calculateEstimatedTime(); 
    }
}

function bruteForceAdv_handleAdvPasswordLengthChange() {
    const advPasswordLength = document.getElementById('bruteForceAdv_advPasswordLength');
    const advPasswordInput = document.getElementById('bruteForceAdv_advPasswordInput');
    if(!advPasswordLength || !advPasswordInput) return;

    const newLength = parseInt(advPasswordLength.value);
    if (!isNaN(newLength) && newLength >= 1 && newLength <= 6) {
        advPasswordInput.maxLength = newLength;
        if (advPasswordInput.value.length > newLength) {
            advPasswordInput.value = advPasswordInput.value.substring(0, newLength);
        }
    }
    bruteForceAdv_calculateEstimatedTime(); 
}

function bruteForceAdv_init() { // Renamed from the global DOMContentLoaded
    const selectSimpleModeBtn = document.getElementById('bruteForceAdv_selectSimpleModeBtn');
    const selectAdvancedModeBtn = document.getElementById('bruteForceAdv_selectAdvancedModeBtn');
    const backToModeSelectionBtn = document.getElementById('bruteForceAdv_backToModeSelectionBtn');
    const simpleSetPasswordBtn = document.getElementById('bruteForceAdv_simpleSetPasswordBtn');
    const advPasswordLength = document.getElementById('bruteForceAdv_advPasswordLength');
    const advPasswordInput = document.getElementById('bruteForceAdv_advPasswordInput');
    const charLowercase = document.getElementById('bruteForceAdv_charLowercase');
    const charUppercase = document.getElementById('bruteForceAdv_charUppercase');
    const charNumbers = document.getElementById('bruteForceAdv_charNumbers');
    const charSymbols = document.getElementById('bruteForceAdv_charSymbols');
    const attackSpeedSelect = document.getElementById('bruteForceAdv_attackSpeed');
    const enableAccountLockout = document.getElementById('bruteForceAdv_enableAccountLockout');
    const accountLockoutOptions = document.getElementById('bruteForceAdv_accountLockoutOptions');
    const advSetupAttackBtn = document.getElementById('bruteForceAdv_advSetupAttackBtn');
    const startAttackBtn = document.getElementById('bruteForceAdv_startAttackBtn');
    const resetSimulationBtn = document.getElementById('bruteForceAdv_resetSimulationBtn');


    bruteForceAdv_updateSystemVisualState(); 
    bruteForceAdv_updateAttackMonitorDisplay();
    if(startAttackBtn) startAttackBtn.disabled = true;
    if(resetSimulationBtn) resetSimulationBtn.disabled = true; 
    
    if(selectSimpleModeBtn) selectSimpleModeBtn.addEventListener('click', () => bruteForceAdv_switchToMode('simple'));
    if(selectAdvancedModeBtn) selectAdvancedModeBtn.addEventListener('click', () => bruteForceAdv_switchToMode('advanced'));
    if(backToModeSelectionBtn) backToModeSelectionBtn.addEventListener('click', () => {
        if(bruteForceAdv_isAttackRunning) {
            if(!confirm("Attack is running. Are you sure you want to go back and reset? This will stop the current attack.")) return;
        }
        bruteForceAdv_isAttackRunning = false; 
        if (bruteForceAdv_attackLoopId) cancelAnimationFrame(bruteForceAdv_attackLoopId);
        document.getElementById('bruteForceAdv_modeSelectionScreen').classList.remove('hidden');
        document.getElementById('bruteForceAdv_simulatorInterface').classList.add('hidden');
    });

    if(simpleSetPasswordBtn) simpleSetPasswordBtn.addEventListener('click', bruteForceAdv_handleSimpleSetPassword);

    if(advPasswordLength) advPasswordLength.addEventListener('input', bruteForceAdv_handleAdvPasswordLengthChange);
    [advPasswordInput, charLowercase, charUppercase, charNumbers, charSymbols, attackSpeedSelect].forEach(el => { 
        if(el) {
            el.addEventListener('input', bruteForceAdv_calculateEstimatedTime);
            el.addEventListener('change', bruteForceAdv_calculateEstimatedTime); 
        }
    });
    if(enableAccountLockout) enableAccountLockout.addEventListener('change', () => {
        if(accountLockoutOptions) accountLockoutOptions.classList.toggle('hidden', !enableAccountLockout.checked);
    });
    if(advSetupAttackBtn) advSetupAttackBtn.addEventListener('click', bruteForceAdv_prepareAttackAdvanced);
    
    if(startAttackBtn) startAttackBtn.addEventListener('click', bruteForceAdv_startAttack);
    if(resetSimulationBtn) resetSimulationBtn.addEventListener('click', bruteForceAdv_resetSimulation);
}


// --- Global Helper Functions (if not in worksheet-common.js) ---
window.toggleMarkScheme = function(markSchemeId, textareaId) {
    const markScheme = document.getElementById(markSchemeId);
    const buttonId = `ms-button-${textareaId.split('-')[1]}`; 
    const button = document.getElementById(buttonId);

    if (markScheme && button) {
        const isHidden = markScheme.style.display === 'none' || markScheme.style.display === '';
        markScheme.style.display = isHidden ? 'block' : 'none';
        button.textContent = isHidden ? 'Hide Mark Scheme' : 'Show Mark Scheme';
    }
};

window.toggleReveal = function(elementId, buttonElement, showText, hideText) {
    const content = document.getElementById(elementId);
    const textareaId = buttonElement.id.replace('reveal-', '').replace('-btn', '-student'); 
    const textarea = document.getElementById(textareaId);
    const minChars = 40;

    if (content && buttonElement) {
        if (!content.classList.contains('show')) { 
            if (textarea && textarea.value.trim().length < minChars) {
                let tempMsg = buttonElement.parentNode.querySelector('.reveal-req-msg');
                if (!tempMsg) {
                    tempMsg = document.createElement('span');
                    tempMsg.className = 'reveal-req-msg text-xs text-red-500 ml-2';
                    buttonElement.parentNode.insertBefore(tempMsg, buttonElement.nextSibling);
                }
                tempMsg.textContent = ` Please write at least ${minChars} characters first.`;
                setTimeout(() => { if(tempMsg) tempMsg.remove(); }, 3000);
                return; 
            }
        }

        const isCurrentlyHidden = content.classList.contains('hidden') || !content.classList.contains('show');
        if (isCurrentlyHidden) {
            content.classList.remove('hidden');
            content.classList.add('show');
            buttonElement.textContent = hideText;
        } else {
            content.classList.add('hidden');
            content.classList.remove('show');
            buttonElement.textContent = showText;
        }
    }
};
