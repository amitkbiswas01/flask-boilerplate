from flask import Response, request, json
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import (
    FieldDoesNotExist,
    NotUniqueError,
    DoesNotExist,
    ValidationError,
    InvalidQueryError,
)

from database.models import Book, Author
from resources.errors import (
    BookAlreadyExistsError,
    SchemaValidationError,
    BookAlreadyExistsError,
    InternalServerError,
    UpdatingBookError,
    DeletingBookError,
    BookNotExistsError,
)


class BookListAPI(Resource):
    """
    GET all books/POST a single book.
    """

    @jwt_required()
    def get(self):
        books = Book.objects().to_json()
        return Response(response=books, status=200, mimetype="application/json")

    @jwt_required()
    def post(self):
        try:
            author_id = get_jwt_identity()
            author = Author.objects.get(id=author_id)

            body = request.get_json()
            book = Book(**body, author=author).save()
            author.update(push__books=book)
            author.save()
            return Response(
                response=json.dumps({"message": "Book created successfully."}),
                status=201,
                mimetype="application/json",
            )
        except (FieldDoesNotExist, ValidationError):
            return {"error": "Invalid data format."}, 400
        except NotUniqueError:
            return {"error": "Book already Exists."}, 400
        except Exception:
            return {"error": "Internal Server Error."}, 500


class BookAPI(Resource):
    """
    GET/PUT/DELETE a single Book.
    """

    @jwt_required()
    def get(self, id):
        try:
            books = Book.objects.get(id=id).to_json()
            return Response(response=books, status=200, mimetype="application/json")
        except DoesNotExist:
            raise BookNotExistsError
        except Exception:
            raise InternalServerError

    @jwt_required()
    def patch(self, id):
        try:
            body = request.get_json()
            Book.objects.get(id=id).update(**body)
            return Response(
                response=json.dumps({"message": "Book Updated."}),
                status=200,
                mimetype="application/json",
            )
        except InvalidQueryError:
            return {"error": "Invalid data format."}, 400
        except DoesNotExist:
            return {"error": "Book doesn't Exists."}, 400
        except Exception:
            return {"error": "Internal Server Error."}, 500

    @jwt_required()
    def delete(self, id):
        try:
            author_id = get_jwt_identity()
            book = Book.objects.get(id=id, author=author_id)
            book.delete()
            return Response(
                response=json.dumps({"message": "Book Deleted."}),
                status=200,
                mimetype="application/json",
            )
        except DoesNotExist:
            raise DeletingBookError
        except Exception:
            raise InternalServerError