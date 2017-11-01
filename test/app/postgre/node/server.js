/* eslint-disable */
app.get('/postgre-test', function (req, res) {

    let messages = [];
    pair = (100, "abc'def")

    var client = serviceManager.get('postgre-client');

    if (!client) {
        res.status(500).send('postgre-client is not defined in serviceManager');
        return;
    }

    client.query('CREATE TABLE IF NOT EXISTS "sch.test" (var1 integer NOT NULL, var2 varchar(256) NOT NULL);', function (err, result) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        client.query('INSERT INTO "sch.test" (var1, var2) VALUES ($1, $2)', [pair[0], pair[1]], function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }
        });
        client.query('SELECT * FROM "sch.test";', function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                messages.push('created and fetched data')
                res.status(202).json(messages);
            }

        });

    });
});


