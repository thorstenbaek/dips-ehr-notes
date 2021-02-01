import React from 'react';
import FhirClientContext from './FhirClientContext';

const PatientName = ({name = []}) => {
    /*
    Generates and wraps the patient's name
    */
    const entry = name.find((nameRecord) => nameRecord.use === 'official') || name[0];
    if (!entry) {
      return <h3>Navn: Navn ikke funnet</h3>;
    }
    return (
      <div className="name-wrapper">
        Aktiv pasient:
        <div>{`${entry.given.join(' ')} ${entry.family}`}</div>
      </div>
    );
  }

class Patient extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
        super(props);

        this.state = {
            patient: null,
            observations: []
        };
    }

    async componentDidMount() {
        const { client } = this.context;

        const patient = await client.patient.read();
        
        //var url = `${client.state.serverUrl}/QuestionnaireResponse/_search?patient=${client.patient.id}&status=in-progress`;
        //console.log(url);
        //var test = await client.request(url);
        //console.log(test);

        this.setState(
            {
                patient: patient,
                //observations: observations
            });

    }    

    render() {
        const {patient} = this.state;

        console.log(patient);
        
        if (patient != null) {
        return (
            <>                
                <PatientName name={patient.name}/>
            </>
        )}

        return null;
    }
}

export default Patient;