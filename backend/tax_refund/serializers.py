from rest_framework import serializers
from .models import (
    Submission,
    TaxRefundConfig,
    ServicePricing,
    CreatorCode,
)

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = "__all__"

class TaxRefundConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRefundConfig
        fields = [
            "file_price",
            "amend_price",
            "locker_price",
            "justfederal_price",  # añade aquí
        ]

class ServicePricingSerializer(serializers.ModelSerializer):
    current_price = serializers.SerializerMethodField()

    class Meta:
        model = ServicePricing
        fields = [
            "service_type",
            "base_price",
            "promo_price",
            "promo_ends_at",
            "creator_discount",
            "address_fee",
            "current_price",
        ]

    def get_current_price(self, obj):
        return obj.current_price()

class CreatorCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreatorCode
        fields = ["code", "discount", "usage_limit", "active"]
