from django.contrib import admin

from . import models

from django.contrib.auth.models import Permission

# admin.py
from django.contrib import admin

class ClientAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'email',
        'first_name',
        'last_name',
        'group',
        'approved',
        'is_staff',
        'role',
        )


admin.site.register(models.Client, ClientAdmin)
admin.site.register(Permission)
admin.site.register(models.Tag)
admin.site.register(models.Device)