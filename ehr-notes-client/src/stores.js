import { readable, writable, derived } from "svelte/store";
import v4 from "uuid";
import './SmartOnFhirStore';

export const user = readable(v4());
export const sidebar = writable(null);

const defaultConfigurationUrl = "https://raw.githubusercontent.com/thorstenbaek/sandbox-environments/master";
const ThisSystemName = ".dips-ehr-notes.";

export const configUrl = readable(null, set => {
    if (window.CONFIG_URL && window.CONFIG_URL != "${CONFIG_URL}") {
        console.log("Using env var", window.CONFIG_URL)
        set(window.CONFIG_URL);        
    } else {
        // CONFIG_URL not resolved - using default
        console.log("CONFIG_URL not set. Using default config url:", defaultConfigurationUrl)
        set(defaultConfigurationUrl);	
    }
});

function findDomain() {
    const name = window.location.hostname;
    console.log("HostName", window.location.hostname);

    const index = name.lastIndexOf(ThisSystemName);
    var domainName = name;
    
    if (index >= 0) {
        domainName = name.substring(index + ThisSystemName.length);
    }

    console.log("domainName:" + domainName);        
    return domainName;
}

function findEnvironmentName() {
    var name = window.location.hostname;
    const index = name.indexOf(ThisSystemName);
    var environment = "";

    if (index >= 0) {
        environment = name.substring(0, index);
    }

    console.log("environmentName:" + environment);
    return environment;
}

async function parseSettings(response) {
    var text = await response.text()
   
    if (text.includes("RELEASE-NAME") || text.includes("DOMAIN")) {
        // variables in configuration - resolve
        const environmentName = findEnvironmentName();
        text = text.replaceAll("RELEASE-NAME", environmentName);
        const domain = findDomain();
        text = text.replaceAll("DOMAIN", domain);
        console.log(`ConfigurationText: ${text}`);
        return JSON.parse(text)
    } else {
        // no variables in text - using 
        return JSON.parse(text)
    }
}

export const settings = derived(
    configUrl, 
    async ($configUrl, set) => {
        let response;
        try {
            response = await fetch(`${$configUrl}/dips-ehr-notes.json`);
        } catch (error) {
            console.error("Configuration not found", error);
        }
        try {
            var _settings = await parseSettings(response);       
            console.log(_settings); 
            set(_settings);    
        } catch (error) {
            console.error("Unable to parse configuration", error);
        }
    });




