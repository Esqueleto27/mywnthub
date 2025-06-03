from django.contrib import admin
from .models import Submission, TaxRefundConfig

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "email", "created_at")
    readonly_fields = ("id", "created_at")

@admin.register(TaxRefundConfig)
class TaxRefundConfigAdmin(admin.ModelAdmin):
    list_display = ("file_price", "amend_price", "locker_price")
    def has_add_permission(self, request):
        # Evitar crear más de un registro
        return not TaxRefundConfig.objects.exists()
