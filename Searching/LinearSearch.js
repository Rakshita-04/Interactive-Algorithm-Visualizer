console.log('linear.js (updated, step count fixed) loaded');

var findingAudio = new Audio('Finding.mp3');
var findedAudio = new Audio('Finded.mp3');
var mouseclick = new Audio('Mouseclick.mp3');

async function waitMs(ms) {
    if (typeof waitforme === 'function') return await waitforme(ms);
    return new Promise(r => setTimeout(r, ms || 200));
}

// Get numeric value from a bar
function barValue(el) {
    if (!el) return NaN;
    const txt = (el.innerText || el.textContent || '').toString().trim();
    const m = txt.match(/-?\d+/);
    return m ? parseInt(m[0], 10) : NaN;
}

// Main Linear Search function
async function linearSearch(array, n, val) {
    let count = 0; // Reset step counter at start of each search

    for (let i = 0; i < n; i++) {
        await waitMs(window.delay || 150);

        const currentVal = barValue(array[i]);

        // Play searching audio safely
        try { findingAudio.pause(); findingAudio.currentTime = 0; findingAudio.play(); } catch (_) {}

        // Compare with target
        count++;
        if (currentVal === val) {
            try { findingAudio.pause(); findingAudio.currentTime = 0; } catch (_) {}
            try { findedAudio.pause(); findedAudio.currentTime = 0; findedAudio.play(); } catch (_) {}

            array[i].style.background = 'green';
            array[i].style.color = '#fcfcfc';

            const stepEl = document.querySelector('.step');
            if (stepEl) stepEl.innerHTML = `${count}`;

            return i; // found
        }

        // Not found yet → mark as compared
        array[i].style.background = 'red';
        array[i].style.color = 'white';

        const stepEl = document.querySelector('.step');
        if (stepEl) stepEl.innerHTML = `${count}`;
    }
    return -1; // not found
}

// Attach click handler
const linearBtn = document.querySelector('#linear_Search');
if (linearBtn) {
    linearBtn.addEventListener('click', async () => {
        console.log('Linear Search started');
        try { mouseclick.play(); } catch (_) {}

        // Get bars (supports both .bar and .bars)
        const nodeList = document.querySelectorAll('.bar').length
            ? document.querySelectorAll('.bar')
            : document.querySelectorAll('.bars');

        if (!nodeList.length) {
            alert('No bars found. Ensure bars have class ".bar" or ".bars".');
            return;
        }

        const ArrayEls = Array.from(nodeList);

        const valRaw = document.querySelector('#searchingVal')?.value?.trim() || '';
        if (!valRaw) {
            alert('Please put Searching Value first!! 😕');
            return;
        }
        const val = parseInt(valRaw, 10);
        if (Number.isNaN(val)) {
            alert('Please enter a valid integer.');
            return;
        }

        // UI setup
        const searchText = document.querySelector('.selected') || document.querySelector('#searchText');
        if (searchText) searchText.innerHTML = `Linear Searching..`;

        const description = document.querySelector('#description');
        if (description) description.style.display = 'flex';

        const section = document.querySelector('#fullbody');
        if (section) section.style.height = '184vh';

        try { disableSortingBtn(); } catch (_) {}
        try { disableSizeSlider(); } catch (_) {}
        try { disableNewArrayBtn(); } catch (_) {}

        // Run search
        const ind = await linearSearch(ArrayEls, ArrayEls.length, val);

        const indexEl = document.querySelector('.index');
        if (ind !== -1) {
            if (searchText) searchText.innerHTML = `Searching Complete`;
            if (indexEl) indexEl.innerHTML = `${val} is present at index no. ${ind}`;
        } else {
            if (searchText) searchText.innerHTML = `Not Found!!`;
            if (indexEl) indexEl.innerHTML = `${val} is not present in the Array!!`;
            try { findingAudio.pause(); findingAudio.currentTime = 0; } catch (_) {}
        }

        try { enableNewArrayBtn(); } catch (_) {}
        try { enableSortingBtn(); } catch (_) {}
        try { enableSizeSlider(); } catch (_) {}
    });
}
