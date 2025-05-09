from rest_framework.response import Response
from rest_framework import status
from api.serializers import UserSerializer
from api.models import User
from django.contrib.auth import authenticate, login

def user_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"success": False, "message": "email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, email=email, password=password)
    
    print("USER", user)
    
    if user is not None:
        login(request, user)
        return Response({
            "success": True,
            "message": "Login successful",
            "user_id": user.id,
            "last_login": user.last_login,
            "role": user.role
        })
    else:
        return Response({"success": False, "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

def get(request):
  users = User.objects.all()
  serializer = UserSerializer(users, many=True)
  return Response({"success": True, "message": "All users retrieved successfully", "data": serializer.data})

def post(request):
  serializer = UserSerializer(data=request.data)
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      user = User.objects.get(pk=id)
   except User.DoesNotExist:
      return Response({"success": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = UserSerializer(user, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      user = User.objects.get(pk=id)
      user.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except User.DoesNotExist:
      return Response({"success": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
