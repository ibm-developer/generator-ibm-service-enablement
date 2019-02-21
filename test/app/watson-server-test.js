const express = require('express');
const app = express();
const serviceManager = require('./services/service-manager');

// Initialize services
require('./services/index')(app);

app.get('/conversation', function(req, res, next) {
	const conversation = serviceManager.get('watson-conversation');
	conversation.listWorkspaces((err, resp) => {
		if (err) {
			next(err);
		} else {
			res.json(resp);
		}
	})
});

app.get('/discovery', function(req, res, next) {
	const discovery = serviceManager.get('watson-discovery');
	discovery.listEnvironments((err, resp) => {
		if (err) {
			next(err);
		} else {
			res.json(resp);
		}
	})
});

app.get('/visual-recognition', function(req, res, next) {
	const visualRecognition = serviceManager.get('watson-visual-recognition');
	visualRecognition.listClassifiers((err, resp) => {
		if (err) {
			next(err);
		} else {
			res.json(resp);
		}
	})
});

app.get('/speech-to-text', function(req, res, next) {
	const stt = serviceManager.get('watson-speech-to-text');
	stt.listModels((err, resp) => {
		if (err) {
			next(err);
		} else {
			res.json(resp);
		}
	})
});

app.get('/text-to-speech', function(req, res, next) {
	const tts = serviceManager.get('watson-text-to-speech');
	tts.listVoices((err, resp) => {
		if (err) {
			next(err);
		} else {
			res.json(resp);
		}
	})
});

app.get('/personality-insights', function(req, res, next) {
	const text = `I think we've got to invest in education and training. I think it's important for us to develop new
	sources of energy here in America, that we change our tax code to make sure that we're helping
	small businesses and companies that are investing here in the United States, that we take some of
	the money that we're saving as we wind down two wars to rebuild America and that we reduce
	our deficit in a balanced way that allows us to make these critical investments.

	Now, it ultimately is going to be up to the voters — to you — which path we should take. Are we
	going to double on top-down economic policies that helped to get us into this mess or do we
	embrace a new economic patriotism that says America does best when the middle class does
	best? And I'm looking forward to having that debate.

	Well, let me talk specifically about what I think we need to do. First, we've
	got to improve our education system and we've made enormous progress drawing on ideas both
	from Democrats and Republicans that are already starting to show gains in some of the toughest
	to deal with schools. We've got a program called Race to the Top that has prompted reforms in
	46 states around the country, raising standards, improving how we train teachers.

	So now I want to hire another 100,000 new math and science teachers, and create 2 million more
	slots in our community colleges so that people can get trained for the jobs that are out there right
	now. And I want to make sure that we keep tuition low for our young people.
	`;

	const personalityInsights = serviceManager.get('watson-personality-insights');
	personalityInsights.profile({ text }, (err, resp) => {
		if (err) {
			next(err);
		} else {
			res.json(resp);
		}
	})
});

app.get('/tone-analyzer', function(req, res, next) {
	const toneAnalyzer = serviceManager.get('watson-tone-analyzer');
	toneAnalyzer.tone({ tone_input: 'Team, I know that times are tough!' }, (err, resp) => {
		if (err) {
			next(err);
		} else {
			res.json(resp);
		}
	})
});

app.get('/natural-language-classifier', function(req, res, next) {
	const classifier = serviceManager.get('watson-natural-language-classifier');
	classifier.listClassifiers((err, resp) => {
		if (err) {
			next(err);
		} else {
			res.json(resp);
		}
	})
});

app.get('/natural-language-understanding', function(req, res, next) {
	const nlu = serviceManager.get('watson-natural-language-understanding');
	nlu.listModels((err, resp) => {
		if (err) {
			next(err);
		} else {
			res.json(resp);
		}
	})
});

app.get('/language-translator', function(req, res, next) {
	const languageTranslator = serviceManager.get('watson-language-translator');
	languageTranslator.listModels((err, resp) => {
		if (err) {
			next(err);
		} else {
			res.json(resp);
		}
	})
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.code = 404;
	err.message = 'Not Found';
	next(err);
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line
	const error = {
		code: err.code || 500,
		error: err.error || err.message,
	};
	res.status(error.code).json(error);
});

const port = 3000;
app.listen(port, function () {
	console.info(`Hayata Shin listening on http://localhost:${port}`);
	if (process.send) {
		process.send('listening');
	}
});
