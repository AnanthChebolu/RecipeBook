python3.10 -m virtualenv -p `which python3.10` venv

source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate