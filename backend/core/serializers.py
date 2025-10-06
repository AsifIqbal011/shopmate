from django.db import transaction
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    full_name = serializers.CharField(required=True, write_only=True)
    phone = serializers.CharField(required=True, write_only=True)
    profile_pic = serializers.ImageField(required=False, write_only=True)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'password', 'email', 'full_name', 'phone', 'profile_pic')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        # Store profile data temporarily
        self.profile_data = {
            'full_name': attrs.pop('full_name'),
            'phone': attrs.pop('phone'),
            'profile_pic': attrs.pop('profile_pic', None)
        }
        return super().validate(attrs)

    @transaction.atomic
    def create(self, validated_data):
        # Create the user
        user = super().create(validated_data)
        # Create profile
        Profile.objects.create(user=user, **self.profile_data)
        return user


class CustomUserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='profile.phone', read_only=True)
    full_name = serializers.CharField(source='profile.full_name', read_only=True)
    profile_pic = serializers.ImageField(source='profile.profile_pic', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'phone', 'profile_pic')
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class ShopSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')  # read-only, automatically set

    class Meta:
        model = Shop
        fields = ['id', 'name', 'address', 'phone', 'shop_logo', 'email', 'owner']
        read_only_fields = ['id', 'owner']   

class ShopMembershipSerializer(serializers.ModelSerializer):
    shop = ShopSerializer(read_only=True)   # show full shop info when reading
    shop_id = serializers.PrimaryKeyRelatedField(  # accept shop id when creating
        queryset=Shop.objects.all(), source="shop", write_only=True
    )
    branch = serializers.StringRelatedField(read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(), source="branch", write_only=True, required=False
    )
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ShopMembership
        fields = ['id', 'user', 'shop', 'shop_id','branch', 'branch_id', 'role', 'status', 'created_at']
        read_only_fields = ['id', 'user', 'role', 'status', 'created_at']

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        validated_data["role"] = "employee"
        validated_data["status"] = "pending"
        return super().create(validated_data)



class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'
        read_only_fields = ['id', 'shop']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ["id", "shop", "created_at", "updated_at"]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    category = CategorySerializer(read_only=True)   # Show full category details
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['shop'] 

class SaleItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source="product"
    )
    product = ProductSerializer(read_only=True)
    class Meta:
        model = SaleItem
        fields = "__all__"
        read_only_fields = ["id", "sale"]

class SaleSerializer(serializers.ModelSerializer):
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        source="customer"
    )
    customer = CustomerSerializer(read_only=True)
    sale_items = SaleItemSerializer(many=True)

    # extra read-only fields for related names
    customer_name = serializers.CharField(source="customer.full_name", read_only=True)
    branch_name = serializers.CharField(source="branch.branch_name", read_only=True)
    employee_username = serializers.CharField(source="employee.username", read_only=True)

    class Meta:
        model = Sale
        fields = "__all__"  # still returns all fields (ids + extra names)
        read_only_fields = ["id", "shop", "employee", "created_at"]

    def create(self, validated_data):
        items_data = validated_data.pop("sale_items", [])
        sale = Sale.objects.create(**validated_data)
        for item_data in items_data:
            SaleItem.objects.create(sale=sale, **item_data)
        return sale

    def update(self, instance, validated_data):
        items_data = validated_data.pop("sale_items", None)

        # update sale fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()

        if items_data is not None:
            # clear old items & recreate
            instance.sale_items.all().delete()
            for item_data in items_data:
                SaleItem.objects.create(sale=instance, **item_data)

        return instance



class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['id', 'shop','created_at']