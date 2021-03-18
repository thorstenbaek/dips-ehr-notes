import { writable, readable } from "svelte/store";
import v4 from "uuid";
import './SmartOnFhirStore';

export const user = readable(v4());
export const sidebar = writable(null);

function findEnvironmentName()
{
    var environmentName = window.location.hostname;

    if (window.location.port !== "")
    {
      console.log(`Adding port '${window.location.port}' to environmentName`);
      environmentName = environmentName + ":" + window.location.port;
    }

    return environmentName;
}

const configurationUrl = "https://raw.githubusercontent.com/thorstenbaek/dips-ehr-configuration/master/configuration.json";

export const settings = readable(
    null, set => {
        fetch(configurationUrl).then(
            response => {        
                response.json().then(                    
                    data => {        
                        const environmentName = findEnvironmentName() + "_ehr-notes";
                        let config = data.configurations.filter(c => c.environment == environmentName);
                        if (config.length == 0)
                        {
                            console.log(`No settings was found for environment: ${environmentName}. Using default settings`);    
                            config = data.configurations.filter(c => c.environment == "default");
                        }
                        
                        set(config[0].settings);
                    })
                });
    });
     










