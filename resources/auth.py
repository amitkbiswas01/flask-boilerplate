import datetime
from flask import request, Response, json
from flask_restful import Resource
from flask_jwt_extended import create_access_token
from mongoengine.errors import FieldDoesNotExist, NotUniqueError, DoesNotExist


from database.models import Author
from resources.errors import (
    SchemaValidationError,
    EmailAlreadyExistsError,
    UnauthorizedError,
    InternalServerError,
)


class SignupAPI(Resource):
    """
    Register new author.
    """

    def post(self):
        try:
            body = request.get_json()
            author = Author(**body)
            author.hash_password()
            author.save()
            return Response(
                response=json.dumps({"message": "Author Created Successfully."}),
                status=201,
                mimetype="application/json",
            )
        except FieldDoesNotExist:
            raise SchemaValidationError
        except NotUniqueError:
            raise EmailAlreadyExistsError
        except Exception:
            raise InternalServerError


class LoginAPI(Resource):
    """
    Login authenticated authors and return access token.
    """

    def post(self):
        try:
            body = request.get_json()
            author = Author.objects.get(email=body.get("email"))
            authorization = author.check_password(body.get("password"))
            if not authorization:
                return {"error": "Invalid Email or Password!"}, 401

            access_token = create_access_token(
                identity=str(author.id), expires_delta=datetime.timedelta(days=7)
            )
            return {"token": access_token}, 200
        except (UnauthorizedError, DoesNotExist):
            raise UnauthorizedError
        except Exception:
            raise InternalServerError