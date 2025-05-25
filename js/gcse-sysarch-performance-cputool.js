// --- Basic View Elements ---
        const clockSpeedSlider = document.getElementById('clockSpeed');
        const cacheSizeSlider = document.getElementById('cacheSize');
        const coresSlider = document.getElementById('cores');
        const clockSpeedValueSpan = document.getElementById('clockSpeedValue');
        const cacheSizeValueSpan = document.getElementById('cacheSizeValue');
        const coresValueSpan = document.getElementById('coresValue');
        const performanceBar = document.getElementById('performanceBar');
        const performanceExplanation = document.getElementById('performanceExplanation');
        const cpuSuggestionP = document.getElementById('cpuSuggestion');
        const cpuSuggestionSpecsP = document.getElementById('cpuSuggestionSpecs');
        // cpuSuggestionImage reference removed

         // --- View Switching Elements ---
        const basicViewDiv = document.getElementById('basicView');
        const advancedViewDiv = document.getElementById('advancedView');
        const showAdvancedBtn = document.getElementById('showAdvancedBtn');
        const showBasicBtn = document.getElementById('showBasicBtn');

        // --- Advanced View Interactive Elements ---
        const clockTypeSelect = document.getElementById('clockTypeSelect');
        const clockRangeInfo = document.getElementById('clockRangeInfo');
        const lithoSelect = document.getElementById('lithoSelect');
        const lithoInfo = document.getElementById('lithoInfo');
        const lithoDensitySquare = document.getElementById('lithoDensitySquare');
        const lithoPerfIndicator = document.getElementById('lithoPerfIndicator');
        const lithoEffIndicator = document.getElementById('lithoEffIndicator');
        const tdpSelect = document.getElementById('tdpSelect');
        const tdpInfo = document.getElementById('tdpInfo');
        const tdpCpuVisual = document.getElementById('tdpCpuVisual');
        const tdpCoolerIcon = document.getElementById('tdpCoolerIcon');
        const tdpCoolerText = document.getElementById('tdpCoolerText');
        const ramTypeSelect = document.getElementById('ramTypeSelect');
        const ramInfo = document.getElementById('ramInfo');
        const ramPipe = document.getElementById('ramPipe');
        const ramBandwidthText = document.getElementById('ramBandwidthText');
        const pcieSelect = document.getElementById('pcieSelect');
        const pcieInfo = document.getElementById('pcieInfo');
        const pciePipe = document.getElementById('pciePipe');
        const pcieBandwidthText = document.getElementById('pcieBandwidthText');

        // --- Basic View Data & Functions ---
        const minClock = 1, maxClock = 5.5;
        const minCache = 1, maxCache = 32;
        const minCores = 1, maxCores = 16;
        const weightClock = 0.4; const weightCache = 0.3; const weightCores = 0.3;

        // --- CPU Database (imageUrl removed) ---
        const cpuDatabase = [
            { name: "Intel Celeron N4020", cores: 2, clock: 2.8, cache: 4 },
            { name: "AMD Athlon Silver 3050U", cores: 2, clock: 3.2, cache: 4 },
            { name: "Intel Core i3-10100F", cores: 4, clock: 4.3, cache: 6 },
            { name: "AMD Ryzen 3 3200G", cores: 4, clock: 4.0, cache: 4 },
            { name: "Intel Core i5-11400F", cores: 6, clock: 4.4, cache: 12 },
            { name: "AMD Ryzen 5 5600X", cores: 6, clock: 4.6, cache: 32 },
            { name: "Intel Core i5-1240P", cores: 12, clock: 4.4, cache: 12 },
            { name: "AMD Ryzen 7 5800U", cores: 8, clock: 4.4, cache: 16 },
            { name: "Intel Core i7-12700K", cores: 12, clock: 5.0, cache: 25 },
            { name: "AMD Ryzen 7 5800X", cores: 8, clock: 4.7, cache: 32 },
            { name: "Intel Core i5-12600K", cores: 10, clock: 4.9, cache: 20 },
            { name: "Intel Core i9-13900K", cores: 16, clock: 5.4, cache: 32 },
            { name: "AMD Ryzen 9 7950X", cores: 16, clock: 5.7, cache: 32 },
        ];


        function findCpuMatch(clock, cache, cores) { let bestMatch = null; let minDifference = Infinity; const wCores = 5; const wClock = 1; const wCache = 0.5; for (const cpu of cpuDatabase) { const coreDiff = Math.abs(cores - cpu.cores) / maxCores; const clockDiff = Math.abs(clock - cpu.clock) / maxClock; const cacheDiff = Math.abs(cache - cpu.cache) / maxCache; const totalDifference = (coreDiff * wCores) + (clockDiff * wClock) + (cacheDiff * wCache); if (totalDifference < minDifference) { minDifference = totalDifference; bestMatch = cpu; } } return bestMatch; }
        function calculatePerformanceScore(clock, cache, cores) { const normClock = (maxClock > minClock) ? (clock - minClock) / (maxClock - minClock) : 0.5; const normCache = (maxCache > minCache) ? (cache - minCache) / (maxCache - minCache) : 0.5; const normCores = (maxCores > minCores) ? (cores - minCores) / (maxCores - minCores) : 0.5; return (normClock * weightClock) + (normCache * weightCache) + (normCores * weightCores); }

        function updatePerformance() {
            if (!basicViewDiv.classList.contains('hidden')) {
                const clock = parseFloat(clockSpeedSlider.value);
                const cache = parseInt(cacheSizeSlider.value);
                const cores = parseInt(coresSlider.value);
                clockSpeedValueSpan.textContent = clock.toFixed(1);
                cacheSizeValueSpan.textContent = cache;
                coresValueSpan.textContent = cores;
                const score = calculatePerformanceScore(clock, cache, cores);
                const percent = Math.max(0, Math.min(100, Math.round(score * 100)));
                performanceBar.style.width = `${percent}%`;
                performanceBar.textContent = `${percent}%`;
                updateExplanationText(percent, clock, cache, cores);

                const suggested = findCpuMatch(clock, cache, cores);
                if (suggested) {
                    cpuSuggestionP.textContent = suggested.name;
                    cpuSuggestionSpecsP.textContent = `(${suggested.cores} Cores, ${suggested.clock.toFixed(1)} GHz, ${suggested.cache}MB Cache)`;
                    // Image update logic removed

                } else {
                    cpuSuggestionP.textContent = "No close match found.";
                    cpuSuggestionSpecsP.textContent = "";
                    // Image hiding logic removed
                }
            }
        }
        function updateExplanationText(score, clock, cache, cores) { let expl = `With ${clock.toFixed(1)} GHz, ${cache} MB Cache, & ${cores} Cores: `; if (score > 85) expl += "Simulated performance is very high. Great for demanding tasks."; else if (score > 65) expl += "Simulated performance is good. Suitable for multitasking & gaming."; else if (score > 40) expl += "Simulated performance is solid. Good for general use."; else expl += "Simulated performance is basic. Best for simple tasks."; expl += " (Real-world results vary)."; performanceExplanation.textContent = expl; }

        // --- Advanced View Update Functions ---
        function updateClockInfo() { if (clockTypeSelect.value === 'base') { clockRangeInfo.textContent = "Typical Base Clock: 2.0 - 4.0 GHz. Determines sustained performance."; } else { clockRangeInfo.textContent = "Typical Boost Clock: 3.5 - 5.5+ GHz. Provides short bursts of speed."; } }
        function updateLithoInfo() { const val = lithoSelect.value; let txt = "", dots = 0, pCls = 'bg-red-200 text-red-800', eCls = 'bg-red-200 text-red-800'; if (val === '14') { txt = "<strong>14/12nm:</strong> Mature, less dense."; dots = 20; pCls = eCls = 'bg-yellow-200 text-yellow-800';} else if (val === '10') { txt = "<strong>10nm:</strong> Improved density/efficiency."; dots = 40; pCls = 'bg-yellow-200 text-yellow-800'; eCls = 'bg-green-200 text-green-800';} else if (val === '7') { txt = "<strong>7nm:</strong> Significant gains."; dots = 60; pCls = eCls = 'bg-green-200 text-green-800';} else if (val === '5') { txt = "<strong>5/4nm:</strong> Leading-edge."; dots = 80; pCls = eCls = 'bg-blue-200 text-blue-800';} else if (val === '3') { txt = "<strong>3nm:</strong> Emerging tech."; dots = 100; pCls = eCls = 'bg-purple-200 text-purple-800';} lithoInfo.innerHTML = txt; lithoDensitySquare.innerHTML = ''; for (let i=0; i<100; i++) { const d=document.createElement('div'); d.className='litho-dot'; if(i<dots && Math.random()<(dots/100)*1.2) d.style.opacity='1'; lithoDensitySquare.appendChild(d); } const vis=lithoDensitySquare.querySelectorAll('.litho-dot[style*="opacity: 1"]'); let more=dots-vis.length; if(more>0){const hid=lithoDensitySquare.querySelectorAll('.litho-dot:not([style*="opacity: 1"])'); for(let i=0;i<Math.min(more,hid.length);i++) hid[i].style.opacity='1';} lithoPerfIndicator.className=`indicator ${pCls}`; lithoEffIndicator.className=`indicator ${eCls}`; }
        function updateTdpInfo() { const val = tdpSelect.value; let txt = "", clr = 'bg-gray-300', glow = 'shadow-[0_0_0px_0px_rgba(0,0,0,0)]', icon = 'fas fa-fan', cTxt = 'Basic Cooling'; if (val === 'low') { txt = "<strong>Low (~5-15W):</strong> Tablets/thin laptops."; clr = 'bg-blue-200'; icon = 'fas fa-battery-quarter'; cTxt = 'Passive/Minimal';} else if (val === 'mobile') { txt = "<strong>Mobile (~15-45W):</strong> Laptops."; clr = 'bg-green-300'; icon = 'fas fa-fan'; cTxt = 'Laptop Fan';} else if (val === 'desktop') { txt = "<strong>Desktop (~65-125W):</strong> PCs."; clr = 'bg-yellow-400'; glow = 'shadow-[0_0_15px_5px_rgba(251,191,36,0.6)]'; icon = 'fas fa-tower-broadcast'; cTxt = 'Air Tower';} else if (val === 'high') { txt = "<strong>High-End (~150W+):</strong> Enthusiast/Server."; clr = 'bg-red-500'; glow = 'shadow-[0_0_25px_10px_rgba(239,68,68,0.7)]'; icon = 'fas fa-water'; cTxt = 'Liquid Cooler';} tdpInfo.innerHTML = txt; tdpCpuVisual.className = `tdp-cpu ${clr} ${glow}`; tdpCoolerIcon.className = `${icon} cooler-icon`; tdpCoolerText.textContent = cTxt; }
        function updateRamInfo() { const opt = ramTypeSelect.options[ramTypeSelect.selectedIndex]; const type = opt.value.includes('ddr5')?'DDR5':'DDR4'; const spd = parseInt(opt.getAttribute('data-speed')); const ch = parseInt(opt.getAttribute('data-channels')); const bw = (spd * ch * 8) / 1000; const maxBw = (5200*2*8)/1000; const bwPerc = (bw/maxBw)*100; let txt = `<strong>${type} (${ch}-Ch):</strong> ~${bw.toFixed(1)} GB/s. `; txt += (type==='DDR4')?"Older.":"Newer."; if(ch===1)txt+=" Single channel limits bandwidth."; ramInfo.innerHTML = txt; ramPipe.style.width = `${Math.max(10, bwPerc)}%`; ramBandwidthText.textContent = `~${bw.toFixed(1)} GB/s`; }
        function updatePcieInfo() { const opt = pcieSelect.options[pcieSelect.selectedIndex]; const ver = opt.value; const bwPL = parseInt(opt.getAttribute('data-bw')); const maxBwPL = 4; const bwPerc = (bwPL/maxBwPL)*100; let txt = `<strong>PCIe ${ver}.0:</strong> ~${bwPL} GB/s/lane. `; if(ver==='3')txt+="Older."; else if(ver==='4')txt+="Doubles 3.0."; else if(ver==='5')txt+="Doubles 4.0."; pcieInfo.innerHTML = txt; pciePipe.style.width = `${Math.max(25, bwPerc)}%`; pcieBandwidthText.textContent = `~${bwPL} GB/s/lane`; }

        // --- Event Listeners ---
        clockSpeedSlider.addEventListener('input', updatePerformance);
        cacheSizeSlider.addEventListener('input', updatePerformance);
        coresSlider.addEventListener('input', updatePerformance);
        showAdvancedBtn.addEventListener('click', () => { basicViewDiv.classList.add('hidden'); advancedViewDiv.classList.remove('hidden'); });
        showBasicBtn.addEventListener('click', () => { advancedViewDiv.classList.add('hidden'); basicViewDiv.classList.remove('hidden'); updatePerformance(); });
        clockTypeSelect.addEventListener('change', updateClockInfo);
        lithoSelect.addEventListener('change', updateLithoInfo);
        tdpSelect.addEventListener('change', updateTdpInfo);
        ramTypeSelect.addEventListener('change', updateRamInfo);
        pcieSelect.addEventListener('change', updatePcieInfo);

        // Initial setup on page load
        window.onload = () => {
            updatePerformance();
            updateClockInfo();
            updateLithoInfo();
            updateTdpInfo();
            updateRamInfo();
            updatePcieInfo();
        };