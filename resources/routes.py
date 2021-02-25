from resources.books import BookListAPI, BookAPI
from resources.auth import SignupAPI, LoginAPI


def initialize_routes(api):
    api.add_resource(BookListAPI, "/api/v1/books")
    api.add_resource(BookAPI, "/api/v1/books/<id>")
    api.add_resource(SignupAPI, "/api/v1/auth/signup")
    api.add_resource(LoginAPI, "/api/v1/auth/login")