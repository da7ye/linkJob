from django.contrib import admin
from django.utils.html import format_html

from base.forms import CustomUserChangeForm, CustomUserCreationForm
from .models import Category, User, Worker, Review, ExtraImage, Language, Education, Certificate
from import_export.admin import ImportExportModelAdmin
from unfold.admin import ModelAdmin
from unfold.contrib.import_export.forms import ExportForm, ImportForm
from django.utils.translation import gettext_lazy as _


class UserAdmin(ModelAdmin, ImportExportModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    ordering = ["email"]
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ["icon","email", "first_name", "last_name", "is_staff", "is_active"]
    list_display_links = ["email"]
    list_filter = ["email", "first_name", "last_name", "is_staff", "is_active"]
    search_fields = ["email", "first_name", "last_name"]

    def icon(self, obj):
        return format_html('<span class="material-symbols-outlined">person</span>') 
    
    fieldsets = (
        (
            _("Login Credentials"), {
                "fields": ("email", "password",)
            }, 
        ),
        (
            _("Personal Information"),
            {
                "fields": ('first_name', 'last_name',)
            },
        ),
        (
            _("Permissions and Groups"),
            {
                "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")
            },
        ),
        (
            _("Important Dates"),
            {
                "fields": ("last_login",)
            },
        ),
    )
    add_fieldsets = (
            (None, {
                "classes": ("wide",),
                "fields": ("email", "first_name", "last_name", "password1", "password2", "is_staff", "is_active"),
            },),
        )
class CategoryAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ["icon", "title", "description", "date_posted"]
    search_fields = ["title", "description"]
    
    def icon(self, obj):
        return format_html('<span class="material-icons">category</span>')

class WorkerAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ["icon", "user", "rating", "numReviews", "pricePerHour", "gender", "num_tel"]
    list_filter = ["categories", "gender"]
    search_fields = ["user__email", "num_tel", "small_description", "description"]

    def icon(self, obj):
        return format_html('<span class="material-symbols-outlined">person</span>')

class ReviewAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ["icon", "reviewer", "worker", "rating", "createdAt"]
    list_filter = ["rating"]
    search_fields = ["reviewer__email", "worker__user__email", "comment"]

    def icon(self, obj):
        return format_html('<span class="material-icons">rate_review</span>')

class ExtraImageAdmin(ModelAdmin, ImportExportModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    list_display = ["icon", "worker", "image"]
    search_fields = ["worker__user__email"]

    def icon(self, obj):
        return format_html('<span class="material-icons">image</span>')

class LanguageAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ["icon", "name", "worker"]
    search_fields = ["name", "worker__user__email"]

    def icon(self, obj):
        return format_html('<span class="material-icons">language</span>')

class EducationAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ["icon", "title", "institution", "date_started", "date_ended", "worker"]
    search_fields = ["title", "institution", "worker__user__email"]

    def icon(self, obj):
        return format_html('<span class="material-icons">school</span>')

class CertificateAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ["icon", "title", "issued_by", "date_issued", "worker"]
    search_fields = ["title", "issued_by", "worker__user__email"]

    def icon(self, obj):
        return format_html('<span class="material-icons">verified</span>')

# Register the models with their custom admin classes


admin.site.register(User, UserAdmin )
admin.site.register(Category, CategoryAdmin)
admin.site.register(Worker, WorkerAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(ExtraImage, ExtraImageAdmin)
admin.site.register(Language, LanguageAdmin)
admin.site.register(Education, EducationAdmin)
admin.site.register(Certificate, CertificateAdmin)
