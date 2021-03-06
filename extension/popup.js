let currentTabId = -1

function updateLiveTab(latestLives) {
  $('#live-avatars').empty()
  const liveList = []
  if (latestLives.latestIcon === undefined) {
    $('#live-avatars').append($('<span>Loading...</span>'))
  } else {
    const liveCounts = latestLives.latestIcon.length
    if (liveCounts !== 0) {
      for (let index = 0; index < liveCounts; index++) {
        liveList.push(
          $(`<div class="video-avatar">
              <a href="https://www.youtube.com/watch?v=${latestLives.latestLink[index]}" target="_blank">
                <img src="${latestLives.latestIcon[index]}" height="60" width="60">
              </a>
            </div>`),
        )
      }
      $('#live-avatars').append(liveList)
      $('#live-status').empty()
      $('#live-status').append($(`<div class="text-right">Last updated time: ${latestLives.updateTime}</div>`))
    } else {
      $('#live-avatars').append(
        $('<span>No live now...</span>'),
      )
    }
  }
}

function restorePopup() {
  chrome.storage.sync.get({
    latestLives: {},
    [currentTabId]: 'off',
  }, (items) => {
    // update toggle event silently
    $('#toggle').bootstrapToggle(items[currentTabId], true)
    updateLiveTab(items.latestLives)
  })
}

function initPopup() {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
    url: ['https://www.youtube.com/*'],
  },
  (tabs) => {
    currentTabId = tabs[0].id
    restorePopup()
  })
}

document.addEventListener('DOMContentLoaded', initPopup)
$('#toggle').change(() => {
  const status = document.getElementById('toggle').checked
  if (status) {
    chrome.storage.sync.set({ [currentTabId]: 'on' })
  } else {
    chrome.storage.sync.set({ [currentTabId]: 'off' })
  }
})

chrome.storage.onChanged.addListener((changes) => {
  if (Object.keys(changes).includes('latestLives')) {
    updateLiveTab(changes.latestLives.newValue)
  }
})
