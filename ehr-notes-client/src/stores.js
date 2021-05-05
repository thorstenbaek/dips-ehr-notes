import { writable, readable } from "svelte/store";
import v4 from "uuid";
import './SmartOnFhirStore';

export const user = readable(v4());
export const sidebar = writable(null);

const configurationUrl = "https://raw.githubusercontent.com/thorstenbaek/sandbox-environments/master";
const ThisSystemName = ".dips-ehr-notes-session-api.";

export const configUrl = readable(null, set => {
    if (window.CONFIG_URL === "${CONFIG_URL}") {
    	// CONFIG_URL not resolved - using default
	    set(configurationUrl);	
    } else {
        set(window.CONFIG_URL);
    }
});

function findDomain() {
    const name = window.location.hostname;
    
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

        return JSON.parse(text)
    } else {
        // no variables in text - using 
        return JSON.parse(text)
    }
}

export const settings = readable(
    null, 
    async set => {
        let response;
        try {
            const configUrl = configurationUrl + "/dips-ehr-notes.json";
            response = await fetch(configUrl);
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




