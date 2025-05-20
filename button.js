document.getElementById('toggle').addEventListener('change', function ()
{
    const status = document.getElementById('status-tum');
    if(this.checked) {
        status.textContent = 'Тумблер: включено';
    }
    else {
        status.textContent = 'Тумблер: выключено'
    }
});