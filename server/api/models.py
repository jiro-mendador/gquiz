from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    )
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    middle_name = models.CharField(max_length=50, blank=True)
    email = models.EmailField(max_length=50, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    # Override groups and user_permissions to set unique related_name
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_groups',  # Unique related_name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_permissions',  # Unique related_name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return f"{self.first_name} ({self.role})"


class Course(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class YearSection(models.Model):
    year = models.PositiveIntegerField()
    section = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.year}-{self.section}"
      
    class Meta:
        unique_together = ('year', 'section')


class Subject(models.Model):
    subject_code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=150)
    teacher = models.ForeignKey(User, limit_choices_to={'role': 'teacher'}, on_delete=models.CASCADE)

    def __str__(self):
        return self.subject_code
      
    class Meta:
        unique_together = ('subject_code', 'teacher')


class StudentCourseYearSectionSubject(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    year_section = models.ForeignKey(YearSection, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    student = models.ForeignKey(User, limit_choices_to={'role': 'student'}, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.course} - {self.year_section} - {self.subject}"

class Quiz(models.Model):
    # time_limit_minutes = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(180)])
    time_limit_minutes = models.PositiveIntegerField()
    quiz_date = models.DateTimeField(blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    title = models.CharField(max_length=150, unique=True, default="")

    def __str__(self):
        return f"Quiz for {self.subject} on {self.created_at}"
      
    class Meta:
        unique_together = ('title', 'quiz_date', 'subject')

class QuizQuestion(models.Model):
    QUESTION_TYPE_CHOICES = (
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('identification', 'Identification'),
        ('essay', 'Essay'),
    )
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES)

    def __str__(self):
        return f"Question {self.id} for {self.quiz}"

class QuizChoice(models.Model):
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE)
    choice = models.TextField()
    is_correct = models.BooleanField()

    def __str__(self):
        return f"Choice for Question {self.question.id}"


class QuizAttempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE)
    student = models.ForeignKey(Course, limit_choices_to={'role': 'student'}, on_delete=models.CASCADE)
    answer = models.ForeignKey(QuizChoice, null=True, blank=True, on_delete=models.SET_NULL)
    attempt_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username}'s attempt on Q{self.question.id}"