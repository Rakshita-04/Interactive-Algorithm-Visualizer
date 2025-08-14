/* binary.js
   Robust binary search visualizer for your project (fixed step-counting & original-index handling).
   - Steps now count comparisons (probes) only
   - Preserves original index before sorting and reports both sorted & original index when found
   - Updates optional .low .high .mid UI elements (if present)
   - Keeps previous safety checks, audio hooks, and helper calls
   - Removes duplicate listeners by cloning the button before attaching a listener
*/
console.log('binary.js (fixed) loaded');

(() => {
  // Config / colors
  const COLOR_DEFAULT = 'cyan';
  const COLOR_EXCLUDED = '#f7b6c6';
  const COLOR_MID = 'rgb(245, 212, 24)';
  const COLOR_FOUND = 'rgb(0,255,0)';
  const COLOR_COMPARE = 'rgb(250, 5, 54)';
  const TEXT_LIGHT = '#ffffff';
  const TEXT_DARK = '#111';

  // Use waitforme(delay) if available, otherwise fallback sleep
  async function waitMs(ms) {
    if (typeof waitforme === 'function') return await waitforme(ms);
    return new Promise(r => setTimeout(r, ms || 200));
  }

  // Safely get bars NodeList — prefer .bar (project uses that), fall back to .bars
  function getBarsNodeList() {
    let nl = document.querySelectorAll('.bar');
    if (nl && nl.length) return nl;
    nl = document.querySelectorAll('.bars');
    return nl;
  }

  // parse integer value from bar element text
  function barValue(el) {
    if (!el) return NaN;
    const txt = (el.innerText || el.textContent || '').toString().trim();
    const m = txt.match(/-?\d+/);
    return m ? parseInt(m[0], 10) : NaN;
  }

  // reset / normalize UI elements that may be duplicated
  function normalizeUIElements() {
    const indexEls = document.querySelectorAll('.index');
    if (indexEls.length > 1) {
      for (let i = 1; i < indexEls.length; i++) indexEls[i].remove();
    }
    const stepEls = document.querySelectorAll('.step');
    if (stepEls.length > 1) {
      for (let i = 1; i < stepEls.length; i++) stepEls[i].remove();
    }
  }

  // paint all bars to default color
  function paintAllDefault(bars) {
    bars.forEach(b => {
      b.style.background = COLOR_DEFAULT;
      b.style.color = TEXT_LIGHT;
    });
  }

  // sort bars by numeric value and re-append to #mainbody (ascending)
  // NOTE: barsArray elements are expected to contain data-original-index dataset (set before calling)
  function sortBarsInDOM(barsArray) {
    barsArray.sort((a, b) => {
      const va = barValue(a), vb = barValue(b);
      return (Number.isNaN(va) ? 0 : va) - (Number.isNaN(vb) ? 0 : vb);
    });
    const container = document.querySelector('#mainbody');
    if (!container) {
      console.warn('#mainbody not found — skipping re-append');
      return barsArray;
    }
    // clear and append sorted ones
    while (container.firstChild) container.removeChild(container.firstChild);
    barsArray.forEach(el => {
      // ensure text shows numeric value (defensive)
      const v = barValue(el);
      if (!Number.isNaN(v)) el.innerText = `${v}`;
      container.appendChild(el);
    });
    return barsArray;
  }

  // Visual binary search (single run)
  async function binarySearchVisual(bars, target, delay) {
    let low = 0, high = bars.length - 1;
    let comparisons = 0; // counts actual mid comparisons (probes)

    paintAllDefault(bars);

    const stepEl = document.querySelector('.step');
    if (stepEl) stepEl.innerText = '0';
    const lowEl = document.querySelector('.low');
    const highEl = document.querySelector('.high');
    const midEl = document.querySelector('.mid');

    while (low <= high) {
      // highlight window
      paintAllDefault(bars);
      for (let i = 0; i < bars.length; i++) {
        if (i < low || i > high) {
          bars[i].style.background = COLOR_EXCLUDED;
          bars[i].style.color = TEXT_LIGHT;
        }
      }

      const mid = low + Math.floor((high - low) / 2);

      // mark mid visually
      if (mid >= 0 && mid < bars.length) {
        bars[mid].style.background = COLOR_MID;
        bars[mid].style.color = TEXT_DARK;
      }

      // update low/high/mid displays (if present)
      if (lowEl) lowEl.innerText = `low: ${low}`;
      if (highEl) highEl.innerText = `high: ${high}`;
      if (midEl) midEl.innerText = `mid: ${mid}`;

      // Count this probe as a comparison (increment here, right before we compare)
      comparisons++;
      if (stepEl) stepEl.innerText = `${comparisons}`;

      // optional searching audio
      try { if (typeof findingAudio !== 'undefined') findingAudio.play(); } catch (_) {}

      // wait so user can see mid highlight
      await waitMs(delay);

      const midVal = barValue(bars[mid]);
      if (Number.isNaN(midVal)) {
        console.warn('Encountered non-numeric bar at index', mid);
        break;
      }

      // comparison happens here
      if (midVal === target) {
        // found - stop search audio, play found audio
        try { if (typeof findingAudio !== 'undefined') { findingAudio.pause(); findingAudio.currentTime = 0; } } catch (_) {}
        try { if (typeof findedAudio !== 'undefined') findedAudio.play(); } catch (_) {}

        bars[mid].style.background = COLOR_FOUND;
        bars[mid].style.color = TEXT_DARK;

        const indexEl = document.querySelector('.index');
        if (indexEl) {
          const orig = typeof bars[mid].dataset.originalIndex !== 'undefined' ? bars[mid].dataset.originalIndex : 'N/A';
          indexEl.innerText = `${target} found at sorted index ${mid} (original index: ${orig})`;
        }
        const searchText = document.querySelector('.selected') || document.querySelector('#searchText') || null;
        if (searchText) searchText.innerText = 'Searching Complete';

        // leave the found bar highlighted; return sorted index
        return mid;
      }

      // not found — mark mid as compared, then exclude side
      bars[mid].style.background = COLOR_COMPARE;
      bars[mid].style.color = TEXT_DARK;

      // short pause to show compare color
      await waitMs(Math.max(50, Math.floor(delay / 2)));

      if (target > midVal) {
        // exclude left including mid
        for (let i = low; i <= mid; i++) {
          bars[i].style.background = COLOR_EXCLUDED;
          bars[i].style.color = TEXT_LIGHT;
        }
        low = mid + 1;
      } else {
        // exclude right including mid
        for (let i = mid; i <= high; i++) {
          bars[i].style.background = COLOR_EXCLUDED;
          bars[i].style.color = TEXT_LIGHT;
        }
        high = mid - 1;
      }

      // small delay before next iteration so UI is readable
      await waitMs(Math.max(50, Math.floor(delay / 2)));
    }

    // not found
    try { if (typeof findingAudio !== 'undefined') { findingAudio.pause(); findingAudio.currentTime = 0; } } catch (_) {}
    const indexEl = document.querySelector('.index');
    if (indexEl) indexEl.innerText = `${target} is not present in the array!!`;
    const searchText = document.querySelector('.selected') || document.querySelector('#searchText') || null;
    if (searchText) searchText.innerText = 'Not Found!!';
    return -1;
  }

  // attach single event listener to binary search button (removes prior listeners)
  function attachBinaryHandler() {
    const btn = document.querySelector('#binary_Search') || document.querySelector('#binarySearch') || document.querySelector('#search_btn');
    if (!btn) {
      console.warn('Binary search button not found (#binary_Search/#binarySearch/#search_btn)');
      return;
    }

    // Replace with a clone to remove any previously attached listeners
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);

    // attach new listener
    clone.addEventListener('click', async (ev) => {
      try { if (typeof mouseclick !== 'undefined') mouseclick.play(); } catch (_) {}

      // normalize UI duplicates (remove extra .index/.step)
      normalizeUIElements();

      // reset step & index
      const stepEl = document.querySelector('.step');
      if (stepEl) stepEl.innerText = '0';
      const indexEl = document.querySelector('.index');
      if (indexEl) indexEl.innerText = '';

      // collect bars and validate
      const nodeList = getBarsNodeList();
      if (!nodeList || nodeList.length === 0) {
        alert('No bars found. Ensure bars have class ".bar" or ".bars".');
        return;
      }
      let bars = Array.from(nodeList);

      // set original index dataset for each bar so we can report original positions after sorting
      bars.forEach((el, idx) => {
        // only set once to preserve any pre-existing mapping
        if (typeof el.dataset.originalIndex === 'undefined') el.dataset.originalIndex = idx;
      });

      // read target value from input
      const input = document.querySelector('#searchingVal') || document.querySelector('#searchVal') || null;
      let raw = input ? (input.value || '').trim() : '';
      if (!raw) {
        alert('Please enter a numeric value to search.');
        return;
      }
      const target = parseInt(raw, 10);
      if (Number.isNaN(target)) {
        alert('Please enter a valid integer value.');
        return;
      }

      // show description panel (c++ snippet + complexity) if desired
      const desc = document.querySelector('#description');
      if (desc) {
        desc.style.display = 'flex';
        const section = document.querySelector('#fullbody'); if (section) section.style.height = '184vh';
        const codeEl = document.querySelector('#code_cpp') || document.querySelector('#code_java') || document.querySelector('.language-java');
        if (codeEl) {
          // Updated C++ snippet (iterative + preserving original index example)
          codeEl.innerText =
`// Iterative Binary Search (C++) - basic (works on sorted arrays)
#include <bits/stdc++.h>
using namespace std;
int binarySearch(const vector<int>& a, int x) {
  int l = 0, r = (int)a.size() - 1;
  while (l <= r) {
    int mid = l + (r - l) / 2;
    if (a[mid] == x) return mid;       // sorted index
    if (a[mid] < x) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}

// If you need to preserve original indices (you sort before searching):
int binarySearchWithOriginalIndex(const vector<int>& a, int x) {
  // build pairs of (value, originalIndex)
  vector<pair<int,int>> v;
  for (int i = 0; i < (int)a.size(); ++i) v.push_back({a[i], i});
  sort(v.begin(), v.end(), [](const auto &p1, const auto &p2){ return p1.first < p2.first; });

  int l = 0, r = (int)v.size() - 1;
  while (l <= r) {
    int mid = l + (r - l) / 2;
    if (v[mid].first == x) return v[mid].second; // original index
    if (v[mid].first < x) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}
// Complexity: O(log n) comparisons, O(1) extra space (basic). If preserving original indices via pairs, sorting adds O(n log n) cost and O(n) extra space.
`;
        }
        const time = document.querySelector('#time'); if (time) time.innerText = 'Best: O(1)  Average/Worst: O(log n)';
        const space = document.querySelector('#space'); if (space) space.innerText = 'Iterative: O(1) extra space (without sorting). Preserve original indices: O(n) extra if you build pairs.';
      }

      // sort and re-append bars in DOM ascending
      bars = sortBarsInDOM(bars);

      // disable controls while searching (if helpers exist)
      try { if (typeof disableSortingBtn === 'function') disableSortingBtn(); } catch (_) {}
      try { if (typeof disableSizeSlider === 'function') disableSizeSlider(); } catch (_) {}
      try { if (typeof disableNewArrayBtn === 'function') disableNewArrayBtn(); } catch (_) {}

      // disable button to prevent re-click
      clone.disabled = true;

      // run visual binary search
      const d = (typeof window.delay !== 'undefined') ? window.delay : 150;
      const resultIndex = await binarySearchVisual(bars, target, d);

      // re-enable controls
      clone.disabled = false;
      try { if (typeof enableNewArrayBtn === 'function') enableNewArrayBtn(); } catch (_) {}
      try { if (typeof enableSortingBtn === 'function') enableSortingBtn(); } catch (_) {}
      try { if (typeof enableSizeSlider === 'function') enableSizeSlider(); } catch (_) {}

      console.log('binary search finished, sorted-index:', resultIndex);
    });
  }

  // initialize
  attachBinaryHandler();

  // expose helper for manual run if needed
  window.runBinarySearchOnce = async function(opts = {}) {
    const selector = opts.selector || (document.querySelectorAll('.bar').length ? '.bar' : '.bars');
    const nodes = document.querySelectorAll(selector);
    if (!nodes || nodes.length === 0) { alert('No bars found'); return; }
    const bars = Array.from(nodes);

    // set original indices
    bars.forEach((el, idx) => {
      if (typeof el.dataset.originalIndex === 'undefined') el.dataset.originalIndex = idx;
    });

    const target = ('target' in opts) ? opts.target : parseInt(prompt('Enter number to search'), 10);
    if (Number.isNaN(target)) { alert('Invalid target'); return; }
    await sortBarsInDOM(bars);
    await binarySearchVisual(bars, target, opts.delay || ((typeof window.delay !== 'undefined') ? window.delay : 150));
  };
})();
