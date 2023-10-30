from django.urls import path
from . import apis

app_name='pages'

urlpatterns = [
    path('andrew_moore_and_associates/', apis.AMAAPI.as_view(), name='ama'),
    path('cma/', apis.CMAAPI.as_view(), name='cma'),
    path('pipeclam/', apis.PipeclamAPI.as_view(), name='pipeclam'),
]
