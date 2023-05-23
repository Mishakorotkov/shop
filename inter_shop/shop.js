import mysql from 'mysql2';
import express from "express";
import nunjucks from 'nunjucks';
import fileUpload from 'express-fileupload';
import cors from 'cors';
const jsonParser = express.json();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'shop',
    password: 'pipyka12345',
});

function gets(sql, head, adress, name, res){
    if(admin_enter == 1){
        connection.execute(
            sql,
            function(err, rows) {
                console.log(rows);
                res.render('category.njk', {head:head, adress:adress, name:name, enter:rows});
            }
        );
    }
    else{
        res.redirect('/admin');
    }
}


function posts(sql1, categ, redir, res, del, sql2){
    if(categ == 0){
        console.log(del);
        console.log("delete");
        connection.execute(
            sql2,
            [del],
            function(err, rows) {
                console.log("данные вставлены");
                res.redirect("/admin/"+redir);
            }
        );
    }
    else if(del == 0){
        console.log(categ);
        console.log("categ_add");
        connection.execute(
            sql1,
            [categ],
            function(err, rows) {
                console.log("данные вставлены");
                res.redirect("/admin/"+redir);
            }
        );
    }
}

let admin_enter = 0;
let app = express();
const urlencodedParser = express.urlencoded({extended: false});

let session;

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));

app.use(fileUpload({}));

app.use(express.static('static'));

app.get('/admin', function(req, res) {
    res.render('admin_enter.html');
});

app.post('/admin', urlencodedParser, function(req, res) {
    if(req.body.login == "admin" && req.body.password == "12345"){
        admin_enter = 1;
        res.redirect('/admin/main');
    }
    else{
        res.redirect('/admin');
    }
});

app.get('/admin/main', function(req, res) {
    if(admin_enter == 1){
        res.render('main.html');
    }
    else{
        res.redirect('/admin');
    }
});

app.post('/admin/main', urlencodedParser, function(req, res) {
    admin_enter = 0;
});



app.get('/admin/color', function(req, res) {
    gets('SELECT id, name FROM color', "добавление цвета", "color", "название цвета", res);
});

app.post('/admin/color', urlencodedParser, function(req, res) {
    console.log("categ "+req.body.categ);
    console.log("del "+req.body.del);
    if(req.body.categ){
        posts(`INSERT INTO color(name) VALUES(?)`, req.body.categ, "color", res, 0, `DELETE FROM color WHERE id=?`);
        console.log("categ_prov");
    }
    else if(req.body.del){
        posts(`INSERT INTO color(name) VALUES(?)`, 0, "color", res, Number(req.body.del), `DELETE FROM color WHERE id=?`);
        console.log("del_prov");
    }
});



app.get('/admin/material', function(req, res) {
    gets('SELECT id, name FROM material', "добавление материала", "material", "название материала", res);
});

app.post('/admin/material', urlencodedParser, function(req, res) {
    console.log("categ "+req.body.categ);
    console.log("del "+req.body.del);
    if(req.body.categ){
        posts(`INSERT INTO material(name) VALUES(?)`, req.body.categ, "material", res, 0, `DELETE FROM material WHERE id=?`);
        console.log("categ_prov");
    }
    else if(req.body.del){
        posts(`INSERT INTO material(name) VALUES(?)`, 0, "material", res, Number(req.body.del), `DELETE FROM material WHERE id=?`);
        console.log("del_prov");
    }
});


app.get('/admin/creator', function(req, res) {
    gets('SELECT id, name FROM creator', "добавление создателя", "creator", "создателя", res);

});

app.post('/admin/creator', urlencodedParser, function(req, res) {
    console.log("categ "+req.body.categ);
    console.log("del "+req.body.del);
    if(req.body.categ){
        posts(`INSERT INTO creator(name) VALUES(?)`, req.body.categ, "creator", res, 0, `DELETE FROM creator WHERE id=?`);
        console.log("categ_prov");
    }
    else if(req.body.del){
        posts(`INSERT INTO creator(name) VALUES(?)`, 0, "creator", res, Number(req.body.del), `DELETE FROM creator WHERE id=?`);
        console.log("del_prov");
    }
});



app.get('/admin/type', function(req, res) {
    gets('SELECT id, name FROM type', "добавление типа", "type", "тип", res);
});

app.post('/admin/type', urlencodedParser, function(req, res) {
    console.log("categ "+req.body.categ);
    console.log("del "+req.body.del);
    if(req.body.categ){
        posts(`INSERT INTO type(name) VALUES(?)`, req.body.categ, "type", res, 0, `DELETE FROM type WHERE id=?`);
        console.log("categ_prov");
    }
    else if(req.body.del){
        posts(`INSERT INTO type(name) VALUES(?)`, 0, "type", res, Number(req.body.del), `DELETE FROM type WHERE id=?`);
        console.log("del_prov");
    }
});



app.get('/admin/size', function(req, res) {
    gets('SELECT id, name FROM size', "добавление размера", "size", "размер", res);
});

app.post('/admin/size', urlencodedParser, function(req, res) {
    console.log("categ "+req.body.categ);
    console.log("del "+req.body.del);
    if(req.body.categ){
        posts(`INSERT INTO size(name) VALUES(?)`, req.body.categ, "size", res, 0, `DELETE FROM size WHERE id=?`);
        console.log("categ_prov");
    }
    else if(req.body.del){
        posts(`INSERT INTO size(name) VALUES(?)`, 0, "size", res, Number(req.body.del), `DELETE FROM size WHERE id=?`);
        console.log("del_prov");
    }
});



app.get('/admin/items', function(req, res){
    let ma = [];
    let flag = 0;
    if(admin_enter == 1){
        connection.execute(
            'SELECT id ,name, price, color, creator, material, size, type, fors, articul FROM items',
            function(err, rows) {
                const promise = new Promise((resolve, reject) => {
                    for(let i = 0; i<rows.length; i++){
                        connection.execute(
                            `SELECT name FROM color WHERE id = ?`,
                            [rows[i].color],
                            function(err, row_color) {
                                connection.execute(
                                    `SELECT name FROM creator WHERE id = ?`,
                                    [rows[i].creator],
                                    function(err, row_creator) {
                                        connection.execute(
                                            `SELECT name FROM material WHERE id = ?`,
                                            [rows[i].material],
                                            function(err, row_material) {
                                                connection.execute(
                                                    `SELECT name FROM size WHERE id = ?`,
                                                    [rows[i].size],
                                                    function(err, row_size) {
                                                        connection.execute(
                                                            `SELECT name FROM type WHERE id = ?`,
                                                            [rows[i].type],
                                                            function(err, row_type) {
                                                                ma.push({id:rows[i].id ,name:rows[i].name, price:rows[i].price, color:row_color[0].name, creator:row_creator[0].name, material:row_material[0].name, size:row_size[0].name, type:row_type[0].name, fors:rows[i].fors, articul:rows[i].articul});
                                                                console.log("1   "+ma)
                                                                flag=flag+1;
                                                                if(rows.length == flag){
                                                                    resolve(ma);
                                                                }
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                    console.log('flag '+flag);
                    console.log("length "+rows.length);
                });
                promise.then((data) =>{
                    console.log("3   "+data);
                    res.render('items.njk', {ite:data});
                });
            }
        );
    }
    else{
        res.redirect('/admin');
    }
});


app.post('/admin/items', urlencodedParser, function(req, res){
    connection.execute(
        `DELETE FROM items WHERE id=?`,
        [req.body.del],
        function(err, rows) {
            res.redirect('/admin/items');
            console.log("item deletes");
        }
    );
});



app.get('/admin/add', function(req, res) {
    if(admin_enter == 1){
        connection.execute(
            'SELECT name, id FROM color',
            function(err, row_color) {
                console.log(row_color);
                connection.execute(
                    'SELECT name, id FROM creator',
                    function(err, row_creator) {
                        console.log(row_creator);
                        connection.execute(
                            'SELECT name, id FROM material',
                            function(err, row_material) {
                                console.log(row_material);
                                connection.execute(
                                    'SELECT name, id FROM size',
                                    function(err, row_size) {
                                        console.log(row_size);
                                        connection.execute(
                                            'SELECT name, id FROM type',
                                            function(err, row_type) {
                                                console.log(row_type);
                                                console.log({color:row_color, creator:row_creator, material:row_material, size:row_size, type:row_type});
                                                res.render('add_item.njk', {mass:{color:row_color, creator:row_creator, material:row_material, size:row_size, type:row_type}});
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
    else{
        res.redirect('/admin');
    }
});


app.post('/admin/add', urlencodedParser, function(req, res) {
    req.files.image.name = String(req.body.articul)+".jpg";
    req.files.image.mv("static/images/"+req.files.image.name);
    connection.execute(
        'INSERT INTO items(name, price, color, creator, material, size, type, fors, articul) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.name, Number(req.body.price), Number(req.body.color), Number(req.body.creator), Number(req.body.material), Number(req.body.size), Number(req.body.type), req.body.for, req.body.articul],
        function(err, row) {
            console.log(err);
            res.redirect("/admin/add");
        }
    );
});



app.get('/all_items', function(req, res) {
    let ma = [];
    let flag = 0;
    connection.execute(
        'SELECT id ,name, price, color, creator, material, size, type, fors, articul FROM items',
        function(err, rows) {
            const promise = new Promise((resolve, reject) => {
                for(let i = 0; i<rows.length; i++){
                    connection.execute(
                        `SELECT name FROM color WHERE id = ?`,
                        [rows[i].color],
                        function(err, row_color) {
                            connection.execute(
                                `SELECT name FROM creator WHERE id = ?`,
                                [rows[i].creator],
                                function(err, row_creator) {
                                    connection.execute(
                                        `SELECT name FROM material WHERE id = ?`,
                                        [rows[i].material],
                                        function(err, row_material) {
                                            connection.execute(
                                                `SELECT name FROM size WHERE id = ?`,
                                                [rows[i].size],
                                                function(err, row_size) {
                                                    connection.execute(
                                                        `SELECT name FROM type WHERE id = ?`,
                                                        [rows[i].type],
                                                        function(err, row_type) {
                                                            ma.push({id:rows[i].id ,name:rows[i].name, price:rows[i].price, color:row_color[0].name, creator:row_creator[0].name, material:row_material[0].name, size:row_size[0].name, type:row_type[0].name, fors:rows[i].fors, articul:rows[i].articul});
                                                            console.log("1   "+ma)
                                                            flag=flag+1;
                                                            if(rows.length == flag){
                                                                resolve(ma);
                                                            }
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
                console.log('flag '+flag);
                console.log("length "+rows.length);
            });
            promise.then((data) =>{
                console.log("data   "+data);
                res.send(data);
            });
        }
    );
});



app.get('/all_category', urlencodedParser, function(req, res) {
    let tags = {fors:['женское', 'мужское', 'детское']};
    const promise = new Promise((resolve, reject) => {
        connection.execute(
            `SELECT name FROM color`,
            function(err, row) {
                let mas = [];
                for(let i = 0; i<row.length;i++){
                    mas.push(row[i].name);
                    tags = {...tags, color:mas}
                }
            }
        );
        connection.execute(
            `SELECT name FROM creator`,
            function(err, row) {
                let mas = [];
                for(let i = 0; i<row.length;i++){
                    mas.push(row[i].name);
                    tags = {...tags, creator:mas}
                }
            }
        );
        connection.execute(
            `SELECT name FROM material`,
            function(err, row) {
                let mas = [];
                for(let i = 0; i<row.length;i++){
                    mas.push(row[i].name);
                    tags = {...tags, material:mas}
                }
            }
        );
        connection.execute(
            `SELECT name FROM size`,
            function(err, row) {
                let mas = [];
                for(let i = 0; i<row.length;i++){
                    mas.push(row[i].name);
                    tags = {...tags, size:mas}
                }
            }
        );
        connection.execute(
            `SELECT name FROM type`,
            function(err, row) {
                let mas = [];
                for(let i = 0; i<row.length;i++){
                    mas.push(row[i].name);
                    tags = {...tags, type:mas}
                }
                resolve(tags);
            }
        );
    });
    promise.then((data) =>{
        console.log("tags   "+data);
        res.send(data);
    });
});


app.post('/registration', jsonParser, (req, res) => {
    connection.execute(
        'INSERT INTO user(name, password) VALUES(?, ?)',
        [req.body.name, req.body.password],
        function(err, row) {
            if(err){
                console.log(err);
                res.send({error: err.sqlMessage});
            }
            else if(req.body.name.length<=6 || req.body.password.length<=6){
                res.send({error: "Слишком короткий логин или пароль"});
            }
            else if(req.body.name.length>=24 || req.body.password.length>=24){
                res.send({error: "Слишком длинный логин или пароль"});
            }
            else {
                res.send(req.body);
            }
        }
    );
});

app.post('/login', jsonParser, function(req, res) {
    connection.execute(
        `SELECT name, password FROM user WHERE name=?`,
        [req.body.name],
        function(err, row) {
            if(err){
                console.log(err);
                res.send({error: err.sqlMessage});
            }
            else{
                if(req.body.password == row[0].password){
                    res.send(row[0]);
                }
                else{
                    res.send({error: "Неправильный пароль"});
                }
            }
        }
    );
});

app.post('/get_cart', urlencodedParser, function(req, res) {
    let cart_tovari = [];
    let user_login = req.body.userLogin;
    connection.execute(
        `SELECT item_articul FROM cart WHERE user_login=?`,
        [user_login],
        function(err, row) {
            console.log(row);
            for(let i = 1; i<=row.length; i++){
                connection.execute(
                    `SELECT id, name, price, color, creator, material, size, type, fors, articul FROM items WHERE articul=?`,
                    [row[i-1].item_articul],
                    function(err, rows) {
                        console.log(row);
                        cart_tovari.push(rows);
                        if(row.length == i){
                            res.send(cart_tovari[0]);
                        }
                    }
                );
            }
        }
    );
});


app.post('/delete_item_from_cart', jsonParser, (req, res) => {  
    const item_articul = req.body.itemArticul;
    const user_login = req.body.userLogin;
    let spisok_cart = [];
    connection.execute(
        `DELETE FROM cart WHERE item_articul=? AND user_login=?`,
        [item_articul, user_login],
        function(err, rows) {
            connection.execute(
                `SELECT item_articul FROM cart WHERE user_login=?`,
                [user_login],
                function(err, row) {
                    console.log(row);
                    for(let i = 1; i<=row.length; i++){
                        connection.execute(
                            `SELECT id, name, price, color, creator, material, size, type, fors, articul FROM items WHERE articul=?`,
                            [row[i-1].item_articul],
                            function(err, rows) {
                                console.log(row);
                                spisok_cart.push(rows);
                                if(row.length == i){
                                    res.send(spisok_cart[0]);
                                }
                            }
                        );
                    }
                }
            );
        }
    );
    res.send([]);
})

app.get('/get_item', urlencodedParser, function(req, res) {
    let itemArticul = req.body.itemArticul;
    connection.execute(
        `SELECT * FROM items WHERE articul=?`,
        [itemArticul],
        function(err, row) {
            res.send(row[0]);
        }
    );
});


app.post('/add_to_cart', jsonParser, function(req, res) {
    let user_login = req.body.userLogin;
    let item_articul = req.body.itemArticul;
    connection.execute(
        'INSERT INTO cart(user_login, item_articul) VALUES(?, ?)',
        [user_login, item_articul],
        function(err, row) {
            if(err){
                console.log(err.sqlMessage);
            }
            res.send({message: 'предмет добавлен в корзину'});
            console.log("предмет добавлен в корзину");
        }
    );
});

app.listen(3000, function() {
	console.log('running');
});