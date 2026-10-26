/* Lưu sẵn giao diện để mở được khi không có mạng (bản web / iPhone).
 * Dữ liệu Google Sheet không đi qua đây — app tự lưu bản gần nhất trong máy. */
var CACHE = "lich-ho-v1";
var SHELL = ["./", "index.html", "style.css", "app.js", "lunar.js", "config.js", "manifest.json",
  "icon.svg", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// Mạng trước (để luôn có bản mới nhất), mất mạng thì dùng bản đã lưu
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match("index.html"); });
  }));
});
