from .models import *

def get_user_shop_and_branch(user):
    # Owner → no branch restriction
    shop = Shop.objects.filter(owner=user).first()
    branch = None

    if not shop:
        membership = ShopMembership.objects.filter(user=user, status="approved").select_related("branch", "shop").first()
        if membership:
            shop = membership.shop
            branch = membership.branch

    return shop, branch

