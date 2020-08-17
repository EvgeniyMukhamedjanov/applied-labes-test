import React, {useState} from 'react';
import sectionData from './section-data';
import ApiService from '../../api-service';

const FORM_READY = 0;
const FORM_LOADING = 1;

const apiService = new ApiService();

function SectionForm() {

    const [sectionName, setSectionName] = useState('');
    const [sectionValue, setSectionValue] = useState('');
    const [formState, setFormState] = useState(FORM_READY);
    const [formMessage, setFormMessage] = useState({error: false, message: ""});

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormState(FORM_LOADING);

        const sectionFullContent = `${sectionValue}\n\n{% schema %}\n${JSON.stringify(sectionData.sectionSchema)}\n{% endschema %}`;

        apiService.createSectionForProductTemplate(sectionName, sectionFullContent)
            .then(res => {
                setFormState(FORM_READY);
                if (res.success) {
                    setFormMessage({message: `Section "${sectionName}" has been added successfully`, error: false});
                    setSectionName("");
                    setSectionValue("");
                } else {
                    setFormMessage({
                        message: `Error while creating new section; contact our developer team`,
                        error: true
                    });
                }
            })
            .catch(err => {
                setFormMessage({message: err.message, error: true});
                setFormState(FORM_READY);
            });
    }

    const handleNameChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^A-Za-z1-9_-]/ig, '');
        setSectionName(value);
    }

    const formClasses = [];
    if (formState === FORM_LOADING) {
        formClasses.push('loading');
    }
    if (formMessage.message !== "") {
        formClasses.push(formMessage.error ? "error" : "success");
    }

    return (
        <div>
            <form className={`ui form ${formClasses.join(" ")}`} onSubmit={handleSubmit}>
                <div className="ui success message">
                    <div className="header">Success</div>
                    <p>{formMessage.message}</p>
                </div>
                <div className="ui error message">
                    <div className="header">Error</div>
                    <p>{formMessage.message}</p>
                </div>
                <div className="field">
                    <label>Section Name</label>
                    <input type="text" placeholder="some-section-name" value={sectionName} onChange={handleNameChange}/>
                </div>
                <div className="field">
                    <label>Section Value</label>
                    <textarea placeholder="Some liquid code here" value={sectionValue} onChange={(e) => {
                        setSectionValue(e.target.value)
                    }}></textarea>
                    <a href="/" onClick={(e) => {
                        e.preventDefault();
                        setSectionValue(sectionData.defaultTemplate)
                    }}>Insert Default Template</a>
                </div>
                <input type="submit" value="Create" className="ui button" disabled={sectionName === ''}/>
            </form>
        </div>
    );
}

export default SectionForm;