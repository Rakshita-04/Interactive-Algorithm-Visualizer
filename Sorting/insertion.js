var beep = new Audio('beep3.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const InsertionSortButton = document.querySelector(".InsertionSort");
InsertionSortButton.addEventListener('click', async function () {
    selectText.innerHTML = `Insertion Sort..`;
    mouseclick.play();

    const description = document.querySelector('#description');
    description.style.display = 'flex';
    const section = document.querySelector('#fullbody');
    section.style.height = '184vh';
    await descriptionText_insertion();

    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();
    await InsertionSort();
    // If you want to re-enable these too, uncomment the next two lines:
    // enableSortingBtn();
    // enableSizeSlider();
    enableNewArrayBtn();
});

async function descriptionText_insertion() {
    const section = document.querySelector('#fullbody');
    section.style.height = `184vh`;

    const description = document.querySelector('#description');
    description.style.display = 'flex';

    // Your HTML uses #code_java. Fallback to #code_cpp only if present.
    const code = document.querySelector('#code_java') || document.querySelector('#code_cpp');
    if (code) {
        code.innerHTML = `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        cout << arr[i] << " ";
    cout << endl;
}
int main() {
    int arr[] = {12, 11, 13, 5, 6};
    int n = sizeof(arr) / sizeof(arr[0]);
    insertionSort(arr, n);
    cout << "Sorted array: ";
    printArray(arr, n);
    return 0;
}`;
    }

    const time = document.querySelector('#time');
    if (time) {
        time.innerHTML = `The worst-case (and average-case) complexity of the insertion sort algorithm is O(n²).
The best-case time complexity is O(n).

Time Complexity: O(N^2)`;
    }

    const space = document.querySelector('#space');
    if (space) {
        space.innerHTML = `The space complexity of insertion sort is <b>O(1)</b>.
Auxiliary Space: O(1)`;
    }
}

/* ---------- Helpers ---------- */
function getHeightsArray() {
    return Array.from(document.querySelectorAll('.bar')).map(bar => parseInt(bar.style.height));
}

function renderBars(arr, highlights = {}, defaultColor = 'cyan') {
    const bars = document.querySelectorAll('.bar');
    arr.forEach((val, idx) => {
        const b = bars[idx];
        b.style.height = `${val}px`;
        b.innerHTML = val;
        b.style.background = highlights[idx] || defaultColor;
    });
}

/* ---------- Corrected Insertion Sort with progressive green ---------- */
async function InsertionSort() {
    let arr = getHeightsArray();
    const n = arr.length;
    if (n === 0) return;

    // initially all cyan, first one green (sorted prefix of length 1)
    renderBars(arr);
    document.querySelectorAll('.bar')[0].style.background = 'rgb(0,255,0)';

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        // highlight current key being placed
        renderBars(arr, { [i]: 'rgb(250, 5, 54)' }); // red for key
        await waitforme(delay);

        // shift bigger elements to the right
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            beep.play();
            renderBars(arr, { [j]: 'rgb(9, 102, 2)', [j + 1]: 'rgb(9, 102, 2)' }); // shifting highlight
            await waitforme(delay);
            j--;
        }

        // insert key
        arr[j + 1] = key;

        // mark sorted prefix [0..i] as green
        const greens = {};
        for (let g = 0; g <= i; g++) greens[g] = 'rgb(0,255,0)';
        renderBars(arr, greens);
        await waitforme(delay);
    }

    done.play();
    selectText.innerHTML = `Sorting Complete!`;
}
