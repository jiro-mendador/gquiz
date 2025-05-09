from rest_framework.response import Response
from rest_framework import status
from api.serializers import YearSectionSerializer
from api.models import YearSection

def get(request):
  # * FILTER
  section = request.GET.get('section')
  year = request.GET.get('year')

  if section and year:
      year_section = YearSection.objects.filter(section=section, year=year)
  elif section:
      year_section = YearSection.objects.filter(section=section)
  elif year:
      year_section = YearSection.objects.filter(year=year)
  # * IF NO FILTER
  else:
      year_section = YearSection.objects.all()

  serializer = YearSectionSerializer(year_section, many=True)
  return Response({
      "success": True,
      "message": "Year and section retrieved successfully",
      "data": serializer.data
  })
    
def post(request):
  serializer = YearSectionSerializer(data=request.data)
  print(serializer)
  if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Added successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
  return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def put(request, id=None):
   try:
      year_section = YearSection.objects.get(pk=id)
   except YearSection.DoesNotExist:
      return Response({"success": False, "message": "year and section not found"}, status=status.HTTP_404_NOT_FOUND)
  
   serializer = YearSectionSerializer(year_section, data=request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({"success": True, "message": "Updated successfully", "data": serializer.data})
   return Response({"success": False, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

def delete(id=None):
   try:
      year_section = YearSection.objects.get(pk=id)
      year_section.delete()
      return Response({"success": True, "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
   except YearSection.DoesNotExist:
      return Response({"success": False, "message": "year and section not found"}, status=status.HTTP_404_NOT_FOUND)
