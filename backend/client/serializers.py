from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from . import models, services

class ClientSerializer(serializers.ModelSerializer):

    # Serializer fields
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField(write_only=True)
    # Validate email uniqueness
    email = serializers.EmailField(validators=[UniqueValidator(queryset=models.Client.objects.all())])
    role = serializers.CharField()

    
    def to_internal_value(self, data):
        data = super().to_internal_value(data)

        return services.ClientDataClass(**data)

    class Meta:
        model = models.Client
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'role',)
   

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tag
        fields = '__all__'
        read_only_fields = ('name',)  # Make 'name' field read-only