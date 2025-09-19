from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register([  Profile,
    Shop,
    ShopMembership,
    Branch,
    Category,
    Product,
    Customer,
    Sale,
    SaleItem,
    Invoice])