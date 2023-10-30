import dataclasses
import datetime
import jwt
from typing import TYPE_CHECKING
from django.conf import settings
from . import models

if TYPE_CHECKING:
    from models import Client

# Turns into class based instead of having to use dictionary
@dataclasses.dataclass
class ClientDataClass:
    first_name: str
    last_name: str
    email: str
    password: str
    role: str

    @classmethod
    def from_instance(cls, client: "Client") -> "ClientDataClass":
        return cls(
            first_name=client.first_name,
            last_name=client.last_name,
            email=client.email,
            password=client.password,
            role=client.role
        )

# Create a client and save to the database
def create_client(client_dataclass: "ClientDataClass") -> "ClientDataClass":
    instance = models.Client(
        first_name=client_dataclass.first_name,
        last_name=client_dataclass.last_name,
        email=client_dataclass.email,
        role=client_dataclass.role
    )

    if client_dataclass.password is not None:
        instance.set_password(client_dataclass.password)

    instance.save()

    return ClientDataClass.from_instance(instance)

def client_email_selector(email: str) -> "Client":
    return models.Client.objects.filter(email=email).first()

#Create our JSON Web Token
def create_token(client_id: int) -> str:
    payload = dict(
        id=client_id,
        exp=datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        iat=datetime.datetime.utcnow()
    )
    token=jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')

    return token


'''

{
"first_name": "FN",
"last_name":"LN",
"email":"a@b.com",
"password":"pswd"
}
'''