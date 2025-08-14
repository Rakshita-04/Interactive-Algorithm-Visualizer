var beep = new Audio('beep3.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const BubbleSortButton = document.querySelector(".BubbleSort");
BubbleSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Bubble Sort..`;

    const description = document.querySelector('#description');
    description.style.display = 'flex';
    const section = document.querySelector('#fullbody');
    section.style.height = '184vh';

    await descriptionText_bubble();

    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();
    await BubbleSort();
    enableNewArrayBtn();
});

// ---------- Description section ----------
async function descriptionText_bubble() {
    const section = document.querySelector('#fullbody');
    section.style.height = `184vh`;

    const description = document.querySelector('#description');
    description.style.display = 'flex';

    // Use #code_java if present, fallback to #code_cpp
    const code = document.querySelector('#code_java') || document.querySelector('#code_cpp');
    if (code) {
        code.innerHTML = `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        cout << arr[i] << " ";
    cout << endl;
}
int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    bubbleSort(arr, n);
    cout << "Sorted array: ";
    printArray(arr, n);
    return 0;
}`;
    }

    const time = document.querySelector('#time');
    if (time) {
        time.innerHTML = `The above function always runs O(N^2) time even if the array is sorted.
It can be optimized by stopping the algorithm if the inner loop didn’t cause any swap.

Time Complexity: O(N^2)`;
    }

    const space = document.querySelector('#space');
    if (space) {
        space.innerHTML = `The space complexity of the Bubble Sort algorithm is O(1).
Bubble sort requires only a fixed amount of extra space for variables such as
loop counters and temporary swap storage.

Auxiliary Space: O(1)`;
    }
}

// ---------- Helpers ----------
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

// ---------- Bubble Sort ----------
async function BubbleSort() {
    let arr = getHeightsArray();
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Highlight bars being compared
            renderBars(arr, { [j]: 'rgb(250, 5, 54)', [j + 1]: 'rgb(250, 5, 54)' }, 'cyan');
            await waitforme(delay);

            // Swap if needed
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                beep.play();
                renderBars(arr, { [j]: 'rgb(250, 5, 54)', [j + 1]: 'rgb(250, 5, 54)' }, 'cyan');
                await waitforme(delay);
            }

            // Revert to default color for unsorted
            renderBars(arr, { [j]: 'cyan', [j + 1]: 'cyan' }, 'cyan');

            // Keep previously sorted elements green
            for (let k = n - i; k < n; k++) {
                document.querySelectorAll('.bar')[k].style.background = 'rgb(0,255,0)';
            }
        }

        // Mark the largest in correct position
        document.querySelectorAll('.bar')[n - 1 - i].style.background = 'rgb(0,255,0)';
    }

    // Mark the very first bar green at the end
    document.querySelectorAll('.bar')[0].style.background = 'rgb(0,255,0)';

    done.play();
    selectText.innerHTML = `Sorting Complete!`;
}
