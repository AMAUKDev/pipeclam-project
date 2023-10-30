from rest_framework import views, response, exceptions, permissions

from . import serializers as client_serializer
from . import services, authentication

class RegisterAPI(views.APIView):

    def post(self, request):
        print(request.data)
        req = request.data
        req['role'] = 'Unapproved'
        serializer = client_serializer.ClientSerializer(data=req)

        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
       
        serializer.instance = services.create_client(client_dataclass=data)
        
        return response.Response(data=serializer.data, status=200) 


class LoginAPI(views.APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        client = services.client_email_selector(email=email)
        print(client)

        if client is None:
            raise exceptions.AuthenticationFailed('Client not found!')
        
        if not client.check_password(raw_password=password):
            raise exceptions.AuthenticationFailed('Invalid Credentials!')
        
        if not client.approved:
            raise exceptions.AuthenticationFailed('Client not approved!')
        
        token = services.create_token(client.id)

        res = response.Response()
        res.set_cookie(key='jwt', value=token, httponly=True)

        return res
        

class DashboardAPI(views.APIView):
    '''
    Endpoint can only be used
    if user is authenticated
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.ClientAuthentication,)

    def get(self, request):
        # Only load area if user is approved
        if request.user.approved:
            serializer = client_serializer.ClientSerializer(request.user)
            
            serializer.data['role'] = request.user.role
            print("DATA", serializer.data)
            return response.Response(data=serializer.data, status=200)
        else:
            return response.Response(data={'message':'You are not approved!'})
    
class LogoutAPI(views.APIView):
    authentication_classes = [authentication.ClientAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        res = response.Response()
        res.delete_cookie('jwt')
        res.data = {"message": "Successfully logged out"}
        return res
    

'''
{
"email":"a@kl.com",
"first_name":"FN",
"last_name":"LN",
"password":"pswd"
}

'''