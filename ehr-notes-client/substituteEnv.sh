#!/bin/bash
if [[ -z $1 ]]; then
    echo 'ERROR: No target file given.'
    exit 1
fi

echo 'substituting $CONFIG_URL in ' $1
#Substitute all environment variables defined in the file given as argument
envsubst '\$CONFIG_URL'<$1 > $2

rm $1

# Execute all other parameters
exec "${@:3}"