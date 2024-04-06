from app import app

# Test if the index page returns a 200 status code
def test_index():
    with app.test_client() as client:
        response = client.get('/')
        assert response.status_code == 200

# Test if the index page contains the expected content
def test_index_content():
    with app.test_client() as client:
        response = client.get('/')
        assert b"Hello From Lebentest Quiz App" in response.data
