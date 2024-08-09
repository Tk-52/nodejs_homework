// public/index.js




window.addEventListener('DOMContentLoaded', (event) => {

  document.querySelector('.send-button').addEventListener('click', (event) => {
    const text = document.querySelector('.input-text').value;
    const text2 = document.querySelector('.input-text2').value;
    fetch('/api/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: text,number:text2}) });
    window.location.reload();

    //一回で送信したいデータはここに追加する
  });
  
  document.querySelector('.delete-button').addEventListener('click', (event) => {
    const text = document.querySelector('.delete-text').value;
    const text2 = document.querySelector('.delete-text2').value;
    
    fetch('/delete/user', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: text,number:text2}) });
    window.location.reload();

    //一回で送信したいデータはここに追加する
  });
  
});
