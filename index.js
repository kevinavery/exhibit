'use strict';

start();

function start() {
  const numPanels = 10;
  for (let i = 0; i < numPanels; i++) {
    buildPanel()
  }
}

function buildPanel() {
  const content = randomContent();
  const h = hljs.highlightAuto(content);

  console.log(h);

  const offset = 30;
  const leftOffset = randomBetween(0, 10) * 100;

  const e = document.createElement('pre');
  e.className = 'hljs';
  e.style.position = 'absolute';
  e.style.top = offset + 'px';
  e.style.left = leftOffset + 'px';
  e.style.opacity = '0';
  e.style.filter = 'blur(' + randomBetween(0, 5) + 'px)';
  e.style.fontSize = randomBetween(8, 12) + 'px';
  e.style.transform = 'translateY('
  e.innerHTML = h.value;

  document.body.appendChild(e);

  // TODO: cap dist depending on size of code
  const dist = 100 + randomBetween(0, 300);
  const speed = 5 + randomBetween(0, 10);
  const translateDuration = 1000 / (speed / dist);
  const fadeDuration = 5000;

  anime({
    targets: e,
    opacity: 1,
    duration: fadeDuration,
    easing: 'linear',
    complete: function() {
      anime({
        targets: e,
        opacity: 0,
        delay: translateDuration - (fadeDuration * 2),
        duration: fadeDuration,
        easing: 'linear'
      })
    }
  })

  anime({
    targets: e,
    translateY: -dist,
    duration: translateDuration,
    easing: 'linear',
    complete: function() {
      document.body.removeChild(e);
      buildPanel();
    }
  })
}

function randomBetween(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}

function randomBoolean() {
  return Math.random() >= 0.5;
}

function randomContent() {
  const url = new URL(window.location.href);
  return url.searchParams.get('contents') || defaultContent();
}

function defaultContent() {
  return `
# Merges two subarrays of arr[].
# First subarray is arr[l..m]
# Second subarray is arr[m+1..r]
def merge(arr, l, m, r):
    n1 = m - l + 1
    n2 = r- m
 
    # create temp arrays
    L = [0] * (n1)
    R = [0] * (n2)
 
    # Copy data to temp arrays L[] and R[]
    for i in range(0 , n1):
        L[i] = arr[l + i]
 
    for j in range(0 , n2):
        R[j] = arr[m + 1 + j]
 
    # Merge the temp arrays back into arr[l..r]
    i = 0     # Initial index of first subarray
    j = 0     # Initial index of second subarray
    k = l     # Initial index of merged subarray
 
    while i < n1 and j < n2 :
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1
 
    # Copy the remaining elements of L[], if there
    # are any
    while i < n1:
        arr[k] = L[i]
        i += 1
        k += 1
 
    # Copy the remaining elements of R[], if there
    # are any
    while j < n2:
        arr[k] = R[j]
        j += 1
        k += 1
 
# l is for left index and r is right index of the
# sub-array of arr to be sorted
def mergeSort(arr,l,r):
    if l < r:
 
        # Same as (l+r)/2, but avoids overflow for
        # large l and h
        m = (l+(r-1))/2
 
        # Sort first and second halves
        mergeSort(arr, l, m)
        mergeSort(arr, m+1, r)
        merge(arr, l, m, r)
  `;
}