function mailto(){
    location.href='mailto:?SUBJECT='+document.title+'&BODY='+escape(location.href)
}

function mailto1(body){   
    location.href='mailto:?SUBJECT='+document.title+'&BODY='+encodeURIComponent(body)
}
