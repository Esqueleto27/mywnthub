# backend/tax_refund/urls.py

from django.urls import path
from .views import (
    SubmissionListCreateAPIView,
    TaxRefundConfigAPIView,
    PricingAPIView,
    ValidateCreatorAPIView,
    CheckoutAPIView,
)

urlpatterns = [
    # Público
    path("submissions/",           SubmissionListCreateAPIView.as_view(), name="submissions"),
    path("pricing/",               PricingAPIView.as_view(),             name="pricing"),
    path("validate-creator/",      ValidateCreatorAPIView.as_view(),     name="validate-creator"),
    path("checkout/",              CheckoutAPIView.as_view(),            name="checkout"),

    # Admin jefe
    path("admin/jefe/config/",     TaxRefundConfigAPIView.as_view(),     name="taxrefund-config"),
]
