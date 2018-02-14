/* eslint-disable */
app.get('/postgre-test', function (req, res) {

    let messages = [];
    var pair = [1, "two"];

    var client = serviceManager.get('postgre-client');

    if (!client) {
        res.status(500).send('postgre-client is not defined in serviceManager');
        return;
    }

    client.query('CREATE TABLE IF NOT EXISTS "sch.test" (num integer NOT NULL, data varchar(256) NOT NULL);', function (err, result) {

        if (err) {
            res.status(400).send(err);
            return;
        }

        client.query('INSERT INTO "sch.test" (num, data) VALUES ($1, $2)', [pair[0], pair[1]], function (err, result) {
            if (err) {
                res.status(400).send(err);
                return;
            }
        });
        client.query('SELECT * FROM "sch.test";', function (err, result) {
            if (err) {
                res.status(400).send(err);
            } else {
                
                if (result.rows[0].num == pair[0] && result.rows[0].data == pair[1]) {
                    messages.push('created and fetched data')
                    client.query('DROP TABLE IF EXISTS "sch.test";');
                    res.status(202).json(messages);
                }
                else {
                    res.status(400).send('error processing data');
                }
            }
        });
    });
});
