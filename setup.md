<!-- * STEPS ON TERMINAL -->
1. python -m venv env
2.  .\env\Scripts\activate
  <!-- ? WHEN YOU SEE THIS YOU'RE GOOD TO GO -->
  (env) PS D:\WebDev\MERN-COMMS\Python\GQUIZ>
<!-- ! (install pip first if it is not available on your machine) -->
3. pip install django 
<!-- ? gquiz is the name of your project folder you can name it anything you want -->
4. django-admin startproject gquiz 
5. cd gquiz (or name of your project)
<!-- ? this wil create an app called main -->
6. python manage.py startapp main
7. go to gquiz folder > setings.py > INSTALLED_APPS = ['main'] and put 'main' or the name of app we created <!-- ! REPEAT WHENEVER YOU CREATE AN APP -->

<!-- ? on root level folder (to start development server) -->
python .\manage.py runserver