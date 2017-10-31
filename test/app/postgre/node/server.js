/* eslint-disable */
app.get('/postgre-test', function (req, res) {
    let messages = [];
    pair = (100, "abc'def")
    var client = serviceManager.get('postgre-client');
    if (!client) {
        res.status(500).send('postgre is not defined in serviceManager');
        return;
    }

    client.query('CREATE TABLE IF NOT EXISTS "sch.test" (var1 varchar(256) NOT NULL, var2 varchar(256) NOT NULL);', function (err, result) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            client.query('INSERT INTO "sch.test" (var1, var2) VALUES ($1, $2)', [pair[0], pair[1]], function (err2, result2) {
                if (err2) {
                    console.log("err after insert: " + err2)
                    // return;
                }
            });
            // client.query('INSERT INTO test (num, data) VALUES ($1, $2)', [pair[0], pair[1]]);
            client.query('SELECT * FROM "sch.test";', function (err3, result3) {
                if (err3) {
                    res.status(500).send(err3);
                } else {
                    messages.push('created and fetched data')
                    res.status(202).json(messages);
                }

            });
        }
    });
});


