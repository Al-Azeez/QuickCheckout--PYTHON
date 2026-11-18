from django.urls import path
from api.views import (
    HealthCheckView,
    RegisterView, LoginView, RefreshTokenView, UserProfileView, ForgotPasswordView,
    ProductListView, ProductDetailView, CategoriesView,
    BarcodeLookupView, BarcodeScanView,
    CartView, AddToCartView, UpdateCartItemView, RemoveCartItemView, ClearCartView,
    OrderCreateView, OrderListView, OrderDetailView,
    PaymentCreateView, PaymentVerifyView, PaymentWebhookView,
    AdminAnalyticsView, AdminInventoryView, AdminCustomersView, AdminTransactionsView
)

urlpatterns = [
    # Health check
    path('health/', HealthCheckView.as_view(), name='health'),

    # Authentication
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/refresh/', RefreshTokenView.as_view(), name='auth_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='auth_profile'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='auth_forgot_password'),

    # Products & Categories
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/<str:id>/', ProductDetailView.as_view(), name='product_detail'),
    path('categories/', CategoriesView.as_view(), name='categories'),

    # Barcode Exact Lookup & Scanning (CRITICAL ADMIN-CUSTOMER INTEGRATION)
    path('products/barcode/<str:barcode>/', BarcodeLookupView.as_view(), name='barcode_lookup'),
    path('products/scan/', BarcodeScanView.as_view(), name='barcode_scan'),

    # Smart Cart
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='cart_add'),
    path('cart/update/', UpdateCartItemView.as_view(), name='cart_update'),
    path('cart/remove/', RemoveCartItemView.as_view(), name='cart_remove'),
    path('cart/clear/', ClearCartView.as_view(), name='cart_clear'),

    # Orders & Digital Receipts
    path('orders/', OrderListView.as_view(), name='order_list'),
    path('orders/create/', OrderCreateView.as_view(), name='order_create'),
    path('orders/<str:id>/', OrderDetailView.as_view(), name='order_detail'),

    # Payments (Razorpay & UPI)
    path('payments/create/', PaymentCreateView.as_view(), name='payment_create'),
    path('payments/verify/', PaymentVerifyView.as_view(), name='payment_verify'),
    path('payments/webhook/', PaymentWebhookView.as_view(), name='payment_webhook'),

    # Administrator Management & Analytics
    path('analytics/', AdminAnalyticsView.as_view(), name='admin_analytics'),
    path('inventory/', AdminInventoryView.as_view(), name='admin_inventory'),
    path('customers/', AdminCustomersView.as_view(), name='admin_customers'),
    path('transactions/', AdminTransactionsView.as_view(), name='admin_transactions'),
]
