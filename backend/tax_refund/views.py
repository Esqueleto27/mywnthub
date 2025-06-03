import os
import stripe
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import (
    Submission,
    TaxRefundConfig,
    ServicePricing,
    CreatorCode,
)
from .serializers import (
    SubmissionSerializer,
    TaxRefundConfigSerializer,
    ServicePricingSerializer,
)

# 1) Submissions públicos
class SubmissionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Submission.objects.all().order_by("-created_at")
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.AllowAny]

# 2) Config singleton (admin jefe)
class TaxRefundConfigAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def _check_admin(self, request):
        role = request.GET.get("role")
        auth = request.headers.get("Authorization", "")
        return role == "admin" or auth == "Bearer admin"

    def get(self, request):
        if not self._check_admin(request):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        config = TaxRefundConfig.get_solo()
        serializer = TaxRefundConfigSerializer(config)
        return Response(serializer.data)

    def post(self, request):
        if not self._check_admin(request):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        config = TaxRefundConfig.get_solo()
        serializer = TaxRefundConfigSerializer(config, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

# 3) Precios de servicio (público)
class PricingAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        service = request.data.get("service")
        try:
            sp = ServicePricing.objects.get(service_type=service)
        except ServicePricing.DoesNotExist:
            return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)
        data = ServicePricingSerializer(sp).data
        return Response({
            "basePrice": data["base_price"],
            "promoPrice": data["promo_price"],
            "promoEndsAt": data["promo_ends_at"],
            "creatorDiscount": data["creator_discount"],
            "addressFee": data["address_fee"],
        })

# 4) Validar código de creador (público)
class ValidateCreatorAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get("code")
        try:
            cc = CreatorCode.objects.get(pk=code, active=True)
        except CreatorCode.DoesNotExist:
            return Response({"valid": False})
        if cc.usage_limit is not None and cc.usage_limit <= 0:
            return Response({"valid": False})
        return Response({"valid": True, "discount": float(cc.discount)})

# 5) Checkout Stripe (si ya lo tienes)
class CheckoutAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        service      = request.data.get("service")
        creator_code = request.data.get("creatorCode")
        use_address  = request.data.get("useAddressFee", False)

        try:
            sp = ServicePricing.objects.get(service_type=service)
        except ServicePricing.DoesNotExist:
            return Response({"detail": "Service not found."}, status=status.HTTP_404_NOT_FOUND)

        price = sp.current_price()

        if creator_code:
            try:
                cc = CreatorCode.objects.get(code=creator_code, active=True)
            except CreatorCode.DoesNotExist:
                return Response({"detail": "Invalid creator code."}, status=status.HTTP_400_BAD_REQUEST)
            if cc.usage_limit is not None and cc.usage_limit <= 0:
                return Response({"detail": "Creator code usage exhausted."}, status=status.HTTP_400_BAD_REQUEST)
            price -= cc.discount
            cc.use()

        if use_address and sp.address_fee:
            price += sp.address_fee

        amount_cents = int(price * 100)

        stripe.api_key = os.getenv("STRIPE_SECRET_KEY", settings.STRIPE_SECRET_KEY)
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": f"{service} service"},
                        "unit_amount": amount_cents,
                    },
                    "quantity": 1,
                }],
                mode="payment",
                success_url=request.build_absolute_uri("/success/"),
                cancel_url=request.build_absolute_uri("/cancel/"),
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"url": session.url})
