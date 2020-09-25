['form', 'title', 'description', 'url', 'body', 'list', 'exporter', 'file', 'scrollView'].forEach(function (id) {
    window[id] = document.getElementById(id);
});

var db;
var request = window.indexedDB.open("bookmarks", 1);

const bufferFragment = new DocumentFragment();

request.onerror = function () {
    flash('error opening the database', 'danger', scrollView);
};

request.onsuccess = function () {
    db = request.result;
    flash('loading all datbase entries', 'success', scrollView);
    display();
};

request.onupgradeneeded = function (e) {
    var db = e.target.result;
    db.onerror = function (e) {
        flash('error loading the database', 'danger', scrollView);
    };
    var objectStore = db.createObjectStore("bookmarks", {
        keyPath: "id",
        autoIncrement: true
    });
    objectStore.createIndex("title", "title", {
        unique: false
    });
};

function time() {
    var now = new Date();
    var time = /(\d+:\d+:\d+)/.exec(now)[0] + ':';
    for (var ms = String(now.getMilliseconds()), i = ms.length - 3; i < 0; ++i) {
        time += '0';
    }
    return time + ms;
}

function S4() {
    return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}

function guid() {
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

function addData(e) {

    e.preventDefault();

    var transaction = db.transaction(["bookmarks"], "readwrite");
    var objectStore = transaction.objectStore("bookmarks");

    var object = {
        title: title.value,
        uri: url.value,
        description: description.value,
        date: Date.now(),
        time : time(),
        uid: guid()
    }

    var request = objectStore.add(object);

    request.onsuccess = function () {
        form.reset();
    };

    transaction.oncomplete = function () {
        flash('added : ' + object.uid, 'info', scrollView);
        display();
    };
    transaction.onerror = function () {
        flash('error adding item', 'danger', scrollView);
    };
}



function display() {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    var objectStore = db.transaction("bookmarks").objectStore("bookmarks");
    objectStore.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
            var listItem = document.createElement("li");
            listItem.className = 'list-group-item';
            var pre = document.createElement("span");
            pre.textContent = cursor.value.title;
            var deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-danger btn-sm float-right";
            deleteBtn.id = cursor.value.uid;
            deleteBtn.setAttribute("data-note-id", cursor.value.id);
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = deleteItem;
            listItem.appendChild(pre);
            listItem.appendChild(deleteBtn);
            list.appendChild(listItem);
            listItem.setAttribute("data-note-id", cursor.value.id);

            cursor.continue();

        } else {

            if (!list.firstChild) {
                var listItem = document.createElement("li");
                listItem.textContent = "No tasks stored.";
                list.appendChild(listItem);
            }

        }
    };
}

function updateItem(e) {
    var uid = event.target.id;
    var noteId = Number(e.target.getAttribute("data-note-id"));
    var transaction = db.transaction(["bookmarks"], "readwrite");
    var objectStore = transaction.objectStore("bookmarks");

    var request = objectStore.put(noteId);

    transaction.oncomplete = function (e) {
        console.log(Object.values(request.result));
        flash('viewed : ' + noteId, 'primary', scrollView);
    };
}

function viewItem(e) {
    var uid = event.target.id;
    var noteId = Number(e.target.getAttribute("data-note-id"));
    var transaction = db.transaction(["bookmarks"], "readwrite");
    var objectStore = transaction.objectStore("bookmarks");
    var request = objectStore.get(noteId);

    transaction.oncomplete = function (e) {
        console.log(Object.values(request.result));
        flash('viewed : ' + noteId, 'primary', scrollView);
    };
}

function deleteItem(e) {
    var uid = event.target.id;
    var noteId = Number(e.target.getAttribute("data-note-id"));
    var transaction = db.transaction(["bookmarks"], "readwrite");
    var objectStore = transaction.objectStore("bookmarks");
    var request = objectStore.delete(noteId);
    transaction.oncomplete = function () {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        if (!list.firstChild) {
            var listItem = document.createElement("li");
            listItem.textContent = "No tasks stored.";
            list.appendChild(listItem);
        }
        flash('deleted : ' + uid, 'warning', scrollView);
    };
}

/* File Input */
function uploadData(event) {
    var files = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        var data = JSON.parse(event.target.result);
        var transaction = db.transaction(["bookmarks"], "readwrite");
        var objectStore = transaction.objectStore("bookmarks");
        data.forEach(function (object) {
            objectStore.add(object);
        });
        transaction.oncomplete = function () {
            flash('upload successful.. ', 'success', scrollView);
            // restore instead
            //display();
        };
        transaction.onerror = function () {
            flash('upload failed', 'error', scrollView);
        };
    }
    reader.readAsText(files);
}

function exportData() {
    var exportArr = [];
    var objectStore = db.transaction("bookmarks", "readwrite").objectStore("bookmarks");
    var objCursor = objectStore.openCursor();
    objCursor.onerror = function (e) {
        flash('database export failed', 'danger', scrollView);
    }
    objCursor.onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
            exportArr.push(cursor.value);
            cursor.continue();
        } else {
            var jsonStr = JSON.stringify(exportArr, null, 2);
            var jsonBlob = new Blob([jsonStr], {
                type: "application/octet-stream"
            });
            var textURL = window.URL.createObjectURL(jsonBlob);
            var fileSave = 'bookmarks-' + Date.now() + "-export.json";
            var downloadLink = document.createElement("a");
            var fragment = document.createDocumentFragment();
            downloadLink.download = fileSave;
            downloadLink.href = textURL;
            downloadLink.onclick = clean;
            downloadLink.style.display = "none";
            fragment.appendChild(downloadLink);
            downloadLink.click();

            function clean(event) {
                fragment.removeChild(event.target);
            }
        }
        flash('database export complete', 'success', scrollView);
    }
}


/* DB Events */
file.addEventListener('change', uploadData, false);
exporter.addEventListener('click', exportData, false);
form.addEventListener('submit', addData, false);