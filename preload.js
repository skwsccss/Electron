// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const { remote } = require('electron');
  // const fetch = require('electron-fetch');
  // let request = new ClientRequest();
  // const request = net.request({
  //   method: 'GET',
  //   protocol: 'https:',
  //   hostname: 'github.com',
  //   port: 443,
  //   path: '/'
  // })

  const axios = require('axios')

  document.getElementById('close').addEventListener('click', closeWindow);
  document.getElementById('minimize').addEventListener('click', minimizeWindow);
  document.getElementById('max').addEventListener('click', maximizeWindow);
  document.getElementById('fetch_data').addEventListener('click', fetchData);
  document.getElementById('url').addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("fetch_data").click();
    }
  })
  function closeWindow() {
    let window = remote.getCurrentWindow()
    window.close()
  }

  function maximizeWindow() {
    let window = remote.getCurrentWindow()
    window.isMaximized() ? window.unmaximize() : window.maximize()
  }

  function minimizeWindow() {
    let window = remote.getCurrentWindow()
    window.minimize()
  }


  function fetchData() {
    let api_key = document.getElementById('api_key').value;
    let url = document.getElementById('url').value;

    axios.defaults.headers = {
      'X-API-Key': api_key
    }
    axios.get('http://127.0.0.1:8384' + url).then(res => {
      document.getElementById('preview').innerHTML = `<pre>` + `${(JSON.stringify(res.data, null, "\t"))}` + `</pre>`
    })
  }
})



// 'CczrTe6Rx6KvbTyh7QDQYFYEQSyPPoQ9'
