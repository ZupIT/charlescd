# CharlesCD Compass breaking change


## What have changed?

Compass now encrypts fields containing configuration data on the database, with that you won't be able to use the metric providers already registered.

## I need to register my providers again?

No, we wrote a script, so you can use the providers that already had been registered.

## How the scripts works?

It's sql file that you need to execute on your compass database. When executed the script will ask for a private key to encrypt your data(We recommend to use password generator).
The script can be found on compass resources folder.

## Private key, what is that?

Now we use a private key to encrypt your data, you will need to set that as environment variable. Remember choose a strong key that you will utilize for both cases(Script end Environment Variable)

