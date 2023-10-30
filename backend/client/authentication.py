from django.conf import settings
from rest_framework import authentication, exceptions
import jwt

from . import models

class ClientAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        token = request.COOKIES.get('jwt')
        print(request)
        
        if not token:
            return None
        
        # Decode the JWT and see if it mathces our client
        try:
            jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
        except:
            raise exceptions.AuthenticationFailed('Invalid Token')
        
        client=models.Client.objects.filter(id=jwt.decode(token, settings.JWT_SECRET,
                                        algorithms=['HS256'])['id']).first()
        
        return (client, None)