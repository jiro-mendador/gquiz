"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
# ! DEPRECATED: from django.conf.urls import url
from django.urls import path, re_path
from api import views

urlpatterns = [
    # path('user',views.userApi), # ? Matches /user or /user/
    # ? USE RE_PATH FOR REGEX
    re_path(r'^user$',views.user), # ? Matches /user only
    re_path(r'^user/login$',views.user_login), # ? Matches /user only
    re_path(r'^user/([0-9]+)$',views.user),
    re_path(r'^course$',views.course), 
    re_path(r'^course/([0-9]+)$',views.course),
    re_path(r'^year-section$',views.year_section), 
    re_path(r'^year-section/([0-9]+)$',views.year_section),
    re_path(r'^subject$',views.subject), 
    re_path(r'^subject/([0-9]+)$',views.subject),
    re_path(r'^student-course-year-section$',views.studentCourseYearSection), 
    re_path(r'^student-course-year-section/([0-9]+)$',views.studentCourseYearSection),
    re_path(r'^quiz$',views.quiz), 
    re_path(r'^quiz/([0-9]+)$',views.quiz),
    re_path(r'^quiz-question$',views.quizQuestion), 
    re_path(r'^quiz-question/([0-9]+)$',views.quizQuestion),
    re_path(r'^quiz-question-choice$',views.quizQuestionChoice), 
    re_path(r'^quiz-question-choice/([0-9]+)$',views.quizQuestionChoice),
    re_path(r'^quiz-attempt$',views.quizAttempt), 
    re_path(r'^quiz-attempt/([0-9]+)$',views.quizAttempt),
    re_path(r'^quiz-submission$',views.quizSubmission), 
    re_path(r'^quiz-submission/([0-9]+)$',views.quizSubmission),
    re_path(r'^generate$',views.generate_question),
    path('admin/', admin.site.urls),
]
