os = None
@app.route('/objectstorage-test')
def objectStorage():
    messages = []
    os = service_manager.get('object-storage')
    messages.append('test container was created')
    try:
        os.get_container('test')
        os.put_object(container='test', obj='ninpocho', contents='test', content_type='text/plain')
        messages.append('ninpocho object was added')
    except Exception as e:
        	os.put_container('test')
        	os.put_object(container='test', obj='ninpocho', contents='test', content_type='text/plain')
        	messages.append('ninpocho object was added')
    return jsonify(messages)