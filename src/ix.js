var link = window.location.pathname.split("/");
link = link[link.length-1]

switch(link)
{
    case 'whatisthis.html':
        let input = document.getElementById('join-input');
        let form = document.getElementById('try-it');
    
        form.addEventListener('submit',
            () => {
                input.value = "You're in the waitlist!";
                input.disabled = true;
            })
        input.onchange = input.oninput = function () {
            form.action = `https://functions.yandexcloud.net/d4edsioq0odbmd9blij6?email=${input.value}`
        }
    break;
}