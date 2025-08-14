var beep = new Audio('beep3.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const SelectionSortButton = document.querySelector(".SelectionSort");
SelectionSortButton.addEventListener('click', async function () {
    selectText.innerHTML = `Selection Sort..`;
    mouseclick.play();

    const description = document.querySelector('#description');
    description.style.display = 'flex';
    const section = document.querySelector('#fullbody');
    section.style.height = '184vh';

    await descriptionText_selection();

    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();

    let arr = getHeightsArray();
    await selectionSort(arr);

    renderBars(arr);
    colorRange(0, arr.length - 1, 'rgb(0,255,0)');

    selectText.innerHTML = `Sorting Complete!`;
    done.play();
    enableNewArrayBtn();
});

/* ---------- Description with C++ ---------- */
async function descriptionText_selection() {
    const section = document.querySelector('#fullbody');
    section.style.height = `184vh`;

    const description = document.querySelector('#description');
    description.style.display = 'flex';

    const code = document.querySelector('#code_java') || document.querySelector('#code_cpp');
    if (code) {
        code.innerText = `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        swap(arr[i], arr[min_idx]);
    }
}

int main() {
    vector<int> arr = {64, 25, 12, 22, 11};
    selectionSort(arr);
    for (int x : arr) cout << x << " ";
}`;
    }

    const time = document.querySelector('#time');
    if (time) {
        time.innerHTML = `<b>Time Complexity:</b> O(N²) for all cases.<br>
One loop selects the position, another finds the minimum from the rest.`;
    }

    const space = document.querySelector('#space');
    if (space) {
        space.innerHTML = `<b>Auxiliary Space:</b> O(1)<br>
Selection Sort makes at most N swaps, using constant extra memory.`;
    }
}

/* ---------- Helpers ---------- */
function getHeightsArray() {
    return Array.from(document.querySelectorAll('.bar')).map(bar => parseInt(bar.style.height));
}

function renderBars(arr, highlights = {}, defaultColor = 'cyan') {
    const bars = document.querySelectorAll('.bar');
    arr.forEach((val, idx) => {
        bars[idx].style.height = `${val}px`;
        bars[idx].innerHTML = val;
        bars[idx].style.background = highlights[idx] || defaultColor;
    });
}

function colorRange(start, end, color) {
    const bars = document.querySelectorAll('.bar');
    for (let i = start; i <= end; i++) {
        bars[i].style.background = color;
    }
}

/* ---------- Selection Sort ---------- */
async function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let min_idx = i;
        renderBars(arr, { [i]: 'rgb(250, 5, 54)' }); // mark current index red
        await waitforme(delay);

        for (let j = i + 1; j < n; j++) {
            renderBars(arr, { [i]: 'rgb(250, 5, 54)', [j]: 'rgb(245, 212, 24)' });
            await waitforme(delay);

            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }

            renderBars(arr, { [i]: 'rgb(250, 5, 54)' });
        }

        if (min_idx !== i) {
            [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
            beep.play();
            renderBars(arr, { [i]: 'orange', [min_idx]: 'orange' });
            await waitforme(delay);
        }

        renderBars(arr);
        document.querySelectorAll('.bar')[i].style.background = 'rgb(0,255,0)'; // sorted green
    }
}
