
from datetime import timedelta
from pathlib import Path
import environ

from django.templatetags.static import static
# from dotenv import load_dotenv
import os

# load_dotenv()  # Load environment variables from a .env file if you're using one

env = environ.Env(DEBUG=(bool, False))

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(BASE_DIR / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = env('SECRET_KEY')
SECRET_KEY = 'django-insecure-+g6$j!i9b5)88sndq&!rbu_fkfeb8@i8t1&#20@6!e+pzyce^7'
# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = env('DEBUG')
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1','192.168.1.250', 'localhost','da7ye.pythonanywhere.com']
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True #yeeeeeeeeeeeeessssss


STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# CORS_ALOWED_ORIGINS = [
#     'http://localhost:3000/',
#     'http://192.168.100.29:3000/',
#     'http://127.0.0.1:3000/',
# ]

# Application definition

INSTALLED_APPS = [
    'unfold',
    'unfold.contrib.forms', 
    'unfold.contrib.import_export',  # optional, if django-import-export package is used

    'django_admin_tailwind',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

# # # maw mhim 3geb
    'tailwind',
#     'theme',
#     'django_browser_reload',
    # External Apps:
    'rest_framework',
    'rest_framework.authtoken',

    'corsheaders',
    'djoser',
    'rest_framework_simplejwt',

    'import_export',

    # internal Apps:
    'base',
    
    "phonenumber_field",

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware',

    "django_browser_reload.middleware.BrowserReloadMiddleware",

    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'jobLink.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            'base.theme',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'jobLink.wsgi.application'
# TAILWIND_APP_NAME = 'theme' # This is the name of the app that will be used to generate the tailwind files
# INTERNAL_IPS = ['127.0.0.1']
# NPM_BIN_PATH ='C:/Program Files/nodejs/npm.cmd'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_USER_MODEL = 'base.User'

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

UNFOLD = {
    "SITE_TITLE": ' ',
    "SITE_HEADER": 'linkJob',
    "SIDEBAR": {
        "show_search": True,  # Search in applications and models names
        "show_all_applications": True,  # Dropdown with all applications and models

    }
    # "SITE_ICON": {
    #     "light": lambda request: static("icon-light.svg"),  # light mode
    #     "dark": lambda request: static("icon-dark.svg"),  # dark mode
    # },
    #  "SITE_LOGO": {
    #     "light": lambda request: static("logo-light.svg"),  # light mode
    #     "dark": lambda request: static("logo-dark.svg"),  # dark mode
    # },

}
# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# STATIC_URL = 'static/'


MEDIA_URL = '/images/'

# STATICFILES_DIRS = [
#     BASE_DIR / 'static'
# ]

MEDIA_ROOT = 'static/images'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": (
        "Bearer",
        "JWT"),
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=120),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=60),
    # "SIGNING_KEY": env("SIGNING_KEY"),
    "SIGNING_KEY": "xGJlEF4PbAIMti0ubQxcAoLr2mCab2ll",
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}


DJOSER = {
    'LOGIN_FIELD': 'email',
    "USER_CREATE_PASSWORD_RETYPE": True,
    "USERNAME_CHANGED_EMAIL_CONFIRMATION": True,
    "PASSWORD_CHANGED_EMAIL_CONFIRMATION": True,
    "SEND_CONFIRMATION_EMAIL": True,
    "PASSWORD_RESET_CONFIRM_URL": "password/reset/confirm/{uid}/{token}",
    "SET_PASSWORD_RETYPE": True,
    "PASSWORD_RESET_CONFIRM_RETYPE": True,
    'USERNAME_RESET_CONFIRM_URL': 'username/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': True,
    'SERIALIZERS': {
        'user_create': 'base.serializers.CreateUserSerializer',
        'user': 'base.serializers.CustomUserSerializer',
        'current_user': 'base.serializers.CustomUserSerializer',
        'user_delete': 'djoser.serializers.UserDeleteSerializer',
    },  
}

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST = env("EMAIL_HOST")
EMAIL_HOST = "sandbox.smtp.mailtrap.io"
EMAIL_USE_TLS = True
# EMAIL_PORT = env("EMAIL_PORT")
EMAIL_PORT = "2525"
# EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_USER = "sandbox.smtp.mailtrap.io"
# EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
EMAIL_HOST_PASSWORD = "1a139e3f4d751f"

DEFAULT_FROM_EMAIL = "info@jobLink.com"
# DOMAIN = env("DOMAIN")
DOMAIN = "localhost:3000"

SITE_NAME = "jobLink"