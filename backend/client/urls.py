from django.urls import path
from . import apis

app_name='client'

urlpatterns = [
    path('register/', apis.RegisterAPI.as_view(), name='register'),
    path('login/', apis.LoginAPI.as_view(), name='login'),
    path('dashboard/', apis.DashboardAPI.as_view(), name='dashboard'),
    path('logout/', apis.LogoutAPI.as_view(), name='logout'),
]


'''
{
"email":"admin@admin.com",
"password":"admin"
}

'''