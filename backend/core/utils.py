from .models import *

def get_user_shop(user):
    shop = Shop.objects.filter(owner=user).first()
    if shop:
        return shop

    membership = ShopMembership.objects.filter(user=user, status="approved").first()
    if membership:
        return membership.shop

    return None
