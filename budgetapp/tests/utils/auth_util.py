from budgetapp.urls import app_name
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status

# Model Names
BUDGET_NAME = 'budget'
CATEGORY_NAME = 'budgetcategory'
CATEGORYBUDGETGROUP_NAME = 'budgetcategorygroup'
TRANSACTION_NAME = 'transaction'
USER_NAME = 'user'

# Test Data
post_data = {
    BUDGET_NAME: {
        'month': 'JAN',
        'year': 2017,
    },
    CATEGORY_NAME: {
        'budget_month': 'JAN',
        'budget_year': 2017,
        'group': 'test',
        'category': 'Groceries',
    },
    CATEGORYBUDGETGROUP_NAME: {
        'name': 'test',
        'budget': '',
    },
    USER_NAME: {
        'username': 'test',
        'email': 'test@test.com',
        'password': 'test',
    }
}
test_users = [
    {'username': 'test0', 'email': 'test0@test.com', 'password': 'test0'},
    {'username': 'test1', 'email': 'test1@test.com', 'password': 'test1'},
]


# ---------- LIST ------------- #


def list_test(client, model_name, auth=False, test_user_index=0):
    url = get_url(model_name, 'list')
    if auth:
        login_test_user(client, test_user_index)
    response = client.get(url)
    client.logout()
    return response


# ----------- POST ------------ #


def post_test(client, model_name, auth=False, test_user_index=0):
    url = get_url(model_name, 'list')
    if auth:
        login_test_user(client, test_user_index)
    response = client.post(url, post_data[model_name])
    client.logout()
    return response


# ------------ DETAIL ------------ #


def detail_test(client, model_name, auth=False, test_user_index=0):
    response = create_test_model(client, model_name, test_user_index)
    if auth:
        login_test_user(client, test_user_index)
    response = client.get(response.data['url'])
    client.logout()
    return response


def detail_cross_user_test(client, model_name):
    """
    Creates a model with one test user, then tries to retrieve it with another
    :param client:
    :param model_name:
    :return: The response
    """
    response = create_test_model(client, model_name, 0)
    login_test_user(client, 1)
    response = client.get(response.data['url'])
    client.logout()
    return response


# ------------- PUT --------------- #


def put_test(client, model_name, auth=False, test_user_index=0):
    response = create_test_model(client, model_name, test_user_index)
    if auth:
        login_test_user(client, test_user_index)
    response = client.put(response.data['url'], post_data[model_name])
    client.logout()
    return response


def put_cross_user_test(client, model_name):
    """
    Creates a model with one test user, then tries to update it with another
    :param client:
    :param model_name:
    :return: The response
    """
    response = create_test_model(client, model_name, 0)
    login_test_user(client, 1)
    response = client.put(response.data['url'], post_data[model_name])
    client.logout()
    return response


# ------------ DELETE --------------- #


def delete_test(client, model_name, auth=False, test_user_index=0):
    response = create_test_model(client, model_name, test_user_index)
    if auth:
        login_test_user(client, test_user_index)
    response = client.delete(response.data['url'])
    client.logout()
    return response


def delete_cross_user_test(client, model_name):
    response = create_test_model(client, model_name, 0)
    login_test_user(client, 1)
    response = client.delete(response.data['url'])
    client.logout()
    return response


# ------- Helper Functions ------- #


def create_test_users():
    """
    Creates test users from test_users data
    """
    for test_user in test_users:
        User.objects.create_user(username=test_user['username'],
                                 email=test_user['email'],
                                 password=test_user['password'])


def login_test_user(client, index=0):
    """
    Logs in selected test user
    :param client:
    :param index: The index of the desired user in test_users
    :return:
    """
    user = User.objects.get(username=test_users[index]['username'])
    if user is None:
        raise Exception('Test user does not exist')
    client.force_login(user)


def create_test_model(client, model_name, test_user_index=0):
    """
    Logs in as test user (create_test_users must be called first) and
    calls the test model function corresponding to the given name
    :param client:
    :param model_name: Name of the model to be created
    :param test_user_index: Index of the user to create the object with
    :return: The post response
    """
    login_test_user(client, test_user_index)

    url = get_url(model_name, 'list')
    test_data = post_data[model_name]

    response = client.post(url, test_data)
    if response.status_code != status.HTTP_201_CREATED:
        raise Exception('Test ' + model_name + ' could not be created: ' +
                        str(response.data))

    client.logout()

    return response


def get_url(model_name, suffix, args=[]):
    return reverse('{}:{}-{}'.format(app_name, model_name, suffix), args=args)
