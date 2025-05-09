<!-- * STEPS ON TERMINAL FOR SETTING UP -->
1. python -m venv env
2.  .\env\Scripts\activate
  <!-- ? WHEN YOU SEE THIS YOU'RE GOOD TO GO -->
  (env) PS D:\WebDev\MERN-COMMS\Python\GQUIZ>
<!-- ! (install pip first if it is not available on your machine) -->
3. pip install django
4. pip install pymysql
5. django-admin startproject server
6. python manage.py startapp main
7. server/settings > add on this array the 'api' INSTALLED_APPS = [..., 'api']
8. pip install django-cors-headers
9. pip install djangorestframework
10. server/settings > add on this array the 'corsheaders', 'rest_framework' on 
  INSTALLED_APPS = [..., 'corsheaders', 'rest_framework']
10. server/settings > add on this array the  'corsheaders.middleware.CorsMiddleware' on
  MIDDLEWARE = [..., 'corsheaders.middleware.CorsMiddleware']
11. server/settings type:
  CORS_ORIGIN_ALLOW_ALL = True
  CORS_ALLOW_ALL_HEADERS=True
12. create api/serializers.py and type
  from rest_framework import serializers
  from api.models import User

  class UserSerializer(serializers.ModelSerializer):
      class Meta:
          model = User
          fields = '__all__'
13. pip install dj-database-url
14. pip install mysqlclient
15. add this on server/settings.py between DATABASES = []
  import dj_database_url
  DATABASES = [...]
  DATABASES['default'] = dj_database_url.parse('mysql://root@localhost/gquiz')