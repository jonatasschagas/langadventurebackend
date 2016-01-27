import requests

print requests.get('https://66sp6bo1pi.execute-api.us-east-1.amazonaws.com/development/client_version/get?alias=v1.0.1', headers={'content-type': 'application/json'}).text