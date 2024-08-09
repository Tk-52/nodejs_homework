const express = require('express');
const app = express();
const path = require('node:path');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

app.set('view engine', 'ejs');
// publicディレクトリ以下のファイルを静的ファイルとして配信
app.use('/static', express.static(path.join(__dirname, 'public')));

const logMiddleware = (req, res, next) => {
  console.log(req.method, req.path);
  next();
}

app.get('/user/:id', logMiddleware, (req, res) => {
  // :idをreq.params.idとして受け取る
  res.status(200).send(req.params.id);
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

async function main() {
  await client.connect();

  const db = client.db('my-app');

  app.get('/', logMiddleware, async (req, res) => {
    // const users = ['alpha', 'beta', 'gamma'];
    const users = await db.collection('user').find().toArray();//dbのuserからusersとして取り出している
    //オブジェクトのuserはidとnameを持っているのでnameだけ取り出す

    res.render(path.resolve(__dirname, 'views/index.ejs'), { users: users });
    //htmlにデータを渡す　この時にusersで渡している
  });

  //リクエストを送った後の処理(データベースにデータを登録する処理)
  app.post('/api/user', express.json(), async (req, res) => {
    const name = req.body.name;
    const number=req.body.number;
    if (!name||!number) {
      res.status(400).send('Bad Request');
      return;
    }
    await db.collection('user').insertOne({ name: name ,number:number});
    res.status(200).send('Created');
  });
  
  app.delete('/delete/user', express.json(),async(req, res) => {
    const name = req.body.name;
    const number=req.body.number;
    if (!name||!number) {
      res.status(400).send('Bad Request');
      return;
    }
    await db.collection('user').deleteOne({ name: name ,number:number});
    res.status(200).send('Created');
      
  });
  // /api/userは適当なアドレス

  // ポート: 3000でサーバーを起動
  app.listen(3000, () => {
    // サーバー起動後に呼び出されるCallback
    console.log('start listening');
  });
}
main();

//http://localhost:3000

//expressがサーバーでデータを返す

//課題はブラウザでもCLIでもいいらしい