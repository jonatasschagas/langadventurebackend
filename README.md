#Lang Adventure Backend

# Deploying function/endpoint

Go to the function folder and run the commands below.

Function:
``
    serverless function deploy
``

Endpoint:
``
    serverless endpoint deploy
``

# Deploying resources (policies, etc):

Go to the project resources and execute:

``
    serverless resources deploy
``

# Testing the function

Go to the project root and execute:

``
    sls function run <componentName>/<moduleName>/<functionName>
``

This command will use the event.json file as the input of the function.

# More documentation here:
http://docs.serverless.com/docs/commands-overview