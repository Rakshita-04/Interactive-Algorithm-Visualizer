var beep = new Audio('beep3.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const QuickSortbutton = document.querySelector(".QuickSort");
QuickSortbutton.addEventListener('click', async function () {
    selectText.innerHTML = `Quick Sort..`;
    mouseclick.play();

    const description = document.querySelector('#description');
    description.style.display = 'flex';
    const section = document.querySelector('#fullbody');
    section.style.height = '184vh';

    await descriptionText_quick();

    let arr = getHeightsArray();

    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();

    await quickSort(arr, 0, arr.length - 1);

    renderBars(arr);
    colorRange(0, arr.length - 1, 'rgb(0,255,0)');

    selectText.innerHTML = `Sorting Complete!`;
    done.play();
    enableNewArrayBtn();
});

/* ---------------- Description with C++ ---------------- */
async function descriptionText_quick() {
    const section = document.querySelector('#fullbody');
    section.style.height = `184vh`;

    const description = document.querySelector('#description');
    description.style.display = 'flex';

    const code = document.querySelector('#code_java') || document.querySelector('#code_cpp');
    if (code) {
        code.innerHTML = `#include <bits/stdc++.h>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i+1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    vector<int> arr = {10, 7, 8, 9, 1, 5};
    quickSort(arr, 0, arr.size()-1);
    for (int x : arr) cout << x << " ";
}`;
    }

    const time = document.querySelector('#time');
    if (time) {
        time.innerHTML = `Worst Case: O(N^2) when pivot is always min/max (already sorted input).
Best Case: O(N log N) when pivot divides array evenly.
Average Case: O(N log N) for random data.`;
    }

    const space = document.querySelector('#space');
    if (space) {
        space.innerHTML = `Space Complexity: O(log N) for recursion stack.`;
    }
}

/* ---------------- Helpers ---------------- */
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

/* ---------------- Quick Sort (array-based) ---------------- */
async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    renderBars(arr);
    document.querySelectorAll('.bar')[high].style.background = 'red'; // pivot
    await waitforme(delay);

    for (let j = low; j < high; j++) {
        renderBars(arr, { [j]: 'yellow', [high]: 'red' });
        await waitforme(delay);

        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            beep.play();
            renderBars(arr, { [i]: 'orange', [j]: 'orange', [high]: 'red' });
            await waitforme(delay);
        } else {
            renderBars(arr, { [j]: 'pink', [high]: 'red' });
            await waitforme(delay);
        }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    beep.play();
    renderBars(arr, { [i + 1]: 'green' });
    await waitforme(delay);

    return i + 1;
}

async function quickSort(arr, low, high) {
    if (low < high) {
        let pi = await partition(arr, low, high);
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    } else if (low === high) {
        document.querySelectorAll('.bar')[low].style.background = 'rgb(0,255,0)';
    }
}
