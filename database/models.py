from database.db import db
from flask_bcrypt import generate_password_hash, check_password_hash


class Book(db.Document):
    book_name = db.StringField(required=True)
    publication_year = db.IntField(required=True, min_value=100, max_value=3000)
    genre = db.ListField(db.StringField(), required=True)
    author = db.ReferenceField("Author")


class Author(db.Document):
    email = db.EmailField(required=True, unique=True)
    password = db.StringField(required=True, min_length=8)
    books = db.ListField(db.ReferenceField("Book", reverse_delete_rule=db.PULL))

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode("utf8")

    def check_password(self, password):
        return check_password_hash(self.password, password)


Author.register_delete_rule(Book, "author", db.CASCADE)