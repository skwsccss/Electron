// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    window.$ = window.jQuery = require('jquery')
    const { remote } = require('electron');
    let exePath = "./syncthing/syncthing.exe"
    let child = require('child_process').execFile;
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


        let api_key = document.getElementById('api_key').value;
        let url = 'rest/system/shutdown';

        axios.defaults.headers = {
            'X-API-Key': api_key
        }
        axios.post('http://127.0.0.1:8384/' + url).then(res => {
            document.getElementById('preview').innerHTML = `<pre>` + `${(JSON.stringify(res.data, null, "\t"))}` + `</pre>`
            setTimeout(() => {
                window.close()
            }, 1000);
        })
    }

    function maximizeWindow() {
        let window = remote.getCurrentWindow()
        window.isMaximized() ? window.unmaximize() : window.maximize()
    }

    function minimizeWindow() {
        let window = remote.getCurrentWindow()
        window.minimize()
    }

    child(exePath, function(err, data) {
        if (err) {
            console.error(err);
            return;
        }

        console.log(data.toString());
    });

    async function fetchData() {
        let response = await axios.get('http://127.0.0.1:8384/').then(res => {
            return res.headers
        })
        console.log(response)
        let cookie = response['set-cookie'][0]
        let csrf_token_header = cookie.split('=')[0]
        let csrf_token = cookie.split('=')[1]
        let method = $("#method option:selected").text();
        let url = document.getElementById('url').value;
        console.log(cookie, csrf_token)
        axios.defaults.headers = {
            'Cookie': cookie,
        }
        axios.defaults.headers[csrf_token_header] = csrf_token
        if (method == 'GET') {
            axios.get('http://127.0.0.1:8384/' + url).then(res => {
                document.getElementById('preview').innerHTML = `<pre>` + `${(JSON.stringify(res.data, null, "\t"))}` + `</pre>`
            })
        }
        if (method == 'POST') {
            axios.post('http://127.0.0.1:8384/' + url).then(res => {
                document.getElementById('preview').innerHTML = `<pre>` + `${(JSON.stringify(res.data, null, "\t"))}` + `</pre>`
            })
        }

    }
})



// 'CczrTe6Rx6KvbTyh7QDQYFYEQSyPPoQ9'