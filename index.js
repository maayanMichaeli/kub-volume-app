/// <reference types="node" />
const express = require('express');
const app = express();
const fs = require('node:fs/promises');

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.get('/', async (req, res) => {
	try {
		return res.sendFile(__dirname + '/index.html');
	} catch (err) {
		console.log(err);
		res.status(500).send({ err: true, msg: `Whoops! That shlouldn't have happened...` });
	}
});

app.get('/initial', async (req, res) => {
	try {
		try {
			const dir = await fs.access('./users');
		} catch (error) {
			const dirMade = await fs.mkdir('./users');
			try {
				const file = await fs.writeFile('./users/users.txt', 'admin');
			} catch (error) {
				return res.status(401).send({ err: true, msg: 'No file writing allowed' });
			}
		}

		// if (!(await exists('./users'))){
		//     await mkdir('./users')
		// }

		res.send('file written :)');
	} catch (err) {
		console.log(err);
		res.status(500).send({ err: true, msg: `Whoops! That shlouldn't have happened...` });
	}
});

app.get('/users', async (req, res) => {
	try {
		try {
			const file = await fs.readFile('./users/users.txt', { encoding: 'utf-8' });
			res.send(file);
		} catch (error) {
			return res.status(400).send({ err: true, msg: 'Couldnt read file. Have you tried running "initial" first?' });
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({ err: true, msg: `Whoops! That shlouldn't have happened...` });
	}
});

app.post('/users', async (req, res) => {
	try {
		try {
			const file = await fs.readFile('./users/users.txt', { encoding: 'utf-8' });
			const updatedFile = await fs.writeFile('./users/users.txt', file + '\n' + req.body.user);
			console.log(req.body);
            const readFile = await fs.readFile('./users/users.txt', { encoding: 'utf-8' });
			res.send(readFile);
		} catch (error) {
			return res.status(400).send({ err: true, msg: 'Couldnt read or write to file. Have you tried running "initial" first?' });
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({ err: true, msg: `Whoops! That shlouldn't have happened...` });
	}
});

app.listen(PORT, () => {
	console.log('listening on ' + PORT);
});
