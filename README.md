## Flask Boilerplate app

### How to run locally?

- Install Mongodb locally. [How-to](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
- Clone the repo and install from pip.

```bash
git clone git@github.com:amitkbiswas01/flask-boilerplate.git
cd flask-boilerplate
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

- Create .env file like below.

```
JWT_SECRET_KEY=some_secret
```

- Run the server and access from `client/homepage.html`

```bash
FLASK_ENV=development flask run
```
