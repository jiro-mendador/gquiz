from rest_framework import serializers
from api.models import User, Course, YearSection, Subject

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # 🔐 this hashes the password
        user.save()
        return user
      
    def update(self, instance, validated_data):
      password = validated_data.pop('password', None)  # safely remove password
      for attr, value in validated_data.items():
          setattr(instance, attr, value)
      
      if password:
          instance.set_password(password)  # 🔐 hash the new password

      instance.save()
      return instance

        
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        
class YearSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = YearSection
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'