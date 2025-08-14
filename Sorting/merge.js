//Merged sort is basically based on DIVIDE AND CONQUER RULE
// First we have to divide the whole array into smaller parts.
//a. si --> mid and another one is b. mid+1 --> ei
//Then we have to follow this steps until we get a single elements
//then we have to sort that indivitual arrays
//then put it into an empty array which is a merged array and a sorted array too
//this is the conquer step and thus we can easily do the merge sort

var beep = new Audio('beep3.mp3')
var mouseclick = new Audio('Mouseclick.mp3')
var done = new Audio('wrong.mp3')

const MergeSortButton = document.querySelector(".MergeSort");
MergeSortButton.addEventListener('click', async function () {
   selectText.innerHTML = `Merge Sort..`;
   mouseclick.play();

   const description = document.querySelector('#description');
   description.style.display = 'flex';
   const section = document.querySelector('#fullbody');
   section.style.height = '184vh';

   await descriptionText_merge();

   // Use an internal numeric array for correct comparisons
   let arr = getHeightsArray();

   disableSortingBtn();
   disableSizeSlider();
   disableNewArrayBtn();

   await mergeSort(arr, 0, arr.length - 1);

   // Final render: everything green
   renderBars(arr);
   colorRange(0, arr.length - 1, 'rgb(0,255,0)');

   selectText.innerHTML = `Sorting Complete!`;
   done.play();
   // enableSortingBtn();
   // enableSizeSlider();
   enableNewArrayBtn();
});

/* ---------------- Description (C++) ---------------- */
async function descriptionText_merge() {
   const section = document.querySelector('#fullbody');
   section.style.height = `184vh`;

   const description = document.querySelector('#description');
   description.style.display = 'flex';

   // Prefer #code_java if that’s what your HTML uses; fallback to #code_cpp or .language-java
   const code = document.querySelector('#code_java') || document.querySelector('#code_cpp') || document.querySelector('.language-java');
   if (code) {
      code.innerHTML = `void merge(vector<int>& a, int l, int m, int r) {
    vector<int> left(a.begin() + l, a.begin() + m + 1);
    vector<int> right(a.begin() + m + 1, a.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < (int)left.size() && j < (int)right.size()) {
        if (left[i] <= right[j]) a[k++] = left[i++];
        else a[k++] = right[j++];
    }
    while (i < (int)left.size()) a[k++] = left[i++];
    while (j < (int)right.size()) a[k++] = right[j++];
}

void mergeSort(vector<int>& a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
}

int main() {
    vector<int> a = {12, 11, 13, 5, 6, 7};
    mergeSort(a, 0, (int)a.size() - 1);
    for (int x : a) cout << x << " ";
    return 0;
}`;
   }

   const time = document.querySelector('#time');
   if (time) {
      time.innerHTML = `Time Complexity: O(N log N)
Merge Sort is a divide-and-conquer algorithm with recurrence T(n) = 2T(n/2) + Θ(n).`;
   }

   const space = document.querySelector('#space');
   if (space) {
      space.innerHTML = `Auxiliary Space: O(N)
Merge uses an auxiliary array to combine two sorted halves.`;
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

/* ---------------- Merge Sort (array-based, animated) ---------------- */
async function mergeSort(arr, si, ei) {
   if (si >= ei) return;
   const mid = si + Math.floor((ei - si) / 2);
   await mergeSort(arr, si, mid);
   await mergeSort(arr, mid + 1, ei);
   await merge(arr, si, mid, ei);
}

async function merge(arr, low, mid, high) {
   // Snapshot halves
   const left = arr.slice(low, mid + 1);
   const right = arr.slice(mid + 1, high + 1);

   // Initial highlight of halves
   renderBars(arr);                 // reset to cyan
   colorRange(low, mid, 'red');     // left half
   colorRange(mid + 1, high, 'yellow'); // right half
   await waitforme(delay);

   let i = 0, j = 0, k = low;

   while (i < left.length && j < right.length) {
      // Choose the smaller and write back
      if (left[i] <= right[j]) {
         arr[k] = left[i++];
      } else {
         arr[k] = right[j++];
      }
      beep.play();

      // Render step: show merged prefix as lightgreen
      renderBars(arr);
      colorRange(low, k, 'lightgreen');      // merged portion so far
      colorRange(k + 1, high, 'cyan');       // remaining in this segment
      await waitforme(delay);
      k++;
   }

   // Drain leftovers from left
   while (i < left.length) {
      arr[k++] = left[i++];
      beep.play();
      renderBars(arr);
      colorRange(low, k - 1, 'lightgreen');
      colorRange(k, high, 'cyan');
      await waitforme(delay);
   }

   // Drain leftovers from right
   while (j < right.length) {
      arr[k++] = right[j++];
      beep.play();
      renderBars(arr);
      colorRange(low, k - 1, 'lightgreen');
      colorRange(k, high, 'cyan');
      await waitforme(delay);
   }

   // If this merge covered the whole array, make everything green now
   const n = arr.length;
   if (low === 0 && high === n - 1) {
      renderBars(arr);
      colorRange(0, n - 1, 'rgb(0,255,0)');
   } else {
      // Otherwise keep the merged segment lightgreen
      colorRange(low, high, 'lightgreen');
   }
}
