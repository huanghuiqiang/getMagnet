// ==UserScript==
// @name         get magnet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  页面加载完成后，复制页面磁力链接到剪贴板
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==
(function () {
  window.addEventListener("load", function () {
    getTorrent();
  });

  function getTorrent() {
    var rules = [{ tags: "a", attr: "href" }, { tags: "span,p,li" }];
    var matchs = [
      {
        re: /\bmagnet:\?xt=urn:btih:[a-z0-9]{32,}.*\b/i,
        callback: callback_copy,
      },
      {
        re: /\bhttp[s]*:\/\/mega.co.nz\/#![a-z0-9]+![a-z0-9]+\b/i,
        callback: callback_open,
      },
      {
        re: /\bhttp[s]*:\/\/subhd.com\/.*\b/i,
        callback: callback_open,
      },
      {
        re: /\bhttp[s]*:\/\/www.zimuku.cn\/subs\/\d+\.html\b/i,
        callback: callback_open,
      },
    ];

    var copy = [];
    var open = [];

    rules.forEach((rule) => {
      console.log("Search : %s", rule.tags);
      var tags = rule.tags.split(",");
      tags.forEach((tag) => {
        var elements = document.getElementsByTagName(tag);
        console.log("Find : %d", elements.length);
        for (var i = 0; i < elements.length; ++i) {
          var element = elements[i];
          var content = element[rule.attr || "textContent"];
          matchs.forEach((match) => {
            m = match.re.exec(content);
            if (m === null) {
              return;
            } else {
              console.log("Match : %s[%d]", tag, i);
              if (typeof match.callback === "function") {
                match.callback(m[0], element);
              }
            }
          });
        }
      });
    });

    console.log("Copy : %d", copy.length);
    if (copy.length > 0) {
      document.addEventListener("copy", func_copy, true);
    }

    console.log("Open : %d", open.length);
    if (open.length > 0) {
      open.forEach((url) => {
        console.log("%s", url);
        window.open(url, "_blank");
      });
    }

    function func_copy(e) {
      e && e.clipboardData.setData("text/plain", copy.join("\r"));
      e.preventDefault();
      alert("已复制" + copy.length + "项到剪贴板!");
    }

    function push_open(url) {
      if (open.indexOf(url) === -1) {
        console.log("Push Open : %s", url);
        open.push(url);
      }
    }

    function push_copy(url) {
      if (copy.indexOf(url) == -1) {
        console.log("Push Cpoy : %s", url);
        copy.push(url);
      }
    }

    function callback_copy(content, element) {
      push_copy(content);
    }

    function callback_open(content, element) {
      push_open(content);
    }
  }
})();
