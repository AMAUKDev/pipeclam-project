from rest_framework import views, response, permissions
from client.authentication import ClientAuthentication
from django.shortcuts import render
from .services import FindUserTags, AstroCast
from client.models import Device

# Create your views here.

# Here we check the authentication and roles of the user
# Database integration with mongodb for DT will come later

class AMAAPI(views.APIView):
    '''
    Endpoint can only be used
    if user is authenticated
    and if they are either an admin or belong to AMA group
    similar to dashboard
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (ClientAuthentication,)

    # Only load area if user is approved
    def get(self, request):
        # Only load area if user is approved        
        # Get all of the tags associated with the user
        tags = FindUserTags(request.user).get_tags()
        # Collect together a response
        res = {}
        if (request.user.approved and
            (request.user.role == 'AMA' or request.user.role == 'ADMIN')):
            for tag in tags:
                if tag not in res:
                    res[tag] = f'Welcome {tag} AMA'
                
            # Basic member
            if len(tags) == 0:
                return response.Response(data={'message':'Welcome AMA'}, status=200)
            
            # Collected response
            return response.Response(data={'message': res}, status=200)
        else:
            return response.Response(data={'message':'You are not approved!'})
        
class CMAAPI(views.APIView):
    '''
    Endpoint can only be used
    if user is authenticated
    and if they are either an admin or belong to CMA group
    similar to dashboard
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (ClientAuthentication,)

    def get(self, request):
        tags = FindUserTags(request.user).get_tags()
        # Collect together a response
        res = {}
        if (request.user.approved and
            (request.user.role == 'CMA' or request.user.role == 'ADMIN')):
            for tag in tags:
                if tag not in res:
                    res[tag] = f'Welcome {tag} CMA'
                
            # Basic member
            if len(tags) == 0:
                return response.Response(data={'message':'Welcome CMA'}, status=200)
            
            # Collected response
            return response.Response(data={'message': res}, status=200)
        else:
            return response.Response(data={'message':'You are not approved!'})


class PipeclamAPI(views.APIView):
    '''
    Endpoint can only be used
    if user is authenticated
    and if they are either an admin or belong to PIPECLAM group
    similar to dashboard
    '''
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (ClientAuthentication,)

    def get(self, request):
        # Collect together a response
        if (request.user.approved and
            (request.user.role == 'PIPECLAM' or request.user.role == 'ADMIN')):
            # Get all devices associated with user
            devices = Device.objects.filter(group=request.user.group)
            res = {}
            # Collect up astro cast data
            for device in devices:
                print(device)
                res[device.device_guid] = AstroCast().get_pipeclam_payload(device_guid=device)
            
            # Find user group
            return response.Response(data={'message': res}, status=200)
        else:
            return response.Response(data={'message':'You do not have access to this page!'})

            