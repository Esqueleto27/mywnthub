"""
URL configuration for mywnthub project.

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
from django.urls import path, include
from tax_refund.views import TaxRefundConfigAPIView

urlpatterns = [
    # Panel de Django
    path("admin/", admin.site.urls),

    # Rutas del módulo tax_refund
    path("api/tax-refund/", include("tax_refund.urls")),

    # Ruta adicional para admin jefe EXACTA
    path(
        "api/admin/tax-refund/jefe/config/",
        TaxRefundConfigAPIView.as_view(),
        name="taxrefund-config-admin"
    ),
]