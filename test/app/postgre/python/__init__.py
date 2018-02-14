cur = None
conn = None
@app.route('/postgre-test')
def testPostgre():
	messages = []
	pair = (100, "abc'def")

	conn = service_manager.get('postgre-client')
	cur = conn.cursor()

	cur.execute("CREATE TABLE test (id serial PRIMARY KEY, num integer, data varchar);")
	cur.execute("INSERT INTO test (num, data) VALUES (%s, %s)", pair)

	cur.execute("SELECT * FROM test;")
	_, num, data = cur.fetchone()

	if (num, data) == pair:
		messages.append('created and fetched data')

	return jsonify(messages)
