from django.db import transaction
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import *

User = get_user_model()

# ---------------- User ----------------
class CustomUserCreateSerializer(UserCreateSerializer):
    full_name = serializers.CharField(required=True, write_only=True)
    phone = serializers.CharField(required=True, write_only=True)
    profile_pic = serializers.ImageField(required=False, write_only=True)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'password', 'email', 'full_name', 'phone', 'profile_pic')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        self.profile_data = {
            'full_name': attrs.pop('full_name'),
            'phone': attrs.pop('phone'),
            'profile_pic': attrs.pop('profile_pic', None)
        }
        return super().validate(attrs)

    @transaction.atomic
    def create(self, validated_data):
        user = super().create(validated_data)
        Profile.objects.create(user=user, **self.profile_data)
        return user

class CustomUserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='profile.phone', read_only=True)
    full_name = serializers.CharField(source='profile.full_name', read_only=True)
    profile_pic = serializers.ImageField(source='profile.profile_pic', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'phone', 'profile_pic')

# ---------------- Profile ----------------
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

# ---------------- Shop ----------------
class ShopSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')

    class Meta:
        model = Shop
        fields = ['id', 'name', 'address', 'phone', 'shop_logo', 'email', 'owner']
        read_only_fields = ['id', 'owner']

class ShopMembershipSerializer(serializers.ModelSerializer):
    shop = ShopSerializer(read_only=True)
    shop_id = serializers.PrimaryKeyRelatedField(queryset=Shop.objects.all(), source="shop", write_only=True)

    class Meta:
        model = ShopMembership
        fields = ['id', 'user', 'shop', 'shop_id', 'role', 'joined_at']
        read_only_fields = ['id', 'user', 'joined_at']

# ---------------- Branch / Customer / Category / Product ----------------
class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source="category", write_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['shop']

# ---------------- SaleItem ----------------
class SaleItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source="product"
    )
    name = serializers.CharField(write_only=True, required=False)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    class Meta:
        model = SaleItem
        fields = ['id', 'product_id', 'name', 'price', 'quantity', 'sale']
        read_only_fields = ['id', 'sale']


# ---------------- Sale ----------------
# serializers.py
class SaleSerializer(serializers.ModelSerializer):
    sale_items = SaleItemSerializer(many=True)
    customer = CustomerSerializer()

    class Meta:
        model = Sale
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        customer_data = validated_data.pop('customer')
        items_data = validated_data.pop('sale_items')
        shop = validated_data.get('shop')

        # Create/Get Customer
        customer, _ = Customer.objects.get_or_create(
            phone=customer_data.get('phone'),
            defaults={
                'full_name': customer_data.get('full_name', ''),
                'email': customer_data.get('email', ''),
                'shop': shop
            }
        )

        # Create Sale
        sale = Sale.objects.create(customer=customer, shop=shop, **validated_data)

        # Create SaleItems
        for item in items_data:
            if 'product' in item:  # linked product
                SaleItem.objects.create(sale=sale, product=item['product'], quantity=item['quantity'], price=item.get('price', item['product'].price))
            else:  # custom item
                SaleItem.objects.create(sale=sale, name=item.get('name'), price=item.get('price', 0), quantity=item['quantity'])

        return sale

    @transaction.atomic
    def create(self, validated_data):
        customer_data = validated_data.pop('customer')
        items_data = validated_data.pop('sale_items')
        shop = validated_data.get('shop')

        # Create or get customer
        customer, created = Customer.objects.get_or_create(
            phone=customer_data.get('phone'),
            defaults={
                'full_name': customer_data.get('full_name'),
                'email': customer_data.get('email', ''),
                'shop': shop
            }
        )

        sale = Sale.objects.create(customer=customer, shop=shop, **validated_data)

        for item_data in items_data:
            SaleItem.objects.create(sale=sale, **item_data)

        return sale

# ---------------- Invoice ----------------
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

# ---------------- Expense ----------------
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['id', 'shop', 'created_at']


