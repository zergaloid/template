let input = document.getElementById('join-input');
let form = document.getElementById('try-it');

form.addEventListener('submit',
    () => {
        input.value = "You're in the waitlist!";
        input.disabled = true;
    })
input.oninput = function() {
    form.action = `https://functions.yandexcloud.net/d4edsioq0odbmd9blij6?email=${input.value}`
}   