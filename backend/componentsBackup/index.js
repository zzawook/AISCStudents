#!/usr/bin/env nodejs
const express = require('express');
const app = express();
const mysql = require('mysql');
const sha256 = require('js-sha256');
const formidable = require('formidable');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(express.static("medias"));
app.use(cookieParser());
const { spawn } = require('child_process');
const mailer = require('nodemailer');

const corsOption = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3030', 'http://aiscstudents.com', 'http://aiscstudents.com/login', 'https://aiscstudents.com', 'https://aiscstudents.com/login'],
    methods: ['GET', 'POST'],
    credentials: true,
}

app.use(cors(corsOption));
app.options("*", cors(corsOption));

function checkLoggedIn(request, response) {
    const passcode = request.cookies.passcode;
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    const sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode+"'";
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected HAHA")
    });
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            response.status(301).send("Redirect to login page");
            con.end();
            return false;
        }
        else {
            con.end();
            return true;
        };
    });
}

app.get('/api/getMaxArticleId/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            console.log("errored")
            res.status(500).send(err);
            con.end();
            return;
        }
        console.log("Connected:)");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = 'select articleDB.id as id from articleDB order by articleDB.id desc limit 5';
        con.query(sql, function (err, result) {
            if (err) {
                res.status(500).send(err);
                con.end();
            }
            else {
                res.status(200).send(result);
                con.end();
            }
        })
    });
})

app.get('/api/getMaxArticleId/:id', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            console.log("errored")
            res.status(500).send(err);
            con.end();
            return;
        }
        console.log("Connected:)");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = 'select articleDB.id as id from articleDB where articleDB.id<=? order by articleDB.id desc limit 5';
        con.query(sql, [req.params.id.toString()], function (err, result) {
            if (err) {
                res.status(500).send(err);
                con.end();
            }
            else {
                res.status(200).send(result);
                con.end();
            }
        })
    });
})

app.post('/api/likeArticle/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            res.status(502).send("Error while connecting to DB")
        }
        console.log("Connected:)")
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            response.status(301).send("Redirect to login page");
            con.end();
        }
    });
    const form = formidable({ mutliples: true })
    sql = "select userDB.hashId as hashID from userDB where passcode='" + req.cookies.passcode.toString() + "' limit 1";
    con.query(sql, (err, result) => {
        if (err) {
            res.status(501).send("Error while getting user ID")
            con.end()
            return;
        }
        const userID = result[0]['hashID'];
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(503).send("Error while parsing the form")
                con.end()
                return;
            }
            sql = "insert into likeDB (articleId, writer) values(" + fields.articleId.toString() + ",'" + userID.toString() + "')"
            con.query(sql, (err, result) => {
                if (err) {
		    console.log(err);
                    res.status(504).send("Error while adding like to DB")
                    con.end()
                    return;
                }
                res.status(200).send("Like added");
                con.end()
                return;
            })
        })
    })
})

app.post('/api/unlikeArticle/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    })
    con.connect(function (err) {
        if (err) {
            res.status(500).send("Error while connecting to DB")
            return;
        }
        console.log("Connected ^^")
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            response.status(301).send("Redirect to login page");
            con.end();
        }
    });
    sql = "select userDB.hashId as hashID from userDB where passcode='" + req.cookies.passcode.toString() + "' limit 1";
    con.query(sql, (err, result) => {
        if (err) {
            res.status(500).send("Error while querying user ID")
            con.end()
            return;
        }
        const hashID = result[0]['hashID']
        const form = formidable({ mutliples: true })
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).send("Error while parsing request")
                con.end()
                return;
            }
            sql = "delete from likeDB where articleId=" + fields.articleId.toString() + " and likeDB.writer='" + hashID + "'";
            con.query(sql, (err, result) => {
                if (err) {
                    res.status(500).send("Error while deleting from likeDB")
                    con.end()
                    return;
                }
                res.status(200).send("Delete successful")
            })

        })
    })
})

app.get('/api/getArticle/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected!");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            response.status(301).send("Redirect to login page");
            con.end();
        }
    });
    sql = 'select articleDB.id, articleDB.content, articleDB.hashTag, commentTable.commentList, likedTable.likedList, mediaTable.mediaLink from (((articleDB left outer join (select commentDB.articleId as CommentArticleId, group_concat(commentDB.order,":::",commentDB.content separator "`~`") as commentList from commentDB group by commentDB.articleId) as commentTable on articleDB.id=CommentArticleId) left outer join (select likeDB.articleId as LikeArticleId, group_concat(likeDB.writer separator "`~`") as likedList from likeDB group by likeDB.articleId) as likedTable on articleDB.id=LikeArticleId) left join (select mediaDB.articleId as MediaArticleId, GROUP_CONCAT(mediaDB.mediaOrder,":::",mediaDB.mediasrc separator "`~`") as mediaLink from mediaDB group by MediaArticleId) as mediaTable on articleDB.id=MediaArticleId) order by articleDB.id desc limit 5;';
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.status(200).send(result);
    })
    con.end();
});

app.get('/api/getArticle/:id', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected!");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        const idInterest = req.params.id.toString();
        console.log(idInterest)
        const getWriterPromise = new Promise((resolve, reject) => {
            sql = 'select articleDB.writer as writer from articleDB where articleDB.id=?'
            con.query(sql, [idInterest.toString()], (err, result) => {
                if (err) {
                    console.log(err)
                    reject(false)
                }
                console.log("Ang")
                console.log(result)
                const getUsePrefName = new Promise((resolve1, reject1) => {
                    sql = 'select userDB.usePrefName as usePrefName from userDB where userDB.hashId=?'
                    con.query(sql, [result[0]['writer']], (err, result2) => {
                        if (err) {
                            console.log(err)
                            reject1(false)
                        }
                        console.log(result2)
                        if (result2[0]['usePrefName'] == 0) {
                            resolve1(result[0]['writer'])
                        }
                        else {
                            sql = 'select userDB.preferredName as preferredName from userDB where userDB.hashId=?'
                            con.query(sql, [result[0]['writer']], (err, result3) => {
                                if (err) {
                                    console.log(err)
                                    reject1(false)
                                }
                                resolve1(result3[0]['preferredName'])
                            })
                        }
                    })
                })
                getUsePrefName.then((promiseResult) => {
                    if (!promiseResult) {
                        reject(false)
                    }
                    resolve(promiseResult)
                })
            })
        })
        getWriterPromise.then((result) => {
            if (!result) {
                res.status(500).send("Error while getting article data");
                return;
            }
            else {
                sql = 'select articleDB.id, articleDB.content, articleDB.hashTag, articleDB.writer, likedTable.likedList, mediaTable.mediaLink from ((articleDB left outer join (select likeDB.articleId as LikeArticleId, group_concat(likeDB.writer separator "`~`") as likedList from likeDB group by likeDB.articleId) as likedTable on articleDB.id=LikeArticleId) left join (select mediaDB.articleId as MediaArticleId, GROUP_CONCAT(mediaDB.mediaOrder,":::",mediaDB.mediasrc separator "`~`") as mediaLink from mediaDB group by MediaArticleId) as mediaTable on articleDB.id=MediaArticleId) where articleDB.id=' + idInterest;
                con.query(sql, function (err, result1) {
                    if (err) {
                        res.status(500).send("Error while getting article data");
                        return;
                    }
                    else {
                        const tempResult = result1;
                        tempResult[0]['writer'] = result;
                        console.log(tempResult)
                        res.set('Connection', 'close')
                        res.status(200).send(result1);
                        con.end();
                        return;
                    }
                })
            }
        })
        
    });
})

app.post('/api/login/', (req, res) => {
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).send("Parsing error")
            return;
        }
        let sql = "select userDB.password as password, userDB.passcode as passcode from userDB where userDB.hashId=? limit 1";
        con.connect(function (err) {
            if (err) {
                res.status(500).send(err);
                con.end()
                return;
            }
            con.query(sql, fields.id.toString(), function (err, result) {
                if (err) {
                    res.status(500).send("DB Query error");
                    con.end()
                    return;
                }
                const userData = JSON.parse(JSON.stringify(result))
                console.log(userData)
                if (userData.length == 0) {
                    res.status(403).send("Login failed - No such account exists");
                    con.end()
                    return;
                }
                if (userData[0]['password'] === fields.pw.toString()) {
                    res.cookie("passcode", userData[0]['passcode'], { httpOnly: true, secure: true, maxAge: 86400000, sameSite: 'none' });
                    console.log(userData[0]['passcode'])
                    res.status(301).send("Login Success");
                    con.end()
                    return false;;
                }
                else if (userData[0]['password'] === null) {
                    res.status(202).send("Create Password")
                    con.end()
                    return;
                }
                else {
                    res.status(403).send("Login failed - No such account exists");
                    con.end()
                    return;
                }
            })
        })
        
    })
});

app.post('/api/createPassword/', (req, res)=> {
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).send("Parsing error")
            con.end()
            return;
        }
        const moldList = [1, 2, 3, 4]
        const randomNumbers = moldList.map((num) => {
            return num * (Math.floor(Math.random() * 16) + 1);
        });
        let keyString = "";
        for (let i = 0; i < randomNumbers.length; i++) {
            keyString += fields.pw.charAt(randomNumbers[i]) + fields.id.charAt(randomNumbers[i]);
        }
        const passcode = sha256(keyString)
        let sql = "update userDB set userDB.password='" + fields.pw.toString() + "', userDB.keyIndex='" + randomNumbers.toString() + "', userDB.passcode='" + passcode.toString() + "' where userDB.hashId='" + fields.id.toString() + "'";
        con.query(sql, function (err, result) {
            if (err) {
                res.status(500).send("Account creation failed");
                con.end()
                return;
            }
            console.log(passcode)
            res.cookie("passcode", passcode, { httpOnly: true, secure: true, maxAge: 86400000 });
            res.status(301).send("redirect");
            con.end()
        })
    })
})

app.get('/api/whoami/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    })
    con.connect(function (err) {
        if (err) {
            res.status(500).send("Error while connecting to DB")
        }
        console.log("Connected~")
    })
    con.query(sql, function (err, result) {
        if (err) {
            res.status(500).send(err);
            con.end();
	    return;
        };
        console.log(result.length)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
	        return;
        }
        sql = "select userDB.hashId as hashID, userDB.usePrefName as usePrefName, userDB.darkTheme as darkTheme, userDB.preferredName as preferredName from userDB where userDB.passcode='" + passcode + "' limit 1";
        con.query(sql, (err, result) => {
            if (err) {
                res.status(500).send("Error while querying user ID of user")
                console.log(err)
                return;
            }
            res.status(200).send(result);
        })
    });
    
})

app.post('/api/submitArticle/', (req, res) => {
    const passcode = req.cookies.passcode;
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {  
            throw err;
            return;
        }
        console.log("Connected!");
        let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
        con.query(sql, function (err, result) {
            if (err) {
                throw err;
                console.log(err)
                res.status(500).send(err)
                con.end();
                return;
            };
            console.log(result)
            if (result.length === 0) {
                console.log(passcode)
                console.log("redirecting")
                res.status(301).send("Redirect to login page");
                con.end();
                return;
            }
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(err)
                    con.end()
                    return;
                }
                let textBody = "";
                if (typeof fields.textBody !== 'undefined') {
                    textBody = fields.textBody;
                }
                let sql = 'insert into articleDB (content, writer, hashTag) values (' + con.escape(textBody.toString()) + ', ' + con.escape(fields.writer.toString()) + ', '+con.escape(fields.hashTag.toString())+');'
                console.log(sql)
                con.query(sql, function (err, result) {
                    if (err) {
                        res.status(500).send("Error has occurred while inserting into database")
                        console.log("errored")
                        console.log(err)
                        return;
                    }
                    console.log("Queried")
                    sql = 'select max(articleDB.id) as articleId from articleDB limit 1';
                    con.query(sql, function (err, result) {
                        if (err) {
                            console.log(err)
                            res.status(501).send("Error has occurred while retrieving the article's id");
                            return;
                        }
                        let articleId = result[0]['articleId'];
                        addHashTag(articleId, fields.hashTag.toString())
                        let mediaData = [];
                        if (typeof files.newMedia != 'undefined') {
                            if (typeof files.newMedia.length == 'undefined') {
                                mediaData.push(files.newMedia)
                            }
                            else {
                                mediaData = files.newMedia
                            }
                        }
                        let orderList = JSON.parse(fields.orderList)
                        const mediaList = [];
                        const mediaProcessPromiseList = []
                        //submit된 미디어 있는지 확인
                        console.log(typeof mediaData)
                        console.log('media Detected')
                        const dir = "/home/kjaehyeok21/media/image/" + articleId.toString() + '/';
                        //const dir = "C:/Users/zzawo/Desktop/My Developing, Programming/AISCStudents/" + articleId.toString() + '/';
                        //복수개이니 미디어소스 리스트 루프돌리기
                        for (let i = 0; i < mediaData.length; i++) {
                            //해당 미디어가 이미지 일시 옮기고 디렉토리 미디어 리스트에 삽입
                            console.log(i)
                            fs.mkdirSync(dir, { recursive: true });
                            if (mediaData[i].type.includes("image")) {
                                const newPromise = new Promise((resolve, reject) => {
                                    let oldPath = mediaData[i].path;
                                    let newPath = dir + mediaData[i].name;
                                    fs.rename(oldPath, newPath, function (err) {
                                        if (err) {
                                            console.log(err)
                                            reject(false)
                                        }
                                        else {
                                            mediaList.push("/media/image/" + articleId.toString() + "/" + mediaData[i].name.toString());
                                            resolve(true)
                                        }
                                    })
                                })
                                mediaProcessPromiseList.push(newPromise)
                            }
                            //해당 미디어가 비디오일 시 
                            else if (mediaData[i].type.includes('video')) {
                                let dataToSend;
                                let successQueue = "";
                                //로컬 스토리지로 옮기고
                                const newPromise = new Promise((resolve, reject) => {
                                    const moveVideosPromise = new Promise((res, rej) => {
                                        let oldPath = mediaData[i].path;
                                        let newPath = dir + mediaData[i].name;
                                        fs.rename(oldPath, newPath, function (err) {
                                            if (err) {
                                                console.log(err)
                                                rej(false)
                                            }
                                            else { res(true) }
                                        })
                                    });
                                    //유튜브에 업로드 후 아이디를 링크 형태로 미디어 리스트에 삽입
                                    moveVideosPromise.then((result) => {
                                        if (result === false) {
                                            reject(false);
                                        }
                                        let python = spawn('python', ['-u', 'youtubeUpload.py', '--file', dir + mediaData[i].name, '--title', articleId.toString() + "`~`edited" + i.toString(), '--privacyStatus', 'unlisted', '--category', '29']);
                                        python.stdout.on('data', function (data) {
                                            console.log('Pipe data from python script ...');
                                            dataToSend = data.toString();
                                            if (dataToSend.includes("successfully uploaded")) {
                                                successQueue = dataToSend.toString().slice()
                                            }
                                            console.log(data.toString())
                                        });
                                        python.stderr.on('data', (error) => {
                                            console.log(error);
                                        })
                                        python.on('close', (code) => {
                                            if (code !== 0) {
                                                reject(false)
                                            }
                                            else {
                                                let YTvideoId = successQueue.split("'")[1].trim();
                                                mediaList.push("https://youtu.be/" + YTvideoId.toString());
                                                for (let j = 0; j < orderList.length; j++) {
                                                    if (orderList[j] == mediaData[i].name) {
                                                        orderList[j] = "https://youtu.be/" + YTvideoId.toString()
                                                        break;
                                                    }
                                                }
                                                fs.unlink(dir + mediaData[i].name, err => {
                                                    if (err && err.code == "ENOENT") {
                                                        console.log("There is no video " + mediaData[i].name)
                                                    }
                                                    else if (err) {
                                                        console.log("Error while deleting the video")
                                                    }
                                                    else {
                                                        console.log('removed')
                                                    }
                                                })
                                                resolve(true)
                                            }
                                        })
                                    })
                                })
                                mediaProcessPromiseList.push(newPromise);
                            }
                        }
                        Promise.all(mediaProcessPromiseList).then((values) => {
                            if (values.includes(false)) {
                                res.status(500).send("Error happened during processing media")
                                return;
                            }
                            else {
                                //미디어 리스트를 루프를 돌며 DB에 저장
                                console.log('all promise resolved')
                                sql = 'insert into mediaDB (articleId, mediaOrder, mediasrc) values(' + articleId.toString() + ', null, ?)';
                                let insertDBDone = true;
                                for (let i = 0; i < mediaList.length; i++) {
                                    if (insertDBDone) {
                                        console.log(sql)
                                        con.query(sql, mediaList[i], function (err, result) {
                                            if (err) {
                                                console.log(err)
                                                insertDBDone = false;
                                            }
                                        })
                                    }
                                    else {
                                        break;
                                    }
                                }
                                if (!insertDBDone) {
                                    res.status(500).send(err)
                                    con.end()
                                    console.log(err)
                                    return;
                                }
                                console.log("save finished")
                                //순서 리스트를 루프를 돌며 DB에 순서 저장
                                sql = 'select mediaDB.id as id, mediaDB.mediasrc as src, mediaDB.mediaOrder as orders from mediaDB where mediaDB.articleId=' + articleId.toString()
                                let allMediaList = []
                                const selectAllMediaPromise = new Promise((resolve, reject) => {
                                    console.log(sql)
                                    con.query(sql, function (err, result) {
                                        if (err) {
                                            reject(false)
                                        }
                                        else {
                                            allMediaList = result
                                            resolve(true)
                                        }
                                    })
                                })
                                selectAllMediaPromise.then((result) => {
                                    if (!result) {
                                        res.status(500).send('something went wrong')
                                        console.log('something went wrong')
                                        con.end()
                                        return;
                                    }
                                    else {
                                        let orderedMediaList = []
                                        for (let i = 0; i < orderList.length; i++) {
                                            let j = 0;
                                            while (allMediaList.length > 0) {
                                                if (allMediaList[j]['src'].includes(orderList[i])) {
                                                    orderedMediaList.push(allMediaList[j]['src'])
                                                    allMediaList.splice(j, 1);
                                                    break;
                                                }
                                                else {
                                                    j++
                                                }
                                                if (j > allMediaList.length - 1) {
                                                    break
                                                }
                                            }
                                        }
                                        console.log(orderedMediaList)
                                        const finalQueryPromise = new Promise((resolve, reject) => {
                                            let finalQuerySuccess = true;
                                            if (orderedMediaList.length == 0) {
                                                resolve(true);
                                            }
                                            for (let i = 0; i < orderedMediaList.length; i++) {
                                                if (finalQuerySuccess) {
                                                    sql = 'update mediaDB set mediaDB.mediaOrder=? where mediaDB.articleId=' + articleId.toString() + ' and mediaDB.mediasrc=?'
                                                    con.query(sql, [i, orderedMediaList[i]], function (err, result) {
                                                        if (err) {
                                                            finalQuerySuccess = false
                                                            console.log(err)
                                                            reject(false)
                                                        }
                                                        else if (i == orderedMediaList.length - 1 && finalQuerySuccess) {
                                                            resolve(true)
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                        finalQueryPromise.then((result) => {
                                            if (!result) {
                                                res.status(500).send("Failed")
                                                con.end()
                                                return;
                                            }
                                            else {
                                                res.status(200).send("Success")
                                                con.end()
                                                return;
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    })
                })
            });
        });
    })
});

addHashTag = (articleId, hashTag) => {
    console.log("entered")
    if ((hashTag.includes(`#${articleId}`))) {
        return;
    }
    else {
        const con = mysql.createConnection({
            host: 'aiscstudents.com',
            user: 'aiscstudentsClient',
            password: 'airbusa3501000',
            database: 'aiscstudents',
        });
        con.connect(function (err) {
            if (err) {
                throw err;
            }
            let sql = `update articleDB set articleDB.hashTag=concat(articleDB.hashTag, ',#${articleId}') where articleDB.id=${articleId}`
            con.query(sql, function (err, result) {
                if (err) {
                    throw err;
                    con.end();
                    console.log(err)
                    return;
                };
                return;
            });
        })
    }
}
    

app.post('/api/comment/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            response.status(301).send("Redirect to login page");
            con.end();
            return;
        }
    });
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            con.end()
            return;
        }
        sql = "select max(commentDB.order) as maxOrder from commentDB where articleId=" + fields.articleId.toString()
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err)
                res.status(500).send("There was DB error while retrieving comment order");
                con.end();
                return;
            }
            const order = (JSON.parse(JSON.stringify(result))[0]['maxOrder'])+1
            console.log(order)
            //parse tag from commentBody
            let commentBody = fields.commentBody.toString()
            console.log(commentBody)
            let data=""
            if (commentBody.substring(0, 1) === '#') {
                const nextBlankIndex = commentBody.indexOf(' ')
                tag = commentBody.substring(1, nextBlankIndex)
                data = fields.articleId.toString() + ",'" + fields.writer.toString() + "'," + order.toString() + ",?," + tag.toString();
            }
            else {
                data = fields.articleId.toString() + ",'" + fields.writer.toString() + "'," + order.toString() + ",?, null"
            }
            sql = 'insert into commentDB (commentDB.articleId, commentDB.writer, commentDB.order, commentDB.content, commentDB.tag) values(' + data + ');';
            con.query(sql, commentBody.toString(), function (err, result) {
                if (err) {
                    console.log(err)
                    res.status(500).send("failed");
                    con.end();
                    return;
                }
                else res.status(200).send("Success");
            })
        }) 
    })
})

app.post('/api/submitContactForm/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err,result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            response.status(301).send("Redirect to login page");
            con.end();
            return;
        }
    })
    const form = formidable({ multiples: true })
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(503).send("Error while parsing the form")
            con.end()
            return;
        }
        const transporter = mailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'kjaehyeok020125@gmail.com',
                pass: 'airbusa380861'
            }
        })
        let mediaList = []
        if (typeof files.mediaInput !== 'undefined') {
            console.log("if entered")
            console.log(files)
            console.log(files.mediaInput.length)
            if (typeof files.mediaInput.length !== 'undefined') {
                for (let i = 0; i < files.mediaInput.length; i++) {
                    let temp = {
                        filename: files.mediaInput[i].name.toString(),
                        content: fs.createReadStream(files.mediaInput[i].path)
                    }
                    console.log("media being added")
                    mediaList.push(temp)
                }
            }
            else {
                let temp = {
                    filename: files.mediaInput.name.toString(),
                    content: fs.createReadStream(files.mediaInput.path)
                }
                mediaList.push(temp)
            }
        }
        const mailOptions = {
            from: 'kjaehyeok020125@gmail.com',
            to: 'kjaehyeok020125@gmail.com',
            subject: 'Sending email from AISCStudents community web server',
            text: 'Identity: ' + fields.identity.toString() + '\n Contact: ' + fields.contact.toString() + '\n Message: ' + fields.textBody.toString(),
            attachments: mediaList
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
                return;
            }
            else {
                res.status(200).send(info)
                return;
            }
        })
    })
})

app.get('/api/getComment/:id', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            response.status(301).send("Redirect to login page");
            con.end();
            return;
        }
    })
    const idInterest = req.params.id.toString()
    sql = 'SELECT commentDB.order, commentDB.content, commentDB.writer, commentDB.tag FROM commentDB WHERE commentDB.articleId = ' + idInterest.toString()+' order by commentDB.order'
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send(err)
            con.end()
            return;
        }
        else {
            res.status(200).send(result)
            con.end()
            return;
        }
    })
})

app.post('/api/deleteComment/:articleId/:commentOrder', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            response.status(301).send("Redirect to login page");
            con.end();
            return;
        }
    })
    sql = 'delete from commentDB where commentDB.articleId=' + req.params.articleId.toString() + " and commentDB.order=" + req.params.commentOrder.toString();
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
            con.end();
            return;
        }
        else {
            res.status(200).send("successfully deleted")
            con.end()
            return;
        }
    })
})

app.post('/api/editComment/:articleId/:commentOrder', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            response.status(301).send("Redirect to login page");
            con.end();
            return;
        }
    })
    const form = formidable({ multiples: true })
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).send("Error while parsing the comment form")
            con.end()
            return;
        }
        sql = "update commentDB set content=? where commentDB.articleId=" + req.params.articleId.toString() + ' and commentDB.order=' + req.params.commentOrder.toString()
        con.query(sql, fields.commentBody.toString(), function(err, result) {
            if (err) {
                res.status(500).send(err)
                console.log(err)
                con.end()
                return;
            }
            else {
                res.status(200).send(result)
                con.end()
                return;
            }
        })
    })
    
})

app.post('/api/deleteArticle/:articleId', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            response.status(301).send("Redirect to login page");
            con.end();
            return;
        }
    })
    sql = "delete from articleDB where articleDB.id=" + req.params.articleId.toString();
    con.query(sql, function (err, result) {
        if (err) {
            res.status(500).send(err)
            con.end()
            return;
        }
        else {
            res.status(200).send(err)
            con.end()
            return;
        }
    })
})

app.post('/api/editArticle/:articleId', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        console.log(result)
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
    })
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).send("Error while parsing the form")
            con.end()
            console.log(err)
            return;
        }
        let mediaData = []
        if (typeof files.newMedia != 'undefined') {
            if (typeof files.newMedia.length == 'undefined') {
                mediaData.push(files.newMedia)
            }
            else {
                mediaData = files.newMedia
            }
        }
        console.log("This is mediaData")
        console.log(mediaData)
        let orderList = JSON.parse(fields.orderList)
        const mediaList = [];
        const articleId = req.params.articleId;
        const mediaProcessPromiseList = []
        //submit된 미디어 있는지 확인
        if (typeof mediaData !== 'undefined') {
            //미디어 있으니 미디어 1개인지 복수개인지 확인
            const dir = "/home/kjaehyeok21/media/image/" + articleId.toString() + '/';
            //const dir = "C:/Users/zzawo/Desktop/My Developing, Programming/AISCStudents/" + articleId.toString() + '/';
            if (typeof mediaData.length !== 'undefined') {
                //복수개이니 미디어소스 리스트 루프돌리기
                for (let i = 0; i < mediaData.length; i++) {
                    //해당 미디어가 이미지 일시 옮기고 디렉토리 미디어 리스트에 삽입
                    console.log(mediaData[i])
                    console.log(mediaData[i].type)
                    if (mediaData[i].type.includes("image")) {
                        const newPromise = new Promise((resolve, reject) => {
                            let oldPath = mediaData[i].path;
                            let newPath = dir + mediaData[i].name;
                            fs.rename(oldPath, newPath, function (err) {
                                if (err) {
                                    console.log(err)
                                    reject(false)
                                }
                                else {
                                    mediaList.push("/media/image/" + articleId.toString() + "/" + mediaData[i].name.toString());
                                    console.log(mediaList)
                                    resolve(true)
                                }
                            })
                        })
                        mediaProcessPromiseList.push(newPromise)
                    }
                    //해당 미디어가 비디오일 시 
                    else if (mediaData[i].type.includes('video')) {
                        let dataToSend;
                        let successQueue = "";
                        //로컬 스토리지로 옮기고
                        const newPromise = new Promise((resolve, reject) => {
                            const moveVideosPromise = new Promise((res, rej) => {
                                let oldPath = mediaData[i].path;
                                let newPath = dir + mediaData[i].name;
                                fs.rename(oldPath, newPath, function (err) {
                                    if (err) {
                                        console.log(err)
                                        rej(false)
                                    }
                                    else { res(true) }
                                })
                            });
                            //유튜브에 업로드 후 아이디를 링크 형태로 미디어 리스트에 삽입
                            moveVideosPromise.then((result) => {
                                if (result === false) {
                                    reject(false);
                                }
                                let python = spawn('python', ['-u', 'youtubeUpload.py', '--file', dir + mediaData[i].name, '--title', articleId.toString() + "`~`edited" + i.toString(), '--privacyStatus', 'unlisted', '--category', '29']);
                                python.stdout.on('data', function (data) {
                                    console.log('Pipe data from python script ...');
                                    dataToSend = data.toString();
                                    if (dataToSend.includes("successfully uploaded")) {
                                        successQueue = dataToSend.toString().slice()
                                    }
                                    console.log(data.toString())
                                });
                                python.stderr.on('data', (error) => {
                                    console.log(error);
                                })
                                python.on('close', (code) => {
                                    if (code !== 0) {
                                        reject(false)
                                    }
                                    else {
                                        let YTvideoId = successQueue.split("'")[1].trim();
                                        mediaList.push("https://youtu.be/" + YTvideoId.toString());
                                        for (let j = 0; j < orderList.length; j++) {
                                            if (orderList[j] == mediaData[i].name) {
                                                orderList[j] = "https://youtu.be/" + YTvideoId.toString()
                                                break;
                                            }
                                        }
                                        fs.unlink(dir + mediaData[i].name, err => {
                                            if (err && err.code == "ENOENT") {
                                                console.log("There is no video " + mediaData[i].name)
                                            }
                                            else if (err) {
                                                console.log("Error while deleting the video")
                                            }
                                            else {
                                                console.log('removed')
                                            }
                                        })
                                        resolve(true)
                                    }
                                })
                            })
                        })
                        mediaProcessPromiseList.push(newPromise);
                    }
                }
            }
            Promise.all(mediaProcessPromiseList).then((values) => {
                console.log("Promise list")
                console.log(mediaProcessPromiseList)
                console.log("All promise resolved")
                if (values.includes(false)) {
                    res.status(500).send("Error happened during processing media")
                    return;
                }
                else {
                    //미디어 리스트를 루프를 돌며 DB에 저장
                    sql = 'insert into mediaDB (articleId, mediaOrder, mediasrc) values(' + articleId.toString() + ', null, ?)';
                    let insertDBDone = true;
                    for (let i = 0; i < mediaList.length; i++) {
                        if (insertDBDone) {
                            console.log(mediaList[i])
                            con.query(sql, mediaList[i], function (err, result) {
                                if (err) {
                                    console.log(err)
                                    insertDBDone = false;
                                }
                            })
                        }
                        else {
                            break;
                        }
                    }
                    if (!insertDBDone) {
                        res.status(500).send(err)
                        con.end()
                        console.log(err)
                        return;
                    }
                    console.log("save finished")
                    //순서 리스트를 루프를 돌며 DB에 순서 저장
                    sql = 'select mediaDB.id as id, mediaDB.mediasrc as src, mediaDB.mediaOrder as orders from mediaDB where mediaDB.articleId=' + articleId.toString()
                    console.log(sql)
                    let allMediaList = []
                    const selectAllMediaPromise = new Promise((resolve, reject) => {
                        con.query(sql, function (err, result) {
                            if (err) {
                                reject(false)
                            }
                            else {
                                allMediaList = result
                                console.log('result out')
                                resolve(true)
                            }
                        })
                    })
                    selectAllMediaPromise.then((result) => {
                        if (!result) {
                            res.status(500).send(err)
                            console.log(err)
                            con.end()
                            return;
                        }
                        else {
                            console.log("mediaList then orderList ")
                            let orderedMediaList = []
                            let deletedMediaList = []
                            for (let i = 0; i < orderList.length; i++) {
                                let j = 0;
                                while (allMediaList.length > 0) {
                                    console.log(allMediaList)
                                    console.log(mediaList)
                                    console.log(orderList)
                                    console.log(orderedMediaList)
                                    console.log(j)
                                    if (allMediaList[j]['src'].includes(orderList[i])) {
                                        orderedMediaList.push(allMediaList[j]['src'])
                                        allMediaList.splice(j, 1);
                                        break;
                                    }
                                    else {
                                        j++
                                    }
                                    if (j > allMediaList.length - 1) {
                                        break
                                    }
                                }
                            }
                            deletedMediaList = allMediaList
                            console.log(orderedMediaList)
                            const finalQueryPromise = new Promise((resolve, reject) => {
                                let finalQuerySuccess = true;
                                if (orderedMediaList.length == 0) {
                                    resolve(true)
                                }
                                else {
                                    for (let i = 0; i < orderedMediaList.length; i++) {
                                        if (finalQuerySuccess) {
                                            sql = 'update mediaDB set mediaDB.mediaOrder=? where mediaDB.articleId=' + articleId.toString() + ' and mediaDB.mediasrc=?'
                                            con.query(sql, [i, orderedMediaList[i]], function (err, result) {
                                                if (err) {
                                                    finalQuerySuccess = false
                                                    console.log(err)
                                                    reject(false)
                                                }
                                                else if (i == orderedMediaList.length - 1 && finalQuerySuccess) {
                                                    resolve(true)
                                                }
                                            })
                                        }
                                    }
                                }
                            })
                            finalQueryPromise.then((result) => {
                                if (!result) {
                                    res.status(500).send("Failed")
                                    con.end()
                                    return;
                                }
                                const deletePromise = new Promise((resolve, reject) => {
                                    console.log("deleting")
                                    console.log(deletedMediaList)
                                    let finalQuerySuccess = true;
                                    if (deletedMediaList.length == 0) {
                                        resolve(true)
                                    }
                                    else {
                                        for (let i = 0; i < deletedMediaList.length; i++) {
                                            if (finalQuerySuccess) {
                                                sql = 'update mediaDB set mediaDB.mediaOrder=null where mediaDB.articleId=' + articleId.toString() + ' and mediaDB.mediasrc=?'
                                                con.query(sql, deletedMediaList[i]['src'], function (err, result) {
                                                    if (err) {
                                                        console.log(err)
                                                        reject(false)
                                                    }
                                                    else if (i == deletedMediaList.length - 1 && finalQuerySuccess) {
                                                        resolve(true)
                                                    }
                                                })
                                            }
                                        }
                                    }
                                })
                                const textUpdatePromise = new Promise((resolve, reject) => {
                                    sql = 'update articleDB set articleDB.content=?, articleDB.hashTag=? where articleDB.id=?';
                                    con.query(sql, [fields.textBody.toString(), fields.hashTag.toString(), articleId.toString()], function (err, result) {
                                        if (err) {
                                            console.log(err);
                                            reject(false)
                                        }
                                        else {
                                            addHashTag(articleId, fields.hashTag.toString());
                                            resolve(true)
                                        }
                                    })
                                })
                                Promise.all([deletePromise, textUpdatePromise]).then((result) => {
                                    if (!result) {
                                        res.status(500).send("failed")
                                        con.end()
                                        return;
                                    }
                                    else {
                                        res.status(200).send("Success")
                                        con.end()
                                        return;
                                    }
                                })
                            })
                        }
                    })
                }
            })
        }
    })
})

app.get('/api/getMyArticles/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = 'select userDB.hashId as hashID from userDB where userDB.passcode=? limit 1'
        con.query(sql, [passcode], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send("HashID retrieval failed")
                con.end()
                return;
            }
            const hashID = result[0]['hashID'].toString();
            sql = 'select articleDB.id as id, articleDB.content as content from articleDB where articleDB.writer=? order by articleDB.id'
            con.query(sql, [hashID], (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Article content retrieval failed")
                    con.end()
                    return;
                }
                res.status(200).send(data);
                console.log(data)
                con.end()
                return;
            })
        })
    })
    
})

app.get('/api/getMyComments/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = 'select userDB.hashId as hashID from userDB where userDB.passcode=? limit 1'
        con.query(sql, [passcode], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send("HashID retrieval failed")
                con.end()
                return;
            }
            const hashID = result[0]['hashID'].toString();
            sql = "select commentDB.articleId as id, commentDB.content as content, commentDB.order as orders, commentDB.tag as tag from commentDB where commentDB.writer=?";
            con.query(sql, [hashID], (err, data) => {
                if (err) {
                    con.end()
                    res.status(500).send("Comment data retrieval failed")
                    console.log(err)
                    return;
                }
                res.status(200).send(data);
                console.log(data)
                con.end();
                return;
            })
        })
    })
    
})

app.get('/api/getMyLiked/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = 'select userDB.hashId as hashID from userDB where userDB.passcode=? limit 1'
        con.query(sql, [passcode], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send("HashID retrieval failed")
                con.end()
                return;
            }
            const hashID = result[0]['hashID'].toString();
            sql = 'select likeDB.articleId as id from likeDB where writer=?'
            con.query(sql, [hashID], (err, data) => {
                if (err) {
                    con.end();
                    res.status(500).send('liked article retrieval failed')
                    console.log(err)
                    return;
                }
                if (data.length == 0) {
                    con.end();
                    res.status(200).send([])
                    return;
                }
                sql = 'select articleDB.id as id, articleDB.content as content from articleDB where '
                for (let i = 0; i < data.length; i++) {
                    sql+='articleDB.id=' + data[i]['id'].toString()
                    if (i != (data.length) - 1) {
                        sql+=' or '
                    }
                }
                con.query(sql, (err, result) => {
                    if (err) {
                        con.end();
                        res.status(500).send('liked article retrieval failed')
                        console.log(err)
                        return;
                    }
                    res.status(200).send(result)
                    con.end()
                    return;
                })
            })
        })
    })
})

app.get('/api/getProfile/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = 'select userDB.name as name, userDB.hashId as hashID, userDB.id as ID, userDB.preferredName as preferredName, userDB.darkTheme as darkTheme, userDB.usePrefName as usePrefName from userDB where userDB.passcode=?'
        con.query(sql, [passcode], (err,result) => {
            if (err) {
                con.end();
                res.status(500).send('profile retrieval failed')
                console.log(err)
                return;
            }
            res.status(200).send(result)
            console.log(result)
            con.end()
            return;
        })
    })
})

app.post('/api/changePassword/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err)
                res.status(500).send(err);
                con.end()
                return;
            }
            sql = 'select userDB.password as password, userDB.passcode as passcode from userDB where userDB.hashId =? limit 1'
            con.query(sql, fields.id.toString(), (err, result) => {
                if (err) {
                    console.log(err)
                    res.status(500).send("DB Query error");
                    con.end()
                    return;
                }
                const userData = JSON.parse(JSON.stringify(result))
                console.log(userData)
                if (userData.length == 0) {
                    res.status(403).send("No such account exists");
                    con.end()
                    return;
                }
                if (userData[0]['password'] === fields.nowPw.toString()) {
                    const moldList = [1, 2, 3, 4]
                    const randomNumbers = moldList.map((num) => {
                        return num * (Math.floor(Math.random() * 16) + 1);
                    });
                    let keyString = "";
                    for (let i = 0; i < randomNumbers.length; i++) {
                        keyString += fields.newPw.charAt(randomNumbers[i]) + fields.id.charAt(randomNumbers[i]);
                    }
                    const newPasscode = sha256(keyString)
                    let sql = "update userDB set userDB.password=?, userDB.keyIndex=?, userDB.passcode=? where userDB.hashId=?";
                    con.query(sql, [fields.newPw.toString(), randomNumbers.toString(), newPasscode.toString(), fields.id.toString()], (err, result) => {
                        if (err) {
                            console.log(err)
                            res.status(500).send(err);
                            con.end();
                            return;
                        }
                        else {
                            console.log(newPasscode)
                            res.cookie("passcode", newPasscode, { httpOnly: true, secure: true, maxAge: 86400000 });
                            res.status(200).send("Success");
                            con.end()
                            return;
                        }
                    })
                }
                else if (userData[0]['password'] === null) {
                    res.status(202).send("Account not activated")
                    con.end()
                    return;
                }
                else
                {
                    res.status(403).send("Login failed - No such account exists");
                    con.end()
                    return;
                }
            })
        })
    })
})

app.post('/api/searchFriend/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err)
                res.status(500).send(err);
                con.end()
                return;
            }
            sql = 'select userDB.hashId as hashID from userDB where userDB.hashId like ?'
            con.query(sql, ['%'+fields.key.toString()+'%'], (err, result) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(err);
                    con.end()
                    return;
                }
                else {
                    res.status(200).send(result)
                    con.end()
                    return;
                }
            })
        })
        
    })
})

app.get('/api/getMyFriends/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = "select userDB.hashId as hashID from userDB where userDB.passcode=? limit 1";
        con.query(sql, [req.cookies.passcode.toString()], (err, result1) => {
            if (err) {
                res.status(500).send("Error while getting user ID")
                con.end()
                return;
            }
            const userID = result1[0]['hashID'];
            sql = 'select friendDB.friendHashId as hashID, friendDB.nickName as nickName from friendDB where friendDB.hashID=?'
            con.query(sql, [userID], (err, result2) => {
                if (err) {
                    res.status(500).send("Error while getting user ID")
                    con.end()
                    return;
                }
                const friendData = result2.slice()
                const friendList=[]
                const promiseList = []
                for (let i = 0; i < friendData.length; i++) {
                    const setPrefNamePromise = new Promise((resolve1, reject1) => {
                        sql = 'select userDB.hashId as hashID, userDB.usePrefName as usePrefName from userDB where userDB.hashId=?'
                        con.query(sql, [friendData[i]['hashID']], (err, result3) => {
                            if (err) {
                                reject1(false)
                            }
                            if (result3[0]['usePrefName'] == 0) {
                                var j = JSON.parse(JSON.stringify(friendData[i]));
                                var keys = Object.keys(j);
                                var values = Object.keys(j).map(function (_) { return j[_]; });
                                keys.push('preferredName');
                                values.push(null);
                                var friendDict = {};
                                keys.forEach(function (i, j) {
                                    friendDict[i] = values[j];
                                });
                                friendList.push(friendDict)
                                resolve1(true)
                            }
                            else {
                                const getPrefNamePromise = new Promise((resolve, reject) => {
                                    sql = 'select userDB.preferredName as preferredName from userDB where userDB.hashId=?'
                                    con.query(sql, [friendData[i]['hashID']], (err, result4) => {
                                        if (err) {
                                            reject(false)
                                        }
                                        var j = JSON.parse(JSON.stringify(friendData[i]));
                                        var keys = Object.keys(j);
                                        var values = Object.keys(j).map(function (_) { return j[_]; });
                                        keys.push('preferredName');
                                        values.push(result4[0]['preferredName']);
                                        var friendDict = {};
                                        keys.forEach(function (i, j) {
                                            friendDict[i] = values[j];
                                        });
                                        friendList.push(friendDict)
                                        resolve(true)
                                    })
                                })
                                getPrefNamePromise.then((result) => {
                                    if (result) {
                                        resolve1(true)
                                    }
                                    else {
                                        reject1(false)
                                    }
                                })
                            }
                        })
                    })
                    promiseList.push(setPrefNamePromise)
                }
                Promise.all(promiseList).then((values) => {
                    console.log(promiseList)
                    if (values.includes(false)) {
                        res.status(500).send("Error while getting user ID")
                        con.end()
                        return;
                    }
                    console.log("This is final result 2")
                    console.log(friendList)
                    res.status(200).send(friendList)
                })
            })
        })
    })
})

app.post('/api/addFriend/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = "select userDB.hashId as hashID from userDB where userDB.passcode=? limit 1";
        con.query(sql, [req.cookies.passcode.toString()], (err, result1) => {
            if (err) {
                res.status(500).send("Error while getting user ID")
                con.end()
                return;
            }
            const userID = result1[0]['hashID'];
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(err);
                    con.end()
                    return;
                }
                sql = 'select userDB.preferredName as preferredName from userDB where userDB.hashId=?'
                con.query(sql, [fields.hashID], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send(err);
                        con.end()
                        return;
                    }
                    sql = 'insert into friendDB (hashID, friendHashID, nickName) values (?,?,?)'
                    con.query(sql, [userID.toString(), fields.hashID.toString(), result[0]['preferredName']], (err, result) => {
                        if (err) {
                            console.log(err)
                            res.status(500).send(err);
                            con.end()
                            return;
                        }
                        res.status(200).send("Add success")
                    })
                })
                
            })
        })
    })
})

app.post('/api/setName/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = "select userDB.hashId as hashID from userDB where userDB.passcode=? limit 1";
        con.query(sql, [req.cookies.passcode.toString()], (err, result1) => {
            if (err) {
                res.status(500).send("Error while getting user ID")
                con.end()
                return;
            }
            const userID = result1[0]['hashID'];
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(err);
                    con.end()
                    return;
                }
                const nickName = fields.nickName == "" ? null : fields.nickName;
                sql = 'update friendDB set friendDB.nickName=? where friendDB.hashID=? and friendDB.friendHashID=?';
                con.query(sql, [nickName, userID, fields.friendHashID], (err, result2) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send(err);
                        con.end()
                        return;
                    }
                    res.status(200).send("Success")
                    con.end();
                    return;
                })
            })
        })
    })
})

app.post('/api/setPrefName/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = "select userDB.hashId as hashID from userDB where userDB.passcode=? limit 1";
        con.query(sql, [req.cookies.passcode.toString()], (err, result1) => {
            if (err) {
                res.status(500).send("Error while getting user ID")
                con.end()
                return;
            }
            const userID = result1[0]['hashID'];
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(err);
                    con.end()
                    return;
                }
                sql = 'update userDB set userDB.preferredName=? where userDB.hashId=?';
                con.query(sql, [fields.nickName, userID], (err, reseult2) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send(err);
                        con.end()
                        return;
                    }
                    res.status(200).send("Success")
                    con.end();
                    return;
                })
            })
        })
    })
})

app.post('/api/setUsePreferredName/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = "select userDB.hashId as hashID from userDB where userDB.passcode=? limit 1";
        con.query(sql, [req.cookies.passcode.toString()], (err, result1) => {
            if (err) {
                res.status(500).send("Error while getting user ID")
                con.end()
                return;
            }
            const userID = result1[0]['hashID'];
            sql = 'select userDB.usePrefName as usePrefName from userDB where userDB.hashId=?'
            con.query(sql, [userID], (err, result) => {
                if (err) {
                    res.status(500).send("Error while getting user ID")
                    con.end()
                    return;
                }
                if (result[0]['usePrefName'] == 0) {
                    sql = 'update userDB set userDB.usePrefName=1 where userDB.hashId=?'
                    con.query(sql, [userID], (err, result) => {
                        if (err) {
                            res.status(500).send("Error while getting user ID")
                            con.end()
                            return;
                        }
                        else {
                            res.status(200).send("Success")
                            con.end();
                            return;
                        }
                    })
                }
                else {
                    sql = 'update userDB set userDB.usePrefName=0 where userDB.hashId=?'
                    con.query(sql, [userID], (err, result) => {
                        if (err) {
                            res.status(500).send("Error while getting user ID")
                            con.end()
                            return;
                        }
                        else {
                            res.status(200).send("Success")
                            con.end();
                            return;
                        }
                    })
                }
            })
        })
    })
})

app.post('/api/setDarkTheme/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = "select userDB.hashId as hashID from userDB where userDB.passcode=? limit 1";
        con.query(sql, [req.cookies.passcode.toString()], (err, result1) => {
            if (err) {
                res.status(500).send("Error while getting user ID")
                con.end()
                return;
            }
            const userID = result1[0]['hashID'];
            sql = 'select userDB.darkTheme as darkTheme from userDB where userDB.hashId=?'
            con.query(sql, userID, (err, result) => {
                if (err) {
                    res.status(500).send("Error while getting user ID")
                    con.end()
                    console.log(err)
                    return;
                }
                let darkTheme = 0;
                if (result[0]['darkTheme'] == 0) {
                    darkTheme = 1;
                }
                sql = 'update userDB set userDB.darkTheme=? where userDB.hashId=?'
                con.query(sql, [darkTheme, userID], (err, result) => {
                    if (err) {
                        res.status(500).send("Error while getting user ID")
                        con.end()
                        return;
                        console.log(err)
                    }
                    else {
                        res.status(200).send('Success')
                    }
                })
            })
            
        })
    })
})

app.post('/api/searchByKeyword/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err)
                res.status(500).send(err);
                con.end()
                return;
            }
            sql = 'select articleDB.id as id from articleDB where '
            //'articleDB.content like ? or articleDB.hashTag like ?'
            console.log(fields.hashTag.length)
            console.log(fields.text.length)
            let hashTag = fields.hashTag.length>0? fields.hashTag.split(","):[]
            let text=fields.text.length>0? fields.text.split(","): []
            for (let i = 0; i < hashTag.length; i++) {
                sql += 'articleDB.hashTag like ?'
                if ((i + 1) != hashTag.length || text.length > 0) {
                    sql+= ' or '
                }
            }
            for (let i = 0; i < text.length; i++) {
                sql += 'articleDB.content like ?'
                if ((i + 1) != text.length) {
                    sql += ' or '
                }
            }
            sql += ' order by articleDB.id desc;'
            
            const parameters = hashTag.concat(text);
            for (let i = 0; i < parameters.length; i++) {
                parameters[i]='%'+parameters[i]+'%'
            }
            console.log(sql)
            console.log(parameters)
            con.query(sql, parameters, (err, result) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(err);
                    con.end()
                    return;
                }
                console.log(result)
                res.status(200).send(result)
            })
        })
    })
})

app.get('/api/getTags/', (req, res) => {
    const passcode = req.cookies.passcode;
    let sql = "select userDB.passcode from userDB where userDB.passcode='" + passcode + "'";
    const con = mysql.createConnection({
        host: 'aiscstudents.com',
        user: 'aiscstudentsClient',
        password: 'airbusa3501000',
        database: 'aiscstudents',
    });
    con.connect(function (err) {
        if (err) {
            throw err;
        }
        console.log("Connected^^");
    })
    con.query(sql, function (err, result) {
        if (err) {
            throw err;
            con.end();
        };
        if (result.length === 0) {
            console.log(passcode)
            console.log("redirecting")
            res.status(301).send("Redirect to login page");
            con.end();
            return;
        }
        sql = 'select userDB.hashId as hashID from userDB where userDB.passcode=? limit 1'
        con.query(sql, [passcode], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send("HashID retrieval failed")
                con.end()
                return;
            }
            const hashID = result[0]['hashID'].toString();
            sql = 'select articleDB.id as id, articleDB.hashTag as hashTag from articleDB where articleDB.writer=? order by articleDB.id'
            con.query(sql, [hashID], (err, result) => {
                if (err) {
                    console.log(err)
                    res.status(500).send("HashID retrieval failed")
                    con.end()
                    return;
                }
                res.status(200).send(result)
                con.end()
                return;
            })
        })
    })
})

app.listen(3030, () => console.log("Listening on port 3030"));