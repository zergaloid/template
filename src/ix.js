document.getElementById('try-it').addEventListener('submit',
() => {
    let input = document.getElementById('join-input');
    input.value = "You're in the waitlist!";
    input.disabled = true;
})