from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
      email = kwargs.get('email', email)
      print("AUTHENTICATING with email:", email)  # Debug line
      try:
          user = User.objects.get(email=email)
      except User.DoesNotExist:
          print("User not found")
          return None

      if user.check_password(password) and self.user_can_authenticate(user):
          print("Password matched!")
          return user
      print("Password mismatch or user inactive")
      return None
