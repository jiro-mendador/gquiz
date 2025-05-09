from rest_framework.response import Response
from rest_framework import status
from api.serializers import SubjectSerializer
from api.models import Subject

def get(request):
  subject = Subject.objects.all()
  serializer = SubjectSerializer(subject, many=True)
  return Response({"success": True, "message": "All Subject retrieved successfully", "data": serializer.data})

def post(request):
  serializer = SubjectSerializer(data=request.data)
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      subject = Subject.objects.get(pk=id)
   except Subject.DoesNotExist:
      return Response({"success": False, "message": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = SubjectSerializer(subject, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      subject = Subject.objects.get(pk=id)
      subject.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except Subject.DoesNotExist:
      return Response({"success": False, "message": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)
