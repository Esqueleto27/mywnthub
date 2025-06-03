import uuid
from django.db import models
from django.utils import timezone

SERVICE_CHOICES = [
    ("file", "File my U.S. Non-Resident Taxes"),
    ("amend", "Amend my U.S. Taxes"),
]

class Submission(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    email      = models.EmailField()
    pdf_file   = models.FileField(upload_to="submissions/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"

class TaxRefundConfig(models.Model):
    file_price        = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    amend_price       = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    locker_price      = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    justfederal_price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)  # <-- añadimos default

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return f"Config(file={self.file_price}, amend={self.amend_price}, locker={self.locker_price})"

class ServicePricing(models.Model):
    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    service_type     = models.CharField(max_length=10, choices=SERVICE_CHOICES)
    base_price       = models.DecimalField(max_digits=7, decimal_places=2)
    promo_price      = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    promo_ends_at    = models.DateTimeField(null=True, blank=True)
    creator_discount = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    address_fee      = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    def current_price(self):
        now = timezone.now()
        if self.promo_price and self.promo_ends_at and now < self.promo_ends_at:
            return self.promo_price
        return self.base_price

    def __str__(self):
        return f"{self.service_type} @ {self.current_price()}"

class CreatorCode(models.Model):
    code         = models.CharField(max_length=32, primary_key=True)
    discount     = models.DecimalField(max_digits=6, decimal_places=2)
    usage_limit  = models.IntegerField(null=True, blank=True)
    active       = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    def use(self):
        if self.usage_limit is not None:
            self.usage_limit -= 1
            if self.usage_limit <= 0:
                self.active = False
            self.save()

    def __str__(self):
        status = "active" if self.active else "inactive"
        return f"{self.code} ({status})"
