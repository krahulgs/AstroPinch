
try:
    import pytz
    print("pytz imported successfully")
except ImportError:
    print("pytz NOT found")

try:
    from skyfield.api import load
    print("skyfield imported successfully")
except ImportError:
    print("skyfield NOT found")
