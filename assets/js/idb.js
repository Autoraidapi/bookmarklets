['form', 'title', 'description', 'url', 'body', 'list', 'exporter', 'file', 'scrollView'].forEach(function (
    id) {
    window[id] = document.getElementById(id);
});

var db;
var request = window.indexedDB.open("notes", 1);

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
    var objectStore = db.createObjectStore("notes", {
        keyPath: "id",
        autoIncrement: true
    });
    objectStore.createIndex("title", "title", {
        unique: false
    });
};

function addData(e) {
    e.preventDefault();
    var transaction = db.transaction(["notes"], "readwrite");
    var objectStore = transaction.objectStore("notes");

    var object = {
        title: title.value,
        uri: url.value,
        description: description.value,
        date: Date.now()
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
    var objectStore = db.transaction("notes").objectStore("notes");
    objectStore.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {

            var listItem = document.createElement("li");
            listItem.className = 'list-group-item';

            var pre = document.createElement("span");
            pre.textContent = cursor.value.title;


            var viewBtn = document.createElement("button");
            viewBtn.className = "btn btn-primary btn-sm float-right";
            viewBtn.setAttribute("data-note-id", cursor.value.id);
            viewBtn.textContent = "View";
            viewBtn.onclick = viewItem;

            var updateBtn = document.createElement("button");
            updateBtn.className = "btn btn-warning btn-sm float-right";
            updateBtn.id = cursor.value.uid;
            updateBtn.setAttribute("data-note-id", cursor.value.id);
            updateBtn.textContent = "update";
            updateBtn.onclick = updateItem;

            var deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-danger btn-sm float-right";
            deleteBtn.id = cursor.value.uid;
            deleteBtn.setAttribute("data-note-id", cursor.value.id);
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = deleteItem;

            listItem.appendChild(pre);
            listItem.appendChild(viewBtn);
            listItem.appendChild(updateBtn);
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
    var transaction = db.transaction(["notes"], "readwrite");
    var objectStore = transaction.objectStore("notes");

    var request = objectStore.put(noteId);

    transaction.oncomplete = function (e) {
        console.log(Object.values(request.result));
        flash('viewed : ' + noteId, 'primary', scrollView);
    };
}

function viewItem(e) {
    var uid = event.target.id;
    var noteId = Number(e.target.getAttribute("data-note-id"));
    var transaction = db.transaction(["notes"], "readwrite");
    var objectStore = transaction.objectStore("notes");
    var request = objectStore.get(noteId);

    transaction.oncomplete = function (e) {
        console.log(Object.values(request.result));
        flash('viewed : ' + noteId, 'primary', scrollView);
    };
}

function deleteItem(e) {
    var uid = event.target.id;
    var noteId = Number(e.target.getAttribute("data-note-id"));
    var transaction = db.transaction(["notes"], "readwrite");
    var objectStore = transaction.objectStore("notes");
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
        var transaction = db.transaction(["notes"], "readwrite");
        var objectStore = transaction.objectStore("notes");
        data.forEach(function (object) {
            objectStore.add(object);
        });
        transaction.oncomplete = function () {
            flash('upload successful.. ', 'success', scrollView);
            // maybe have a restore function.. display here I think fucks up
            display();
        };
        transaction.onerror = function () {
            flash('upload failed', 'error', scrollView);
        };
    }
    reader.readAsText(files);
}

function exportData() {
    var exportArr = [];
    var objectStore = db.transaction("notes", "readwrite").objectStore("notes");
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
            var fileSave = 'notes-' + Date.now() + "-export.json";
            var downloadLink = document.createElement("a");
            downloadLink.download = fileSave;
            downloadLink.href = textURL;
            downloadLink.onclick = clean;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();

            function clean(event) {
                document.body.removeChild(event.target);
            }
        }
        flash('database export complete', 'success', scrollView);
    }
}


/* DB Events */
file.addEventListener('change', uploadData, false);
exporter.addEventListener('click', exportData, false);
form.addEventListener('submit', addData, false);
