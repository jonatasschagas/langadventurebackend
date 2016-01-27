import requests
import json

print requests.post('https://66sp6bo1pi.execute-api.us-east-1.amazonaws.com/development/client_version/create',data=json.dumps({'alias': 'v1.0.2', 'active': True}), headers={'content-type':'application/json'}).text