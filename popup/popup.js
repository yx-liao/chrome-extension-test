var getDataBtn = document.querySelector("button#getdata");

var downloadBtn = document.querySelector("button#download");

var text = document.querySelector("#text");

var data = null;

getDataBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const response = await chrome.tabs.sendMessage(tab.id, {
    getDate: true,
  });

  data = response.data;

  text.textContent = JSON.stringify(response.data, null, 2);

  downloadBtn.disabled = false;
});

downloadBtn.addEventListener("click", async () => {
  if (data) {
    var csvData = data
      .map(({ rank, title }) => [rank, title].map((v) => `"${v}"`).join(","))
      .join("\r\n");

    const encodeData = new TextEncoder("big5", {
      NONSTANDARD_allowLegacyEncoding: true,
    }).encode(csvData);

    var objUrl = URL.createObjectURL(
      new Blob([encodeData], { type: "text/csv" })
    );

    try {
      await chrome.downloads.download({
        url: objUrl,
        filename: "data.csv",
        saveAs: true,
      });
    } finally {
      URL.revokeObjectURL(objUrl);
    }
  }
});

async function init() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  if (tab) {
    const response = await chrome.tabs.sendMessage(tab.id, {
      popupOpen: true,
    });

    if (response.connected) {
      getDataBtn.disabled = false;
    }
  }
}

init();
